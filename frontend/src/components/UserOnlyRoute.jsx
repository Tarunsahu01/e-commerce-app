import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function UserOnlyRoute({ children }) {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const isAdmin = user?.role === 'ADMIN' || localStorage.getItem('role') === 'admin';
  if (isAdmin) {
    return <Navigate to="/admin-dashboard" replace />;
  }

  return children;
}