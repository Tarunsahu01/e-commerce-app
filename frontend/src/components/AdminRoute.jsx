/**
 * AdminRoute: Renders children only if user has admin role; otherwise redirects to home.
 * Uses localStorage "role" === "admin" to avoid showing admin UI to normal users.
 */
import { Navigate, useLocation } from 'react-router-dom';

export function AdminRoute({ children }) {
  const location = useLocation();
  const role = localStorage.getItem('role');

  if (role !== 'admin') {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  return children;
}
