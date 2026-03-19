import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { api } from '../../lib/api';
import { useToast } from '../../context/ToastContext';

export function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const { cartItems } = useCart();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef(null);
  const searchRef = useRef(null);
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  const isAdmin = user?.role === 'ADMIN' || localStorage.getItem('role') === 'admin';
  const cartCount = cartItems.reduce((sum, item) => sum + (item.quantity ?? 1), 0);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    api.get('/products').then((res) => {
      setAllProducts(Array.isArray(res.data) ? res.data : []);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) { setSearchResults([]); setShowDropdown(false); return; }
    const filtered = allProducts.filter((p) =>
      p.name?.toLowerCase().includes(query) ||
      p.description?.toLowerCase().includes(query) ||
      p.categoryName?.toLowerCase().includes(query)
    );
    setSearchResults(filtered.slice(0, 6));
    setShowDropdown(true);
  }, [searchQuery, allProducts]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) setShowDropdown(false);
      if (menuRef.current && !menuRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchUserProfile = async () => {
    const token = localStorage.getItem('token');
    if (!token) { setUsername(''); return; }
    try {
      const { data } = await api.get('/auth/me');
      setUsername(data?.name ?? '');
    } catch { setUsername(''); }
  };

  useEffect(() => {
    if (isAuthenticated) fetchUserProfile();
    else setUsername('');
  }, [isAuthenticated]);

  const handleLogout = () => { setOpen(false); logout(); navigate('/'); };

  const handleCartClick = (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      showToast('You must login first to view your cart.', 'warning');
      navigate('/login');
      return;
    }
    navigate('/cart');
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setShowDropdown(false);
    navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`);
    setSearchQuery('');
  };

  const handleResultClick = (product) => {
    setShowDropdown(false);
    setSearchQuery('');
    navigate(`/?search=${encodeURIComponent(product.name)}`);
  };

  const imageSrc = (imageUrl) => {
    if (!imageUrl) return null;
    return imageUrl.startsWith('http') ? imageUrl : `http://localhost:8080${imageUrl}`;
  };

  return (
    <div className="sticky top-0 z-50 w-full pointer-events-none">
      <div
        className="pointer-events-auto"
        style={{
          margin: scrolled ? '12px auto' : '0 auto',
          maxWidth: scrolled ? '680px' : '100%',
          borderRadius: scrolled ? '9999px' : '0px',
          // ✅ Always gradient — no white blink on transition
          background: scrolled
            ? 'linear-gradient(135deg, #222 0%, #111 50%, #222 100%)'
            : 'linear-gradient(135deg, #000 0%, #000 50%, #000 100%)',
          border: scrolled ? '1px solid #333' : 'none',
          borderBottom: scrolled ? '1px solid #333' : '1px solid #222',
          boxShadow: scrolled ? '0 8px 32px rgba(0,0,0,0.4)' : 'none',
          // ✅ Explicit background transition to prevent blink
          transition: 'margin 0.5s ease, max-width 0.5s ease, border-radius 0.5s ease, background 0.5s ease, box-shadow 0.5s ease, border 0.5s ease',
        }}
      >
        <nav
          style={{
            // ✅ Tighter padding — content not too wide
            padding: scrolled ? '0 24px' : '0 32px',
            transition: 'padding 0.5s ease',
          }}
        >
          <div
            className="flex justify-between items-center gap-4"
            style={{ height: '72px' }}
          >
            {/* Logo */}
            <Link
              to="/"
              className="font-bold flex-shrink-0 text-white"
              style={{ fontSize: '1.25rem' }}
            >
              E-Shop
            </Link>

            {/* Search Bar */}
            {isHomePage && (
              <div
                className="relative"
                style={{
                  width: scrolled ? '200px' : '100%',
                  maxWidth: scrolled ? '200px' : '500px',
                  transition: 'width 0.5s ease, max-width 0.5s ease',
                }}
                ref={searchRef}
              >
                <form onSubmit={handleSearchSubmit} className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => searchResults.length > 0 && setShowDropdown(true)}
                    placeholder="Search products..."
                    className="w-full pl-4 pr-10 py-2 text-sm rounded-full focus:outline-none focus:ring-1 focus:ring-white"
                    style={{
                      backgroundColor: '#1a1a1a',
                      border: '1px solid #444',
                      color: '#fff',
                    }}
                  />
                  <button
                    type="submit"
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                    style={{ color: '#888' }}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
                    </svg>
                  </button>
                </form>

                {showDropdown && (
                  <div
                    className="absolute top-full left-0 right-0 mt-1 rounded-xl overflow-hidden z-50"
                    style={{
                      backgroundColor: '#111',
                      border: '1px solid #333',
                      boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
                    }}
                  >
                    {searchResults.length > 0 ? (
                      <>
                        {searchResults.map((product) => (
                          <button
                            key={product.id}
                            type="button"
                            onClick={() => handleResultClick(product)}
                            className="w-full flex items-center gap-3 px-4 py-2 text-left transition-colors"
                            style={{ color: '#fff' }}
                            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#1a1a1a'}
                            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                          >
                            <div className="w-10 h-10 flex-shrink-0 rounded overflow-hidden" style={{ backgroundColor: '#222' }}>
                              {imageSrc(product.imageUrl) ? (
                                <img src={imageSrc(product.imageUrl)} alt={product.name} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-xs" style={{ color: '#666' }}>No img</div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate" style={{ color: '#fff' }}>{product.name}</p>
                              <p className="text-xs" style={{ color: '#888' }}>₹{Number(product.price).toLocaleString('en-IN')}</p>
                            </div>
                          </button>
                        ))}
                        <div className="px-4 py-2" style={{ borderTop: '1px solid #222' }}>
                          <button type="button" onClick={handleSearchSubmit} className="text-xs" style={{ color: '#888' }}>
                            See all results for "{searchQuery}"
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="px-4 py-3 text-sm" style={{ color: '#888' }}>
                        No products found for "{searchQuery}"
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Right side: Cart + Auth */}
            <div className="flex items-center gap-3 flex-shrink-0" ref={menuRef}>
              <button
                type="button"
                onClick={handleCartClick}
                className="relative p-2 rounded-full transition-colors"
                style={{ color: '#fff' }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#2a2a2a'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                aria-label="Cart"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center px-1 rounded-full bg-red-600 text-white text-xs font-medium">
                    {cartCount > 99 ? '99+' : cartCount}
                  </span>
                )}
              </button>

              {!isAuthenticated ? (
                <Link
                  to="/login"
                  className="px-4 py-1.5 text-sm font-medium rounded-full transition-colors"
                  style={{ color: '#000', backgroundColor: '#fff', border: '1px solid #fff' }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = '#e5e5e5'}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = '#fff'}
                >
                  Login
                </Link>
              ) : (
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
                      {isAdmin && (
                        <Link
                          to="/admin-dashboard"
                          className="block px-4 py-2 text-sm transition-colors"
                          style={{ color: '#fff' }}
                          onMouseEnter={e => e.currentTarget.style.backgroundColor = '#1a1a1a'}
                          onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                          onClick={() => setOpen(false)}
                        >
                          Admin Dashboard
                        </Link>
                      )}
                      {!isAdmin && (
                        <Link
                          to="/orders"
                          className="block px-4 py-2 text-sm transition-colors"
                          style={{ color: '#fff' }}
                          onMouseEnter={e => e.currentTarget.style.backgroundColor = '#1a1a1a'}
                          onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                          onClick={() => setOpen(false)}
                        >
                          My Orders
                        </Link>
                      )}
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
      </div>
    </div>
  );
}