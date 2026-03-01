/**
 * CartPage: Minimal cart route so the navbar cart button opens a page.
 *
 * This intentionally does NOT implement cart APIs yet.
 */
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function CartPage() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold text-black">Cart</h1>

      {!isAuthenticated ? (
        <div className="mt-6 border border-gray-200 rounded-lg p-6 bg-white">
          <p className="text-gray-700">
            Please log in to view your cart.
          </p>
          <Link
            to="/login"
            className="inline-block mt-4 px-4 py-2 text-sm font-medium text-black border border-black rounded-md hover:bg-gray-100 transition-colors"
          >
            Go to Login
          </Link>
        </div>
      ) : (
        <div className="mt-6 border border-gray-200 rounded-lg p-6 bg-white">
          <p className="text-gray-700">
            Cart UI will be implemented next.
          </p>
        </div>
      )}
    </div>
  );
}

