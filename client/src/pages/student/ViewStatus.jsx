import { useState, useEffect } from 'react';
import submissionService from '../../services/submissionService';
import Loader from '../../components/common/Loader';
import StatusBadge from '../../components/common/StatusBadge';
import { CheckCircle, Download } from 'lucide-react';
import clsx from 'clsx';

const ViewStatus = () => {
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStatus();
    }, []);

    const fetchStatus = async () => {
    try {
        const data = await submissionService.getMySubmissions();

        const sortedSubmissions = Array.isArray(data)
            ? [...data].sort(
                  (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
              )
            : [];

        setSubmissions(sortedSubmissions);
    } catch (error) {
        console.error("Failed to fetch status", error);
        setSubmissions([]);
    } finally {
        setLoading(false);
    }
};


    if (loading) return <Loader />;

    if (submissions.length === 0) {
        return (
            <div className="text-center py-10">
                <h2 className="text-2xl font-bold">No Dissertation Submitted</h2>
                <a
                    href="/student/upload"
                    className="mt-4 inline-flex px-4 py-2 bg-indigo-600 text-white rounded"
                >
                    Upload Now
                </a>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">Dissertation Status</h1>

            {submissions.map((submission, index) => {
                const steps = [
                    { name: 'Draft', status: 'complete' },
                    { name: 'Submitted', status: 'complete' },
                    {
                        name: 'Under Review',
                        status:
                            submission.status === 'pending'
                                ? 'current'
                                : submission.status === 'approved' || submission.status === 'rejected'
                                    ? 'complete'
                                    : 'upcoming'
                    },
                    {
                        name: 'Completed',
                        status: submission.status === 'approved' ? 'complete' : 'upcoming'
                    }
                ];

                return (
                    <div key={submission._id} className="bg-white shadow rounded-lg p-6 space-y-6">
                        {/* HEADER */}
                        <div className="flex justify-between">
                            <div>
                                <h2 className="text-lg font-bold">
                                    {submission.title || submission.dissertationId?.title || `Version ${submission.version}`}
                                </h2>

                                <div className="flex items-center space-x-2 mt-1">
                                    <p className="text-sm text-gray-500">
                                        Submitted on {new Date(submission.createdAt).toLocaleDateString()}
                                    </p>
                                    <span className="px-2 py-0.5 text-xs font-medium bg-indigo-50 text-indigo-700 rounded border border-indigo-100">
                                        {submission.submissionMode}
                                    </span>
                                </div>
                            </div>
                            <StatusBadge status={submission.status} />
                        </div>

                        {/* TIMELINE */}
                        <ol className="flex justify-between border-t pt-4">
                            {steps.map((step, idx) => (
                                <li key={idx} className="flex-1 text-center">
                                    <div
                                        className={clsx(
                                            "w-10 h-10 mx-auto rounded-full flex items-center justify-center border-2",
                                            step.status === 'complete'
                                                ? "bg-indigo-600 border-indigo-600 text-white"
                                                : step.status === 'current'
                                                    ? "border-indigo-600 text-indigo-600"
                                                    : "border-gray-300 text-gray-400"
                                        )}
                                    >
                                        {step.status === 'complete' ? (
                                            <CheckCircle className="w-6 h-6" />
                                        ) : (
                                            idx + 1
                                        )}
                                    </div>
                                    <p className="mt-2 text-sm">{step.name}</p>
                                </li>
                            ))}
                        </ol>

                        {/* DOWNLOAD */}
                        <a
                            href={`http://localhost:5000${submission.fileUrl}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-4 py-2 border rounded hover:bg-gray-50"
                        >
                            <Download className="h-5 w-5 mr-2 text-indigo-600" />
                            Download PDF
                        </a>
                    </div>
                );
            })}
        </div>
    );
};

export default ViewStatus;
