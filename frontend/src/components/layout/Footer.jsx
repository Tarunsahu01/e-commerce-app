/**
 * Footer component for the website
 */
import { Link, useLocation } from 'react-router-dom';

export function Footer() {

  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin-dashboard');

  return (
    <footer
      className="text-gray-300 mt-auto"
      style={{
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        background:
          'radial-gradient(900px circle at 20% -30%, rgba(200,169,126,0.16) 0%, rgba(200,169,126,0) 60%), linear-gradient(135deg, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.82) 50%, rgba(0,0,0,0.82) 100%)',
        borderTop: '1px solid rgba(229,229,229,0.14)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">

        <Link
            to={isAdmin ? '/admin-dashboard' : '/home'}
            className="text-lg font-semibold text-white hover:text-gray-200"
          >
            E-Shop
          </Link>

          <div className="flex gap-6">
            <Link to="/contact" className="hover:text-white transition-colors">
              Contact
            </Link>
          </div>
        </div>
        <p className="mt-4 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} E-Shop. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
