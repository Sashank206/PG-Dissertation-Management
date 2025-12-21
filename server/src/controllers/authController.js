import User from "../models/User.js";
import bcrypt from "bcrypt";
import { generateToken } from "../config/jwt.js";
import { createActivityLog, getClientIp, getUserAgent } from "../utils/activityLogger.js";

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user || !user.isActive) {
      // Log failed login attempt
      if (user) {
        await createActivityLog({
          userId: user._id,
          activityType: 'login',
          action: 'Failed login attempt - invalid credentials',
          ipAddress: getClientIp(req),
          userAgent: getUserAgent(req),
          status: 'failure'
        });
      }
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      // Log failed login attempt
      await createActivityLog({
        userId: user._id,
        activityType: 'login',
        action: 'Failed login attempt - incorrect password',
        ipAddress: getClientIp(req),
        userAgent: getUserAgent(req),
        status: 'failure'
      });
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken({
      userId: user._id,
      role: user.role
    });

    // Log successful login
    await createActivityLog({
      userId: user._id,
      activityType: 'login',
      action: `User logged in successfully as ${user.role}`,
      ipAddress: getClientIp(req),
      userAgent: getUserAgent(req),
      status: 'success',
      details: {
        role: user.role,
        email: user.email
      }
    });

    res.json({
      token,
      role: user.role,
      name: user.name
    });

  } catch (error) {
    res.status(500).json({ message: "Login failed" });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password").populate("departmentId");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user data" });
  }
};
