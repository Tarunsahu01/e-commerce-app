/**
 * Hero Section on home page to show banners
 */
/* eslint-disable react/prop-types */
import { useRef, useState, useEffect } from 'react';
import VariableProximity from '../VariableProximity';

const imageSrc = (url) => {
  if (!url) return null;
  return url.startsWith('http') ? url : `http://localhost:8080${url}`;
};

export function Hero({ products = [] }) {
  const containerRef = useRef(null);
  const [active, setActive] = useState(0);
  const featured = products.slice(0, 6);

  useEffect(() => {
    if (featured.length === 0) return;
    const interval = setInterval(() => {
      setActive((prev) => (prev + 1) % featured.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [featured.length]);

  return (
    <section className="bg-[#faf0e6] border-b border-[#E5E5E5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 relative overflow-hidden">
        {/* Subtle premium overlay */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(600px circle at 20% 10%, rgba(200,169,126,0.18) 0%, rgba(200,169,126,0.00) 60%), radial-gradient(700px circle at 90% 30%, rgba(200,169,126,0.10) 0%, rgba(200,169,126,0.00) 55%)',
          }}
        />
        <div className="relative">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">

          {/* Left — text */}
          <div className="max-w-xl">
            <div ref={containerRef} style={{ position: 'relative' }}>
              <VariableProximity
                label="Discover Your Next Favorite"
                className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-black"
                fromFontVariationSettings="'wght' 400, 'opsz' 9"
                toFontVariationSettings="'wght' 1000, 'opsz' 40"
                containerRef={containerRef}
                radius={100}
                falloff="linear"
              />
            </div>
            <p className="mt-4 text-lg sm:text-xl text-gray-600 leading-relaxed">
              Shop the latest products.
            </p>
          </div>

          {/* Right — rotating card stack */}
          {featured.length > 0 && (
            <div className="relative w-80 h-96 flex-shrink-0">
              {featured.map((product, i) => {
                const offset = (i - active + featured.length) % featured.length;
                const isTop = offset === 0;
                return (
                  <div
                    key={product.id}
                    className="absolute w-72 h-96 bg-white rounded-2xl border border-[#E5E5E5] overflow-hidden"
                    style={{
                      transition: 'all 0.5s ease',
                      top: `${offset * 12}px`,
                      left: `${offset * 12}px`,
                      zIndex: featured.length - offset,
                      transform: `rotate(${(offset - 1) * 3}deg) scale(${isTop ? 1.03 : 1})`,
                      boxShadow: isTop ? '0 8px 24px rgba(0,0,0,0.12)' : '0 2px 8px rgba(0,0,0,0.06)',
                    }}
                  >
                    {imageSrc(product.imageUrl) ? (
                      <img
                        src={imageSrc(product.imageUrl)}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-[#faf0e6] flex items-center justify-center text-gray-400 text-sm">
                        No image
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

        </div>
        </div>
      </div>
    </section>
  );
}
