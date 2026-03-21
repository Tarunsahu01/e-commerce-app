import { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { useToast } from '../context/ToastContext';

export function AdminEditCouponsPage() {
  const { showToast } = useToast();
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetchCoupons = () => {
    setLoading(true);
    setError(null);
    api
      .get('/coupons')
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : [];
        setCoupons(data);
      })
      .catch((err) => {
        setError(err.response?.data?.message ?? err.message ?? 'Failed to load coupons');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const openEditModal = (coupon) => {
    setEditingCoupon({ ...coupon });
  };

  const closeEditModal = () => {
    setEditingCoupon(null);
    setSaving(false);
  };

  const handleFieldChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditingCoupon((prev) => {
      if (!prev) return prev;
      let nextValue = value;
      if (type === 'checkbox') {
        nextValue = checked;
      } else if (name === 'discountPercentage' || name === 'minOrderAmount') {
        nextValue = value === '' ? '' : Number(value);
      }
      return { ...prev, [name]: nextValue };
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!editingCoupon) return;
    setSaving(true);
    try {
      await api.put(`/coupons/${editingCoupon.id}`, {
        discountPercentage: editingCoupon.discountPercentage,
        minOrderAmount: Number(editingCoupon.minOrderAmount) || 0,
        active: editingCoupon.active,
      });
      
      showToast('Coupon updated successfully', 'success');
      closeEditModal();
      fetchCoupons();
    } catch (err) {
      showToast('Failed to update coupon', 'error');
      setSaving(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-black">Manage Coupons</h1>
      </div>

      {loading && <p className="text-gray-600">Loading coupons...</p>}
      {error && !loading && <p className="text-sm text-red-600">{error}</p>}

      {!loading && !error && coupons.length === 0 && (
        <p className="text-gray-600">No coupons found yet.</p>
      )}

      {!loading && !error && coupons.length > 0 && (
        <div className="mt-4 overflow-x-auto">
          <div className="min-w-full inline-block align-middle">
            <div className="card-surface overflow-hidden">
              <table className="min-w-full text-left text-sm text-gray-700">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 font-semibold text-gray-900">Coupon Code</th>
                    <th className="px-4 py-3 font-semibold text-gray-900">Category</th>
                    <th className="px-4 py-3 font-semibold text-gray-900">Discount Type</th>
                    <th className="px-4 py-3 font-semibold text-gray-900">Discount Value</th>
                    <th className="px-4 py-3 font-semibold text-gray-900">Minimum Amount</th>
                    <th className="px-4 py-3 font-semibold text-gray-900">Status</th>
                    <th className="px-4 py-3 font-semibold text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {coupons.map((coupon) => (
                    <tr key={coupon.id} className="hover:bg-[#faf0e6] transition-colors">
                      <td className="px-4 py-3 whitespace-nowrap font-mono text-sm text-gray-900">
                        {coupon.code}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {coupon.categoryName ?? '—'}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        Percentage
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {coupon.discountPercentage != null ? `${coupon.discountPercentage}%` : '—'}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {coupon.minOrderAmount != null && coupon.minOrderAmount > 0 ? `₹${Number(coupon.minOrderAmount).toLocaleString('en-IN')}`: '—'}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            coupon.active
                              ? 'bg-emerald-50 text-emerald-800'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {coupon.active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => openEditModal(coupon)}
                            className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-[#C8A97E] text-black hover:bg-[#B8946B] transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={async () => {
                              try {
                                await api.delete(`/coupons/${coupon.id}`);
                                showToast('Coupon deleted successfully', 'success');
                                fetchCoupons();
                              } catch {
                                showToast('Order already placed using this coupon.', 'error');
                              }
                            }}
                            className="px-3 py-1.5 text-xs font-semibold rounded-xl border border-[#E5E5E5] text-gray-700 hover:bg-[#faf0e6] transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingCoupon && (
        <div
          className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          onClick={closeEditModal}
        >
          <div
            className="w-full max-w-lg mx-4 bg-white rounded-2xl shadow-xl border border-[#E5E5E5] p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-black">Edit Coupon</h2>
              <button
                type="button"
                onClick={closeEditModal}
                className="text-gray-600 hover:text-black focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C8A97E] focus-visible:ring-offset-2 focus-visible:ring-offset-[#faf0e6] rounded-xl p-2 -m-2 transition-colors"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">

              {/* Coupon Code — read only */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Coupon Code
                </label>
                <input
                  type="text"
                  value={editingCoupon.code ?? ''}
                  readOnly
                  className="w-full rounded-xl border border-[#E5E5E5] bg-[#faf0e6] px-4 py-2 text-sm text-gray-800"
                />
              </div>

              {/* Category — read only */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Category
                </label>
                <input
                  type="text"
                  value={editingCoupon.categoryName ?? '—'}
                  readOnly
                  className="w-full rounded-xl border border-[#E5E5E5] bg-[#faf0e6] px-4 py-2 text-sm text-gray-800"
                />
              </div>

              {/* Discount Percentage — editable */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Discount Value (%)
                </label>
                <input
                  type="number"
                  name="discountPercentage"
                  min={1}
                  max={100}
                  value={editingCoupon.discountPercentage ?? ''}
                  onChange={handleFieldChange}
                  className="w-full rounded-xl border border-[#E5E5E5] px-4 py-2 text-sm text-gray-800 focus:border-[#C8A97E] focus:ring-2 focus:ring-[#C8A97E]/30 focus:outline-none"
                  required
                />
              </div>

              <div className="flex items-center justify-between gap-4">

                {/* Minimum Order Amount — NOW EDITABLE */}
                <div className="flex-1">
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Minimum Order Amount (₹)
                  </label>
                  <input
                    type="number"
                    name="minOrderAmount"
                    min={0}
                    value={editingCoupon.minOrderAmount ?? ''}
                    onChange={handleFieldChange}
                    className="w-full rounded-xl border border-[#E5E5E5] px-4 py-2 text-sm text-gray-800 focus:border-[#C8A97E] focus:ring-2 focus:ring-[#C8A97E]/30 focus:outline-none"
                  />
                </div>

                {/* Status — editable */}
                <div className="flex-1">
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Status
                  </label>
                  <select
                    name="active"
                    value={editingCoupon.active ? 'true' : 'false'}
                    onChange={(e) =>
                      handleFieldChange({
                        target: {
                          name: 'active',
                          value: e.target.value === 'true',
                          type: 'checkbox',
                          checked: e.target.value === 'true',
                        },
                      })
                    }
                    className="w-full rounded-xl border border-[#E5E5E5] px-4 py-2 text-sm text-gray-800 focus:border-[#C8A97E] focus:ring-2 focus:ring-[#C8A97E]/30 focus:outline-none"
                  >
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="mt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="px-4 py-2 text-sm font-semibold rounded-xl border border-[#E5E5E5] text-gray-700 hover:bg-[#faf0e6] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 text-sm font-semibold rounded-xl bg-[#C8A97E] text-black hover:bg-[#B8946B] disabled:opacity-70 disabled:pointer-events-none transition-colors"
                >
                  {saving ? 'Saving…' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}