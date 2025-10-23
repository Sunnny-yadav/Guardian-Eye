import { AppError } from "./errorHandeller";

interface disasterEvent {
    name:string,
    _id:number,
    isBroadCasted:boolean
}

export async function socketEmitter(disasterObj: disasterEvent){
    try {
        const disasterName = disasterObj.name;
        const disasterId = disasterObj._id;
        const socketServerUrl = process.env.SOCKET_SERVER_URL || 'http://localhost:4000'

        if(!disasterId || !disasterName){
            throw new AppError("Incompelete disaster data received",400);
        };

        const result = await fetch(`${socketServerUrl}/api/emit-disaster-alert`,{
            method:"POST",
            headers:{
                'Content-Type':"application/json"
            },
            body: JSON.stringify({
                disasterId, disasterName
            })
        });


        if (!result.ok) {
            throw new Error(`Socket server responded with status: ${result.status}`);
          }
      
          const data = await result.json();
          console.log('✅ Alert emitted successfully:', data);
          
          return data;
          
    } catch (error) {
        let errMsg = error instanceof Error ? error.message : "socket-emmiter failed";
        return {
            err:errMsg,
            success: false
        }
    }
}