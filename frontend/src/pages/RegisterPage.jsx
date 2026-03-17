/**
 * RegisterPage: Form for POST /auth/register.
 */
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';

export function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const response = await api.post('/auth/register', { name, email, password });
      if (response.status === 200) {
        navigate('/verify-otp', { state: { email } });
        // const token = typeof data === 'string' ? data : data?.token;
        // if (token) await login(token, { name, email, role: 'USER' });
        // navigate('/', { replace: true });
      }
    } catch (err) {
      setError(err.response?.data?.message ?? err.message ?? 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-white">
      <div className="absolute inset-0 h-full w-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
      <div className="relative z-10 flex flex-col items-center justify-start px-4 pt-8">
      <div className="w-full max-w-md mb-8">
        <Link to="/" className="flex justify-center">
          <span className="text-3xl font-bold tracking-tight text-gray-900">E-Shop</span>
        </Link>
      </div>
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Create account</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-black focus:ring-1 focus:ring-black focus:outline-none"
            />
          </div>
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
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-black focus:ring-1 focus:ring-black focus:outline-none"
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
              minLength={6}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-black focus:ring-1 focus:ring-black focus:outline-none"
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
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>
        <p className="mt-4 text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-black font-medium underline hover:no-underline">
            Sign in
          </Link>
        </p>
      </div>
      </div>
    </div>
  );
}
