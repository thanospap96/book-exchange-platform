import mongoose from "mongoose";

export const connectDB = async (): Promise<void> => {
    console.log("🟡 Trying to connect to MongoDB..."); // DEBUG
    try {
        await mongoose.connect(process.env.MONGO_URI!);
        console.log("✅ Connected to MongoDB!");
    } catch (error) {
        console.error("❌ Database connection error:", error);
        process.exit(1);
    }
};