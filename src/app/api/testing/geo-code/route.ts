import { getCoordinates } from "@/helpers/geoCode";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    
    const { address } = reqBody;
    const data = await getCoordinates(address);

    if (data == null) {
      return NextResponse.json(
        { error: "Capturing geoCode failed" },
        { status: 500 }
      );
    }
    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    let errorMsg = error instanceof Error ? error.message : error;
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  };
}
