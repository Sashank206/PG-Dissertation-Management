import mongoose from "mongoose";

const dissertationSchema = new mongoose.Schema({
  title: String,
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  supervisorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  departmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Department"
  },
  status: {
    type: String,
    default: "Proposed"
  }
}, { timestamps: true });

export default mongoose.model("Dissertation", dissertationSchema);
