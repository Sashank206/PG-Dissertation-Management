import mongoose from "mongoose";
import dotenv from "dotenv";
import Submission from "../src/models/Submission.js";

dotenv.config({ path: ".env.performance" });

try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("✅ MongoDB connected");

    const indexes = await Submission.collection.indexes();

    console.log("\n===== SUBMISSION INDEXES =====");

    indexes.forEach((index, i) => {
        console.log(`\nIndex ${i + 1}:`);
        console.log(index);
    });

    await mongoose.disconnect();

} catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
}