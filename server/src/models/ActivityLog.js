import mongoose from "mongoose";
const submissionSchema = new mongoose.Schema({
    activityType: String,
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    action: String,
}, { timestamps: true });
export default mongoose.model("ActivityLog", submissionSchema);