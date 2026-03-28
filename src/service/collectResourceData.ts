import { regionMetaData } from "@/models/regionMetaData.model";

interface Coordinates {
  lat: number;
  lon: number;
}

interface Resources {
  point?: number;
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

    const Resource_Modle_Input_Values: Resources = {
      point: regionData.point,
      populationDensity: regionData.populationDensity,
      totalPopulation: regionData.totalPopulation,
      regionArea: regionData.regionArea,
      roadDensity: regionData.roadDensity,
      accessibilityIndex: regionData.accessibilityIndex,
    };

    const successObj = {
      data: {
        Resource_Modle_Input_Values: Resource_Modle_Input_Values,
        regionId: regionData._id,
      },
      success: true,
    };

    return successObj;
  } catch (error) {
    let errMsg =
      error instanceof Error
        ? error.message
        : "service/collectResourceData failed";
    return { err: errMsg, success: false, data: null };
  }
}
