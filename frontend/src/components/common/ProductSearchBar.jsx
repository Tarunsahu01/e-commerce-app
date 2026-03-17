import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSearch } from '../../context/SearchContext';
import { api } from '../../lib/api';

function getCategoryLabel(product) {
  return product?.categoryName ?? product?.category?.name ?? 'Products';
}

export function ProductSearchBar() {
  const { query, setQuery } = useSearch();
  const [value, setValue] = useState(query);
  const [products, setProducts] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const wrapperRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Keep local input in sync if query changes elsewhere
  useEffect(() => {
    setValue(query);
  }, [query]);

  // Close suggestions on outside click
  useEffect(() => {
    const onDocMouseDown = (e) => {
      if (!wrapperRef.current) return;
      if (!wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onDocMouseDown);
    return () => document.removeEventListener('mousedown', onDocMouseDown);
  }, []);

  const onProductsRoute = useMemo(
    () => location.pathname === '/',
    [location.pathname]
  );

  const q = value.trim().toLowerCase();
  const suggestions = useMemo(() => {
    if (!q || q.length < 2) return [];
    const matches = products
      .filter((p) => (p?.name ?? '').toLowerCase().includes(q))
      .slice(0, 6);
    return matches;
  }, [products, q]);

  const ensureProductsLoaded = async () => {
    if (products.length > 0 || loading) return;
    setLoading(true);
    try {
      const { data } = await api.get('/products');
      setProducts(Array.isArray(data) ? data : []);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const next = e.target.value;
    setValue(next);
    setQuery(next);
    setOpen(true);
    if (!onProductsRoute) {
      navigate('/', { replace: false });
    }
  };

  return (
    <div className="hidden sm:block w-64 md:w-80" ref={wrapperRef}>
      <label className="sr-only" htmlFor="product-search">
        Search products
      </label>
      <div className="relative">
        <input
          id="product-search"
          type="text"
          value={value}
          onChange={handleChange}
          onFocus={() => {
            setOpen(true);
            ensureProductsLoaded();
          }}
          placeholder="Search products…"
          className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-black focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
        />
        {value ? (
          <button
            type="button"
            onClick={() => {
              setValue('');
              setQuery('');
              setOpen(false);
            }}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black"
            aria-label="Clear search"
          >
            ✕
          </button>
        ) : null}

        {open && (loading || suggestions.length > 0) && (
          <div className="absolute z-50 mt-2 w-full rounded-md border border-gray-200 bg-white shadow-lg overflow-hidden">
            {loading && products.length === 0 ? (
              <div className="px-3 py-2 text-sm text-gray-600">Loading…</div>
            ) : (
              <ul className="max-h-80 overflow-auto">
                {suggestions.map((p) => {
                  const imageUrl = p?.imageUrl
                    ? (p.imageUrl.startsWith('http') ? p.imageUrl : `http://localhost:8080${p.imageUrl}`)
                    : null;
                  const category = getCategoryLabel(p);
                  return (
                    <li key={p?.id ?? `${p?.name}-${Math.random()}`}>
                      <button
                        type="button"
                        onClick={() => {
                          const name = p?.name ?? '';
                          setValue(name);
                          setQuery(name);
                          setOpen(false);
                          if (!onProductsRoute) navigate('/', { replace: false });
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-gray-50"
                      >
                        <div className="w-10 h-10 rounded bg-gray-100 overflow-hidden flex items-center justify-center shrink-0">
                          {imageUrl ? (
                            <img src={imageUrl} alt={p?.name ?? 'Product'} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-[10px] text-gray-400">No Image</span>
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="text-sm font-medium text-black truncate">{p?.name ?? 'Product'}</div>
                          <div className="text-xs text-blue-600 truncate">in {category}</div>
                        </div>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

