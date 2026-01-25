"use client";

import { createContext,  ReactNode,  useContext,  useEffect,  useState, } from "react";
import { setupSocketListeners, cleanupSocketListeners, } from "@/socket-events/socketListeners";
import { io, Socket } from "socket.io-client";
import { useUserContext } from "./UserContext";
import { useDisasterContext } from "./DisasterContext";

interface SocketContextType {
    isConnected: boolean;
    socket: Socket | null;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const SocektContextProvider = ({children,}: { children: ReactNode; }) => {

    const [isConnected, setIsconnected] = useState(false);
    const [socket, setSocket] = useState<Socket | null>(null);
    const { user } = useUserContext();
    const {updateAlertStatus, saveAlertData, savePredictedResources} = useDisasterContext()

    useEffect(() => {
        // If no user, disconnect and return
        if (!user || Object.keys(user).length === 0) {
            if (socket) {
                socket.disconnect();
                setSocket(null);
                setIsconnected(false);
            }
            return;
        }

        const socketUrl =
            process.env.NEXT_PUBLIC_SOCKET_SERVER_URL || "http://localhost:4000";

        const socketInstance = io(socketUrl, {
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
        });

        socketInstance.on("connect", () => {
            console.log("✅ Socket connected");
            setIsconnected(true);

            socketInstance.emit("user-registered", user?.regionName);
        });

        socketInstance.on("disconnect", () => {
            console.log("❌ Socket disconnected");
            setIsconnected(false);
        });

        socketInstance.on("connect_error", (error) => {
            console.error("Socket connection error:", error);
        });

        // Setup all listeners from separate file
        setupSocketListeners(socketInstance, updateAlertStatus, saveAlertData, savePredictedResources);

        setSocket(socketInstance);

        return () => {
            cleanupSocketListeners(socketInstance);
            socketInstance.disconnect();
        };
    }, [user]);

    return (
        <SocketContext.Provider value={{ isConnected, socket }}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocektContext = () => {
    const context = useContext(SocketContext);

    if (context === undefined) {
        throw new Error("useSocketContext must be used within a SocketProvider");
    }

    return context;
};
