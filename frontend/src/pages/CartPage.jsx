/**
 * CartPage: Displays cart items from backend API (GET /api/cart).
 */
import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { api } from '../lib/api';

function isCouponValid(c) {
  if (!c || !c.active) return false;
  if (!c.expiryDate) return true;
  try {
    const expiry = new Date(c.expiryDate);
    return !isNaN(expiry.getTime()) && expiry >= new Date();
  } catch {
    return false;
  }
}



// Safely build image URL — handles full URLs, relative /uploads paths, and null
function resolveImageUrl(image) {
  if (!image) return null;
  if (image.startsWith('http')) return image;
  return `http://localhost:8080${image}`;
}

export function CartPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const {
    cartItems,
    cartLoading,
    cartTotalAmount,
    appliedCoupon,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    applyCouponToCart,
    removeCouponFromCart,
  } = useCart();

  const [availableCoupons, setAvailableCoupons] = useState([]);
  const [couponsLoading, setCouponsLoading] = useState(false);
  const [couponError, setCouponError] = useState(null);
  const [applyingCode, setApplyingCode] = useState(null);

  const categoryIds = [...new Set(cartItems.map((item) => item.categoryId).filter((id) => id != null))];
  const categoryNames = [...new Set(cartItems.map((item) => item.categoryName).filter(Boolean))];

  useEffect(() => {
    if (!isAuthenticated) {
      showToast('You must login first to view your cart.', 'warning');
      navigate('/login', { replace: true, state: { from: location } });
    }
  }, [isAuthenticated, navigate, location, showToast]);

  useEffect(() => {
    if (cartItems.length === 0) {
      setAvailableCoupons([]);
      return;
    }
    let cancelled = false;
    setCouponsLoading(true);
    setCouponError(null);

    const fetchCoupons = () => {
      if (categoryIds.length > 0) {
        return api.post('coupons/applicable', { categories: categoryIds });
      }
      return api.get('coupons').then((res) => {
        const list = Array.isArray(res.data) ? res.data : [];
        return {
          data: list.filter(
            (c) =>
              isCouponValid(c) &&
              (categoryNames.length === 0 || categoryNames.includes(c.categoryName))
          ),
        };
      });
    };

    fetchCoupons()
      .then((res) => {
        const list = Array.isArray(res.data) ? res.data : [];
        if (!cancelled) setAvailableCoupons(list);
      })
      .catch((err) => {
        if (!cancelled) setCouponError(err.response?.data?.message ?? 'Failed to load coupons');
      })
      .finally(() => {
        if (!cancelled) setCouponsLoading(false);
      });
    return () => { cancelled = true; };
  }, [cartItems.length, categoryIds.join(','), categoryNames.join(',')]);

  const subtotalFromItems = cartItems.reduce(
    (sum, item) => sum + (item.price ?? 0) * (item.quantity ?? 1),
    0
  );
  const displayTotal = cartTotalAmount != null ? cartTotalAmount : subtotalFromItems;

  const handleApplyCoupon = async (code) => {
    setApplyingCode(code);
    setCouponError(null);
    try {
      await applyCouponToCart(code);
      showToast('Coupon applied successfully', 'success');
    } catch (err) {
      setCouponError(err.response?.data?.message ?? 'Could not apply coupon');
    } finally {
      setApplyingCode(null);
    }
  };

  const handleRemoveCoupon = async () => {
    setCouponError(null);
    try {
      await removeCouponFromCart();
      showToast('Coupon removed', 'info');
    } catch (err) {
      setCouponError(err.response?.data?.message ?? 'Could not remove coupon');
    }
  };

  if (cartLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-2xl font-bold text-black">Cart</h1>
        <p className="mt-6 text-gray-600">Loading cart...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-black">Cart</h1>
      </div>

      {cartItems.length === 0 ? (
        <div className="mt-6 card-surface p-6">
          <p className="text-gray-700 leading-relaxed">Your cart is empty.</p>
          <Link to="/" className="btn-secondary mt-5 justify-center">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="mt-6 lg:grid lg:grid-cols-3 lg:gap-8">
          <div className="lg:col-span-2 space-y-6">
            {cartItems.map((item) => {
              const lineTotal = (item.price ?? 0) * (item.quantity ?? 1);
              return (
                <div
                  key={item.id}
                  className="flex gap-4 p-4 border border-[#E5E5E5] rounded-2xl bg-white shadow-sm hover:shadow-md transition-shadow"
                >
                {/* Product Image */}
                  <div className="w-20 h-20 flex-shrink-0 bg-[#faf0e6] border border-[#E5E5E5] rounded-2xl flex items-center justify-center overflow-hidden">
                    {resolveImageUrl(item.image) ? (
                      <img
                        src={resolveImageUrl(item.image)}
                        alt={item.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    ) : (
                      <span className="text-gray-400 text-xs">No Image</span>
                    )}
                  </div>

                {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-black truncate">{item.title}</h3>
                    <p className="mt-1 text-sm text-gray-700">
                      Price: ₹{Number(item.price ?? 0).toLocaleString('en-IN')}
                    </p>
                    <div className="mt-2 flex items-center gap-2 flex-wrap">
                      <button
                        type="button"
                        aria-label={`Decrease quantity for ${item.title}`}
                        onClick={() => decreaseQuantity(item.id)}
                        className="w-9 h-9 rounded-xl border border-[#E5E5E5] bg-white shadow-sm hover:bg-[#faf0e6] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C8A97E] focus-visible:ring-offset-2 focus-visible:ring-offset-[#faf0e6]"
                      >
                        -
                      </button>
                      <span className="text-sm font-semibold w-9 text-center">{item.quantity ?? 1}</span>
                      <button
                        type="button"
                        aria-label={`Increase quantity for ${item.title}`}
                        onClick={() => increaseQuantity(item.id)}
                        className="w-9 h-9 rounded-xl border border-[#E5E5E5] bg-white shadow-sm hover:bg-[#faf0e6] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C8A97E] focus-visible:ring-offset-2 focus-visible:ring-offset-[#faf0e6]"
                      >
                        +
                      </button>
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.id)}
                        aria-label={`Remove ${item.title} from cart`}
                        className="ml-1 inline-flex items-center px-3 py-1.5 rounded-xl text-sm font-medium text-[#B91C1C] border border-red-200 bg-white hover:bg-red-50 transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                    <p className="mt-2 text-sm font-semibold text-black">
                      Line total: ₹{lineTotal.toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Sticky Summary */}
          <aside className="lg:col-span-1 lg:sticky lg:top-24 self-start space-y-6 mt-6 lg:mt-0">
            {/* Coupons */}
            <section className="card-surface p-6">
              <h2 className="text-lg font-bold text-black mb-3">Available Coupons</h2>
              {couponError && <p className="text-sm text-red-600 mb-2">{couponError}</p>}

              {appliedCoupon && (
                <div className="flex flex-wrap items-center gap-3 mb-4 p-3 rounded-2xl bg-emerald-50 border border-emerald-200">
                  <span className="text-sm font-semibold text-emerald-800">
                    Applied: {appliedCoupon.code} ({appliedCoupon.discountPercentage}% OFF)
                  </span>
                  <button
                    type="button"
                    onClick={handleRemoveCoupon}
                    className="text-xs font-semibold px-3 py-1.5 rounded-xl border border-emerald-700 text-emerald-700 hover:bg-emerald-100 transition-colors"
                  >
                    Remove Coupon
                  </button>
                </div>
              )}

              {!appliedCoupon && (
                <>
                  {availableCoupons.length > 0 ? (
                    <>
                      <p className="text-sm text-gray-600 mb-2">Available for your cart:</p>
                      <div className="grid gap-3 sm:grid-cols-1">
                        {availableCoupons.map((coupon) => (
                          <div
                            key={coupon.id}
                            className="p-4 rounded-2xl border border-[#C8A97E]/35 bg-[#faf0e6] shadow-sm"
                          >
                            <div className="font-mono font-semibold text-[#7A5C2E]">
                              COUPON: {coupon.code}
                            </div>
                            <div className="mt-1 text-sm font-semibold text-[#7A5C2E]">
                              {coupon.discountPercentage}% OFF on {coupon.categoryName ?? 'Category'}
                            </div>
                            <button
                              type="button"
                              onClick={() => handleApplyCoupon(coupon.code)}
                              disabled={applyingCode === coupon.code}
                              className="mt-3 w-full btn-primary disabled:opacity-60 disabled:pointer-events-none"
                            >
                              {applyingCode === coupon.code ? 'Applying…' : 'Apply Coupon'}
                            </button>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : couponsLoading ? (
                    <p className="text-sm text-gray-500">Loading coupons…</p>
                  ) : (
                    <p className="text-sm text-gray-500">
                      No coupons available for your cart&apos;s categories.
                    </p>
                  )}
                </>
              )}
            </section>

            {/* Total + Checkout */}
            <section className="card-surface p-6">
              <p className="text-sm font-medium text-gray-700">Total Amount</p>
              <p className="mt-1 text-2xl font-extrabold text-black">
                ₹{Number(displayTotal).toLocaleString('en-IN')}
              </p>
              <button
                type="button"
                onClick={() => navigate('/payment')}
                className="mt-5 w-full btn-primary justify-center"
              >
                Checkout
              </button>
            </section>
          </aside>
        </div>
      )}
    </div>
  );
}