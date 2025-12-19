import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema({
  dissertationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Submission"
    },
    supervisorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
    },
    studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
    },
    comments: String,
    marks: Number
}, { timestamps: true });   

export default mongoose.model("Feedback", feedbackSchema);