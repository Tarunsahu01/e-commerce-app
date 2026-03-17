/**
 * HomePage: Hero + category-based product carousels with search + filters.
 */
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Hero } from '../components/home/Hero';
import { ProductCarousel } from '../components/home/ProductCarousel';
import { ProductModal } from '../components/product/ProductModal';
import { api } from '../lib/api';

const inferCategoryFromProduct = (product) => {
  if (!product) return 'Other';

  if (typeof product.categoryName === 'string' && product.categoryName.trim() !== '') {
    return product.categoryName;
  }
  const rawCategory = product.category;
  if (typeof rawCategory === 'string' && rawCategory.trim() !== '') {
    return rawCategory;
  }
  if (rawCategory && typeof rawCategory === 'object' && typeof rawCategory.name === 'string' && rawCategory.name.trim() !== '') {
    return rawCategory.name;
  }

  const name = (product.name || '').toLowerCase();
  if (!name) return 'Other';
  const containsAny = (keywords) => keywords.some((kw) => name.includes(kw));

  if (containsAny(['iphone', 'galaxy', 'macbook', 'dell inspiron', 'headphones', 'monitor', 'ipad', 'jbl', 'canon', 'smart watch', 'smartwatch'])) return 'Electronics';
  if (containsAny(['backpack', 'travel bag', 'laptop sleeve', 'gym bag', 'office bag', 'duffel', 'trolley', 'sling'])) return 'Bags';
  if (containsAny(['nike', 'adidas', 'puma', 'boots', 'sneakers', 'slippers', 'sandals', 'trainers', 'shoes'])) return 'Shoes';
  if (containsAny(['t-shirt', 't shirt', 'jeans', 'hoodie', 'jacket', 'shirt', 'shorts', 'track pants', 'sweater', 'kurta', 'blazer'])) return 'Clothing';
  if (containsAny(['sunglasses', 'wallet', 'belt', 'cap', 'watch', 'bracelet', 'scarf', 'gloves', 'ring', 'keychain'])) return 'Accessories';

  return 'Other';
};

export function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortOrder, setSortOrder] = useState('none');
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get('search')?.toLowerCase().trim() ?? '';

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    api.get('/products')
      .then((res) => {
        if (!cancelled) setProducts(Array.isArray(res.data) ? res.data : []);
      })
      .catch((err) => {
        if (!cancelled) setError(err.response?.data?.message ?? err.message ?? 'Failed to load products');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  // Filter products by search query if present
  const filteredProducts = searchQuery
    ? products.filter((p) =>
        p.name?.toLowerCase().includes(searchQuery) ||
        p.description?.toLowerCase().includes(searchQuery) ||
        p.categoryName?.toLowerCase().includes(searchQuery)
      )
    : products;

  const groupedByCategory = filteredProducts.reduce((acc, product) => {
    const categoryName = inferCategoryFromProduct(product);
    if (!acc[categoryName]) acc[categoryName] = [];
    acc[categoryName].push(product);
    return acc;
  }, {});

  const allCategoryNames = Object.keys(groupedByCategory).sort();
  const categoryOptions = ['All', ...allCategoryNames];

  const visibleCategoryNames =
    selectedCategory === 'All'
      ? allCategoryNames
      : allCategoryNames.filter((name) => name === selectedCategory);

  const sortProducts = (items) => {
    if (!items) return [];
    const copy = [...items];
    if (sortOrder === 'price-asc') copy.sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
    else if (sortOrder === 'price-desc') copy.sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
    return copy;
  };

  return (
    <>
      {/* Only show Hero when not searching */}
      {!searchQuery && <Hero />}

      <section className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              {searchQuery ? (
                <div>
                  <h2 className="text-xl font-semibold text-black">
                    Search results for{' '}
                    <span className="text-black font-bold">&quot;{searchQuery}&quot;</span>
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
                  </p>
                </div>
              ) : (
                <h2 className="text-xl font-semibold text-black">Browse products</h2>
              )}
            </div>
            <div className="flex flex-wrap gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1" htmlFor="category-filter">
                  Category
                </label>
                <select
                  id="category-filter"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="block w-40 rounded-md border border-gray-300 bg-white px-2 py-1 text-sm text-black focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                >
                  {categoryOptions.map((name) => (
                    <option key={name} value={name}>
                      {name === 'All' ? 'All categories' : name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1" htmlFor="sort-filter">
                  Sort by price
                </label>
                <select
                  id="sort-filter"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="block w-44 rounded-md border border-gray-300 bg-white px-2 py-1 text-sm text-black focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                >
                  <option value="none">None</option>
                  <option value="price-asc">Low to High</option>
                  <option value="price-desc">High to Low</option>
                </select>
              </div>
            </div>
          </div>

          {loading && <p className="mt-4 text-gray-600">Loading products...</p>}
          {error && !loading && <p className="mt-4 text-gray-600">{error}</p>}
          {!loading && !error && filteredProducts.length === 0 && (
            <p className="mt-4 text-gray-600">
              {searchQuery
                ? `No products found for "${searchQuery}". Try a different search term.`
                : 'No products to show yet.'}
            </p>
          )}
        </div>
      </section>

      {!loading && !error &&
        visibleCategoryNames.map((name) => {
          const sorted = sortProducts(groupedByCategory[name]);
          if (!sorted.length) return null;
          return (
            <section key={name} className="bg-white border-b border-gray-200">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10">
                <h3 className="text-2xl font-bold text-black mb-6">{name}</h3>
                <ProductCarousel
                  products={sorted}
                  onQuickView={setQuickViewProduct}
                />
              </div>
            </section>
          );
        })}

      {quickViewProduct && (
        <ProductModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
      )}
    </>
  );
}