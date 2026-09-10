import mongoose from "mongoose";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

import User from "../src/models/User.js";
import Department from "../src/models/Department.js";
import Dissertation from "../src/models/Dissertation.js";
import Submission from "../src/models/Submission.js";

dotenv.config({ path: ".env.performance" });

const TOTAL_STUDENTS = 500;
const TOTAL_SUPERVISORS = 50;
const TOTAL_ADMINS = 5;
const TOTAL_DEPARTMENTS = 10;
const SUBMISSIONS_PER_STUDENT = 3;

const seedPerformanceData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        console.log("✅ Connected to performance database");
        console.log(`📦 Database: ${mongoose.connection.name}`);

        // Clear only the performance database collections
        await Submission.deleteMany({});
        await Dissertation.deleteMany({});
        await User.deleteMany({});
        await Department.deleteMany({});

        console.log("🧹 Old performance data cleared");

        // --------------------------------------------------
        // 1. Departments
        // --------------------------------------------------

        const departments = [];

        for (let i = 1; i <= TOTAL_DEPARTMENTS; i++) {
            departments.push({
                departmentName: `Performance Department ${i}`,
                departmentCode: `PERF${i}`
            });
        }

        const createdDepartments = await Department.insertMany(departments);

        console.log(`✅ Departments created: ${createdDepartments.length}`);

        // --------------------------------------------------
        // 2. Password
        // --------------------------------------------------

        const hashedPassword = await bcrypt.hash("Test@123", 10);

        // --------------------------------------------------
        // 3. Supervisors
        // --------------------------------------------------

        const supervisors = [];

        for (let i = 1; i <= TOTAL_SUPERVISORS; i++) {
            supervisors.push({
                name: `Performance Supervisor ${i}`,
                email: `supervisor${i}@performance.test`,
                password: hashedPassword,
                role: "supervisor",
                departmentId:
                    createdDepartments[(i - 1) % TOTAL_DEPARTMENTS]._id,
                designation: "Professor",
                isActive: true
            });
        }

        const createdSupervisors = await User.insertMany(supervisors);

        console.log(`✅ Supervisors created: ${createdSupervisors.length}`);

        // --------------------------------------------------
        // 4. Admins
        // --------------------------------------------------

        const admins = [];

        for (let i = 1; i <= TOTAL_ADMINS; i++) {
            admins.push({
                name: `Performance Admin ${i}`,
                email: `admin${i}@performance.test`,
                password: hashedPassword,
                role: "admin",
                departmentId:
                    createdDepartments[(i - 1) % TOTAL_DEPARTMENTS]._id,
                designation: "Administrator",
                isActive: true
            });
        }

        const createdAdmins = await User.insertMany(admins);

        console.log(`✅ Admins created: ${createdAdmins.length}`);

        // --------------------------------------------------
        // 5. Students
        // --------------------------------------------------

        const students = [];

        for (let i = 1; i <= TOTAL_STUDENTS; i++) {
            students.push({
                name: `Performance Student ${i}`,
                email: `student${i}@performance.test`,
                password: hashedPassword,
                role: "student",
                departmentId:
                    createdDepartments[(i - 1) % TOTAL_DEPARTMENTS]._id,
                rollNumber: `PERF${String(i).padStart(4, "0")}`,
                batch: "2026",
                program: "B.Tech CSE",
                phoneNumber: `90000${String(i).padStart(5, "0")}`,
                isActive: true
            });
        }

        const createdStudents = await User.insertMany(students);

        console.log(`✅ Students created: ${createdStudents.length}`);

        // --------------------------------------------------
        // 6. Dissertations
        // --------------------------------------------------

        const dissertations = [];

        for (let i = 0; i < TOTAL_STUDENTS; i++) {
            const student = createdStudents[i];

            dissertations.push({
                studentId: student._id,
                title: `Performance Testing Project ${i + 1}`,
                abstract:
                    "This is synthetic dissertation data created for performance testing.",
                departmentId: student.departmentId,
                status: "active"
            });
        }

        const createdDissertations =
            await Dissertation.insertMany(dissertations);

        console.log(
            `✅ Dissertations created: ${createdDissertations.length}`
        );

        // --------------------------------------------------
        // 7. Submissions
        // --------------------------------------------------

        const submissions = [];

        for (let i = 0; i < createdDissertations.length; i++) {
            const dissertation = createdDissertations[i];
            const student = createdStudents[i];

            const supervisor =
                createdSupervisors[i % createdSupervisors.length];

            for (let version = 1; version <= SUBMISSIONS_PER_STUDENT; version++) {
                submissions.push({
                    dissertationId: dissertation._id,
                    studentId: student._id,
                    supervisorId: supervisor._id,
                    title: `Performance Testing Project ${i + 1} - Version ${version}`,
                    abstract:
                        "Synthetic submission data created for application performance testing.",
                    departmentId: student.departmentId,
                    fileUrl: `/uploads/performance/project-${i + 1}-v${version}.pdf`,
                    filePath: `/uploads/performance/project-${i + 1}-v${version}.pdf`,
                    version: version,
                    submissionMode: "online",
                    status:
                        version === 3
                            ? "approved"
                            : version === 2
                            ? "revision"
                            : "pending",
                    reviewedAt:
                        version > 1 ? new Date() : undefined
                });
            }
        }

        const createdSubmissions =
            await Submission.insertMany(submissions);

        console.log(`✅ Submissions created: ${createdSubmissions.length}`);

        // --------------------------------------------------
        // Summary
        // --------------------------------------------------

        console.log("\n====================================");
        console.log("🎯 PERFORMANCE TEST DATA READY");
        console.log("====================================");
        console.log(`Departments   : ${createdDepartments.length}`);
        console.log(`Students      : ${createdStudents.length}`);
        console.log(`Supervisors   : ${createdSupervisors.length}`);
        console.log(`Admins        : ${createdAdmins.length}`);
        console.log(`Dissertations : ${createdDissertations.length}`);
        console.log(`Submissions   : ${createdSubmissions.length}`);
        console.log("====================================");

        console.log("\n🔐 Test login credentials:");
        console.log("Student    : student1@performance.test");
        console.log("Supervisor : supervisor1@performance.test");
        console.log("Admin      : admin1@performance.test");
        console.log("Password   : Test@123");

        await mongoose.connection.close();

        console.log("\n✅ Database connection closed");
    } catch (error) {
        console.error("\n❌ Seeding failed:");
        console.error(error);

        await mongoose.connection.close();
        process.exit(1);
    }
};

seedPerformanceData();