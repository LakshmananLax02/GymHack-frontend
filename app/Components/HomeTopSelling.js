'use client';
import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, ShoppingCart, AlertCircle, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCartStore } from '../store/useCartStore';
import { useAuth } from '../context/AuthContext';

const bestSellingProducts = [
  { id: 1, name: 'John Varvatos Star USA Contrast Stitch Jacket', price: 250, image: '/images/oatsimg.jpg' },
  { id: 2, name: 'John Varvatos Star USA Contrast Stitch Jacket', price: 250, image: '/images/oatsimg.jpg' },
  { id: 3, name: 'John Varvatos Star USA Contrast Stitch Jacket', price: 250, image: '/images/oatsimg.jpg' },
  { id: 4, name: 'John Varvatos Star USA Contrast Stitch Jacket', price: 250, image: '/images/oatsimg.jpg' },
  { id: 5, name: 'John Varvatos Star USA Contrast Stitch Jacket', price: 250, image: '/images/oatsimg.jpg' },
];

export default function OurTopSelling() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsToShow, setItemsToShow] = useState(4);
  const [showLoginPopup, setShowLoginPopup] = useState(false);

  const router = useRouter();
  const { user, showToast } = useAuth();
  const addToCartStore = useCartStore((state) => state.addToCart);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) setItemsToShow(1);
      else if (window.innerWidth < 1024) setItemsToShow(2);
      else setItemsToShow(4);
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

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev >= bestSellingProducts.length - itemsToShow ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev <= 0 ? bestSellingProducts.length - itemsToShow : prev - 1));
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
    showToast(`${item.name} added to cart 🛒`, 'success', 2000);
  };

  const handleLoginNow = () => {
    setShowLoginPopup(false);
    showToast('Redirecting to login...', 'info', 1500);
    router.push('/login');
  };

  return (
    <section className="py-6 bg-white overflow-hidden">
      <div className="max-w-[1200px] mx-auto px-7">

        {/* Header Section */}
        <div className="flex flex-row items-center justify-center gap-3 mb-12 w-full px-4">
          <div className="w-4 h-4 md:w-5 md:h-5 bg-[#c23d6a] rounded-full shrink-0" />
          <h2 className="text-3xl md:text-4xl font-primary font-bold text-black text-center leading-tight">
            Our top selling products
          </h2>
        </div>

        <div className="relative group">
          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute -left-6 top-[35%] z-20 w-12 h-12 bg-[#c23d6a] text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
          >
            <ArrowLeft size={24} strokeWidth={3} />
          </button>

          {/* Card Container */}
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${currentIndex * (100 / itemsToShow)}%)` }}
            >
              {bestSellingProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex-none px-2"
                  style={{ width: `${100 / itemsToShow}%` }}
                >
                  {/* Image — links to product page */}
                  <Link href={`/productsviewpage/${product.id}`}>
                    <div className="bg-[#f2eadf]/30 rounded-[15px] p-3 border-[10px] border-[#f2eadf] mb-4 aspect-[4/5] relative overflow-hidden cursor-pointer">
                      <div className="relative w-full h-full bg-white rounded-[15px] overflow-hidden">
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-contain p-4"
                        />
                      </div>
                    </div>
                  </Link>

                  {/* Text Details */}
                  <div className="flex justify-between items-start mb-4 px-1">
                    <p className="font-secondary text-[13px] font-bold text-gray-800 leading-tight max-w-[70%]">
                      {product.name}
                    </p>
                    <span className="font-secondary text-xl font-black text-black">
                      ₹{product.price}
                    </span>
                  </div>

                  {/* Add to Cart Button (gated on login) */}
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="flex items-center justify-center w-full gap-2 px-5 py-2.5 rounded-full font-bold text-xs shadow-lg bg-[#c23d6a] text-white hover:bg-[#f2eadf] hover:text-black border border-transparent hover:border-black transition-all duration-300 font-secondary"
                  >
                    Add to Cart <ShoppingCart size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={nextSlide}
            className="absolute -right-6 top-[35%] z-20 w-12 h-12 bg-[#c23d6a] text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
          >
            <ArrowRight size={24} strokeWidth={3} />
          </button>
        </div>

        {/* Bottom Shop All Button */}
        <div className="hidden md:flex justify-center mt-8 md:mt-10">
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