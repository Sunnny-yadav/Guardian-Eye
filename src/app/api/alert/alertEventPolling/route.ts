/* here i will write code for getting webhook alert and broadcast the alert */
import { AppError } from "@/helpers/errorHandeller";
import { socketEmitter } from "@/helpers/socket-emitter";
import { DisasterEvent } from "@/models/disasterEvent.model";
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/dbConfig/dbConnect";

dbConnect();

export async function POST(req:NextRequest){
    try {
        //  these line is a placeholder for the code which will be responsible for fetching data  example, IMD webhook or polling

        const time = new Date();
        const fifteenMinBackTime = new Date(time.getTime() - 15 * 60 * 1000);
       
        const recentEvent = await DisasterEvent.findOne({
            name: "cyclone",
            createdAt: {
                $gte:fifteenMinBackTime
            }
        });

        if(recentEvent && Object.keys(recentEvent).length > 0){
            return NextResponse.json({Message:"The Event is Already Boradcasted, Be relax!"},{status: 200});
        };

        const disasterObj = await DisasterEvent.create({
            name:"cyclone",
            isBroadCasted:true
        });
    
        if(!disasterObj || Object.keys(disasterObj).length === 0){
            throw new AppError("Entry creation of disaster in database failed",400);
        };
        
        const result = await socketEmitter(disasterObj);

        if(!result.success && "err" in result){
            console.log(result.err);
            throw new AppError(result.err,400);
        };

        return NextResponse.json({data:result},{status:200});

    } catch (error) {
        let msg = error instanceof Error ? error.message : "undefined"
        return NextResponse.json({"error":msg},{status:400});
    }
};

