import toast from "react-hot-toast";
import { Socket } from "socket.io-client";

interface alertDataType {
  disasterId: string | number;
  disasterName: string;
  [key: string]: any;
}

interface PredictedResources {
  disaster: {
    type: string;
    severity: string;
    region: string;
    civiliansToEvacuate: number;
  };
  resources: {
    rescueBoats: number;
    ambulances: number;
    humanRescueTeams: number;
    supplyTrucks: number;
    shelterTents: number;
    drones: number;
  };
  timeline: string;
  priority: string;
}

export const setupSocketListeners = (
  socket: Socket,
  updateAlertStatus: () => void,
  saveAlertData: (dataObj: alertDataType) => void,
  savePredictedResources: (dataObj: PredictedResources) => void
) => {
  
  // Room joined confirmation
  socket.on("room-joined", (data) => {
    console.log("✅ Joined room:", data.region);
    // Add toast notification here if needed or can store the value in the context by invokin a function decalred intothe context
  });

  // Disaster alerts (global)
  socket.on("disaster-alert", (data) => {
    updateAlertStatus();
    saveAlertData(data);
    console.log("🚨 Disaster Alert:", data);
    // Show alert notification
  });

  // Prediction results (room-specific)
  socket.on("prediction-results", (data) => {
    console.log("📊 Prediction Results:", data);
    toast.success("Prediction completed, You can view your board");
    savePredictedResources(data);
  });

  // Add more listeners here...
};

export const cleanupSocketListeners = (socket: Socket) => {
  socket.off("room-joined");
  socket.off("disaster-alert");
  socket.off("prediction-results");
  // Remove all listeners
};
