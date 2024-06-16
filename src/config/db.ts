import mongoose from "mongoose";
import { config } from "./ServerConfig";

const connectDatabase = async () => {
  try {
    mongoose.connection.on("error", (error) => {
      console.error("Database Connection Failed ", error);
    });
    mongoose.connection.on("connected", () => {
      console.log("Connected to Database  Successfully");
    }); 
    await mongoose.connect(config.DATABASE_URL as string);
  } catch (error) {
    console.log(`Error while connecting to database: ${error}`);
    process.exit(1);
  }
};

export default connectDatabase;
