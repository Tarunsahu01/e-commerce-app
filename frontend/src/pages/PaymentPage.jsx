/**
 * PaymentPage: Checkout page before redirecting to Stripe.
 */
import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { api } from '../lib/api';
import { useToast } from '../context/ToastContext';

export function PaymentPage() {
  const { showToast } = useToast();
  const navigate = useNavigate();
  const { cartItems, cartTotalAmount, cartLoading } = useCart();
  const [loading, setLoading] = useState(false);

  const subtotal = useMemo(
    () => cartItems.reduce((sum, i) => sum + (i.price ?? 0) * (i.quantity ?? 1), 0),
    [cartItems]
  );
  const total = cartTotalAmount != null ? cartTotalAmount : subtotal;

  const handleProceed = async () => {
    if (cartItems.length === 0) {
      showToast('Your cart is empty.', 'warning');
      navigate('/cart');
      return;
    }
    setLoading(true);
    try {
      const res = await api.post('payment/checkout');
      const url = res.data?.sessionUrl;
      if (!url) {
        showToast('Could not start Stripe checkout. Try again.', 'error');
        return;
      }
      window.location.href = url;
    } catch (e) {
      showToast(e.response?.data?.message ?? 'Checkout failed. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-black">Checkout</h1>
        <Link to="/cart" className="text-sm text-black underline">
          Back to cart
        </Link>
      </div>

      {cartLoading ? (
        <p className="mt-6 text-gray-700">Loading cart…</p>
      ) : cartItems.length === 0 ? (
        <div className="mt-6 bg-white border border-gray-200 rounded-lg p-6">
          <p className="text-gray-700">Your cart is empty.</p>
          <Link
            to="/"
            className="inline-block mt-4 px-4 py-2 text-sm font-medium text-black border border-black rounded-md hover:bg-gray-100 transition-colors"
          >
            Continue shopping
          </Link>
        </div>
      ) : (
        <div className="mt-6 bg-white border border-gray-200 rounded-lg p-6">
          <p className="text-sm text-gray-700">Review your items before payment.</p>

          <div className="mt-4 space-y-3">
            {cartItems.map((it) => (
              <div key={it.id} className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-black truncate">{it.title}</p>
                  <p className="text-xs text-gray-600">
                    Qty: {it.quantity ?? 1} • Price: ₹{it.price ?? 0}
                  </p>
                </div>
                <div className="text-sm font-medium text-black">
                  ₹{(it.price ?? 0) * (it.quantity ?? 1)}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-gray-200 flex items-center justify-between">
            <p className="text-sm text-gray-700">Total</p>
            <p className="text-lg font-semibold text-black">₹{Number(total).toLocaleString('en-IN')}</p>
          </div>

          <button
            type="button"
            onClick={handleProceed}
            disabled={loading}
            className="mt-5 w-full px-4 py-2 text-sm font-medium text-white bg-black rounded-md hover:bg-gray-900 transition-colors disabled:opacity-60 disabled:pointer-events-none"
          >
            {loading ? 'Redirecting to Stripe…' : 'Pay with Stripe'}
          </button>
        </div>
      )}
    </div>
  );
}

