import { useEffect, useState } from "react";
import submissionService from "../../services/submissionService";
import ReviewPanel from "../../components/dissertation/ReviewPanel";
import StatusBadge from "../../components/common/StatusBadge";
import Loader from "../../components/common/Loader";
import { FileText, Download } from "lucide-react";
import { useNotification } from "../../context/NotificationContext";

const ReviewDissertations = () => {
  const { showNotification } = useNotification();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);

      // backend already filters by supervisor (JWT)
      const data = await submissionService.getDissertations();
      setSubmissions(Array.isArray(data) ? data : []);

    } catch (error) {
      console.error(error);
      showNotification("error", "Failed to load submissions");
      setSubmissions([]);
    } finally {
      setLoading(false);
    }
  };

  const pending = submissions.filter(s => s?.status === "pending");

  if (loading) return <Loader />;

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Review Dissertations
        </h1>
        <p className="text-sm text-gray-500">
          Review and approve or reject student submissions
        </p>
      </div>

      {/* EMPTY */}
      {pending.length === 0 && (
        <div className="bg-white p-6 rounded-lg shadow text-center text-gray-500">
          No pending submissions
        </div>
      )}

      {/* LIST */}
      <div className="space-y-4">
        {pending.map(submission => (
          <div
            key={submission._id}
            className="bg-white shadow rounded-lg p-6 border-l-4 border-yellow-400"
          >
            {/* TITLE */}
            <h3 className="text-lg font-bold text-gray-900">
              {submission.title || submission.dissertationId?.title || "Untitled Dissertation"}
            </h3>

            {/* META */}
            <p className="text-sm text-gray-500 mt-1">
              Student: {submission.studentId?.name}
            </p>

            <div className="mt-2 flex items-center gap-2">
              <StatusBadge status={submission.status} />
              <span className="px-2 py-0.5 text-xs rounded-full bg-indigo-100 text-indigo-700">
                Version {submission.version}
              </span>
              <span className="px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-700">
                {submission.submissionMode}
              </span>
            </div>

            {/* ACTIONS */}
            <div className="mt-4 flex gap-3">
              <a
                href={`http://localhost:5000${submission.fileUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 border rounded-md text-sm bg-white hover:bg-gray-50"
              >
                <Download className="h-4 w-4 mr-2" />
                View PDF
              </a>

              <button
                onClick={() =>
                  setSelectedStudent({
                    _id: submission.studentId?._id,
                    name: submission.studentId?.name,
                    dissertation: submission,
                    submissionId: submission._id
                  })
                }
                className="inline-flex items-center px-4 py-2 rounded-md text-white bg-yellow-600 hover:bg-yellow-700"
              >
                <FileText className="h-4 w-4 mr-2" />
                Review
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* REVIEW PANEL */}
      {
        selectedStudent && (
          <ReviewPanel
            student={selectedStudent}
            onClose={() => setSelectedStudent(null)}
            onUpdate={fetchSubmissions}
          />
        )
      }
    </div >
  );
};

export default ReviewDissertations;
