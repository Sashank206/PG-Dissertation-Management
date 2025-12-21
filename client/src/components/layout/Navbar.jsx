import { useAuth } from '../../context/AuthContext';
import { LogOut, Menu, User } from 'lucide-react';
import { useNotification } from '../../context/NotificationContext';
import NotificationPanel from '../common/NotificationPanel';

const Navbar = ({ sidebarOpen, setSidebarOpen }) => {
    const { user, logout } = useAuth();
    const { showNotification } = useNotification();

    const handleLogout = () => {
        logout();
        showNotification('info', 'Logged out successfully');
    };

    return (
        <header className="flex justify-between items-center py-4 px-6 bg-white shadow-sm border-b border-gray-200">
            <div className="flex items-center">
                <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="text-gray-500 focus:outline-none lg:hidden"
                >
                    <Menu className="h-6 w-6" />
                </button>
                <div className="ml-4 lg:ml-0 font-semibold text-xl text-gray-800">
                    PG Dissertation Management
                </div>
            </div>

            <div className="flex items-center space-x-4">
                <NotificationPanel />

                <div className="relative group">
                    <div className="flex items-center space-x-2 cursor-pointer">
                        <div className="h-8 w-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
                            <User className="h-5 w-5" />
                        </div>
                        <div className="hidden md:block">
                            <div className="text-sm font-medium text-gray-700">{user?.name}</div>
                            <div className="text-xs text-gray-500 capitalize">{user?.role}</div>
                        </div>
                    </div>

                    {/* Dropdown - simple hover for now */}
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 hidden group-hover:block z-50 ring-1 ring-black ring-opacity-5">
                        <button
                            onClick={handleLogout}
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                            <LogOut className="h-4 w-4 mr-2" />
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
