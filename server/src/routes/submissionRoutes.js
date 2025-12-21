import express from "express";
import {
  submitDissertation,
  getSubmissions,
  reviewSubmission
} from "../controllers/submissionController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, upload.single('file'), submitDissertation);
router.get("/", authMiddleware, getSubmissions);
router.put(
  "/:id/review",
  authMiddleware,
  roleMiddleware("supervisor"),
  reviewSubmission
);

export default router;
