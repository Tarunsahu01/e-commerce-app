/**
 * ProductCard: Reusable card for a single product.
 */
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';

export function ProductCard({ product, adminMode, onQuickView }) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const [adding, setAdding] = useState(false);

  const { id, name, price, imageUrl } = product ?? {};

  const displayPrice = price != null ? `₹${Number(price).toLocaleString('en-IN')}` : '—';

  // Safely build the full image URL
  const imageSrc = imageUrl
    ? imageUrl.startsWith('http')
      ? imageUrl
      : `http://localhost:8080${imageUrl}`
    : null;

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      showToast('You must login first to add items to your cart.', 'warning');
      navigate('/login');
      return;
    }
    setAdding(true);
    try {
      await addToCart(product);
      showToast('Product added to cart', 'success');
    } catch {
      showToast('Failed to add to cart. Please try again.', 'error');
    } finally {
      setAdding(false);
    }
  };

  const ImageBlock = (
    <div className="aspect-square bg-gray-100 flex items-center justify-center overflow-hidden">
      {imageSrc ? (
        <img
          src={imageSrc}
          alt={name || 'Product'}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'flex';
          }}
        />
      ) : null}
      <span
        className="text-gray-400 text-xs items-center justify-center"
        style={{ display: imageSrc ? 'none' : 'flex' }}
      >
        No Image
      </span>
    </div>
  );

  if (adminMode) {
    return (
      <article
        className="flex-shrink-0 w-[190px] sm:w-[210px] bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all"
        data-product-id={id}
      >
        {ImageBlock}
        <div className="p-3">
          <h3 className="text-sm font-medium text-black truncate" title={name}>
            {name || 'Unnamed product'}
          </h3>
          <p className="mt-1 text-sm font-medium text-black">{displayPrice}</p>
          <div className="mt-2 flex justify-center">
            <Link
              to={`/admin-dashboard/edit-product/${id}`}
              className="block w-full text-center text-xs py-1.5 px-2 rounded border border-black text-black hover:bg-gray-100 transition-colors"
            >
              Edit Product
            </Link>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article
      className="flex-shrink-0 w-[190px] sm:w-[210px] bg-white border border-gray-200 rounded-xl overflow-hidden shadow-md hover:shadow-lg hover:-translate-y-1 transition-all"
      data-product-id={id}
      onClick={() => onQuickView && onQuickView(product)}
      role="button"
      tabIndex={0}
    >
      {ImageBlock}
      <div className="p-3">
        <h3 className="text-sm font-medium text-black truncate" title={name}>
          {name || 'Unnamed product'}
        </h3>
        <p className="mt-1 text-sm font-medium text-black">{displayPrice}</p>
        <div className="mt-2 flex justify-center">
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              handleAddToCart();
            }}
            disabled={adding}
            className="w-full text-xs py-1.5 px-2 rounded border border-black text-black hover:bg-gray-100 transition-colors disabled:opacity-50"
          >
            {adding ? 'Adding…' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </article>
  );
}