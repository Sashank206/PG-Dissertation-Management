import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema({
  dissertationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Dissertation",
    required: true
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  supervisorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  title: String,
  abstract: String,
  departmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Department"
  },
  fileUrl: String,
  filePath: String,
  version: Number,
  submissionMode: String,
  status: {
    type: String,
    enum: ["pending", "approved", "rejected", "revision"],
    default: "pending"
  },
  reviewedAt: Date
}, { timestamps: true });

export default mongoose.model("Submission", submissionSchema);
