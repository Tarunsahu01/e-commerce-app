/**
 * EditProductPage: Admin form to edit a product.
 * GET /products/:id to load, PUT /products/:id to save. Redirects to admin product list on success.
 */
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../lib/api';

export function EditProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    name: '',
    price: '',
    categoryId: '',
    description: '',
    imageUrl: '',
    quantityAvailable: 100,
  });

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    Promise.all([
      api.get('/products/' + id),
      api.get('/categories'),
    ])
      .then(([productRes, categoriesRes]) => {
        if (cancelled) return;
        const product = productRes.data;
        const catList = Array.isArray(categoriesRes.data) ? categoriesRes.data : [];
        setCategories(catList);
        setForm({
          name: product.name ?? '',
          price: product.price ?? '',
          categoryId: product.categoryId ?? product.category?.id ?? '',
          description: product.description ?? '',
          imageUrl: product.imageUrl ?? '',
          quantityAvailable: product.quantityAvailable ?? 100,
        });
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.response?.data?.message ?? err.message ?? 'Failed to load product');
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: name === 'categoryId' || name === 'quantityAvailable' ? (value === '' ? '' : Number(value)) : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      await api.put('/products/' + id, {
        name: form.name,
        price: Number(form.price),
        categoryId: Number(form.categoryId),
        description: form.description || null,
        imageUrl: form.imageUrl || null,
        quantityAvailable: Number(form.quantityAvailable) || 1,
      });
      navigate('/admin-dashboard/products');
    } catch (err) {
      setError(err.response?.data?.message ?? err.message ?? 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-xl mx-auto px-4 py-10">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-black mb-6">Edit Product</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Product Name</label>
          <input
            id="name"
            name="name"
            type="text"
            value={form.name}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-black focus:ring-1 focus:ring-black"
          />
        </div>
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price</label>
          <input
            id="price"
            name="price"
            type="number"
            min="0"
            step="0.01"
            value={form.price}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-black focus:ring-1 focus:ring-black"
          />
        </div>
        <div>
          <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700">Category</label>
          <select
            id="categoryId"
            name="categoryId"
            value={form.categoryId}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-black focus:ring-1 focus:ring-black"
          >
            <option value="">Select category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            id="description"
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={3}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-black focus:ring-1 focus:ring-black"
          />
        </div>
        <div>
          <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">Image URL</label>
          <input
            id="imageUrl"
            name="imageUrl"
            type="url"
            value={form.imageUrl}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-black focus:ring-1 focus:ring-black"
          />
        </div>
        <div>
          <label htmlFor="quantityAvailable" className="block text-sm font-medium text-gray-700">Quantity</label>
          <input
            id="quantityAvailable"
            name="quantityAvailable"
            type="number"
            min="1"
            value={form.quantityAvailable}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-black focus:ring-1 focus:ring-black"
          />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={saving}
          className="w-full py-2 px-4 bg-black text-white font-medium rounded-md hover:bg-gray-800 disabled:opacity-50"
        >
          {saving ? 'Saving…' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
}
