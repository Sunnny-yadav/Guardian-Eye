import { regionMetaData } from "@/models/regionMetaData.model";

interface Coordinates {
  lat: number;
  lon: number;
};

interface Resources {
    populationDensity?: number;
    totalPopulation?: number;
    regionArea?: number;
    roadDensity?: number;
    accessibilityIndex?: number;
    [key: string]: any;
  }

export async function collectResourceData(geoCode: Coordinates) {
  try {
    const regionData = await regionMetaData.findOne({
      "coordinates.lat": geoCode.lat,
      "coordinates.lon": geoCode.lon,
    });

    if (!regionData) {
      throw new Error("Region metadata not found in database");
    }

    const Resource_Modle_Input_Values: Resources = {};
    const fields = [
      "populationDensity",
      "totalPopulation",
      "regionArea",
      "roadDensity",
      "accessibilityIndex",
    ];

    Object.keys(regionData).forEach((key) => {
      if (fields.includes(key)) {
        Resource_Modle_Input_Values[key] = regionData[key];
      }
    });

    const successObj = {
        data: {
            Resource_Modle_Input_Values:Resource_Modle_Input_Values,
            regionId : regionData._id
        },
        success: true,
      };
      
      return successObj;


  } catch (error) {
    let errMsg = error instanceof Error ? error.message : "service/collectResourceData failed";
    return { err: errMsg, success: false , data: null};
  }
}
