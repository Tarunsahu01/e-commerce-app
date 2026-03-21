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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-black">Checkout</h1>
        <Link to="/cart" className="btn-ghost">
          Back to cart
        </Link>
      </div>

      {cartLoading ? (
        <div className="mt-8">
          <p className="text-gray-700">Loading cart…</p>
        </div>
      ) : cartItems.length === 0 ? (
        <div className="mt-8 card-surface p-6">
          <p className="text-gray-700">Your cart is empty.</p>
          <Link to="/" className="btn-secondary mt-5 justify-center">
            Continue shopping
          </Link>
        </div>
      ) : (
        <div className="mt-8 lg:grid lg:grid-cols-3 lg:gap-8">
          {/* Items */}
          <div className="lg:col-span-2 card-surface p-6">
            <p className="text-sm text-gray-700">Review your items before payment.</p>

            <div className="mt-5 space-y-3">
              {cartItems.map((it) => (
                <div key={it.id} className="flex items-start justify-between gap-3 pb-3 border-b border-[#E5E5E5] last:border-b-0">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-black truncate">{it.title}</p>
                    <p className="text-xs text-gray-600">
                      Qty: {it.quantity ?? 1} • Price: ₹{it.price ?? 0}
                    </p>
                  </div>
                  <div className="text-sm font-semibold text-black">
                    ₹{(it.price ?? 0) * (it.quantity ?? 1)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div className="mt-6 lg:mt-0 lg:col-span-1 lg:sticky lg:top-24 self-start">
            <div className="card-surface p-6">
              <p className="text-sm font-medium text-gray-700">Total amount</p>
              <div className="mt-2 flex items-baseline justify-between gap-4">
                <p className="text-2xl font-extrabold text-black">
                  ₹{Number(total).toLocaleString('en-IN')}
                </p>
              </div>

              <p className="mt-3 text-xs text-gray-600 leading-relaxed">
                You’ll be redirected to Stripe to complete your payment securely.
              </p>

              <button
                type="button"
                onClick={handleProceed}
                disabled={loading}
                className="mt-6 w-full btn-primary disabled:opacity-70 disabled:pointer-events-none"
              >
                {loading ? 'Redirecting to Stripe…' : 'Pay with Stripe'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

