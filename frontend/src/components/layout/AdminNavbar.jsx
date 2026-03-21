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
      if (!token) { setUsername(''); return; }
      try {
        const { data } = await api.get('/auth/me');
        setUsername(data?.name ?? '');
      } catch { setUsername(''); }
    };
    if (isAuthenticated) fetchUserProfile();
    else setUsername('');
  }, [isAuthenticated]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) setOpen(false);
    };
    if (open) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  const handleLogout = () => { setOpen(false); logout(); navigate('/'); };

  return (
    <header
      className="sticky top-0 z-50 w-full"
      style={{
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        background: 'radial-gradient(900px circle at 20% -30%, rgba(200,169,126,0.16) 0%, rgba(200,169,126,0) 60%), linear-gradient(135deg, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.72) 50%, rgba(0,0,0,0.72) 100%)',
        borderBottom: '1px solid rgba(229,229,229,0.14)',
      }}
    >
      <nav style={{ padding: '0 32px' }}>
        <div className="flex justify-between items-center gap-4" style={{ height: '72px' }}>

          {/* Logo */}
          <Link
            to="/admin-dashboard"
            className="font-bold flex-shrink-0 text-white"
            style={{ fontSize: '1.25rem' }}
          >
            E-Shop Admin
          </Link>

          {/* Right side */}
          <div className="flex items-center gap-3 flex-shrink-0" ref={menuRef}>
            <Link
              to="/admin-dashboard"
              className="px-4 py-1.5 text-sm font-medium rounded-full transition-colors"
              style={{ color: '#000', backgroundColor: '#fff', border: '1px solid #fff' }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = '#e5e5e5'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = '#fff'}
            >
              Dashboard
            </Link>

            {isAuthenticated && (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setOpen((prev) => !prev)}
                  className="p-2 rounded-full transition-colors"
                  style={{ color: '#fff' }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = '#2a2a2a'}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                  aria-label="User menu"
                  aria-expanded={open}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>

                {open && (
                  <div
                    className="absolute right-0 mt-2 w-56 rounded-xl overflow-hidden z-50"
                    style={{
                      backgroundColor: '#111',
                      border: '1px solid #333',
                      boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
                    }}
                  >
                    <div className="px-4 py-3" style={{ borderBottom: '1px solid #222' }}>
                      {username && (
                        <>
                          <p className="text-xs" style={{ color: '#888' }}>Welcome!</p>
                          <p className="text-sm font-medium truncate" style={{ color: '#fff' }}>{username}</p>
                        </>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm transition-colors"
                      style={{ color: '#fff', borderTop: '1px solid #222' }}
                      onMouseEnter={e => e.currentTarget.style.backgroundColor = '#1a1a1a'}
                      onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
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