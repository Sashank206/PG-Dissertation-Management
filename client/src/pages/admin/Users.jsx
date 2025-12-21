import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import userService from '../../services/userService';
import UserManagementTable from '../../components/admin/UserManagementTable';
import Loader from '../../components/common/Loader';
import { Plus } from 'lucide-react';
import { useNotification } from '../../context/NotificationContext';

const Users = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const { showNotification } = useNotification();

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await userService.getAllUsers();
            setUsers(response.data);
        } catch (error) {
            console.error("Error fetching users", error);
            showNotification('error', 'Failed to fetch users');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteUser = async (userId) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            try {
                await userService.deleteUser(userId);
                showNotification('success', 'User deleted successfully');
                fetchUsers();
            } catch (error) {
                console.error("Error deleting user", error);
                showNotification('error', 'Failed to delete user');
            }
        }
    };

    const handleEditUser = (user) => {
        setSelectedUser(user);
        setShowEditModal(true);
    };

    const handleUserUpdated = () => {
        fetchUsers();
        setShowEditModal(false);
        setSelectedUser(null);
    };

    if (loading) return <Loader />;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
                <button
                    onClick={() => navigate('/admin/add-user')}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all active:scale-95"
                >
                    <Plus className="h-5 w-5 mr-2" />
                    Add User
                </button>
            </div>

            <UserManagementTable
                users={users}
                onDelete={handleDeleteUser}
                onEdit={handleEditUser}
            />
        </div>
    );
};

export default Users;
