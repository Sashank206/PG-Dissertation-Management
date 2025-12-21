import mongoose from "mongoose";

const departmentSchema = new mongoose.Schema({
  departmentName: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  departmentCode: {
    type: String,
    required: true,
    trim: true,
    unique: true
  }
}, { timestamps: true });

export default mongoose.model("Department", departmentSchema);
