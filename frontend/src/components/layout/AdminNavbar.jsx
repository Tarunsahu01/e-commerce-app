/**
 * AdminNavbar: Header for admin area — no cart icon, no cart features.
 * Shows E-Shop, link to Admin Dashboard, and user menu (Logout).
 */
import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../lib/api';

export function AdminNavbar() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState('');
  const menuRef = useRef(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setUsername('');
        return;
      }
      try {
        const { data } = await api.get('/auth/me');
        setUsername(data?.name ?? '');
      } catch {
        setUsername('');
      }
    };
    if (isAuthenticated) {
      fetchUserProfile();
    } else {
      setUsername('');
    }
  }, [isAuthenticated]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  const handleLogout = () => {
    setOpen(false);
    logout();
    navigate('/');
  };

  return (
    <header className="bg-white border-b border-gray-200">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/admin-dashboard" className="text-xl font-bold text-black">
            E-Shop Admin
          </Link>

          <div className="flex items-center gap-2" ref={menuRef}>
            <Link
              to="/admin-dashboard"
              className="px-4 py-2 text-sm font-medium text-black border border-gray-300 rounded-md hover:bg-gray-100"
            >
              Admin Dashboard
            </Link>
            {isAuthenticated && (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setOpen((prev) => !prev)}
                  className="p-2 rounded-md text-black hover:bg-gray-100"
                  aria-label="User menu"
                  aria-expanded={open}
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                </button>
                {open && (
                  <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-md shadow-lg overflow-hidden z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                      {username && (
                        <>
                          <p className="text-xs text-gray-600">Welcome!</p>
                          <p className="text-sm font-medium text-black truncate">{username}</p>
                        </>
                      )}
                    </div>
                    <Link
                      to="/"
                      className="block px-4 py-2 text-sm text-black hover:bg-gray-100"
                      onClick={() => setOpen(false)}
                    >
                      View Store
                    </Link>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-black hover:bg-gray-100 border-t border-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
