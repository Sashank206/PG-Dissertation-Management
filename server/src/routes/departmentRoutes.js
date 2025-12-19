import express from "express";
import {
  createDepartment,
  getDepartments
} from "../controllers/departmentController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  createDepartment
);

router.get(
  "/",
  authMiddleware,
  getDepartments
);

export default router;
