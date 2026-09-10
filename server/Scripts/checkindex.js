import mongoose from "mongoose";
import dotenv from "dotenv";
import Dissertation from "../src/models/Dissertation.js";

dotenv.config({ path: ".env.performance" });

try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("✅ MongoDB connected");

    const indexes = await Dissertation.collection.indexes();

    console.log("\n===== DISSERTATION INDEXES =====");

    indexes.forEach((index, i) => {
        console.log(`\nIndex ${i + 1}:`);
        console.log(index);
    });

    await mongoose.disconnect();
} catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
}