import mongoose from "mongoose";

const MAX_RETRY_Count = 3;
const RETRY_INTERVAL = 5000;

class databaseConnection {
  retryCount: number;
  isConnected: boolean;

  constructor() {
    this.retryCount = 0;
    this.isConnected = false;

    mongoose.set("strictQuery", true);

    // configuring the events
    mongoose.connection.on("connected", () => {
      console.log("MongoDB connected successfully");
      this.isConnected = true;
    });

    mongoose.connection.on("disconnected", () => {
      console.log("MongoDB disconnected");
      this.isConnected = false;
      this.handleDisconnection();
    });

    mongoose.connection.on("error", (err) => {
      console.error(" MongoDB connection error:", err);
      this.isConnected = false;
    });

    // handelling the application termination
    process.on("SIGINT", () => this.handleAppTermination());
    process.on("SIGTERM", () => this.handleAppTermination());
  }

  async connect() {
    try {
      if (
        process.env.MONGODB_URI === "" ||
        process.env.MONGODB_URI === undefined
      ) {
        throw new Error("MongoDB URI is not defined in environment variable");
      }
      if (process.env.NODE_ENV === "development") {
        mongoose.set("debug", true);
      }

      const connection_Options = {
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        family: 4,
      };

      await mongoose.connect(process.env.MONGODB_URI, connection_Options);

      this.retryCount = 0;
    } catch (error) {
      if (error instanceof Error) {
        console.error("Failed to connect to MongoDB:", error.message);
      } else {
        console.error("Failed to connect to MongoDB:", error);
      }
        await this.handleConnectionError();
    }
  }

    async handleConnectionError() {
      if (this.retryCount < MAX_RETRY_Count) {
        this.retryCount++;
        console.log(
          `Retrying Connection... Attempt ${this.retryCount} of ${MAX_RETRY_Count}`
        );
        await new Promise<void>((resolve) =>
          setTimeout(() => {
            resolve();
          }, RETRY_INTERVAL)
        );
        return this.connect();
      }else{
          console.error(
              `Failed to connect to MongoDB after ${MAX_RETRY_Count} attempts`
            );
            process.exit(1);
      }
    }

  async handleDisconnection() {
    
    // Only reconnect if it was previously connected 
    if (this.isConnected) {
      console.log("Attempting to reconnect to mongoDb...");
      this.connect();
    }
  }

  async handleAppTermination() {
    try {
      await mongoose.connection.close();
      console.log("MongoDB connection closed through app termination");
      process.exit(0);
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error during database disconnection:", error.message);
      } else {
        console.error("Error during database disconnection:", error);
      }
      process.exit(1);
    }
  }
}

const dbConnection = new databaseConnection();

export default dbConnection.connect.bind(dbConnection);
