import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import { useNavigate } from 'react-router-dom';

export function ProductModal({ product, onClose }) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const { showToast } = useToast();

  if (!product) return null;

  const { name, price, imageUrl, description, categoryName, category } = product;
  const displayPrice = price != null ? `₹${Number(price).toLocaleString('en-IN')}` : '—';
  const categoryLabel = categoryName ?? category?.name ?? 'Uncategorized';

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      showToast('You must login first to add items to your cart.', 'warning');
      navigate('/login');
      return;
    }
    try {
      await addToCart(product);
      showToast('Product added to cart', 'success');
      onClose?.();
    } catch {
      showToast('Failed to add to cart. Please try again.', 'error');
    }
  };

  const handleOverlayClick = () => {
    onClose?.();
  };

  const stopPropagation = (event) => {
    event.stopPropagation();
  };

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={handleOverlayClick}
    >
      <div
        className="max-w-3xl w-full mx-4 bg-white rounded-2xl shadow-xl overflow-hidden border border-[#E5E5E5] focus:outline-none"
        onClick={stopPropagation}
        role="dialog"
        aria-modal="true"
        aria-label="Product details"
      >
        <div className="flex justify-between items-start px-6 pt-5 pb-2">
          <h2 className="text-xl font-semibold text-black truncate pr-6">
            {name || 'Product details'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-600 hover:text-black transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C8A97E] focus-visible:ring-offset-2 focus-visible:ring-offset-[#faf0e6] rounded-xl p-2 -m-2"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="px-6 pb-6 pt-2 flex flex-col md:flex-row gap-6">
          <div className="md:w-1/2">
            <div className="aspect-[4/5] bg-[#faf0e6] border border-[#E5E5E5] rounded-2xl flex items-center justify-center overflow-hidden">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={name || 'Product image'}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-gray-400 text-xs">No Image</span>
              )}
            </div>
          </div>
          <div className="md:w-1/2 flex flex-col gap-3">
            <p className="text-sm text-gray-600">
              Category:{' '}
              <span className="font-medium text-gray-900">{categoryLabel}</span>
            </p>
            <p className="text-2xl font-semibold text-black">{displayPrice}</p>
            {description && (
              <p className="text-sm text-gray-700 mt-1 whitespace-pre-line">
                {description}
              </p>
            )}
            <button
              type="button"
              onClick={handleAddToCart}
              className="mt-4 inline-flex justify-center items-center px-4 py-2 rounded-md bg-black text-white text-sm font-medium hover:bg-gray-900 transition-colors"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

