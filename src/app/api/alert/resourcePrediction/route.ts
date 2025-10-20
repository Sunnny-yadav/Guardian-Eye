import dbConnect from "@/dbConfig/dbConnect";
import { AppError, handleApiError } from "@/helpers/errorHandeller";
import { requestLock } from "@/models/requestLock.model";
import { generateDisasterPrediciton } from "@/service/generateDisasterPrediction ";
import { NextRequest, NextResponse } from "next/server";

dbConnect();

export async function POST(request: NextRequest) {
  try {
    const { geoCode, disasterEventId, userId } = await request.json();
   
    // Input validation
    if (!geoCode || !geoCode.lat || !geoCode.lon || !disasterEventId || !userId) {
      throw new AppError("Invalid or insufficient region data provided.", 422)
    }

    //  Check for existing lock
    const isAlreadyLocked = await requestLock.findOne({
      "geoCode.lat": geoCode.lat,
      "geoCode.lon": geoCode.lon,
      disasterEventId,
    });

    let createLockFlag = null;

    if (isAlreadyLocked) {
      if (isAlreadyLocked.isLocked) {
        return NextResponse.json(
          {
            message:
              "Processing for this region is already in progress. Please wait for the response.",
          },
          { status: 202 }
        );
      } else {
        isAlreadyLocked.isLocked = true;
        isAlreadyLocked.userId = userId;
        await isAlreadyLocked.save();
      }

    } else {
      createLockFlag = await requestLock.create({
        isLocked: true,
        geoCode,
        disasterEventId,
        userId,
      });
    }

    // invoke  prediction model
    const intensityDetails = await generateDisasterPrediciton(geoCode);
    
    
    if (intensityDetails.success === false && "err" in intensityDetails) {

      // Rollback lock if failed
      if (isAlreadyLocked) {
        isAlreadyLocked.isLocked = false;
        await isAlreadyLocked.save();
      } else if (createLockFlag) {
        createLockFlag.isLocked = false;
        await createLockFlag.save();
      }

      throw new AppError(intensityDetails.err, 502);
    };


    return NextResponse.json(
      {
        data: "Resources" in intensityDetails ? intensityDetails.Resources : " intensity data"
      },
      {
        status:200
      }
    );

  } catch (error) {
    return handleApiError(
      error,
      "Failed to process resource prediction request.",
      "Error occurred in api/alert/resourcePrediction route"
    );
  }
};