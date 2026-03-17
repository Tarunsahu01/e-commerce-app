/**
 * Hero Section on home page to show banners
 */
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
        </div>
      </div>
    </section>
  );
}
