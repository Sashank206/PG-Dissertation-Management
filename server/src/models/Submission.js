import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema({
  dissertationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Dissertation"
  },
  fileUrl: String,
  version: Number,
  submittedAt: Date
});

export default mongoose.model("Submission", submissionSchema);
