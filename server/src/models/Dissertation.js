import mongoose from "mongoose";

const dissertationSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    unique: true
  },
  title: String,
  abstract: String,
  departmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Department"
  },
  status: String
}, { timestamps: true });

export default mongoose.model("Dissertation", dissertationSchema);
