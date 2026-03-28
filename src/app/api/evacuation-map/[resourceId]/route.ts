import dbConnect from "@/dbConfig/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import { AppError, handleApiError } from "@/helpers/errorHandeller";
import mongoose from "mongoose";
import { ResourcePlan } from "@/models/resourcePlan.model";
import "@/models/alert.model";
import "@/models/regionMetaData.model";

dbConnect();

const convertIntensityToNumber = (value?: string): number => {
  if (!value) return 0;

  const normalized = value.trim().toLowerCase();

  if (["extreme low", "very low", "low"].includes(normalized)) {
    return 1;
  }

  if (["normal", "moderate"].includes(normalized)) {
    return 2;
  }

  if (["high", "very high", "severely high"].includes(normalized)) {
    return 3;
  }

  return 0; // fallback for unexpected value
};

export async function POST( request:NextRequest, { params }: { params: { resourceId: string } }) {

  try {
    const { resourceId } = params;

    if (!mongoose.Types.ObjectId.isValid(resourceId)) {
      throw new AppError("Invalid resourceId detected", 400);
    }

    const data = await ResourcePlan.findOne({ _id: resourceId }).populate({
      path: "alertId",
      populate: {
        path: "regionMetaDataId",
        select:
          "populationDensity totalPopulation regionArea roadDensity accessibilityIndex regionName",
      },
    });

    const evacuationMapData = {
      /* predicted intensity */
      rainfall_intensity: convertIntensityToNumber(data?.alertId?.intensityPredicted?.rainfall),
      cyclone_intensity: convertIntensityToNumber(data?.alertId?.intensityPredicted?.cyclone),
      flood_intensity: convertIntensityToNumber(data?.alertId?.intensityPredicted?.flood),
    
      /* predicted resources */
      boats: data?.predictedResources?.rescueBoats ?? 0,
      ambulances: data?.predictedResources?.ambulances ?? 0,
      teams: data?.predictedResources?.humanRescueTeams ?? 0,
      shelters: data?.predictedResources?.shelterCount ?? 0,
      trucks: data?.predictedResources?.supplyTrucks ?? 0,
      drones: data?.predictedResources?.drones ?? 0,
      evacuated: data?.predictedResources?.civiliansToEvacuate ?? 0,
    
      /* region Meta Data */
      population: data?.alertId?.regionMetaDataId?.totalPopulation ?? 0,
      population_density: data?.alertId?.regionMetaDataId?.populationDensity ?? 0,
      area: data?.alertId?.regionMetaDataId?.regionArea ?? 0,
      road_density: data?.alertId?.regionMetaDataId?.roadDensity ?? 0,
      accessibility: data?.alertId?.regionMetaDataId?.accessibilityIndex ?? 0,
    
      /* Climate Meta Data */
      humidity: data?.alertId?.climateMetaData?.humidity ?? 0,
      pressure: data?.alertId?.climateMetaData?.airPressure ?? 0,
      rainfall_mm: data?.alertId?.climateMetaData?.rainfall ?? 0,
      rainfall_3d: data?.alertId?.climateMetaData?.rainfall_3d_sum ?? 0,
      rainfall_cum: 450,
    };

    if (!process.env.EVACUATION_MAP_URL) {
      throw new AppError("The evacuation map url not found", 500);
    }
    const mapResponse = await fetch(process.env.EVACUATION_MAP_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(evacuationMapData),
      signal: AbortSignal.timeout(300000),
    });

    if (!mapResponse.ok) {
      throw new AppError("Map generation failed: ", mapResponse.status);
    }

    // Step 4: Get the HTML content from response
    // THIS IS THE KEY PART - The HTML comes in response.text()
    const htmlContent = await mapResponse.text();

    console.log("Map HTML received, length:", htmlContent.length);

    // Step 5: Send HTML back to frontend with download headers
    
    const regionName = data?.alertId?.regionMetaDataId?.regionName || "unknown_region";
    const safeFileName = regionName.replace(/[^a-z0-9]/gi, "_").toLowerCase();

    return new NextResponse(htmlContent, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Content-Disposition": `attachment; filename="evacuation_map_${safeFileName}.html"`,
        "Cache-Control":"no-cache"
      },
    });

  } catch (error: any) {
    console.error("Error generating map:", error.message);

    return handleApiError(
      error,
      "Server Failed to generate the evacuation map",
      "Error occured in api/evacuation-map/route.ts"
    );
  }
}
