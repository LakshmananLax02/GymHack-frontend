'use client';
import React, { useState, useEffect } from 'react';
import { ShoppingCart, AlertCircle, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCartStore } from '../store/useCartStore';
import { useAuth } from '../context/AuthContext';

const products = [
  { id: 1,  category: 'OATS',   name: 'Premium Rolled Oats - High Protein',         price: 180, image: '/images/oatsimg.jpg' },
  { id: 2,  category: 'OATS',   name: 'Instant Oats - Quick Energy',                price: 150, image: '/images/oatsimg.jpg' },
  { id: 7,  category: 'OATS',   name: 'Premium Rolled Oats - High Protein',         price: 180, image: '/images/oatsimg.jpg' },
  { id: 8,  category: 'OATS',   name: 'Instant Oats - Quick Energy',                price: 150, image: '/images/oatsimg.jpg' },
  { id: 9,  category: 'OATS',   name: 'Steel Cut Oats - Pure Grain',                price: 200, image: '/images/oatsimg.jpg' },
  { id: 10, category: 'OATS',   name: 'Oats & Honey Crunch',                        price: 190, image: '/images/oatsimg.jpg' },
  { id: 3,  category: 'Muesli', name: 'Gourmet Muesli - Rich Fruits, Nuts & Seeds', price: 250, image: '/images/meusliimg.png' },
  { id: 4,  category: 'Muesli', name: 'Berries & Seeds Muesli Mix',                 price: 280, image: '/images/meusliimg.png' },
  { id: 5,  category: 'Muesli', name: 'Crunchy Nut Muesli',                         price: 240, image: '/images/meusliimg.png' },
  { id: 6,  category: 'Muesli', name: 'Berries & Seeds Muesli Mix',                 price: 280, image: '/images/meusliimg.png' },
  { id: 11, category: 'Muesli', name: 'Tropical Muesli Blend',                      price: 260, image: '/images/meusliimg.png' },
  { id: 12, category: 'Muesli', name: 'Dark Chocolate Muesli',                      price: 290, image: '/images/meusliimg.png' },
];

const tabs = [
  { key: 'OATS',   label: 'Oats',   image: '/images/oatsimg.jpg' },
  { key: 'Muesli', label: 'Muesli', image: '/images/meusliimg.png' },
];

export default function HomeProducts() {
  const [activeTab, setActiveTab] = useState('OATS');
  const [showLoginPopup, setShowLoginPopup] = useState(false);

  const router = useRouter();
  const { user, showToast } = useAuth();
  const addToCartStore = useCartStore((state) => state.addToCart);

  const filtered = products.filter(p => p.category === activeTab);

  // Lock body scroll when popup is open
  useEffect(() => {
    document.body.style.overflow = showLoginPopup ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [showLoginPopup]);

  // ✅ Gated Add to Cart — show popup if not logged in
  const handleAddToCart = (item) => {
    if (!user) {
      setShowLoginPopup(true);
      return;
    }
    addToCartStore({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
    });
    showToast(`${item.name} added to cart 🛒`, 'success', 2000);
  };

  const handleLoginNow = () => {
    setShowLoginPopup(false);
    showToast('Redirecting to login...', 'info', 1500);
    router.push('/login');
  };

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
              <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                <Image src={tab.image} alt={tab.label} fill className="object-contain p-1" />
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
          {filtered.map(item => (
            <div key={item.id} className="group flex flex-col">

              {/* Image Card — links to product view */}
              <Link href={`/productsviewpage/${item.id}`}>
                <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-[#f8f8f8] border border-black/5 mb-3 cursor-pointer">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-contain p-5 md:p-8 transition-transform duration-500"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  />

                  {/* Hover overlay — desktop only */}
                  <div className="hidden md:flex absolute inset-0 z-10 items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/40 backdrop-blur-[2px]">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleAddToCart(item);
                      }}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-xs shadow-lg bg-[#c23d6a] text-white hover:bg-[#f2eadf] hover:text-black border border-transparent hover:border-black transition-all duration-300 font-secondary"
                    >
                      Add to cart <ShoppingCart className="w-4 h-4" />
                    </button>
                  </div>

                </div>
              </Link>

              {/* Name + Price */}
              <div className="flex items-start justify-between gap-2 px-1 mb-3">
                <h3 className="font-secondary text-xs sm:text-sm font-semibold text-black leading-snug flex-1">
                  {item.name}
                </h3>
                <span className="font-secondary text-base sm:text-lg font-black text-black whitespace-nowrap">
                  ₹{item.price}
                </span>
              </div>

              {/* Add to Cart — mobile only, always visible at bottom of card */}
              <button
                onClick={() => handleAddToCart(item)}
                className="flex md:hidden w-full items-center justify-center gap-2 py-2.5 rounded-full font-bold text-xs bg-[#c23d6a] text-white font-secondary transition-all active:scale-95"
              >
                Add to Cart <ShoppingCart className="w-4 h-4" />
              </button>

            </div>
          ))}
        </div>

      </div>

      {/* ── Login Required Popup ───────────────────────────────────────────── */}
      {showLoginPopup && (
        <div
          className="fixed inset-0 z-[999999] flex items-center justify-center p-4"
          style={{ animation: 'fadeIn 0.2s ease forwards' }}
        >
          <style>{`
            @keyframes fadeIn    { from { opacity: 0; } to { opacity: 1; } }
            @keyframes popIn     { from { opacity: 0; transform: scale(0.92) translateY(10px); } to { opacity: 1; transform: scale(1) translateY(0); } }
            @keyframes pulseRing { 0%,100% { box-shadow: 0 0 0 0 rgba(194,61,106,0.35); } 50% { box-shadow: 0 0 0 14px rgba(194,61,106,0); } }
          `}</style>

          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowLoginPopup(false)}
          />

          {/* Modal */}
          <div
            className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 md:p-10 text-center"
            style={{ animation: 'popIn 0.3s cubic-bezier(.22,1,.36,1) forwards' }}
          >
            {/* Close button */}
            <button
              onClick={() => setShowLoginPopup(false)}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Close"
            >
              <X size={20} className="text-gray-400" />
            </button>

            {/* Icon circle */}
            <div className="flex justify-center mb-5">
              <div
                className="w-20 h-20 rounded-full border-[3px] border-[#c23d6a]/40 flex items-center justify-center bg-[#fff3f7]"
                style={{ animation: 'pulseRing 2s ease-in-out infinite' }}
              >
                <AlertCircle size={40} className="text-[#c23d6a]" strokeWidth={2.5} />
              </div>
            </div>

            {/* Heading */}
            <h3 className="text-2xl md:text-3xl font-bold font-primary text-black mb-2">
              Login Required
            </h3>

            {/* Message */}
            <p className="text-gray-500 font-secondary text-sm md:text-base mb-7 leading-relaxed">
              Please login to add items to your cart
            </p>

            {/* Buttons */}
            <div className="flex gap-3 justify-center">
              <button
                onClick={handleLoginNow}
                className="flex-1 max-w-[160px] bg-[#c23d6a] text-white font-bold text-sm py-3 rounded-full font-secondary hover:bg-[#a8305a] active:scale-95 transition-all shadow-md"
              >
                Login Now
              </button>
              <button
                onClick={() => setShowLoginPopup(false)}
                className="flex-1 max-w-[160px] bg-gray-100 text-gray-700 font-bold text-sm py-3 rounded-full font-secondary hover:bg-gray-200 active:scale-95 transition-all"
              >
                Maybe later
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}