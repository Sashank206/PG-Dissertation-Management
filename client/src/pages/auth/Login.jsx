import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { GraduationCap, Lock, Mail } from 'lucide-react';
import Loader from '../../components/common/Loader';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { login } = useAuth();
    const { showNotification } = useNotification();
    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from?.pathname || '/';

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const result = await login(email, password);

        if (result.success) {
            showNotification('success', 'Login successful!');
            navigate(from, { replace: true });
        } else {
            showNotification('error', result.message);
        }
        setIsLoading(false);
    };

    return (
<div className="min-h-screen bg-gradient-to-br from-yellow-500 via-purple-500 to-blue-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="flex justify-center">
                    <div className="bg-gradient-to-r from-red-500 to-blue-600 p-3 rounded-full shadow-lg">
                        <GraduationCap className="h-10 w-10 text-white" />
                    </div>
                </div>
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    PG Dissertation Management
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Sign in to your account
                </p>
            </div>

            {/* Card */}
            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-gradient-to-r from-red-500 to-blue-600 p-[1px] rounded-lg shadow-lg">
                    <div className="bg-white py-8 px-4 rounded-lg sm:px-10">
                        <form className="space-y-6" onSubmit={handleSubmit}>
                            
                            {/* Email */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Email address
                                </label>
                                <div className="mt-1 relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Mail className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="you@university.edu"
                                        className="block w-full pl-10 py-2 border border-gray-300 rounded-md 
                                        focus:ring-2 focus:ring-blue-400 focus:border-blue-500 sm:text-sm"
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Password
                                </label>
                                <div className="mt-1 relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="block w-full pl-10 py-2 border border-gray-300 rounded-md 
                                        focus:ring-2 focus:ring-red-400 focus:border-red-500 sm:text-sm"
                                    />
                                </div>
                            </div>

                            {/* Button */}
                            <div>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full flex justify-center py-2 px-4 rounded-md shadow-md 
                                    text-sm font-medium text-white 
                                    bg-gradient-to-r from-red-600 to-blue-600 
                                    hover:from-red-700 hover:to-blue-700 
                                    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 
                                    disabled:opacity-50 transition-all"
                                >
                                    {isLoading ? (
                                        <Loader className="h-5 w-5 text-white" />
                                    ) : (
                                        'Sign in'
                                    )}
                                </button>
                            </div>

                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
