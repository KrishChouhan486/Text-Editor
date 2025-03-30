import mongoose from "mongoose";

const connectDB = async (attempt = 1) => {
  if (attempt > 5) {
    console.error("❌ MongoDB Connection Failed after multiple attempts.");
    process.exit(1);
  }

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      dbName: "writingApp",
      connectTimeoutMS: 5000, // ✅ Reduce timeout to 5 sec
      socketTimeoutMS: 30000, // ✅ 30 sec socket timeout
    });

    console.log("✅ MongoDB Connected Successfully");
    return conn;
  } catch (error) {
    console.error(`❌ MongoDB Connection Failed (Attempt ${attempt}):`, error.message);
    setTimeout(() => connectDB(attempt + 1), 5000); // 🔄 Retry after 5 sec
  }
};

export default connectDB;
