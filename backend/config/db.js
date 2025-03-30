import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("❌ MONGO_URI is not defined in environment variables!");
    }

    await mongoose.connect(process.env.MONGO_URI, {
      dbName: "writingApp", // ✅ Specify database name
      serverSelectionTimeoutMS: 5000, // ✅ Retry connection in 5 sec if failed
      socketTimeoutMS: 45000, // ✅ 45 sec socket timeout
    });

    console.log("✅ MongoDB Connected Successfully");
  } catch (error) {
    console.error("❌ MongoDB Connection Failed:", error.message);
    setTimeout(connectDB, 5000); // 🔄 Retry after 5 sec
  }
};

export default connectDB;
