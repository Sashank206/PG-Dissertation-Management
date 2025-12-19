import Department from "../models/Department.js";

export const createDepartment = async (req, res) => {
  const department = await Department.create(req.body);
  res.status(201).json(department);
};

export const getDepartments = async (req, res) => {
  const departments = await Department.find();
  res.json(departments);
};
