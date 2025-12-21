
import { useState, useEffect } from 'react';
import submissionService from '../../services/submissionService';
import StatCard from '../../components/common/StatCard';
import Loader from '../../components/common/Loader';
import { FileText, Clock, CheckCircle, AlertCircle, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';
import QueryPanel from './QueryPanel';
import { useAuth } from '../../context/AuthContext';

const StudentDashboard = () => {
  const { user, logout } = useAuth();
  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(true);

  // Mocking stats for now, in real app derive from data
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // ✅ service already returns array
      const submissions = await submissionService.getMySubmissions();

      const safeSubmissions = Array.isArray(submissions) ? submissions : [];
      const latest = safeSubmissions[0] || null;

      setSubmission(latest);

      setStats({
        total: safeSubmissions.length,
        pending: safeSubmissions.filter(s => s.status === 'pending').length,
        approved: safeSubmissions.filter(s => s.status === 'approved').length,
        rejected: safeSubmissions.filter(s => s.status === 'rejected').length
      });

    } catch (error) {
      console.error("Error fetching dashboard data", error);
    } finally {
      setLoading(false);
    }
  };


  if (loading) return <Loader />;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.name}</h1>
        <p className="mt-2 text-gray-600">Track your dissertation progress and manage your submissions.</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Submissions"
          value={stats.total}
          icon={FileText}
          color="indigo"
        />
        <StatCard
          title="Pending Review"
          value={stats.pending}
          icon={Clock}
          color="yellow"
        />
        <StatCard
          title="Approved"
          value={stats.approved}
          icon={CheckCircle}
          color="green"
        />
        <StatCard
          title="Rejected"
          value={stats.rejected}
          icon={AlertCircle}
          color="red"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Dissertations / Current Status */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-bold text-gray-900">Your Dissertations</h2>

          {submission ? (
            <div className="bg-white shadow rounded-lg p-6 border border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {submission.title || submission.dissertationId?.title || 'Dissertation'}
                </h3>

                <p className="text-sm text-gray-500 mt-1">
                  Submitted on {new Date(submission.createdAt).toLocaleDateString()}
                </p>

                <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                  {submission.abstract || submission.dissertationId?.abstract || 'No abstract provided'}
                </p>
              </div>

              <div className="mt-4 sm:mt-0 flex flex-col items-end space-y-2">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium capitalize
              ${submission.status === 'approved'
                      ? 'bg-green-100 text-green-800'
                      : submission.status === 'rejected'
                        ? 'bg-red-100 text-red-800'
                        : submission.status === 'revision'
                          ? 'bg-orange-100 text-orange-800'
                          : 'bg-yellow-100 text-yellow-800'
                    }`}
                >
                  {submission.status}
                </span>

                <Link
                  to="/student/status"
                  className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center"
                >
                  View Details
                </Link>
              </div>
            </div>
          ) : (
            <div className="bg-white shadow rounded-lg p-8 text-center border-dashed border-2 border-gray-300">
              <p className="text-gray-500">No dissertations submitted yet.</p>
              <Link
                to="/student/upload"
                className="mt-4 inline-flex items-center px-4 py-2 rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Submit New Dissertation
              </Link>
            </div>
          )}
        </div>

        {/* Sidebar: Recent Feedback & Tips */}
        <div className="space-y-6">
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center">
              <MessageSquare className="h-5 w-5 mr-2 text-indigo-500" />
              Recent Feedback
            </h3>
            {/* Mock or fetch real feedback */}
            <div className="space-y-4">
              <div className="p-3 bg-gray-50 rounded-md">
                <p className="text-sm text-gray-600 italic">"Ensure your PDF is properly formatted before upload..."</p>
                <p className="text-xs text-gray-400 mt-2 text-right">- System Tip</p>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <h3 className="font-bold text-yellow-800 mb-2">Quick Tips</h3>
            <ul className="text-sm text-yellow-700 space-y-2 list-disc list-inside">
              <li>Check formatting guidelines.</li>
              <li>Include abstract and references.</li>
              <li>Review supervisor feedback promptly.</li>
            </ul>
          </div>

          {/* Query Panel */}
          <QueryPanel />
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;

