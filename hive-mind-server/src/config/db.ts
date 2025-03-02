import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://giuseppenapolii55:YKHFGQQcYDfMJxe4@cluster0.wxhyr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

export const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ MongoDB Connected!");
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error);
    process.exit(1);
  }
};
