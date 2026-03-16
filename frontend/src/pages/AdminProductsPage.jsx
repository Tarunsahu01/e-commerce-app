/**
 * AdminProductsPage: List all products with Edit Product per card.
 * Reuses product listing from backend; each card has Edit Product link.
 */

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';
import { ProductCard } from '../components/product/ProductCard';

export function AdminProductsPage() {

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {

    let cancelled = false;

    setLoading(true);
    setError(null);

    api.get('/products')

      .then((res) => {

        if (!cancelled) {
          setProducts(Array.isArray(res.data) ? res.data : []);
        }

      })

      .catch((err) => {

        if (!cancelled) {
          setError(err.response?.data?.message ?? err.message ?? 'Failed to load products');
        }

      })

      .finally(() => {

        if (!cancelled) setLoading(false);

      });

    return () => { cancelled = true };

  }, []);

  return (

    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      <div className="flex items-center justify-between mb-6">

        <h1 className="text-2xl font-bold text-black">
          Manage Products
        </h1>

        <Link
          to="/admin-dashboard/add-product"
          className="px-4 py-2 text-sm font-medium bg-black text-white rounded-md hover:bg-gray-800"
        >
          Add Product
        </Link>

      </div>

      {loading && <p className="text-gray-600">Loading products...</p>}

      {error && <p className="text-gray-600">{error}</p>}

      {!loading && !error && products.length === 0 && (
        <p className="text-gray-600">
          No products yet. Add one from the button above.
        </p>
      )}

      {!loading && !error && products.length > 0 && (

        <div className="flex flex-wrap gap-4">

          {products.map((product) => (

            <ProductCard
              key={product.id}
              product={product}
              adminMode
            />

          ))}

        </div>

      )}

    </div>

  );

}