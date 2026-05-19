'use client';
import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, ShoppingCart, AlertCircle, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCartStore } from '../store/useCartStore';
import { useAuth } from '../context/AuthContext';

const product = [
  { id: 1, category: 'OATS', name: 'Premium Rolled Oats - High Protein', price: 180, image: '/images/oatsimg.jpg' },
  { id: 2, category: 'OATS', name: 'Instant Oats - Quick Energy', price: 150, image: '/images/oatsimg.jpg' },
  { id: 3, category: 'Muesli', name: 'Gourmet Muesli-Rich fruits, Nuts & Seeds', price: 250, image: '/images/meusliimg.png' },
  { id: 4, category: 'Muesli', name: 'Berries & Seeds Muesli Mix', price: 280, image: '/images/meusliimg.png' },
  { id: 5, category: 'Muesli', name: 'Crunchy Nut Muesli', price: 240, image: '/images/meusliimg.png' },
  { id: 6, category: 'Muesli', name: 'Berries & Seeds Muesli Mix', price: 280, image: '/images/meusliimg.png' },
  { id: 7, category: 'OATS', name: 'Premium Rolled Oats - High Protein', price: 180, image: '/images/oatsimg.jpg' },
  { id: 8, category: 'OATS', name: 'Instant Oats - Quick Energy', price: 150, image: '/images/oatsimg.jpg' },
];

export default function HomeProducts() {
  const [activeTab, setActiveTab] = useState('OATS');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsToShow, setItemsToShow] = useState(3);
  const [showLoginPopup, setShowLoginPopup] = useState(false);

  const router = useRouter();
  const { user } = useAuth();
  const addToCartStore = useCartStore((state) => state.addToCart);

  const filteredProducts = product.filter(p => p.category === activeTab);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setItemsToShow(1);
      } else if (window.innerWidth < 1024) {
        setItemsToShow(2);
      } else {
        setItemsToShow(3);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Lock body scroll when popup is open
  useEffect(() => {
    document.body.style.overflow = showLoginPopup ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [showLoginPopup]);

  const nextSlide = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) =>
      prev >= filteredProducts.length - itemsToShow ? 0 : prev + 1
    );
  };

  const prevSlide = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) =>
      prev <= 0 ? Math.max(0, filteredProducts.length - itemsToShow) : prev - 1
    );
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentIndex(0);
  };

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
  };

  const handleLoginNow = () => {
    setShowLoginPopup(false);
    router.push('/login');
  };

  return (
    <section className="py-3 md:py-14 bg-white overflow-hidden font-sans">
      <div className="max-w-[1440px] mx-auto px-4 md:px-6">

        {/* HEADER */}
        <div className="text-center mb-8 md:mb-12">
          <div className="flex items-center justify-center gap-2 md:gap-3 mb-2 md:mb-3">
            <div className="w-3 h-3 md:w-5 md:h-5 bg-[#c23d6a] rounded-full" />
            <h2 className="text-3xl md:text-5xl font-bold font-primary text-black">
              Find Your Perfect Meal
            </h2>
          </div>
          <p className="text-gray-500 font-secondary text-sm md:text-xl font-medium tracking-tight px-4">
            Fuel your body with the right choice for your routine
          </p>
        </div>

    {/* FILTER TABS (With Permanent Scrollbar) */}
<div className="flex justify-start md:justify-center w-full mb-8">
  <div className="flex gap-3 md:gap-6 overflow-x-scroll pb-6 px-4 visible-scrollbar max-w-full scroll-smooth">
    {['OATS', 'Muesli', 'Protein Bar', 'Protein', 'Granola', 'Snacks'].map((category) => (
      <button
        key={category}
        onClick={() => handleTabChange(category)}
        className={`px-8 md:px-12 font-secondary py-2.5 rounded-full border-2 font-black text-xs md:text-sm uppercase tracking-[0.2em] transition-all duration-300 whitespace-nowrap shadow-sm flex-shrink-0
          ${activeTab === category 
            ? 'bg-[#f0ece2] border-zinc-300 text-black scale-105' 
            : 'border-transparent bg-gray-100 text-gray-400 hover:bg-gray-200'
          }`}
      >
        {category}
      </button>
    ))}
  </div>
</div>

        {/* SLIDER */}
        <div className="relative flex items-center justify-center min-h-[500px] md:min-h-[650px]">
          <button
            onClick={prevSlide}
            className="absolute left-0 md:left-2 z-[100] w-10 h-10 md:w-14 md:h-14 bg-[#c23d6a] text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all"
          >
            <ArrowLeft className="w-5 h-5 md:w-8 md:h-8" strokeWidth={3} />
          </button>

          <div className="w-full overflow-hidden px-2">
            <div
              className="flex transition-transform duration-700 ease-in-out"
              style={{
                transform: `translateX(-${currentIndex * (100 / itemsToShow)}%)`,
              }}
            >
              {filteredProducts.map((item) => (
                <div
                  key={item.id}
                  className="flex-none px-4 md:px-8 flex flex-col group"
                  style={{ width: `${100 / itemsToShow}%` }}
                >
                  {/* Product Image */}
                  <Link href={`/productsviewpage/${item.id}`}>
                    <div className="relative w-full aspect-[3/4] mb-4 md:mb-8 cursor-pointer rounded-[15px] overflow-hidden bg-[#f8f8f8] border border-black/5">
                      <div className="absolute inset-0">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-contain p-6 md:p-10 transition-transform duration-500"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                      </div>

                      {/* Hover overlay — desktop only */}
                      <div className="hidden md:flex absolute inset-0 z-20 items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/40 backdrop-blur-[1px]">
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleAddToCart(item);
                          }}
                          className="flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-xs shadow-lg bg-[#c23d6a] text-white hover:bg-[#f2eadf] hover:text-black border border-transparent hover:border-black transition-all duration-300 font-secondary"
                        >
                          Add to cart <ShoppingCart className="w-4 h-4 md:w-5 md:h-5" />
                        </button>
                      </div>
                    </div>
                  </Link>

                  {/* Product Info */}
                  <div className="flex justify-between items-start w-full px-2 gap-2 md:gap-4 mb-3">
                    <div className="min-h-[60px] md:min-h-[80px]">
                      <h3 className="text-lg md:text-xl font-secondary font-bold leading-tight text-black uppercase max-w-[150px] md:max-w-[200px]">
                        {item.name}
                      </h3>
                    </div>
                    <span className="text-2xl md:text-4xl font-secondary font-black text-black whitespace-nowrap">
                      ₹{item.price}
                    </span>
                  </div>

                  {/* Add to Cart — mobile only, always visible at bottom */}
                  <button
                    onClick={() => handleAddToCart(item)}
                    className="md:hidden w-full flex items-center justify-center gap-2 py-3 rounded-full font-bold text-sm bg-[#c23d6a] text-white font-secondary transition-all active:scale-95"
                  >
                    Add to Cart <ShoppingCart className="w-4 h-4" />
                  </button>

                </div>
              ))}
            </div>
          </div>

          <button
            onClick={nextSlide}
            className="absolute right-0 md:right-2 z-[100] w-10 h-10 md:w-14 md:h-14 bg-[#c23d6a] text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all"
          >
            <ArrowRight className="w-5 h-5 md:w-8 md:h-8" strokeWidth={3} />
          </button>
        </div>

        {/* SHOP ALL BUTTON */}
        <div className="hidden md:flex justify-center">
          <Link href='/products'>
            <button className="flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-xs shadow-lg bg-[#c23d6a] text-white hover:bg-[#f2eadf] hover:text-black border border-transparent hover:border-black transition-all duration-300 font-secondary">
              Shop all <ShoppingCart className="w-5 h-5 md:w-6 md:h-6" />
            </button>
          </Link>
        </div>

      </div>

      {/* ── Login Required Popup ───────────────────────────────────────────── */}
      {showLoginPopup && (
        <div
          className="fixed inset-0 z-[999999] flex items-center justify-center p-4"
          style={{ animation: 'fadeIn 0.2s ease forwards' }}
        >
          <style>{`
            @keyframes fadeIn  { from { opacity: 0; } to { opacity: 1; } }
            @keyframes popIn   { from { opacity: 0; transform: scale(0.92) translateY(10px); } to { opacity: 1; transform: scale(1) translateY(0); } }
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