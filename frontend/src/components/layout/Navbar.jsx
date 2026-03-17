/**
 * Navbar: Black text on white, with Search + Cart + Login / Hamburger.
 */
import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
  const menuRef = useRef(null);
  const searchRef = useRef(null);

  const isAdmin = user?.role === 'ADMIN' || localStorage.getItem('role') === 'admin';
  const cartCount = cartItems.reduce((sum, item) => sum + (item.quantity ?? 1), 0);

  // Fetch all products once for search
  useEffect(() => {
    api.get('/products').then((res) => {
      setAllProducts(Array.isArray(res.data) ? res.data : []);
    }).catch(() => {});
  }, []);

  // Filter products as user types
  useEffect(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }
    const filtered = allProducts.filter((p) =>
      p.name?.toLowerCase().includes(query) ||
      p.description?.toLowerCase().includes(query) ||
      p.categoryName?.toLowerCase().includes(query)
    );
    setSearchResults(filtered.slice(0, 6)); // show max 6 results
    setShowDropdown(true);
  }, [searchQuery, allProducts]);

  // Close search dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
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
    } catch {
      setUsername('');
    }
  };

  useEffect(() => {
    if (isAuthenticated) fetchUserProfile();
    else setUsername('');
  }, [isAuthenticated]);

  const handleLogout = () => {
    setOpen(false);
    logout();
    navigate('/');
  };

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
    <header className="bg-white border-b border-gray-200">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 gap-4">

          {/* Logo */}
          <Link to="/" className="text-xl font-bold text-black flex-shrink-0">
            E-Shop
          </Link>

          {/* Search Bar */}
          <div className="flex-1 max-w-xl relative" ref={searchRef}>
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => searchResults.length > 0 && setShowDropdown(true)}
                placeholder="Search products..."
                className="w-full pl-4 pr-10 py-2 text-sm border border-gray-300 rounded-full focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
                </svg>
              </button>
            </form>

            {/* Search Dropdown */}
            {showDropdown && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden">
                {searchResults.length > 0 ? (
                  <>
                    {searchResults.map((product) => (
                      <button
                        key={product.id}
                        type="button"
                        onClick={() => handleResultClick(product)}
                        className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors text-left"
                      >
                        <div className="w-10 h-10 flex-shrink-0 bg-gray-100 rounded overflow-hidden">
                          {imageSrc(product.imageUrl) ? (
                            <img
                              src={imageSrc(product.imageUrl)}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                              No img
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-black truncate">{product.name}</p>
                          <p className="text-xs text-gray-500">
                            ₹{Number(product.price).toLocaleString('en-IN')}
                          </p>
                        </div>
                      </button>
                    ))}
                    <div className="border-t border-gray-100 px-4 py-2">
                      <button
                        type="button"
                        onClick={handleSearchSubmit}
                        className="text-xs text-gray-500 hover:text-black"
                      >
                        See all results for "{searchQuery}"
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="px-4 py-3 text-sm text-gray-500">
                    No products found for "{searchQuery}"
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right side: Cart + Auth */}
          <div className="flex items-center gap-2 flex-shrink-0" ref={menuRef}>
            <button
              type="button"
              onClick={handleCartClick}
              className="relative p-2 rounded-md text-black hover:bg-gray-100 transition-colors"
              aria-label="Cart"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16" />
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
                    {isAdmin && (
                      <Link
                        to="/admin-dashboard"
                        className="block px-4 py-2 text-sm text-black hover:bg-gray-100"
                        onClick={() => setOpen(false)}
                      >
                        Admin Dashboard
                      </Link>
                    )}
                    {!isAdmin && (
                      <Link
                        to="/orders"
                        className="block px-4 py-2 text-sm text-black hover:bg-gray-100"
                        onClick={() => setOpen(false)}
                      >
                        My Orders
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