import mongoose from "mongoose";
import dotenv from "dotenv";
import Dissertation from "../src/models/Dissertation.js";

dotenv.config({ path: ".env.performance" });

try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("✅ MongoDB connected");

    const plan = await Dissertation
        .find({})
        .populate("studentId", "name email")
        .populate("departmentId", "departmentName")
        .explain("executionStats");

    console.log("\n===== QUERY EXECUTION PLAN =====");

    console.log(
        JSON.stringify(plan.executionStats, null, 2)
    );

    await mongoose.disconnect();
} catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
}