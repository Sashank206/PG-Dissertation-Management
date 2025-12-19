import express from "express";
import {
  createDissertation,
  getDissertations
} from "../controllers/dissertationController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, createDissertation);
router.get("/", authMiddleware, getDissertations);

export default router;
