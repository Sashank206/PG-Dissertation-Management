import mongoose from "mongoose";

const activityLogSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    activityType: {
        type: String,
        required: true,
        enum: ['login', 'logout', 'submission', 'review', 'update', 'delete', 'create', 'other']
    },
    action: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['success', 'failure', 'pending'],
        default: 'success'
    },
    ipAddress: {
        type: String
    },
    userAgent: {
        type: String
    },
    details: {
        type: mongoose.Schema.Types.Mixed
    }
}, { timestamps: true });

// Index for faster queries
activityLogSchema.index({ userId: 1, createdAt: -1 });
activityLogSchema.index({ activityType: 1 });
activityLogSchema.index({ createdAt: -1 });

export default mongoose.model("ActivityLog", activityLogSchema);
