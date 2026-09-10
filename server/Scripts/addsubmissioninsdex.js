import mongoose from "mongoose";
import dotenv from "dotenv";
import Submission from "../src/models/Submission.js";

dotenv.config({ path: ".env.performance" });

try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("✅ MongoDB connected");

    const result = await Submission.collection.createIndex(
        {
            studentId: 1,
            createdAt: -1
        },
        {
            name: "studentId_createdAt"
        }
    );

    console.log("\n✅ Index created:");
    console.log(result);

    await mongoose.disconnect();

} catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
}