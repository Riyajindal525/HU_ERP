import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export const ProtectedRoute = ({ children, allowedRoles }) => {
    const { isAuthenticated, role } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(role)) {
        // Role-based redirects
        if (role === 'STUDENT') {
            return <Navigate to="/student/dashboard" replace />;
        } else if (role === 'FACULTY') {
            return <Navigate to="/faculty/dashboard" replace />;
        } else if (role === 'LIBRARIAN') {
            return <Navigate to="/library/dashboard" replace />;
        } else if (role === 'FEE_CLERK') {
            return <Navigate to="/fees/dashboard" replace />;
        } else if (role === 'ADMIN' || role === 'SUPER_ADMIN') {
            return <Navigate to="/admin/dashboard" replace />;
        }
        return <Navigate to="/unauthorized" replace />;
    }

    return children;
};

export default ProtectedRoute;
