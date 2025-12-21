import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
    LayoutDashboard,
    Users,
    BookOpen,
    FileText,
    MessageSquare,
    Settings,
    GraduationCap,
    ClipboardCheck,
    Building,
    Upload,
    UserPlus
} from 'lucide-react';
import clsx from 'clsx';

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
    const { user } = useAuth();
    const location = useLocation();
    const role = user?.role;

    const links = {
        admin: [
            { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
            { name: 'Users', path: '/admin/users', icon: Users },
            // { name: 'Add User', path: '/admin/add-user', icon: UserPlus },
            { name: 'Departments', path: '/admin/departments', icon: Building },
            { name: 'Reports', path: '/admin/reports', icon: FileText },
        ],
        supervisor: [
            { name: 'Dashboard', path: '/supervisor/dashboard', icon: LayoutDashboard },
            { name: 'Review Dissertations', path: '/supervisor/reviews', icon: ClipboardCheck },
            { name: 'Queries', path: '/supervisor/queries', icon: MessageSquare },

        ],
        student: [
            { name: 'Dashboard', path: '/student/dashboard', icon: LayoutDashboard },
            { name: 'Upload Dissertation', path: '/student/upload', icon: Upload },
            { name: 'Queries', path: '/student/queries', icon: MessageSquare },
            { name: 'View Status', path: '/student/status', icon: BookOpen },
        ]
    };

    const currentLinks = links[role] || [];

    return (
        <>
            {/* Mobile backdrop */}
            <div
                onClick={() => setSidebarOpen(false)}
                className={clsx(
                    "fixed inset-0 z-20 transition-opacity bg-black opacity-50 lg:hidden",
                    sidebarOpen ? "block" : "hidden"
                )}
            ></div>

            {/* Sidebar */}
            <div className={clsx(
                "fixed inset-y-0 left-0 z-30 w-64 overflow-y-auto transition duration-300 transform bg-white border-r border-gray-200 lg:translate-x-0 lg:static lg:inset-0",
                sidebarOpen ? "translate-x-0 ease-out" : "-translate-x-full ease-in"
            )}>
                <div className="flex items-center justify-center p-6 border-b border-gray-200">
                    <div className="flex items-center space-x-2">
                        <GraduationCap className="h-8 w-8 text-indigo-600" />
                        <span className="text-2xl font-bold text-gray-800">DMS</span>
                    </div>
                </div>

                <nav className="mt-6 px-4 space-y-2 ">
                    {currentLinks.map((link) => {
                        const Icon = link.icon;
                        const isActive = location.pathname.startsWith(link.path);

                        return (
                            <Link
                                key={link.name}
                                to={link.path}
                                className={clsx(
                                    "flex items-center px-4 py-3 text-sm font-medium transition-colors rounded-lg",
                                    isActive
                                        ? "bg-indigo-50 text-indigo-700"
                                        : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                                )}
                                onClick={() => setSidebarOpen(false)} // mobile close
                            >
                                <Icon className="h-5 w-5 mr-3" />
                                {link.name}
                            </Link>
                        );
                    })}
                </nav>
            </div>
        </>
    );
};

export default Sidebar;
