/**
 * ProductCard: Reusable card for a single product.
 * Shows image, name, price, and Add to Cart button.
 */
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

const isLoggedIn = () => {
  return localStorage.getItem('user') !== null;
};

export function ProductCard({ product }) {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { id, name, price, imageUrl } = product ?? {};
  const displayPrice = price != null ? `₹${Number(price).toLocaleString('en-IN')}` : '—';

  const handleAddToCart = () => {
    if (!isLoggedIn()) {
      alert('You need to sign in first.');
      navigate('/login');
      return;
    }

    addToCart(product);
    alert('This item has been added to the cart.');
  };

  return (
    <article
      className="flex-shrink-0 w-[180px] sm:w-[200px] bg-white border border-gray-200 rounded-md overflow-hidden hover:border-gray-300 transition-colors"
      data-product-id={id}
    >
      <div className="aspect-square bg-gray-100 flex items-center justify-center">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name || 'Product'}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-gray-400 text-xs">No Image</span>
        )}
      </div>
      <div className="p-3">
        <h3 className="text-sm font-medium text-black truncate" title={name}>
          {name || 'Unnamed product'}
        </h3>
        <p className="mt-1 text-sm font-medium text-black">{displayPrice}</p>
        <div className="mt-2 flex justify-center">
          <button
            type="button"
            onClick={handleAddToCart}
            className="w-full text-xs py-1.5 px-2 rounded border border-black text-black hover:bg-gray-100 transition-colors"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </article>
  );
}
