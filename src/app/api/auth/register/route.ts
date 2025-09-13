import { NextRequest, NextResponse } from "next/server";
import { User } from "@/models/users.model";
import { getCoordinates } from "@/helpers/geoCode";
import { uploadImage } from "@/helpers/ImageUpload";
import dbConnect from "@/dbConfig/dbConnect";
import { AppError, handleApiError } from "@/helpers/errorHandeller";

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
    }
    const {
      teamName,
      email,
      phone,
      address,
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
      let matchedFiled;
      for (const key of ["teamName", "email"]) {
        if (isEmailExisting[key] === (key === "email" ? email : teamName)) {
          matchedFiled = key;
          break;
        }
      }
      throw new AppError(`${matchedFiled} already exist`, 409);
    }

    const requiredAddress: RequriedAddressFields = await getCoordinates(
      address as string
    );

    if (requiredAddress === null) {
      throw new AppError("capturing geocode failed", 502);
    }

    const { name, display_name, lat, lon } = requiredAddress;

    const filteredAddress = {
      actual_Address: name,
      captured_Address: display_name,
      latitude: lat,
      longitude: lon,
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
