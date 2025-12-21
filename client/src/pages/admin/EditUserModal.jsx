import { useState, useEffect } from 'react';
import userService from '../../services/userService';
import { useNotification } from '../../context/NotificationContext';
import Loader from '../common/Loader';

const EditUserModal = ({ user, onClose, onUserUpdated }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        role: 'student',
        departmentId: '',
        rollNumber: '',
        designation: ''
    });
    const [loading, setLoading] = useState(false);
    const [departments, setDepartments] = useState([]);
    const { showNotification } = useNotification();

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                role: user.role || 'student',
                departmentId: user.departmentId?._id || user.departmentId || '',
                rollNumber: user.rollNumber || '',
                designation: user.designation || ''
            });
        }
        fetchDepartments();
    }, [user]);

    const fetchDepartments = async () => {
        try {
            const res = await userService.getDepartments();
            setDepartments(res.data);
        } catch (e) {
            console.error("Failed to fetch departments", e);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await userService.updateUser(user._id, formData);
            showNotification('success', 'User updated successfully');
            onUserUpdated();
        } catch (error) {
            console.error(error);
            showNotification('error', 'Failed to update user');
        }
        setLoading(false);
    };

    return (
        <div className="fixed inset-0 z-[60] overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={onClose}></div>
                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <div className="sm:flex sm:items-start">
                            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                                <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                                    Edit User
                                </h3>
                                <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Name</label>
                                        <input
                                            type="text" required
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                            value={formData.name}
                                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Email</label>
                                        <input
                                            type="email" required
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                            value={formData.email}
                                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Role</label>
                                            <select
                                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                value={formData.role}
                                                onChange={e => setFormData({ ...formData, role: e.target.value })}
                                            >
                                                <option value="student">Student</option>
                                                <option value="supervisor">Supervisor</option>
                                                <option value="admin">Admin</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Department</label>
                                            <select
                                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                value={formData.departmentId}
                                                onChange={e => setFormData({ ...formData, departmentId: e.target.value })}
                                            >
                                                <option value="">Select Dept</option>
                                                {departments.map(d => (
                                                    <option key={d._id} value={d._id}>{d.departmentName || d.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    {formData.role === 'student' && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Roll Number</label>
                                            <input
                                                type="text" required
                                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                value={formData.rollNumber}
                                                onChange={e => setFormData({ ...formData, rollNumber: e.target.value })}
                                            />
                                        </div>
                                    )}

                                    {formData.role === 'supervisor' && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Designation</label>
                                            <input
                                                type="text" required
                                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                value={formData.designation}
                                                onChange={e => setFormData({ ...formData, designation: e.target.value })}
                                            />
                                        </div>
                                    )}
                                    <div className="flex justify-end pt-4">
                                        <button type="button" onClick={onClose} className="mr-3 bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none">
                                            Cancel
                                        </button>
                                        <button type="submit" disabled={loading} className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none disabled:opacity-50">
                                            {loading ? <Loader className="h-4 w-4 text-white" /> : 'Save Changes'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditUserModal;
