"use client";
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
    /* Removed horizontal padding on mobile (px-0) to allow edge-to-edge content */
    <section className="py-16 px-0 md:px-6 bg-white overflow-hidden">
      <div className="max-w-[1200px] mx-auto">

        {/* ── Desktop: Expanding Accordion Cards ── */}
        <div className="hidden md:flex gap-4 h-[500px] items-end">
          {products.map((product) => (
            <div
              key={product.id}
              className="
                group relative overflow-hidden rounded-2xl cursor-pointer
                flex-[1] hover:flex-[2.2]
                h-full transition-all duration-500 ease-in-out
                bg-gray-100
              "
            >
              <div className="absolute inset-0 w-full h-full overflow-hidden">
                <Image
                  src={product.image}
                  alt={product.title}
                  fill
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
              </div>
              <div className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in-out" />
              <div className="absolute inset-0 flex flex-col justify-end p-8">
                <div className="translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out">
                  <h3 className="font-primary text-5xl text-white leading-none mb-2 uppercase italic">
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

        {/* ── Mobile: Full Image & Content (No Gaps) ── */}
        <div className="flex flex-col md:hidden"> {/* Removed gap-10 to allow items to touch if desired, or keep for spacing */}
          {products.map((product) => (
            <div
              key={product.id}
              /* rounded-none ensures the background hits the screen edges perfectly */
              className="flex flex-col overflow-hidden bg-white border-b border-gray-100"
            >
              {/* IMAGE CONTAINER: Full Width */}
              <div className="relative w-full h-[350px] bg-[#f9f9f9] overflow-hidden">
                <Image
                  src={product.image}
                  alt={product.title}
                  fill
                  className="object-contain p-6" 
                />
              </div>

              {/* CONTENT AREA: Horizontal padding added back here so text isn't touching screen edge */}
              <div className="p-10">
                <h3 className="font-primary text-4xl text-[#2b2b2b] leading-none mb-3 uppercase italic">
                  {product.title}
                </h3>
                <div className="space-y-3">
                  <p className="text-[#c23d6a] font-secondary text-lg font-bold">
                    {product.subtitle}
                  </p>
                  <p className="text-gray-600 font-secondary text-base leading-relaxed">
                    {product.benefit}
                  </p>
                </div>
                
                <div className="mt-6 flex items-center gap-2">
                  <span className="w-8 h-[2px] bg-[#c23d6a]"></span>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                    Premium Quality
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}