import { useEffect, useState } from 'react';
import { api } from '../lib/api';

export function OrderHistoryPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    const fetchOrders = async () => {
      setLoading(true);
      setError('');
      try {
        const { data } = await api.get('orders/my');
        if (!mounted) return;
        setOrders(Array.isArray(data) ? data : []);
      } catch (e) {
        if (!mounted) return;
        setError('Failed to load orders.');
        setOrders([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchOrders();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-black mb-6">My Orders</h1>

      {loading && <p className="text-gray-700">Loading...</p>}
      {!loading && error && <p className="text-red-600">{error}</p>}

      {!loading && !error && orders.length === 0 && (
        <p className="text-gray-700">No orders found.</p>
      )}

      <div className="space-y-4">
        {orders.map((order) => {
          const createdAt = order?.createdAt ? new Date(order.createdAt).toLocaleString() : '—';
          const items = Array.isArray(order?.orderItems) ? order.orderItems : [];
          return (
            <div key={order?.id ?? Math.random()} className="bg-white border border-gray-200 rounded-md p-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <p className="text-sm text-gray-600">Order date</p>
                  <p className="text-sm font-medium text-black">{createdAt}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Total</p>
                  <p className="text-sm font-semibold text-black">₹{order?.totalAmount ?? 0}</p>
                </div>
              </div>

              <div className="mt-4">
                <p className="text-sm font-medium text-black mb-2">Products</p>
                {items.length === 0 ? (
                  <p className="text-sm text-gray-700">No products.</p>
                ) : (
                  <ul className="space-y-2">
                    {items.map((it) => (
                      <li key={it?.id ?? Math.random()} className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-sm text-black truncate">{it?.product?.name ?? 'Product'}</p>
                          <p className="text-xs text-gray-600">
                            Qty: {it?.quantity ?? 0} • Price: ₹{it?.priceAtTime ?? 0}
                          </p>
                        </div>
                        <div className="text-sm text-black font-medium">
                          ₹{(it?.priceAtTime ?? 0) * (it?.quantity ?? 0)}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

