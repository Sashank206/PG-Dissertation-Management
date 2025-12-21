import express from "express";
import {
  createDissertation,
  getDissertations,
  updateDissertationStatus
} from "../controllers/dissertationController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, createDissertation);
router.get("/", authMiddleware, getDissertations);
router.put(
  "/:id/status",
  authMiddleware,
  roleMiddleware("supervisor", "admin"),
  updateDissertationStatus
);

export default router;
