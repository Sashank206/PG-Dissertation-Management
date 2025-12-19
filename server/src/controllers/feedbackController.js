import Feedback from "../models/Feedback.js";
import { createNotification } from "./notificationController.js";

/* Supervisor adds feedback */
export const addFeedback = async (req, res) => {
  const feedback = await Feedback.create({
    studentId: req.body.studentId,
    supervisorId: req.user.userId, // supervisor from JWT
    dissertationId: req.body.dissertationId,
    comments: req.body.comments,
    grade: req.body.grade
  });

 
  await createNotification(
    feedback.studentId,
    "New feedback has been added to your dissertation"
  );

  res.status(201).json(feedback);
};

/* View feedback */
export const getFeedbacks = async (req, res) => {
  const feedbacks = await Feedback.find();
  res.json(feedbacks);
};
