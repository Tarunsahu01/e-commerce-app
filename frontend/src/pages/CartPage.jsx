/**
 * CartPage: Displays cart items and total amount.
 * Uses CartContext for frontend-only cart state.
 */
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export function CartPage() {
  const navigate = useNavigate();
  const { cartItems, increaseQuantity, decreaseQuantity } = useCart();

  const total = cartItems.reduce(
    (sum, item) => sum + (item.price ?? 0) * (item.quantity ?? 1),
    0
  );

  const handleCheckout = () => {
    navigate('/payment');
  };

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
        <div className="mt-6 space-y-4">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="flex gap-4 p-4 border border-gray-200 rounded-lg bg-white"
            >
              <div className="w-20 h-20 flex-shrink-0 bg-gray-100 rounded flex items-center justify-center">
                {item.image ? (
                  <img
                    src={item.image}
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
                <div className="mt-2 flex items-center gap-2">
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
                </div>
              </div>
            </div>
          ))}

          <div className="mt-6 pt-4 border-t border-gray-200">
            <p className="text-lg font-semibold text-black">
              Total Amount: ₹{total.toLocaleString('en-IN')}
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
