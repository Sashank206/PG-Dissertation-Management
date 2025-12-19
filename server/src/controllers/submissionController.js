import Submission from "../models/Submission.js";

export const submitDissertation = async (req, res) => {
  const submission = await Submission.create({
    ...req.body,
    submittedAt: new Date()
  });
  res.status(201).json(submission);
};

export const getSubmissions = async (req, res) => {
  const submissions = await Submission.find();
  res.json(submissions);
};
