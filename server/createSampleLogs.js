// import mongoose from 'mongoose';
// import dotenv from 'dotenv';
// import User from './src/models/User.js';
// import ActivityLog from './src/models/ActivityLog.js';

// dotenv.config();

// const createSampleLogs = async () => {
//     try {
//         // Connect to MongoDB
//         await mongoose.connect(process.env.MONGO_URI);
//         console.log('MongoDB Connected');

//         // Get some users from the database
//         const users = await User.find().limit(5);

//         if (users.length === 0) {
//             console.log('No users found in database. Please create some users first.');
//             process.exit(0);
//         }

//         console.log(`Found ${users.length} users. Creating sample activity logs...`);

//         const activityTypes = ['login', 'logout', 'submission', 'review', 'update', 'create'];
//         const statuses = ['success', 'success', 'success', 'failure']; // More success than failure
//         const ipAddresses = ['192.168.1.1', '10.0.0.1', '172.16.0.1', '203.0.113.1'];

//         const sampleLogs = [];

//         // Create 50 sample logs
//         for (let i = 0; i < 50; i++) {
//             const randomUser = users[Math.floor(Math.random() * users.length)];
//             const randomActivityType = activityTypes[Math.floor(Math.random() * activityTypes.length)];
//             const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
//             const randomIp = ipAddresses[Math.floor(Math.random() * ipAddresses.length)];

//             const actions = {
//                 login: `User logged in as ${randomUser.role}`,
//                 logout: `User logged out`,
//                 submission: `Submitted dissertation for review`,
//                 review: `Reviewed dissertation submission`,
//                 update: `Updated ${randomUser.role === 'admin' ? 'user profile' : 'dissertation'}`,
//                 create: `Created new ${randomUser.role === 'admin' ? 'user account' : 'dissertation'}`
//             };

//             const log = {
//                 userId: randomUser._id,
//                 activityType: randomActivityType,
//                 action: actions[randomActivityType],
//                 ipAddress: randomIp,
//                 userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
//                 status: randomStatus,
//                 details: {
//                     role: randomUser.role,
//                     email: randomUser.email
//                 },
//                 createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000) // Random date within last 30 days
//             };

//             sampleLogs.push(log);
//         }

//         // Insert all logs
//         await ActivityLog.insertMany(sampleLogs);
//         console.log(`✅ Successfully created ${sampleLogs.length} sample activity logs!`);

//         // Show summary
//         const logCounts = await ActivityLog.aggregate([
//             { $group: { _id: '$activityType', count: { $sum: 1 } } }
//         ]);

//         console.log('\nActivity Log Summary:');
//         logCounts.forEach(item => {
//             console.log(`  ${item._id}: ${item.count} logs`);
//         });

//         mongoose.connection.close();
//         console.log('\nDatabase connection closed.');
//         process.exit(0);

//     } catch (error) {
//         console.error('Error creating sample logs:', error);
//         process.exit(1);
//     }
// };

// createSampleLogs();
