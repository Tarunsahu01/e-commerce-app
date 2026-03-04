/**
 * ProductCarousel: Reusable horizontal scroll row for products.
 * This component is presentational: parent fetches and passes `products`.
 */
import { ProductCard } from '../product/ProductCard';

export function ProductCarousel({ products }) {
  const safeProducts = Array.isArray(products) ? products : [];

  if (!safeProducts.length) {
    return null;
  }

  return (
    <div className="overflow-x-auto -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
      <div className="flex gap-4 pb-2 min-w-0">
        {safeProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
