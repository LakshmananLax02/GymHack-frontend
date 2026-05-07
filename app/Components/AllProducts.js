'use client';
import React, { useState } from 'react';
import { ShoppingCart } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const allProducts = [
  { id: 1,  category: 'OATS',   name: 'Premium Rolled Oats - High Protein',      price: 180, image: '/images/oatsimg.jpg' },
  { id: 2,  category: 'OATS',   name: 'Instant Oats - Quick Energy',              price: 150, image: '/images/oatsimg.jpg' },
  { id: 7,  category: 'OATS',   name: 'Premium Rolled Oats - High Protein',      price: 180, image: '/images/oatsimg.jpg' },
  { id: 8,  category: 'OATS',   name: 'Instant Oats - Quick Energy',             price: 150, image: '/images/oatsimg.jpg' },
  { id: 9,  category: 'OATS',   name: 'Steel Cut Oats - Pure Grain',             price: 200, image: '/images/oatsimg.jpg' },
  { id: 10, category: 'OATS',   name: 'Oats & Honey Crunch',                     price: 190, image: '/images/oatsimg.jpg' },
  { id: 3,  category: 'Muesli', name: 'Gourmet Muesli - Rich Fruits, Nuts & Seeds', price: 250, image: '/images/meusliimg.png' },
  { id: 4,  category: 'Muesli', name: 'Berries & Seeds Muesli Mix',              price: 280, image: '/images/meusliimg.png' },
  { id: 5,  category: 'Muesli', name: 'Crunchy Nut Muesli',                      price: 240, image: '/images/meusliimg.png' },
  { id: 6,  category: 'Muesli', name: 'Berries & Seeds Muesli Mix',              price: 280, image: '/images/meusliimg.png' },
  { id: 11, category: 'Muesli', name: 'Tropical Muesli Blend',                   price: 260, image: '/images/meusliimg.png' },
  { id: 12, category: 'Muesli', name: 'Dark Chocolate Muesli',                   price: 290, image: '/images/meusliimg.png' },
];

const tabs = [
  { key: 'OATS',   label: 'Oats',   image: '/images/oatsimg.jpg' },
  { key: 'Muesli', label: 'Muesli', image: '/images/meusliimg.png' },
];

export default function HomeProducts() {
  const [activeTab, setActiveTab] = useState('OATS');

  const filtered = allProducts.filter(p => p.category === activeTab);

  return (
    <section className="py-10 md:py-16 bg-white font-sans">
      <div className="max-w-[1200px] mx-auto px-4 md:px-6">

        {/* ── Header ── */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-4 h-4 bg-[#c23d6a] rounded-full" />
            <h2 className="font-primary text-3xl md:text-5xl font-bold text-black">
              Find products by category
            </h2>
          </div>
          <p className="text-gray-500 font-secondary text-sm md:text-base mt-1">
            Fuel your body with the right choice for your routine
          </p>
        </div>

        {/* ── Image Tabs ── */}
        <div className="flex justify-center gap-4 mb-6">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-3 px-5 py-3 rounded-xl border-2 transition-all duration-300 font-secondary font-bold text-lg
                ${activeTab === tab.key
                  ? 'bg-[#f0ece2] border text-black'
                  : 'border-gray-200 bg-gray-50 text-gray-400'
                }`}
            >
              {/* Thumbnail */}
              <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                <Image
                  src={tab.image}
                  alt={tab.label}
                  fill
                  className="object-contain p-1"
                />
              </div>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* ── Product Count ── */}
        <p className="text-center text-gray-400 font-secondary text-sm mb-8">
          ({filtered.length} products)
        </p>

        {/* ── Product Grid ── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {filtered.map(product => (
            <div key={product.id} className="group flex flex-col">

              {/* Image Card */}
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-[#f8f8f8] border border-black/5 mb-3 cursor-pointer">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-contain p-5 md:p-8 transition-transform duration-500"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
                {/* Hover overlay */}
                <div className="absolute inset-0 z-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/40 backdrop-blur-[2px]">
                  <button className="flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-xs shadow-lg bg-[#c23d6a] text-white hover:bg-[#f2eadf] hover:text-black border border-transparent hover:border-black transition-all duration-300 font-secondary">
                    Add to cart <ShoppingCart className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Name + Price */}
              <div className="flex items-start justify-between gap-2 px-1">
                <h3 className="font-secondary text-xs sm:text-sm font-semibold text-black leading-snug flex-1">
                  {product.name}
                </h3>
                <span className="font-secondary text-base sm:text-lg font-black text-black whitespace-nowrap">
                  ₹{product.price}
                </span>
              </div>

            </div>
          ))}
        </div>
      </div>
    </section>
  );
}