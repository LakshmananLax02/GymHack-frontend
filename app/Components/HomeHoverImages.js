"use client";
import React from 'react';
import Image from 'next/image';
import { RevealGroup } from './scroll/Reveal';

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
    <section className="py-16 px-4 md:px-27 sm:px-6 bg-white">
      <div className="max-w-[1200px] mx-auto">

        {/* ── Desktop: expanding flex cards ── */}
        <RevealGroup stagger={0.15} amount={0.15} className="hidden md:flex gap-4 h-[400px] items-end">
          {products.map((product) => (
            <RevealGroup.Item
              key={product.id}
              variant="up"
              duration={0.75}
              className="
                group relative overflow-hidden rounded-xl cursor-pointer
                flex-[1] hover:flex-[2.2]
                h-full hover:h-[400px]
                transition-[flex,opacity,transform] duration-[900ms] ease-in-out
                bg-gray-100
              "
            >
              {/* Image */}
              <div className="absolute inset-0 w-full h-full overflow-hidden">
                <Image
                  src={product.image}
                  alt={product.title}
                  fill
                  className="object-cover transition-transform hover:duration-[900ms] ease-out group-hover:scale-105"
                />
              </div>

              {/* Dark overlay */}
              <div className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 transition-opacity duration-[900ms] ease-in-out" />

              {/* Text — slides up on hover */}
              <div className="absolute inset-0 flex flex-col justify-end p-8">
                <div className="translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-[1300ms] ease-out">
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
            </RevealGroup.Item>
          ))}
        </RevealGroup>

        {/* ── Mobile / Tablet: stacked cards ── */}
        <RevealGroup stagger={0.12} amount={0.1} className="flex flex-col gap-5 md:hidden">
          {products.map((product) => (
            <RevealGroup.Item
              key={product.id}
              variant="up"
              duration={0.7}
              className="relative overflow-hidden rounded-xl cursor-pointer h-[320px] sm:h-[400px] bg-gray-100"
            >
              <div className="absolute inset-0 w-full h-full overflow-hidden">
                <Image
                  src={product.image}
                  alt={product.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute inset-0 bg-black/40" />
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
            </RevealGroup.Item>
          ))}
        </RevealGroup>

      </div>
    </section>
  );
}
