import { useState } from "react";
import submissionService from "../../services/submissionService";
import { X, CheckCircle, XCircle } from "lucide-react";
import Loader from "../common/Loader";
import { useNotification } from "../../context/NotificationContext";

const ReviewPanel = ({ student, onClose, onUpdate }) => {
    const { showNotification } = useNotification();
    const [loading, setLoading] = useState(false);
    const [remarks, setRemarks] = useState("");

    if (!student) return null;

    const handleDecision = async (status) => {
        try {
            setLoading(true);

            await submissionService.reviewSubmission(
                student.submissionId,
                {
                    status,
                    remarks
                }
            );

            showNotification("success", `Submission ${status}`);
            onClose();
            onUpdate();

        } catch (error) {
            console.error(error);
            showNotification("error", "Action failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
            <div className="bg-white w-full max-w-xl rounded-lg shadow-lg relative">

                {/* HEADER */}
                <div className="flex justify-between items-center px-6 py-4 border-b">
                    <h2 className="text-lg font-bold text-gray-900">
                        Review Dissertation
                    </h2>
                    <button onClick={onClose}>
                        <X className="h-5 w-5 text-gray-500" />
                    </button>
                </div>

                {/* BODY */}
                <div className="p-6 space-y-4">
                    <div>
                        <p className="text-sm text-gray-500">Student</p>
                        <p className="font-medium text-gray-900">{student.name}</p>
                    </div>

                    <div>
                        <p className="text-sm text-gray-500">Dissertation Title</p>
                        <p className="font-medium text-gray-900">
                            {student.dissertation?.title || "Untitled"}
                        </p>
                    </div>

                    <div>
                        <p className="text-sm text-gray-500 mb-1">Abstract</p>
                        <div className="bg-gray-50 border rounded p-3 text-sm text-gray-700 max-h-40 overflow-y-auto">
                            {student.dissertation?.abstract || "No abstract available"}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Remarks (optional)
                        </label>
                        <textarea
                            rows={3}
                            className="w-full border rounded-md p-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
                            value={remarks}
                            onChange={(e) => setRemarks(e.target.value)}
                            placeholder="Write feedback for the student..."
                        />
                    </div>
                </div>

                {/* FOOTER */}
                <div className="flex justify-end gap-3 px-6 py-4 border-t">
                    <button
                        onClick={() => handleDecision("rejected")}
                        disabled={loading}
                        className="inline-flex items-center px-4 py-2 rounded-md text-white bg-red-600 hover:bg-red-700"
                    >
                        <XCircle className="h-4 w-4 mr-2" />
                        Reject
                    </button>

                    <button
                        onClick={() => handleDecision("approved")}
                        disabled={loading}
                        className="inline-flex items-center px-4 py-2 rounded-md text-white bg-green-600 hover:bg-green-700"
                    >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Approve
                    </button>
                </div>

                {loading && (
                    <div className="absolute inset-0 bg-white bg-opacity-60 flex items-center justify-center">
                        <Loader />
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReviewPanel;
