import Notification from "../models/Notification.js";


export const createNotification = async (userId, message) => {
  await Notification.create({
    userId,
    message
  });
};


export const getNotifications = async (req, res) => {
  // console.log("JWT userId:", req.user.userId);
  // console.log("JWT role:", req.user.role);
  const notifications = await Notification.find({
    userId: req.user.userId
  }).sort({ createdAt: -1 });

  res.json(notifications);
};


export const markAsRead = async (req, res) => {
  await Notification.findByIdAndUpdate(req.params.id, {
    isRead: true
  });

  res.json({ message: "Notification marked as read" });


};
