/**
 * LoginPage: Form that calls POST /auth/login, stores token via AuthContext.
 *
 * Redirects to 'from' location (e.g. /cart) or / on success.
 */
import { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { api } from '../lib/api';
import ClickSpark from '../components/ClickSpark';
import { useAuth } from '../context/AuthContext';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const { state } = useLocation();
  const from = state?.from?.pathname ?? '/';

  // If already logged in, don't allow visiting /login
  useEffect(() => {
    if (!isAuthenticated) return;
    const role = user?.role ?? (localStorage.getItem('role') === 'admin' ? 'ADMIN' : 'USER');
    if (role === 'ADMIN') {
      navigate('/admin-dashboard', { replace: true });
    } else {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, user?.role, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', { email, password });
      const token = typeof data === 'string' ? data : data?.token;
      if (!token) throw new Error('No token received');
      await login(token);
      const role = localStorage.getItem('role');
      if (role === 'admin') {
        navigate('/admin-dashboard', { replace: true });
      } else {
        navigate(from, { replace: true });
      }
    } catch (err) {
      const status = err.response?.status;
      const serverMessage = err.response?.data?.message;
      if (status === 400 || status === 401) {
        setError('Invalid email or password');
      } else {
        setError(serverMessage ?? err.message ?? 'Login failed');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <ClickSpark
      sparkColor="#000000"
      sparkSize={10}
      sparkRadius={15}
      sparkCount={8}
      duration={400}
      easing="ease-out"
      extraScale={1}
    >
    <div className="relative min-h-screen w-full bg-[#faf0e6]">
      <div className="absolute inset-0 h-full w-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
      <div className="relative z-10 flex flex-col items-center justify-start px-4 pt-8">
  
        <div className="w-full max-w-md mb-8">
          <Link to="/" className="flex justify-center">
            <span className="text-3xl font-bold tracking-tight text-gray-900">E-Shop</span>
          </Link>
        </div>
  
        <div className="w-full max-w-md card-surface p-8">
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
                className="mt-1 block w-full field-premium"
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
                className="mt-1 block w-full field-premium"
              />
            </div>
            {error && (
              <p className="text-sm text-red-600">{error}</p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary disabled:opacity-60 disabled:pointer-events-none"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
          <p className="mt-4 text-sm text-gray-600">
            Don&apos;t have an account?{' '}
            <Link to="/register" className="text-black font-medium underline hover:no-underline">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
    </ClickSpark>
  );
}