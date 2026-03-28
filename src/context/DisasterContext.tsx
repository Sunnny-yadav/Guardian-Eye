"use client"

import { createContext ,ReactNode, useContext, useState} from "react"

interface alertDataType {
    disasterId:string | number,
    disasterName: string,
    [key: string]: any
};

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
    resourcePlanId:string;
    timeline: string;
    priority: string;
  };

interface DisasterContextType {
    alertOccurred: boolean,
    alertData: alertDataType | null,
    predictedResources: PredictedResources | null,
    updateAlertStatus: () => void,
    saveAlertData: (dataObj: alertDataType) => void,
    savePredictedResources: (data: PredictedResources) => void
};



const DisasterContext = createContext <DisasterContextType | undefined> (undefined);

export const DisasterContextProvider = ({children}:{children: ReactNode}) => {
    const [alertOccurred, setAlertOccurred] = useState(false);
    const [alertData, setAlertData] = useState<alertDataType | null>(null);
    const [predictedResources, setPredictedResources] = useState<PredictedResources | null>(null);
    
    const updateAlertStatus = ()=>{
        setAlertOccurred(!alertOccurred);
    };

    const saveAlertData = (dataObj: alertDataType) => {
        setAlertData(dataObj);
    };

    const savePredictedResources = (data: PredictedResources) => {
        setPredictedResources(data);
    };

    return (
        <DisasterContext.Provider value={{alertOccurred, updateAlertStatus, saveAlertData, alertData, savePredictedResources, predictedResources }}>
            {children}
        </DisasterContext.Provider>
    );
};

export const useDisasterContext = () => {
    const context = useContext(DisasterContext);
    if(context === undefined){
        throw new Error("useDisasterContext must be used within a DisasterProvider");
    }
    return context;
};