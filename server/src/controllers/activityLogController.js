import ActivityLog from "../models/ActivityLog.js";

export const getActivityLogs = async (req, res) => {
  const logs = await ActivityLog.find();
  res.json(logs);
};

