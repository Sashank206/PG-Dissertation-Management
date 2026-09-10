import mongoose from "mongoose";
import dotenv from "dotenv";

import User from "../src/models/User.js";
import Department from "../src/models/Department.js";
import Dissertation from "../src/models/Dissertation.js";
import Submission from "../src/models/Submission.js";

dotenv.config({ path: ".env.performance" });

const checkData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        console.log("✅ Connected to:", mongoose.connection.name);
        console.log("");

        const departments = await Department.countDocuments();
        const students = await User.countDocuments({ role: "student" });
        const supervisors = await User.countDocuments({ role: "supervisor" });
        const admins = await User.countDocuments({ role: "admin" });
        const dissertations = await Dissertation.countDocuments();
        const submissions = await Submission.countDocuments();

        console.log("========== PERFORMANCE DATA ==========");
        console.log("Departments   :", departments);
        console.log("Students      :", students);
        console.log("Supervisors   :", supervisors);
        console.log("Admins        :", admins);
        console.log("Dissertations :", dissertations);
        console.log("Submissions   :", submissions);
        console.log("======================================");

        await mongoose.connection.close();

        console.log("\n✅ Verification completed");
    } catch (error) {
        console.error("❌ Verification failed:");
        console.error(error.message);

        await mongoose.connection.close();
    }
};

checkData();