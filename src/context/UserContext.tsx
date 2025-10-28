"use client"

import getRegionName from "@/helpers/mapCoordinates";
import { createContext , ReactNode, useContext, useState} from "react"

interface Location {
    actual_Address: string;
    captured_Address: string;
    latitude: number;
    longitude: number;
  };
  
  interface User {
    _id: string;
    teamName: string;
    email: string;
    avatar: string;
    phone: string;
    location: Location;
    rescueBoats: number;
    ambulances: number;
    humanRescueTeamSize: number;
    supplyTrucks: number;
    createdAt: string;
    updatedAt: string;
    [key:string]:any
  };

  interface UserContextType {
    user: User | null,
    logout: () => void,
    saveUserData: (data: User) => void
  }

const userContext = createContext<UserContextType | undefined>(undefined);

export const UserContextProvider = ({children} : {children: ReactNode}) => {

    const [user, setUser] = useState<User | null>(null);

    const saveUserData = (data: User) => {
        const value = getRegionName(
            data.centralRegionGeoCode.lat,
            data.centralRegionGeoCode.lon
          );
        setUser({...data , regionName:value});
    };

    const logout = ()=>{
        setUser(null);
    };

    

    return (
        <userContext.Provider value={{user, logout, saveUserData}}>
            {children}
        </userContext.Provider>
    );
};

export function useUserContext(){
    const context = useContext(userContext);

    if(context === undefined){
        throw new Error("useUser must be used within a UserContextProvider")
    };

    return context;
}
