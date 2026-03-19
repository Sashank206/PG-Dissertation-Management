import express from "express";
import { addFeedback, getFeedbackBySubmission, getMyFeedbacks } from "../controllers/feedbackController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, roleMiddleware("supervisor", "admin"), addFeedback);
router.get("/submission/:submissionId", authMiddleware, getFeedbackBySubmission);
router.get(
  "/my",
  authMiddleware,
  roleMiddleware(["student"]),
  getMyFeedbacks
);



export default router;
