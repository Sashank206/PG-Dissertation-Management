import express from "express";
import {
  createQuery,
  markPending,
  answerQuery,
  getQueriesByStatus,
  getQueries
} from "../controllers/queryController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  roleMiddleware("student"),
  createQuery
);

router.put(
  "/:id/pending",
  authMiddleware,
  roleMiddleware("supervisor"),
  markPending
);

router.put(
  "/:id/answer",
  authMiddleware,
  roleMiddleware("supervisor"),
  answerQuery
);

router.get(
  "/status/:status",
  authMiddleware,
  roleMiddleware("admin", "supervisor"),
  getQueriesByStatus
);

router.get(
  "/",
  authMiddleware,
  roleMiddleware("admin", "student", "supervisor"),
  getQueries
);

export default router;
