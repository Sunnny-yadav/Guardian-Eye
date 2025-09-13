import dbConnect from "@/dbConfig/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import { User } from "@/models/users.model";
import { AppError, handleApiError } from "@/helpers/errorHandeller";

dbConnect();

interface LoginRequest {
  email: string;
  password: string;
}

export async function POST(request: NextRequest) {
  try {
    const data: LoginRequest = await request.json();
    const { email, password } = data;

    const user = await User.findOne({ email }).select("email password");
    if (!user) {
      throw new AppError("user not found", 404);
    }

    const pwdVerification = await user.isPasswordCorrect(password);

    if (!pwdVerification) {
      throw new AppError("Password is wrong", 401);
    }

    const AccessToken = user.getAccessToken();

    const response = NextResponse.json(
      {
        message: "Login successful",
      },
      { status: 200 }
    );

    response.cookies.set("AccessToken", AccessToken, { httpOnly: true });

    return response;
  } catch (error) {
    return handleApiError(
      error,
      "Login failed",
      "Error occured in /api/login route"
    );
  }
};
