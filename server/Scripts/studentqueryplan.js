import mongoose from "mongoose";
import dotenv from "dotenv";
import Dissertation from "../src/models/Dissertation.js";

dotenv.config({ path: ".env.performance" });

try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("✅ MongoDB connected");

    const student = await mongoose.connection
        .collection("users")
        .findOne({
            email: "student1@performance.test"
        });

    if (!student) {
        console.log("❌ Student not found");
        process.exit(1);
    }

    console.log("Student ID:", student._id);

    const plan = await Dissertation
        .find({
            studentId: student._id
        })
        .explain("executionStats");

    console.log("\n===== STUDENT QUERY PLAN =====");

    console.log(
        JSON.stringify(plan.executionStats, null, 2)
    );

    await mongoose.disconnect();

} catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
}