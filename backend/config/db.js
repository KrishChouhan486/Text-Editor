import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();  // Load environment variables from .env file

const connectDB = async () => {
  try {
    // Ensure the MONGO_URI is set in the environment variables
    if (!process.env.MONGO_URI) {
      throw new Error("❌ MONGO_URI is not defined in environment variables!");
    }

    // Connect to MongoDB with the provided URI and database name
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: "writingApp", // Specify the database name
      useNewUrlParser: true,
      useUnifiedTopology: true,  // Ensure these options are included for stability
    });

    console.log("✅ MongoDB Connected Successfully");
  } catch (error) {
    // Log detailed error message if the connection fails
    console.error("❌ MongoDB Connection Failed:", error.message);
    process.exit(1);  // Exit the process if MongoDB connection fails
  }
};

export default connectDB;
