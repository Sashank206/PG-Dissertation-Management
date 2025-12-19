import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import authRoutes from "./src/routes/authRoutes.js";
import userRoutes from "./src/routes/userRoutes.js";
import departmentRoutes from "./src/routes/departmentRoutes.js";
import dissertationRoutes from "./src/routes/dissertationRoutes.js";
import submissionRoutes from "./src/routes/submissionRoutes.js";
import feedbackRoutes from "./src/routes/feedbackRoutes.js";
import queryRoutes from "./src/routes/queryRoutes.js";
import notificationRoutes from "./src/routes/notificationRoutes.js";
import activityLogRoutes from "./src/routes/activityLogRoutes.js";
import errorMiddleware from "./src/middleware/errorMiddleware.js";

dotenv.config();

const app = express();

/* Middlewares */
app.use(cors());
app.use(express.json());

/* Routes */
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/dissertations", dissertationRoutes);
app.use("/api/submissions", submissionRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/queries", queryRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/activity-logs", activityLogRoutes);

/* Test API */
app.get("/", (req, res) => {
  res.send("PG Dissertation Management API is running...");
});
 
/* Error Handling Middleware (always last) */
app.use(errorMiddleware);

/* DB Connection */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error(err));

/* Server */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
