import { Routes, Route } from 'react-router-dom';
import Login from './pages/auth/Login';
import Layout from './components/layout/Layout';
import ProtectedRoute from './routes/ProtectedRoute';
import StudentDashboard from './pages/student/Dashboard';
import SupervisorDashboard from './pages/supervisor/Dashboard';
import AdminDashboard from './pages/admin/Dashboard';
import EditUser from "./pages/admin/editUser";
import Home from './pages/Home';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import NotificationToast from './components/common/NotificationToast';
import UploadDissertation from './pages/student/UploadDissertation';
import ViewStatus from './pages/student/ViewStatus';
import ReviewDissertations from './pages/supervisor/ReviewDissertations';
import Users from './pages/admin/Users';
import AddUser from './pages/admin/AddUser';
import Departments from './pages/admin/Departments';
import Reports from './pages/admin/Reports';
import StudentQueries from './pages/student/Queries';
import SupervisorQueries from './pages/supervisor/QueryList';

const App = () => {
  return (
    <>
    <AuthProvider>
      <NotificationProvider>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route path="/" element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route index element={<Home />} />

              {/* Student Routes */}
              <Route element={<ProtectedRoute allowedRoles={['student']} />}>
                <Route path="student/dashboard" element={<StudentDashboard />} />
                <Route path="student/upload" element={<UploadDissertation />} />
                <Route path="student/status" element={<ViewStatus />} />
                <Route path="student/queries" element={<StudentQueries />} />
              </Route>

              {/* Supervisor Routes */}
              <Route element={<ProtectedRoute allowedRoles={['supervisor']} />}>
                <Route path="supervisor/dashboard" element={<SupervisorDashboard />} />
                <Route path="supervisor/reviews" element={<ReviewDissertations />} />
                <Route path="supervisor/queries" element={<SupervisorQueries />} />
              </Route>

              {/* Admin Routes */}
              <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                <Route path="admin/dashboard" element={<AdminDashboard />} />
                <Route path="admin/users" element={<Users />} />
                <Route path="admin/users/edit/:id" element={<EditUser />} />
                <Route path="admin/add-user" element={<AddUser />} />
                <Route path="admin/departments" element={<Departments />} />
                <Route path="admin/reports" element={<Reports />} />
              </Route>
            </Route>
          </Route>
        </Routes>
        <NotificationToast />
      </NotificationProvider>
    </AuthProvider>
    
    </>
  );
};

export default App;
