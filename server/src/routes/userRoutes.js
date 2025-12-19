import express from "express";
import { createUser, getAllUsers } from "../controllers/userController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  createUser
);

router.get(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  getAllUsers
);

export default router;
