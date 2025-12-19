import mongoose from "mongoose";

const departmentSchema = new mongoose.Schema({
  departmentCode: String,
  departmentName: String
}, { timestamps: true });

export default mongoose.model("Department", departmentSchema);
