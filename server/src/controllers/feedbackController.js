import Feedback from "../models/Feedback.js";
import Dissertation from "../models/Dissertation.js";
import Submission from "../models/Submission.js";

export const addFeedback = async (req, res) => {
  try {
    const { submissionId, comments, marks, status } = req.body;
    const supervisorId = req.user.userId;

    const submission = await Submission.findById(submissionId);
    if (!submission) return res.status(404).json({ message: "Submission not found" });

    const feedback = await Feedback.create({
      dissertationId: submission.dissertationId,
      supervisorId,
      studentId: submission.studentId,
      comments,
      marks
    });

    // Update submission status
    submission.status = status;
    submission.feedback = comments;
    await submission.save();

    // Update dissertation status
    await Dissertation.findByIdAndUpdate(submission.dissertationId, { status });

    res.status(201).json(feedback);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error adding feedback" });
  }
};

export const getFeedbackBySubmission = async (req, res) => {
  try {
    const { submissionId } = req.params;
    // Find feedbacks attached to the specific submission
    const feedback = await Feedback.find({ submissionId: submissionId })
      .populate('supervisorId', 'name')
      .populate('dissertationId', 'title');
    res.json(feedback);
  } catch (error) {
    res.status(500).json({ message: "Error fetching feedback" });
  }
};

export const getMyFeedbacks = async (req, res) => {
  try {
    const studentId = req.user.userId;
    const feedbacks = await Feedback.find({ studentId })
      .populate('supervisorId', 'name')
      .populate('dissertationId', 'title')
      .populate('submissionId');
    res.json(feedbacks);
  } catch (error) {
    res.status(500).json({ message: "Error fetching feedbacks" });
  }
};
