import mongoose from "mongoose";
import dotenv from "dotenv";
import Submission from "../src/models/Submission.js";

dotenv.config({ path: ".env.performance" });

try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("✅ MongoDB connected");

    const supervisor = await mongoose.connection
        .collection("users")
        .findOne({
            email: "supervisor1@performance.test"
        });

    if (!supervisor) {
        console.log("❌ Supervisor not found");
        process.exit(1);
    }

    console.log("Supervisor ID:", supervisor._id);

    const plan = await Submission
        .find({
            supervisorId: supervisor._id
        })
        .sort({ createdAt: -1 })
        .explain("executionStats");

    console.log("\n===== SUPERVISOR QUERY PLAN =====");

    console.log(
        JSON.stringify(plan.executionStats, null, 2)
    );

    await mongoose.disconnect();

} catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
}