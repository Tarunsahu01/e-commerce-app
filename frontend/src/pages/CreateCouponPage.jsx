/**
 * CreateCouponPage: Admin form to create a coupon.
 * POST /coupons with code, discount type (percentage), discount value, category.
 * Backend expects: code, discountPercentage, expiryDate, categoryId.
 */
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api';

export function CreateCouponPage() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({
    code: '',
    discountValue: '',
    categoryId: '',
    expiryDate: '',
  });

  useEffect(() => {
    api.get('/categories')
      .then((res) => setCategories(Array.isArray(res.data) ? res.data : []))
      .catch(() => setCategories([]));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === 'categoryId' || name === 'discountValue' ? (value === '' ? '' : value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      const discountPercentage = Number(form.discountValue) || 0;
      const payload = {
        code: form.code.trim().toUpperCase(),
        discountPercentage: Math.min(100, Math.max(1, discountPercentage)),
        expiryDate: form.expiryDate || null,
        categoryId: form.categoryId ? Number(form.categoryId) : null,
      };
      if (!payload.expiryDate) {
        const d = new Date();
        d.setFullYear(d.getFullYear() + 1);
        payload.expiryDate = d.toISOString().slice(0, 10);
      }
      if (!payload.categoryId) {
        setError('Please select a category.');
        setSaving(false);
        return;
      }
      await api.post('/coupons', payload);
      navigate('/admin-dashboard');
    } catch (err) {
      setError(err.response?.data?.message ?? err.message ?? 'Failed to create coupon');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-black mb-6">Create Coupon</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="code" className="block text-sm font-medium text-gray-700">Coupon Code</label>
          <input
            id="code"
            name="code"
            type="text"
            value={form.code}
            onChange={handleChange}
            required
            placeholder="e.g. SAVE20"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-black focus:ring-1 focus:ring-black uppercase"
          />
        </div>
        <div>
          <label htmlFor="discountValue" className="block text-sm font-medium text-gray-700">
            Discount Value (%)
          </label>
          <input
            id="discountValue"
            name="discountValue"
            type="number"
            min="1"
            max={100}
            step={1}
            value={form.discountValue}
            onChange={handleChange}
            required
            placeholder="20"
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
          <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700">Expiry Date (future date required)</label>
          <input
            id="expiryDate"
            name="expiryDate"
            type="date"
            value={form.expiryDate}
            onChange={handleChange}
            required
            min={new Date().toISOString().slice(0, 10)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-black focus:ring-1 focus:ring-black"
          />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={saving}
          className="w-full py-2 px-4 bg-black text-white font-medium rounded-md hover:bg-gray-800 disabled:opacity-50"
        >
          {saving ? 'Creating…' : 'Create Coupon'}
        </button>
      </form>
    </div>
  );
}
