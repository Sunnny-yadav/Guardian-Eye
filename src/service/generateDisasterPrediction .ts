import mongoose from "mongoose";
import { Alert } from "@/models/alert.model";
import { collectIntensityData } from "./collectIntensityData";
import { collectResourceData } from "./collectResourceData";
import { ResourcePlan } from "@/models/resourcePlan.model";
import { AppError } from "@/helpers/errorHandeller";
import { intensityInputFormater } from "@/helpers/inputFormater/intensityInput";
import { resourceInputFormater } from "@/helpers/inputFormater/resourceInput";

interface Coordinates {
  lat: number;
  lon: number;
}

export async function generateDisasterPrediciton(geoCode: Coordinates) {

  // START: Create session
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // call the function to collect intensity model data
    const result1 = await collectIntensityData(geoCode);
    if(!result1.success && "err" in result1){
        throw new Error(result1.err);
    }

    // this is used to store in database
    const intensity_Modle_Input_Values = result1.data; 

    // this is follows the format of input required to the intensity model
    if (!intensity_Modle_Input_Values) {
      throw new Error("Intensity data is missing");
    }
    const formatedIntensityInput = intensityInputFormater(intensity_Modle_Input_Values);

    console.log("FormatedIntensityInput",formatedIntensityInput)
    const intensityModelResponse = await fetch("https://ganeshnaik0108-intensity-disaster.hf.space/predict", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formatedIntensityInput),
    });
    
    if (!intensityModelResponse.ok) {
      const errObj = await intensityModelResponse.json()
      console.log("Error Obj Of intensity model:",errObj);
      throw new Error("Intensity Model Failed");
    }
    
    const intensitymodelOutput = await intensityModelResponse.json();
    
    console.log("Intensity model Output: ", intensitymodelOutput)
// todo: here now call a database to capture the historical document with same intensity and name

    // call the funciton to collect data for resource model
    const result2 = await collectResourceData(geoCode);
    if(!result2.success && "err" in result2){
        throw new Error(result2.err)
    }
    const Resource_Modle_Input_Values = result2?.data?.Resource_Modle_Input_Values;
    const regionId = result2?.data?.regionId;

    if (!Resource_Modle_Input_Values) {
      throw new Error("Resource data is missing");
    }
    
    const formatedResourceInput = {
      Region: Resource_Modle_Input_Values.point,
      Population_Density_per_sqkm: Resource_Modle_Input_Values.populationDensity,
      Total_Population: Resource_Modle_Input_Values.totalPopulation,
      Road_Density_km_per_sqkm: Resource_Modle_Input_Values.roadDensity,
      Accessibility_Index: Resource_Modle_Input_Values.accessibilityIndex,
      Event_Description: "Heavy rainfall warning",
      Historical_Rescue_Boats: 18.0,
      Historical_Ambulances: 20.0,
      Historical_Human_Rescue_Teams: 50.0,
      Historical_Shelters: 23.0,
      Historical_Civilians_Evacuated: 20000.0,
      Historical_Supply_Trucks: 12.0,
      Historical_Drones: 3.0,
      Area: Resource_Modle_Input_Values.regionArea,
      Population_Density: Resource_Modle_Input_Values.populationDensity,
    };
    
    const combinedInput = {
      ...formatedResourceInput,
      ...formatedIntensityInput
    }; 

    console.log("Combine Input resource",combinedInput)


    // give the collected input to the model we will get the intensity and resource prediction
    const response = await fetch("https://ganeshnaik0108-resource-prediction.hf.space/predict", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(combinedInput),
    });
    
    if (!response.ok) {
      throw new Error("Resource Model Failed");
    }
    
    const modelOutput = await response.json();

    console.log("Resource model Output:", modelOutput)

      const PredictedResourceAllocation = {
      rescueBoats: Math.round(modelOutput.predicted_resources.Predicted_Rescue_Boats),
      ambulances: Math.round(modelOutput.predicted_resources.Predicted_Ambulances),
      humanRescueTeams: Math.round(modelOutput.predicted_resources.Predicted_Human_Rescue_Teams),
      shelterCount: Math.round(modelOutput.predicted_resources.Predicted_Shelters),
      civiliansToEvacuate: Math.round(modelOutput.predicted_resources.Predicted_Civilians_To_Evacuate),
      supplyTrucks: Math.round(modelOutput.predicted_resources.Predicted_Supply_Trucks),
      drones: Math.round(modelOutput.predicted_resources.Predicted_Drones),
    };

    //  create a alert document with session
    const alertObj = await Alert.create(
      [{
        climateMetaData: intensity_Modle_Input_Values,
        regionMetaDataId: regionId,
        intensityPredicted: {
          flood: intensitymodelOutput.Flood_Intensity.includes('Unknown') ? 'Low' : intensitymodelOutput.Flood_Intensity,
          cyclone: intensitymodelOutput.Cyclone_Intensity.includes('Unknown') ? 'Low' : intensitymodelOutput.Cyclone_Intensity,
          rainfall: intensitymodelOutput.Rain_Intensity.includes('Unknown') ? 'Low' : intensitymodelOutput.Rain_Intensity
        }
      }],
      { session }  
    );
    if (!alertObj || alertObj.length === 0) {
      throw new AppError("Failed to create Alert record",500);
    }

    // create a resource document with session
    const predictedResourceObj = await ResourcePlan.create(
      [{
        predictedResources: PredictedResourceAllocation,
        alertId: alertObj[0]._id, 
      }],
      { session }
    );
    if (!predictedResourceObj || predictedResourceObj.length === 0) {
      throw new AppError("Failed to create ResourcePlan record",500);
    }

    // Commit transaction if everything succeeds
    await session.commitTransaction();

    const successObj = {
      Resources: predictedResourceObj[0],
      success: true,
    };

    return successObj;

  } catch (error) {
    // Abort transaction if any error occurs
    await session.abortTransaction();
    
    let errMsg =
      error instanceof Error
        ? error.message
        : "Failed to create ResourcePlan record";

    return { err: errMsg, success: false };

  } finally {
    // Always end session
    await session.endSession();
  }
}