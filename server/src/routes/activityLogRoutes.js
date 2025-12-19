import express from "express";
import { getActivityLogs } from "../controllers/activityLogController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  getActivityLogs
);

export default router;
