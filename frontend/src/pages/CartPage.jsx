/**
 * CartPage: Displays cart items from backend API (GET /api/cart).
 * Shows product image, name, quantity, price, line total, total amount.
 * Integrates coupons: fetch applicable coupons, apply one, show discounted total.
 */
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
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

export function CartPage() {
  const navigate = useNavigate();
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
    handleCheckout,
  } = useCart();

  const [availableCoupons, setAvailableCoupons] = useState([]);
  const [couponsLoading, setCouponsLoading] = useState(false);
  const [couponError, setCouponError] = useState(null);
  const [applyingCode, setApplyingCode] = useState(null);

  const categoryIds = [...new Set(cartItems.map((item) => item.categoryId).filter((id) => id != null))];
  const categoryNames = [...new Set(cartItems.map((item) => item.categoryName).filter(Boolean))];

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
  const displayTotal =
    cartTotalAmount != null ? cartTotalAmount : subtotalFromItems;

  const handleApplyCoupon = async (code) => {
    setApplyingCode(code);
    setCouponError(null);
    try {
      await applyCouponToCart(code);
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
    } catch (err) {
      setCouponError(err.response?.data?.message ?? 'Could not remove coupon');
    }
  };

  // const handleCheckout = () => {
  //   navigate('/payment');
  // };

  if (cartLoading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-2xl font-bold text-black">Cart</h1>
        <p className="mt-6 text-gray-600">Loading cart...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold text-black">Cart</h1>

      {cartItems.length === 0 ? (
        <div className="mt-6 border border-gray-200 rounded-lg p-6 bg-white">
          <p className="text-gray-700">Your cart is empty.</p>
          <Link
            to="/"
            className="inline-block mt-4 px-4 py-2 text-sm font-medium text-black border border-black rounded-md hover:bg-gray-100 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="mt-6 space-y-6">
          {cartItems.map((item) => {
            const lineTotal = (item.price ?? 0) * (item.quantity ?? 1);
            return (
              <div
                key={item.id}
                className="flex gap-4 p-4 border border-gray-200 rounded-lg bg-white"
              >
                <div className="w-20 h-20 flex-shrink-0 bg-gray-100 rounded flex items-center justify-center">
                  {item.image ? (
                    <img
                      src={`http://localhost:8080${item.image}`}
                      alt={item.title}
                      className="w-full h-full object-cover rounded"
                    />
                  ) : (
                    <span className="text-gray-400 text-xs">No Image</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-black truncate">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-sm text-gray-700">
                    Price: ₹{Number(item.price ?? 0).toLocaleString('en-IN')}
                  </p>
                  <div className="mt-2 flex items-center gap-2 flex-wrap">
                    <button
                      type="button"
                      onClick={() => decreaseQuantity(item.id)}
                      className="w-8 h-8 rounded border border-gray-300 text-black hover:bg-gray-100 transition-colors"
                    >
                      -
                    </button>
                    <span className="text-sm font-medium w-8 text-center">
                      {item.quantity ?? 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => increaseQuantity(item.id)}
                      className="w-8 h-8 rounded border border-gray-300 text-black hover:bg-gray-100 transition-colors"
                    >
                      +
                    </button>
                    <button
                      type="button"
                      onClick={() => removeFromCart(item.id)}
                      className="ml-2 text-xs text-red-600 hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                  <p className="mt-1 text-sm font-medium text-black">
                    Line total: ₹{lineTotal.toLocaleString('en-IN')}
                  </p>
                </div>
              </div>
            );
          })}

          {/* Available Coupons - always show when cart has items */}
          {cartItems.length > 0 && (
            <section className="border-t border-gray-200 pt-6">
              <h2 className="text-lg font-semibold text-black mb-3">Available Coupons</h2>
              {couponError && (
                <p className="text-sm text-red-600 mb-2">{couponError}</p>
              )}
              {appliedCoupon && (
                <div className="flex flex-wrap items-center gap-3 mb-4 p-3 rounded-lg bg-emerald-50 border border-emerald-200">
                  <span className="text-sm font-medium text-emerald-800">
                    Applied: {appliedCoupon.code} ({appliedCoupon.discountPercentage}% OFF)
                  </span>
                  <button
                    type="button"
                    onClick={handleRemoveCoupon}
                    className="text-xs font-medium px-3 py-1.5 rounded border border-emerald-700 text-emerald-700 hover:bg-emerald-100 transition-colors"
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
                      <div className="grid gap-3 sm:grid-cols-2">
                        {availableCoupons.map((coupon) => (
                          <div
                            key={coupon.id}
                            className="p-4 rounded-lg border-2 border-dashed border-amber-200 bg-amber-50/80"
                          >
                            <div className="font-mono font-semibold text-amber-900">
                              COUPON: {coupon.code}
                            </div>
                            <div className="mt-1 text-sm font-semibold text-amber-700">
                              {coupon.discountPercentage}% OFF on {coupon.categoryName ?? 'Category'}
                            </div>
                            <button
                              type="button"
                              onClick={() => handleApplyCoupon(coupon.code)}
                              disabled={applyingCode === coupon.code}
                              className="mt-3 w-full py-1.5 px-3 text-sm font-medium rounded border border-amber-600 text-amber-800 bg-white hover:bg-amber-100 transition-colors disabled:opacity-50 disabled:pointer-events-none"
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
                    <p className="text-sm text-gray-500">No coupons available for your cart&apos;s categories.</p>
                  )}
                </>
              )}
            </section>
          )}

          <div className="pt-4 border-t border-gray-200">
            <p className="text-lg font-semibold text-black">
              Total Amount: ₹{Number(displayTotal).toLocaleString('en-IN')}
            </p>
          
            <button
              type="button"
              onClick={handleCheckout}
              className="mt-4 w-full px-4 py-2 text-sm font-medium text-white bg-black rounded-md hover:bg-gray-900 transition-colors"
            >
              Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
