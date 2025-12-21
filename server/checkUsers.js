// import mongoose from 'mongoose';
// import dotenv from 'dotenv';
// import User from './src/models/User.js';

// dotenv.config();

// const checkUsers = async () => {
//     try {
//         await mongoose.connect(process.env.MONGO_URI);
//         console.log("Connected to MongoDB");

//         const users = await User.find({}, 'name email role isActive');
//         console.log("Found " + users.length + " users");

//         users.forEach(u => {
//             console.log(`USER: ${u.name} | EMAIL: ${u.email} | ROLE: ${u.role} | ACTIVE: ${u.isActive}`);
//         });

//         process.exit(0);
//     } catch (error) {
//         console.error("Error:", error);
//         process.exit(1);
//     }
// };

// checkUsers();
