
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import userService from '../../services/userService';
import submissionService from '../../services/submissionService';
import UserManagementTable from '../../components/admin/UserManagementTable';
import StatCard from '../../components/common/StatCard';
import Loader from '../../components/common/Loader';
import {
    Users,
    FileText,
    Building,
    Activity,
    Plus,
    TrendingUp,
    UserPlus,
    LayoutGrid,
    ChevronRight,
    Settings
} from 'lucide-react';
import { useNotification } from '../../context/NotificationContext';
import AdminSidebar from './AdminSidebar';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const { showNotification } = useNotification();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalStudents: 0,
        totalSupervisors: 0,
        totalDissertations: 0,
        activeUsers: 0
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [usersResponse, submissionsResponse] = await Promise.all([
                userService.getAllUsers(),
                submissionService.getAllSubmissions()
            ]);

            const allUsers = usersResponse.data;
            setUsers(allUsers);

            const students = allUsers.filter(u => u.role === 'student');
            const supervisors = allUsers.filter(u => u.role === 'supervisor');
            const totalDissertations = Array.isArray(submissionsResponse.data) ? submissionsResponse.data.length : 0;

            setStats({
                totalStudents: students.length,
                totalSupervisors: supervisors.length,
                totalDissertations: totalDissertations,
                activeUsers: allUsers.length
            });

        } catch (error) {
            console.error("Error fetching admin data", error);
            showNotification('error', 'Failed to refresh dashboard data');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteUser = async (userId) => {
        if (window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
            try {
                await userService.deleteUser(userId);
                showNotification('success', 'User deleted successfully');
                fetchData();
            } catch (error) {
                console.error("Error deleting user", error);
                showNotification('error', 'Failed to delete user');
            }
        }
    };

    const handleEditUser = (user) => {
    navigate(`/admin/users/edit/${user._id}`);
};


    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[400px]">
            <Loader className="h-12 w-12 text-indigo-600 mb-4" />
            <p className="text-gray-500 font-medium animate-pulse">Loading amazing things...</p>
        </div>
    );

    return (
        <div className="space-y-8 animate-fade-in  ">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Admin Console</h1>
                    <p className="mt-1 text-sm text-gray-500">Overview of your institution's dissertation progress and users.</p>
                </div>
                <div className="flex items-center space-x-3">
                    <button
                        onClick={() => navigate('/admin/add-user')}
                        className="inline-flex items-center px-5 py-2.5 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-all active:scale-95 group"
                    >
                        <UserPlus className="h-5 w-5 mr-2 group-hover:rotate-12 transition-transform" />
                        New User
                    </button>
                    <button
                        onClick={() => navigate('/admin/departments')}
                        className="inline-flex items-center px-5 py-2.5 border border-gray-200 rounded-xl shadow-sm text-sm font-bold text-gray-700 bg-white hover:bg-gray-50 transition-all active:scale-95"
                    >
                        <Building className="h-5 w-5 mr-2" />
                        Departments
                    </button>
                </div>
            </div>

            {/* Premium Stats Grid */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    title="Total Students"
                    value={stats.totalStudents}
                    icon={Users}
                    color="indigo"
                    trend="+12% from last month"
                />
                <StatCard
                    title="Supervisors"
                    value={stats.totalSupervisors}
                    icon={LayoutGrid}
                    color="blue"
                    trend="+5 new this week"
                />
                <StatCard
                    title="Dissertations"
                    value={stats.totalDissertations}
                    icon={FileText}
                    color="green"
                    trend="85% approval rate"
                />
                <StatCard
                    title="Platform Activity"
                    value={`${stats.activeUsers * 27}%`}
                    icon={TrendingUp}
                    color="yellow"
                    trend="System stable"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Table area */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <UserManagementTable
                            users={users.slice(0, 5)}
                            onDelete={handleDeleteUser}
                            onEdit={handleEditUser}
                        />
                        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 font-medium">
                            <button
                                onClick={() => navigate('/admin/users')}
                                className="text-indigo-600 hover:text-indigo-800 flex items-center text-sm transition-colors"
                            >
                                View All Users <ChevronRight className="h-4 w-4 ml-1" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Sidebar area for extra stats/actions */}
                <div className="flex min-h-screen">
    <main className="flex-1 p-6 bg-gray-100" />
        <AdminSidebar />
</div>

            </div>
        </div>
        
    );
};

export default AdminDashboard;

