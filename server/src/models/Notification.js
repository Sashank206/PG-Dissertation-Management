import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
    },
    message: String,
    isRead: {
    type: Boolean,
    default: false
    }
}, { timestamps: true });

export default mongoose.model("Notification",notificationSchema);