import User from "../models/User.js";
import bcrypt from "bcrypt";

export const createUser = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role,
      departmentId,
      designation,
      rollNumber
    } = req.body;

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const userPayload = {
      name,
      email,
      password: hashedPassword,
      role,
      designation,
      rollNumber
    };

    if (departmentId && departmentId.trim() !== "") {
      userPayload.departmentId = departmentId;
    }

    await User.create(userPayload);

    res.status(201).json({ message: "User created successfully" });

  } catch (error) {
    console.error("CREATE USER ERROR:", error);
    res.status(500).json({ message: "Error creating user" });
  }
};

export const getAllUsers = async (req, res) => {
  const users = await User.find().select("-password").populate("departmentId", "departmentName");
  res.json(users);
};

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("DELETE USER ERROR:", error);
    res.status(500).json({ message: "Error deleting user" });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { name, email, role, departmentId, designation, rollNumber } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    user.name = name || user.name;
    user.email = email || user.email;
    user.role = role || user.role;
    user.departmentId = departmentId || user.departmentId;
    if (designation) user.designation = designation;
    if (rollNumber) user.rollNumber = rollNumber;

    await user.save();
    res.json({ message: "User updated", user });
  } catch (error) {
    console.error("UPDATE USER ERROR:", error);
    res.status(500).json({ message: "Error updating user" });
  }
};


