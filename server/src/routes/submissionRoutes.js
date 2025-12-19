import express from "express";
import {
  submitDissertation,
  getSubmissions
} from "../controllers/submissionController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, submitDissertation);
router.get("/", authMiddleware, getSubmissions);

export default router;
