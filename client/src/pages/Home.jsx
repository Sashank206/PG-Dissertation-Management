import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
    const { user } = useAuth();

    if (!user) return <Navigate to="/login" replace />;

    if (user.role === 'student') return <Navigate to="/student/dashboard" replace />;
    if (user.role === 'supervisor') return <Navigate to="/supervisor/dashboard" replace />;
    if (user.role === 'admin') return <Navigate to="/admin/dashboard" replace />;

    return <Navigate to="/login" replace />;
};

export default Home;
