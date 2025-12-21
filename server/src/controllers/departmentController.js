import Department from "../models/Department.js";

/* ===============================
   GET ALL DEPARTMENTS
================================ */
export const getDepartments = async (req, res) => {
  try {
    const departments = await Department.find().sort({ departmentName: 1 });
    res.json(departments);
  } catch {
    res.status(500).json({ message: "Failed to fetch departments" });
  }
};

/* ===============================
   CREATE DEPARTMENT
================================ */
export const createDepartment = async (req, res) => {
  try {
    const { departmentName, departmentCode } = req.body;

    // 🔒 Prevent duplicates
    const exists = await Department.findOne({
      $or: [
        { departmentName },
        { departmentCode }
      ]
    });

    if (exists) {
      return res.status(400).json({
        message: "Department name or code already exists"
      });
    }

    const department = await Department.create({
      departmentName,
      departmentCode
    });

    res.status(201).json(department);
  } catch (error) {
    res.status(500).json({ message: "Failed to create department" });
  }
};

/* ===============================
   UPDATE DEPARTMENT
================================ */
export const updateDepartment = async (req, res) => {
  try {
    const { departmentName, departmentCode } = req.body;
    const { id } = req.params;

    // 🔒 Prevent duplicates (excluding self)
    const exists = await Department.findOne({
      _id: { $ne: id },
      $or: [
        { departmentName },
        { departmentCode }
      ]
    });

    if (exists) {
      return res.status(400).json({
        message: "Department name or code already exists"
      });
    }

    const updated = await Department.findByIdAndUpdate(
      id,
      { departmentName, departmentCode },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Department not found" });
    }

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Failed to update department" });
  }
};

/* ===============================
   DELETE DEPARTMENT
================================ */
export const deleteDepartment = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Department.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Department not found" });
    }

    res.json({ message: "Department deleted successfully" });
  } catch {
    res.status(500).json({ message: "Failed to delete department" });
  }
};
