import express from "express";
import {
  addFeedback,
  getFeedbacks
} from "../controllers/feedbackController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  roleMiddleware("supervisor"),
  addFeedback
);

router.get(
  "/",
  authMiddleware,
  getFeedbacks
);

export default router;
