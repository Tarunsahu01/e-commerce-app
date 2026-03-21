/**
 * CartContext: Cart state synced with backend API for persistent cart.
 * When user is logged in: cart is fetched from GET /api/cart, add/update/remove call backend.
 * On logout: frontend cart state is cleared only (backend cart is NOT deleted).
 * On login: cart is fetched again from backend.
 */
import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { api } from '../lib/api';

const CartContext = createContext(null);

/**
 * Map backend Cart response to frontend cart items shape.
 * Backend: { cartItems: [ { product: { id, name, categoryId, categoryName, ... }, quantity, priceAtTime } ], totalAmount, appliedCoupon }
 */
function cartResponseToItems(cart) {
  if (!cart?.cartItems || !Array.isArray(cart.cartItems)) return [];
  console.log(cart.id);

  return cart.cartItems.map((ci) => ({

    id: ci.product?.id,
    productId: ci.product?.id,
    title: ci.product?.name ?? 'Product',
    price: ci.priceAtTime ?? ci.product?.price ?? 0,
    image: ci.product?.imageUrl ?? null,
    quantity: ci.quantity ?? 1,
    categoryId: ci.product?.categoryId ?? ci.product?.category?.id ?? null,
    categoryName: ci.product?.categoryName ?? ci.product?.category?.name ?? null,
  }));
}

function cartResponseToCoupon(appliedCoupon) {
  if (!appliedCoupon) return null;
  return {
    code: appliedCoupon.code,
    discountPercentage: appliedCoupon.discountPercentage ?? 0,
    categoryName: appliedCoupon.category?.name ?? null,
  };
}

export function CartProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [cartLoading, setCartLoading] = useState(false);
  const [cartTotalAmount, setCartTotalAmount] = useState(null);
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  const setCartFromResponse = useCallback((data) => {
    setCartItems(cartResponseToItems(data));
    setCartTotalAmount(data?.totalAmount ?? null);
    setAppliedCoupon(cartResponseToCoupon(data?.appliedCoupon));
  }, []);

  const fetchCart = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setCartItems([]);
      setCartTotalAmount(null);
      setAppliedCoupon(null);
      return;
    }
    setCartLoading(true);
    try {
      const { data } = await api.get('cart');
      setCartFromResponse(data);
    } catch (err) {
      if (err.response?.status !== 401) {
        console.error('Failed to fetch cart', err);
      }
      setCartItems([]);
      setCartTotalAmount(null);
      setAppliedCoupon(null);
    } finally {
      setCartLoading(false);
    }
  }, [setCartFromResponse]);

  // When user logs in or page loads with token, fetch cart. When user logs out, clear frontend state only.
  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    } else {
      setCartItems([]);
      setCartTotalAmount(null);
      setAppliedCoupon(null);
    }
  }, [isAuthenticated, fetchCart]);

  const addToCart = useCallback(
    async (product) => {
      if (!product?.id) return;
      if (!isAuthenticated) return;

      try {
        const { data } = await api.post('cart/add', {
          productId: product.id,
          quantity: 1,
        });
        setCartFromResponse(data);
      } catch (err) {
        console.error('Add to cart failed', err);
        throw err;
      }
    },
    [isAuthenticated]
  );

  const updateQuantity = useCallback(async (productId, quantity) => {
    if (quantity <= 0) {
      try {
        await api.delete(`cart/remove/${productId}`);
        const { data } = await api.get('cart');
        setCartFromResponse(data);
      } catch (err) {
        console.error('Remove from cart failed', err);
      }
      return;
    }
    try {
      const { data } = await api.put('cart/update', { productId, quantity });
      setCartFromResponse(data);
    } catch (err) {
      console.error('Update cart failed', err);
    }
  }, [setCartFromResponse]);

  const increaseQuantity = useCallback(
    (productId) => {
      const item = cartItems.find((i) => i.id === productId);
      const nextQty = (item?.quantity ?? 0) + 1;
      updateQuantity(productId, nextQty);
    },
    [cartItems, updateQuantity]
  );

  const decreaseQuantity = useCallback(
    (productId) => {
      const item = cartItems.find((i) => i.id === productId);
      const nextQty = Math.max(0, (item?.quantity ?? 1) - 1);
      updateQuantity(productId, nextQty);
    },
    [cartItems, updateQuantity]
  );

  const removeFromCart = useCallback(
    (productId) => updateQuantity(productId, 0),
    [updateQuantity]
  );

  const applyCouponToCart = useCallback(
    async (couponCode) => {
      try {
        const { data } = await api.post('cart/apply-coupon', { couponCode });
        setCartFromResponse(data);
      } catch (err) {
        console.error('Apply coupon failed', err);
        throw err;
      }
    },
    [setCartFromResponse]
  );

  const removeCouponFromCart = useCallback(async () => {
    try {
      const { data } = await api.delete('cart/remove-coupon');
      setCartFromResponse(data);
    } catch (err) {
      console.error('Remove coupon failed', err);
      throw err;
    }
  }, [setCartFromResponse]);

  const handleCheckout = async () => {
    try {
      const res = await api.post("payment/checkout");

      console.log(res.data.sessionUrl);
      
      window.location.href = res.data.sessionUrl;

    } catch (err) {
      console.error(err);
    }
  };

  const value = {
    cartItems,
    setCartItems,
    cartLoading,
    cartTotalAmount,
    appliedCoupon,
    fetchCart,
    addToCart,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    applyCouponToCart,
    removeCouponFromCart,
    handleCheckout,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error('useCart must be used within CartProvider');
  }
  return ctx;
}
