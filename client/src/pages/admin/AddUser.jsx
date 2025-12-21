import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import userService from '../../services/userService';
import { useNotification } from '../../context/NotificationContext';
import Loader from '../../components/common/Loader';
import { UserPlus, ArrowLeft } from 'lucide-react';

const AddUser = () => {
    const navigate = useNavigate();
    const { showNotification } = useNotification();

    const [loading, setLoading] = useState(false);
    const [departments, setDepartments] = useState([]);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'student',
        departmentId: '',
        designation: ''
    });

    useEffect(() => {
        fetchDepartments();
    }, []);

    const fetchDepartments = async () => {
        try {
            const res = await userService.getDepartments();
            setDepartments(res.data);
        } catch (e) {
            console.error('Failed to fetch departments', e);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await userService.createUser(formData);
            showNotification('success', 'User created successfully');
            navigate('/admin/users');
        } catch (error) {
            showNotification(
                'error',
                error.response?.data?.message || 'Failed to create user'
            );
        }
        setLoading(false);
    };

    return (
        <div className="max-w-2xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center text-sm font-medium text-gray-600 hover:text-indigo-600 mb-6 transition-colors"
            >
                <ArrowLeft className="h-4 w-4 mr-1" /> Back
            </button>

            <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="bg-indigo-600 px-6 py-4 flex items-center space-x-3">
                    <UserPlus className="h-6 w-6 text-white" />
                    <h2 className="text-xl font-bold text-white">
                        Add New User
                    </h2>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        {/* Full Name */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700">
                                Full Name
                            </label>
                            <input
                                type="text"
                                required
                                className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                placeholder="John Doe"
                                value={formData.name}
                                onChange={e =>
                                    setFormData({
                                        ...formData,
                                        name: e.target.value
                                    })
                                }
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Email Address
                            </label>
                            <input
                                type="email"
                                required
                                className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                placeholder="john@example.com"
                                value={formData.email}
                                onChange={e =>
                                    setFormData({
                                        ...formData,
                                        email: e.target.value
                                    })
                                }
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <input
                                type="password"
                                required
                                minLength={6}
                                className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={e =>
                                    setFormData({
                                        ...formData,
                                        password: e.target.value
                                    })
                                }
                            />
                        </div>

                        {/* Role */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Role
                            </label>
                            <select
                                className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                value={formData.role}
                                onChange={e =>
                                    setFormData({
                                        ...formData,
                                        role: e.target.value,
                                        designation: ''
                                    })
                                }
                            >
                                <option value="student">Student</option>
                                <option value="supervisor">Supervisor</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>

                        {/* Department */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Department
                            </label>
                            <select
                                className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                value={formData.departmentId}
                                onChange={e =>
                                    setFormData({
                                        ...formData,
                                        departmentId: e.target.value
                                    })
                                }
                            >
                                <option value="">Select Department</option>
                                {departments.map(d => (
                                    <option key={d._id} value={d._id}>
                                        {d.departmentName || d.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Supervisor Designation */}
                        {formData.role === 'supervisor' && (
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    Designation
                                </label>
                                <input
                                    type="text"
                                    required
                                    className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    placeholder="Assistant Professor"
                                    value={formData.designation}
                                    onChange={e =>
                                        setFormData({
                                            ...formData,
                                            designation: e.target.value
                                        })
                                    }
                                />
                            </div>
                        )}
                    </div>

                    {/* Submit */}
                    <div className="flex justify-end pt-6 border-t border-gray-100">
                        <button
                            type="submit"
                            disabled={loading}
                            className="inline-flex justify-center py-2 px-8 rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                        >
                            {loading ? (
                                <Loader className="h-4 w-4 text-white" />
                            ) : (
                                'Create User'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddUser;
