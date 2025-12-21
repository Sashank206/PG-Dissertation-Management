import express from "express";
import {
  getDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment
} from "../controllers/departmentController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, getDepartments);
router.post("/", authMiddleware, roleMiddleware("admin"), createDepartment);
router.put("/:id", authMiddleware, roleMiddleware("admin"), updateDepartment);
router.delete("/:id", authMiddleware, roleMiddleware("admin"), deleteDepartment);

export default router;
