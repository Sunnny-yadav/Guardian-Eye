import dbconnect from "@/dbConfig/dbConnect";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        await dbconnect();
        return NextResponse.json({message:process.env.NODE_ENV === "development" ? "Test-db route executed successfully" : "Ok"}, {status: 200})
    } catch (error) {
        let errorMessage = error instanceof Error ? error.message : String(error);
        console.error("Test DB route error:", errorMessage);
        return NextResponse.json({error:errorMessage}, {status: 500})
    }
};