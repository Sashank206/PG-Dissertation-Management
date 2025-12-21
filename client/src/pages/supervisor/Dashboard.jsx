import { useState, useEffect } from 'react';
import submissionService from '../../services/submissionService';
import queryService from '../../services/queryService';
import StatCard from '../../components/common/StatCard';
import Loader from '../../components/common/Loader';
import { Users, AlertCircle, CheckCircle, Clock, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';
import StatusBadge from '../../components/common/StatusBadge';
import { useAuth } from '../../context/AuthContext';

const SupervisorDashboard = () => {
    const { user, logout } = useAuth();
    const [stats, setStats] = useState({
        total: 0,
        pending: 0,
        completed: 0,
        activeStudents: 0,
        openQueries: 0
    });

    const [recentReviews, setRecentReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);

            // Fetch Dissertations
            const allSubmissions = await submissionService.getDissertations();
            const submissions = Array.isArray(allSubmissions) ? allSubmissions : [];

            // Fetch Queries for count
            const allQueries = await queryService.getQueries();
            const queries = Array.isArray(allQueries) ? allQueries : [];
            const openQueriesCount = queries.filter(q => q.status !== 'Closed').length;

            setStats({
                total: submissions.length,
                pending: submissions.filter(s => s.status === 'pending').length,
                completed: submissions.filter(
                    s => s.status === 'approved' || s.status === 'rejected'
                ).length,
                activeStudents: new Set(
                    submissions.map(s => s.studentId?._id).filter(Boolean)
                ).size,
                openQueries: openQueriesCount
            });

            // recent completed reviews (latest 3)
            setRecentReviews(
                submissions
                    .filter(s => s.status !== 'pending')
                    .slice(0, 3)
            );

        } catch (error) {
            console.error("Supervisor dashboard fetch error", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <Loader />;

    return (
        <div className="space-y-8">
            {/* HEADER */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Welcome, {user.name}</h1>
                    <p className="mt-2 text-gray-600">
                        Manage and review dissertations assigned to you
                    </p>
                </div>
                <Link
                    to="/supervisor/queries"
                    className="p-3 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all flex items-center text-gray-700 font-medium group"
                >
                    <div className="bg-indigo-50 p-2 rounded-lg mr-3 group-hover:bg-indigo-100 transition-colors">
                        <MessageSquare className="h-5 w-5 text-indigo-600" />
                    </div>
                    <span>Respond to Queries</span>
                    {stats.openQueries > 0 && (
                        <span className="ml-2 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full ring-2 ring-white">
                            {stats.openQueries}
                        </span>
                    )}
                </Link>
            </div>

            {/* STATS */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
                <StatCard title="Total Assigned" value={stats.total} icon={Users} color="indigo" />
                <StatCard title="Pending Review" value={stats.pending} icon={Clock} color="yellow" />
                <StatCard title="Reviews Done" value={stats.completed} icon={CheckCircle} color="green" />
                <StatCard title="Active Students" value={stats.activeStudents} icon={Users} color="blue" />
                <StatCard title="Open Queries" value={stats.openQueries} icon={MessageSquare} color="indigo" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* LEFT: Pending Reviews */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-gray-900 flex items-center">
                            <Clock className="h-5 w-5 mr-2 text-yellow-500" />
                            Pending Reviews
                        </h2>
                        <Link
                            to="/supervisor/reviews"
                            className="text-sm font-medium text-indigo-600 hover:text-indigo-500 bg-indigo-50 px-3 py-1 rounded-full transition-colors"
                        >
                            View All
                        </Link>
                    </div>

                    <div className="bg-white shadow rounded-lg p-10 text-center border border-gray-100">
                        <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Clock className="h-10 w-10 text-gray-300" />
                        </div>
                        {stats.pending > 0 ? (
                            <p className="text-gray-600 font-medium">You have {stats.pending} dissertations waiting for review.</p>
                        ) : (
                            <p className="text-gray-500">No pending reviews. Good job!</p>
                        )}
                        <div className="mt-6">
                            <Link
                                to="/supervisor/reviews"
                                className="inline-flex items-center px-6 py-3 rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 transition-all shadow-lg active:scale-95"
                            >
                                <CheckCircle className="h-5 w-5 mr-2" />
                                Go to Review Hub
                            </Link>
                        </div>
                    </div>
                </div>

                {/* RIGHT: Recent Activity */}
                <div className="space-y-6">
                    <h3 className="font-bold text-gray-900 flex items-center px-1">
                        <AlertCircle className="h-5 w-5 mr-2 text-indigo-500" />
                        Recent Activity
                    </h3>
                    <div className="bg-white shadow rounded-lg p-6 space-y-4 border border-gray-100">
                        {recentReviews.length > 0 ? (
                            recentReviews.map(r => (
                                <div
                                    key={r._id}
                                    className="flex items-start space-x-3 pb-4 border-b last:border-0 last:pb-0"
                                >
                                    <div
                                        className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0
                                            ${r.status === 'approved'
                                                ? 'bg-green-100 text-green-600'
                                                : 'bg-red-100 text-red-600'}
                                        `}
                                    >
                                        {r.status === 'approved'
                                            ? <CheckCircle className="w-4 h-4" />
                                            : <AlertCircle className="w-4 h-4" />
                                        }
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm font-bold text-gray-900 truncate">
                                            {r.title || r.dissertationId?.title || 'Untitled'}
                                        </p>
                                        <p className="text-xs text-gray-500 mb-2">
                                            Student: {r.studentId?.name || 'Unknown'}
                                        </p>
                                        <div className="flex items-center space-x-2">
                                            <StatusBadge status={r.status} />
                                            <span className="text-[10px] px-1.5 py-0.5 bg-gray-50 text-gray-400 rounded uppercase font-bold tracking-wider">
                                                {r.submissionMode}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-6 text-gray-400">
                                <AlertCircle className="h-8 w-8 mx-auto mb-2 opacity-20" />
                                <p className="text-sm">No recent activity.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SupervisorDashboard;
