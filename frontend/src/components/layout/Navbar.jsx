/**
 * Navbar: Black text on white, with Cart + Login / Hamburger.
 *
 * IF NOT LOGGED IN:
 * - Cart button (top right, left of Login)
 * - Login button
 *
 * IF LOGGED IN:
 * - Cart button stays
 * - Login replaced by Hamburger menu with dropdown (name, email, Admin link, Logout).
 */
import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  const isAdmin = user?.role === 'ADMIN';

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
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
          <Link to="/" className="text-xl font-bold text-black">
            E-Shop
          </Link>

          <div className="flex items-center gap-2" ref={menuRef}>
            {/* Cart button (always visible). Currently navigates to /cart, which redirects to home. */}
            <Link
              to="/cart"
              className="relative p-2 rounded-md text-black hover:bg-gray-100 transition-colors"
              aria-label="Cart"
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
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </Link>

            {!isAuthenticated ? (
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-medium text-black border border-black rounded-md hover:bg-gray-100 transition-colors"
              >
                Login
              </Link>
            ) : (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setOpen((prev) => !prev)}
                  className="p-2 rounded-md text-black hover:bg-gray-100 transition-colors"
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
                      <p className="text-sm font-medium text-black truncate">
                        {user?.name ?? 'User'}
                      </p>
                      <p className="mt-0.5 text-xs text-gray-600 truncate">
                        {user?.email}
                      </p>
                    </div>

                    {isAdmin && (
                      <Link
                        to="/admin"
                        className="block px-4 py-2 text-sm text-black hover:bg-gray-100"
                        onClick={() => setOpen(false)}
                      >
                        Admin Dashboard
                      </Link>
                    )}

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
