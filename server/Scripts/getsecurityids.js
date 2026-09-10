import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ path: ".env.performance" });

try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("✅ MongoDB connected\n");

    const users = mongoose.connection.collection("users");
    const submissions = mongoose.connection.collection("submissions");

    // Get Student 1
    const student1 = await users.findOne({
        email: "student1@performance.test"
    });

    console.log("===== STUDENT 1 =====");
    console.log("Email:", student1.email);
    console.log("Student ID:", student1._id);

    // Get a submission belonging to another student
    const otherSubmission = await submissions.findOne({
        studentId: { $ne: student1._id }
    });

    console.log("\n===== OTHER STUDENT SUBMISSION =====");
    console.log("Submission ID:", otherSubmission._id);
    console.log("Student ID:", otherSubmission.studentId);

    await mongoose.disconnect();

} catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
}