import React from 'react';
import Image from 'next/image';

const products = [
  {
    id: 1,
    title: "Muesli",
    image: "/images/homehoverimage1.png",
    subtitle: "No heavy processing",
    benefit: "Rich in fiber, vitamins, and minerals.",
  },
  {
    id: 2,
    title: "Rolled Oats",
    image: "/images/homehoverimage2.png",
    subtitle: "Keeps you full longer",
    benefit: "Helps in weight management",
  },
  {
    id: 3,
    title: "Steel-Cut Oats",
    image: "/images/homehoverimage3.png",
    subtitle: "Releases energy slowly",
    benefit: "Good for stable blood sugar",
  },
];

export default function ProductShowcase() {
  return (
    <section className="py-16 px-4 sm:px-6 bg-white">
      <div className="max-w-[1200px] mx-auto">

        {/* ── Desktop: expanding flex cards ── */}
        <div className="hidden md:flex gap-4 h-[500px] items-end">
          {products.map((product) => (
            <div
              key={product.id}
              className="
                group relative overflow-hidden rounded-xl cursor-pointer
                flex-[1] hover:flex-[2.2]
                h-full hover:h-[500px]
                transition-all duration-500 ease-in-out
                bg-gray-100
              "
            >
              {/* Image */}
              <div className="absolute inset-0 w-full h-full overflow-hidden">
                <Image
                  src={product.image}
                  alt={product.title}
                  fill
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
              </div>

              {/* Dark overlay */}
              <div className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in-out" />

              {/* Text — slides up on hover */}
              <div className="absolute inset-0 flex flex-col justify-end p-8">
                <div className="translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out">
                  <h3 className="font-primary text-5xl text-white leading-none mb-2">
                    {product.title}
                  </h3>
                  <p className="text-white font-secondary text-lg font-bold mb-1">
                    {product.subtitle}
                  </p>
                  <p className="text-gray-200 font-secondary text-base leading-snug">
                    {product.benefit}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Mobile / Tablet: stacked cards ── */}
        <div className="flex flex-col gap-5 md:hidden">
          {products.map((product) => (
            <div
              key={product.id}
              className="relative overflow-hidden rounded-3xl cursor-pointer h-[320px] sm:h-[400px] bg-gray-100"
            >
              {/* Image */}
              <div className="absolute inset-0 w-full h-full overflow-hidden">
                <Image
                  src={product.image}
                  alt={product.title}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Always-visible dark overlay on mobile */}
              <div className="absolute inset-0 bg-black/40" />

              {/* Text always visible on mobile */}
              <div className="absolute inset-0 flex flex-col justify-end p-6">
                <h3 className="font-primary text-4xl text-white leading-none mb-2">
                  {product.title}
                </h3>
                <p className="text-white font-secondary text-base font-bold mb-1">
                  {product.subtitle}
                </p>
                <p className="text-gray-200 font-secondary text-sm leading-snug">
                  {product.benefit}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}