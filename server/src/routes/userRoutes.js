import express from "express";
import { createUser, getAllUsers, deleteUser, updateUser } from "../controllers/userController.js";
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
  // Allow all authenticated users to fetch users list (filtered by role in controller or frontend)
  // For dropdowns, we need students to see supervisors
  roleMiddleware("admin", "student", "supervisor"),
  getAllUsers
);



router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  deleteUser
);

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  updateUser
);

export default router;
