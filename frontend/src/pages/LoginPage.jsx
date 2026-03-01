/**
 * LoginPage: Form that calls POST /auth/login, stores token via AuthContext.
 *
 * Redirects to 'from' location (e.g. /cart) or / on success.
 */
import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { state } = useLocation();
  const from = state?.from?.pathname ?? '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', { email, password });
      const token = typeof data === 'string' ? data : data?.token;
      if (!token) throw new Error('No token received');
      await login(token);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message ?? err.message ?? 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Sign in</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-black focus:ring-1 focus:ring-black focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-black focus:ring-1 focus:ring-black focus:outline-none"
            />
          </div>
          {error && (
            <p className="text-sm text-black">{error}</p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-black text-white font-medium rounded-md hover:bg-gray-800 disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
        <p className="mt-4 text-sm text-gray-600">
          Don't have an account?{' '}
          <Link to="/register" className="text-black font-medium underline hover:no-underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
