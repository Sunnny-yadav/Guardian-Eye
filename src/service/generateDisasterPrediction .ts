import mongoose from "mongoose";
import { Alert } from "@/models/alert.model";
import { collectIntensityData } from "./collectIntensityData";
import { collectResourceData } from "./collectResourceData";
import { ResourcePlan } from "@/models/resourcePlan.model";

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
    const intensity_Modle_Input_Values = result1.data;

    // call the funciton to collect data for resource model
    const result2 = await collectResourceData(geoCode);
    if(!result2.success && "err" in result2){
        throw new Error(result2.err)
    }
    const Resource_Modle_Input_Values = result2?.data?.Resource_Modle_Input_Values;
    const regionId = result2?.data?.regionId;

    console.log(Resource_Modle_Input_Values);
    
    // give the collected input to the model we will get the intensity and resource prediction
    const dummyPredictedResourceAllocation = {
        rescueBoats: 15,
        ambulances: 25,
        humanRescueTeams: 8,
        shelterCount: 12,
        civiliansToEvacuate: 5000,
        supplyTrucks: 30,
        drones: 10,
    };

    //  create a alert document with session
    const alertObj = await Alert.create(
      [{
        climateMetaData: intensity_Modle_Input_Values,
        regionMetaDataId: regionId,
        intensityPredicted: { flood: "Normal", cyclone: "High", rainfall: "Low" },
      }],
      { session }  
    );
    if (!alertObj || alertObj.length === 0) {
      throw new Error("Failed to create Alert record");
    }

    // create a resource document with session
    const predictedResourceObj = await ResourcePlan.create(
      [{
        ...dummyPredictedResourceAllocation,
        alertId: alertObj[0]._id, 
      }],
      { session }
    );
    if (!predictedResourceObj || predictedResourceObj.length === 0) {
      throw new Error("Failed to create ResourcePlan record");
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