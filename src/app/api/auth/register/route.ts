import { NextRequest, NextResponse } from "next/server";
import { User } from "@/models/users.model";
import { getCoordinates } from "@/helpers/geoCode";
import { uploadImage } from "@/helpers/ImageUpload";
import dbConnect from "@/dbConfig/dbConnect";

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
    if(file == null){
        throw new Error("file not present")
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
      throw new Error("All fields are requried");
    }

    const requiredAddress: RequriedAddressFields = await getCoordinates(
      address as string
    );

    if (requiredAddress === null) {
      throw new Error("capturing geocode failed");
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
      throw new Error("Uplaoding Image failed! Try again");
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
      throw new Error("Registration Failed, Try Again");
    }

    return NextResponse.json(
      {
        data: user,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    let errMsg = error instanceof Error ? error.message : error;
    return NextResponse.json(
      {
        error: errMsg,
      },
      {
        status: 400,
      }
    );
  }
};
