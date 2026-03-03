/**
 * ProductCard: Reusable card for a single product.
 * Shows image (or placeholder), name, price, and a static rating placeholder.
 * Styling matches app theme: black/gray, borders, rounded-md.
 */
export function ProductCard({ product }) {
  const { id, name, price, imageUrl } = product ?? {};
  const displayPrice = price != null ? `₹${Number(price).toLocaleString('en-IN')}` : '—';

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
        <p className="mt-0.5 text-xs text-gray-500">★★★★☆ 4.0</p>
      </div>
    </article>
  );
}
