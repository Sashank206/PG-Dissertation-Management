import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ path: ".env.performance" });

try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("✅ MongoDB connected");

    const collection = mongoose.connection.collection("submissions");

    await collection.createIndex(
        { supervisorId: 1, createdAt: -1 },
        { name: "supervisorId_createdAt" }
    );

    console.log("✅ Supervisor compound index created");

    const indexes = await collection.indexes();

    console.log("\n===== SUBMISSION INDEXES =====");
    console.log(indexes);

    await mongoose.disconnect();
} catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
}
