import mongoose from "mongoose";
import dotenv from "dotenv";
import dns from "dns";

dotenv.config();

dns.setServers(["8.8.8.8"]);

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected successfully");
    console.log(`MongoDB connected to ${mongoose.connection.name}`);
  } catch (error) {
    console.log(`MongoDB Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;