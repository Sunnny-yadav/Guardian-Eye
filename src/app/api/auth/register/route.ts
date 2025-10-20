import { NextRequest, NextResponse } from "next/server";
import { User } from "@/models/users.model";
import { getCoordinates } from "@/helpers/geoCode";
import { uploadImage } from "@/helpers/ImageUpload";
import dbConnect from "@/dbConfig/dbConnect";
import { AppError, handleApiError } from "@/helpers/errorHandeller";
import { regionMetaData } from "@/models/regionMetaData.model";

dbConnect();

interface RequriedAddressFields {
  name: string;
  display_name: string;
  lat: number;
  lon: number;
  [key: string]: any;
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("avatar") as File;
    if (file == null) {
      throw new AppError("file not present", 400);
    };

    console.log(Object.fromEntries(formData))
    const {
      teamName,
      email,
      phone,
      address,
      centralRegion,
      rescueBoats,
      ambulances,
      humanRescueTeamSize,
      supplyTrucks,
      password,
    } = Object.fromEntries(formData);

    if (
      [
        teamName,
        email,
        phone,
        address,
        centralRegion,
        rescueBoats,
        ambulances,
        humanRescueTeamSize,
        supplyTrucks,
        password,
      ].some((val) => val === "")
    ) {
      throw new AppError("All fields are requried", 400);
    }

    const isEmailExisting = await User.findOne({
      $or: [{ teamName }, { email }],
    }).select("email teamName");

    if (isEmailExisting) {
      const existing = isEmailExisting.toObject();
      let matchedField;
      
      if (
        existing.email?.trim().toLowerCase() === email.toString().trim().toLowerCase()
      ) {
        matchedField = "email";
      } else if (
        existing.teamName?.trim().toLowerCase() === teamName.toString().trim().toLowerCase()
      ) {
        matchedField = "teamName";
      }
    
      throw new AppError(`${matchedField} already exists`, 409);
    }
    

    const [requiredAddress, CentralRegionCodes]: [
      RequriedAddressFields,
      { coordinates: { lat: number; lon: number } } | null
    ] = await Promise.all([
      getCoordinates(address as string),
      regionMetaData.findOne({ regionName: centralRegion }).select("coordinates")
    ]);
    

    if (requiredAddress === null || CentralRegionCodes === null) {
      throw new AppError("capturing geocode failed", 502);
    };

    const { name, display_name, lat, lon } = requiredAddress;

    const filteredAddress = {
      actual_Address: name,
      captured_Address: display_name,
      latitude: lat,
      longitude: lon,
    };

    
    const FilteredcentralRegion = {
      lat:CentralRegionCodes?.coordinates.lat,
      lon:CentralRegionCodes?.coordinates.lon
    };

    const uplaodedImageOnCloudinary = await uploadImage(file);

    if (uplaodedImageOnCloudinary === null) {
      throw new AppError("Uplaoding Image failed! Try again", 502);
    }

    const user = await User.create({
      teamName,
      email,
      phone,
      location: filteredAddress,
      avatar: uplaodedImageOnCloudinary,
      rescueBoats: Number(rescueBoats),
      ambulances: Number(ambulances),
      humanRescueTeamSize: Number(humanRescueTeamSize),
      supplyTrucks: Number(supplyTrucks),
      password,
      centralRegionGeoCode:FilteredcentralRegion
    });

    if (Object.keys(user).length === 0) {
      throw new AppError("Registration Failed, Try Again", 500);
    }

    const AccessToken = user.getAccessToken();

    const response = NextResponse.json(
      {
        data: user,
      },
      {
        status: 200,
      }
    );

    response.cookies.set("AccessToken", AccessToken, { httpOnly: true });

    return response;
  } catch (error) {
    return handleApiError(
      error,
      "Registration attempt failed",
      "Error Occured in api/register route"
    );
  }
}
