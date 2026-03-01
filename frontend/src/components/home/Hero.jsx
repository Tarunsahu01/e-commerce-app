/**
 * Hero Section on home page to show banners
 */
import { Link } from 'react-router-dom';

export function Hero() {
  return (
    <section className="bg-gray-100 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <div className="max-w-2xl">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-black">
            Discover Your Next Favorite
          </h1>
          <p className="mt-4 text-lg sm:text-xl text-gray-600">
            Shop the latest products. Fast delivery, easy returns.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              to="/products"
              className="inline-flex items-center px-6 py-3 bg-black text-white font-semibold rounded-md hover:bg-gray-800 transition-colors"
            >
              Shop Now
            </Link>
            <Link
              to="/products"
              className="inline-flex items-center px-6 py-3 border-2 border-black text-black font-semibold rounded-md hover:bg-gray-100 transition-colors"
            >
              Browse All
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
