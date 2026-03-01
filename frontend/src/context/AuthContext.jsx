/**
 * AuthContext: Centralized auth state for JWT-based authentication.
 *
 * User role (USER/ADMIN) comes from GET /auth/me after login so we can guard admin routes.
 * Token in localStorage; /me response (name, email, role) stored in user state.
 */
import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { api } from '../lib/api';
import { parseJwtPayload } from '../lib/utils';

const AuthContext = createContext(null);

const TOKEN_KEY = 'token';
const USER_KEY = 'user';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem(USER_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    setIsInitialized(true);
    const handleLogout = () => {
      setToken(null);
      setUser(null);
    };
    window.addEventListener('auth:logout', handleLogout);
    return () => window.removeEventListener('auth:logout', handleLogout);
  }, []);

  const login = useCallback(async (receivedToken, userData) => {
    localStorage.setItem(TOKEN_KEY, receivedToken);
    setToken(receivedToken);
    if (userData) {
      localStorage.setItem(USER_KEY, JSON.stringify(userData));
      setUser(userData);
      return;
    }
    try {
      const { data } = await api.get('/auth/me');
      const u = { name: data.name, email: data.email, role: data.role ?? 'USER' };
      localStorage.setItem(USER_KEY, JSON.stringify(u));
      setUser(u);
    } catch {
      const payload = parseJwtPayload(receivedToken);
      const u = payload ? { email: payload.sub ?? payload.email, role: payload.role ?? 'USER' } : {};
      localStorage.setItem(USER_KEY, JSON.stringify(u));
      setUser(u);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setToken(null);
    setUser(null);
    window.dispatchEvent(new CustomEvent('auth:logout'));
  }, []);

  const value = {
    user,
    token,
    isAuthenticated: !!token,
    isInitialized,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}
