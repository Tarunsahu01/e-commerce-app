import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { api } from '../lib/api';
import { useToast } from '../context/ToastContext';
import { useCart } from '../context/CartContext';

export default function PaymentSuccess() {
  const [params] = useSearchParams();
  const [status, setStatus] = useState('finalizing'); // finalizing | success | warning
  const [message, setMessage] = useState('Payment received. Finalizing your order…');
  const [order, setOrder] = useState(null);
  const { showToast } = useToast();
  const { fetchCart, setCartItems } = useCart();

  const sessionId = useMemo(() => params.get('session_id'), [params]);

  useEffect(() => {
    let mounted = true;

    const confirmPaymentAndLoadOrder = async () => {
      if (!sessionId) {
        if (!mounted) return;
        setStatus('warning');
        setMessage('Payment completed, but we could not read the Stripe session id. Please check My Orders in a moment.');
        return;
      }

      try {
        // Confirm payment in backend (marks existing order SUCCESS).
        // Prevent duplicate calls across reloads.
        const key = `payment_success_confirmed:${sessionId}`;
        const alreadyConfirmed = localStorage.getItem(key) === '1';
        if (!alreadyConfirmed) {
          await api.post('payment/success', { sessionId });
          localStorage.setItem(key, '1');
        }

        // Cart is cleared on backend during payment success; refresh frontend state.
        try {
          setCartItems([]);
          await fetchCart();
        } catch {
          // ignore UI refresh failures
        }

        const toastKey = `order_email_toast_shown:${sessionId}`;
        if (localStorage.getItem(toastKey) !== '1') {
          showToast('Order details have been emailed to you.', 'success');
          localStorage.setItem(toastKey, '1');
        }

        // Load order details (best-effort) to show products + totals.
        try {
          const { data } = await api.get('orders/my');
          const list = Array.isArray(data) ? data : [];
          const found = list.find((o) => o?.stripeSessionId === sessionId) ?? null;
          if (mounted) setOrder(found);
        } catch {
          if (mounted) setOrder(null);
        }

        if (!mounted) return;
        setStatus('success');
        setMessage('Payment confirmed. Your order was successfully placed for all items.');
      } catch (e) {
        if (!mounted) return;
        // Stripe payment already succeeded (we are on success redirect).
        // Keep UI as success but show a warning that backend finalization may be delayed.
        setStatus('warning');
        setMessage('Payment successful. We are still confirming your order in the background—please check My Orders in a moment or refresh.');
      }
    };

    confirmPaymentAndLoadOrder();
    return () => {
      mounted = false;
    };
  }, [sessionId, showToast, fetchCart, setCartItems]);

  const createdAt = order?.createdAt ? new Date(order.createdAt).toLocaleString() : null;
  const items = Array.isArray(order?.orderItems) ? order.orderItems : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="card-surface p-6">
        <div className="flex items-start gap-3">
          <div
            className={[
              'w-10 h-10 rounded-full flex items-center justify-center shrink-0',
              status === 'success' ? 'bg-green-50 text-green-700' : '',
              status === 'warning' ? 'bg-amber-50 text-amber-800' : '',
              status === 'finalizing' ? 'bg-gray-100 text-gray-700' : '',
            ].join(' ')}
            aria-hidden="true"
          >
            {status === 'success' ? '✓' : status === 'warning' ? '!' : '…'}
          </div>

          <div className="min-w-0">
            <h1 className="text-xl font-semibold text-black">
              Payment Successful
            </h1>
            <p className="mt-1 text-sm text-gray-700">{message || 'Please wait…'}</p>

            {sessionId && (
              <p className="mt-2 text-xs text-gray-600">
                Session: <span className="font-mono">{sessionId}</span>
              </p>
            )}
          </div>
        </div>

        {(status === 'success' || status === 'warning') && (
          <div className="mt-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <p className="text-xs text-gray-600">Order date</p>
                <p className="text-sm font-medium text-black">{createdAt ?? '—'}</p>
              </div>
              <div className="sm:text-right">
                <p className="text-xs text-gray-600">Total amount</p>
                <p className="text-sm font-semibold text-black">₹{order?.totalAmount ?? 0}</p>
              </div>
            </div>

            <div className="mt-5">
              <p className="text-sm font-medium text-black mb-2">Products</p>
              {items.length === 0 ? (
                <p className="text-sm text-gray-700">
                  Your order details will appear in <Link to="/orders" className="underline">My Orders</Link>.
                </p>
              ) : (
                <ul className="space-y-2">
                  {items.map((it) => (
                    <li key={it?.id ?? `${it?.product?.id}-${Math.random()}`} className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-sm text-black truncate">{it?.product?.name ?? 'Product'}</p>
                        <p className="text-xs text-gray-600">
                          Qty: {it?.quantity ?? 0} • Price: ₹{it?.priceAtTime ?? 0}
                        </p>
                      </div>
                      <div className="text-sm font-medium text-black">
                        ₹{(it?.priceAtTime ?? 0) * (it?.quantity ?? 0)}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}

        <div className="mt-6 flex flex-wrap gap-2">
          <Link
            to="/"
            className="btn-primary"
          >
            Continue shopping
          </Link>
          <Link
            to="/orders"
            className="btn-secondary"
          >
            View my orders
          </Link>
        </div>
      </div>
    </div>
  );
}