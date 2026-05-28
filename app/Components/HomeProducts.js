'use client';
import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, ShoppingCart, AlertCircle, X, Package, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCartStore } from '../store/useCartStore';
import { useAuth } from '../context/AuthContext';

const API_ROOT = process.env.NEXT_PUBLIC_API_URL;

export default function HomeProducts() {
  const [categories, setCategories]     = useState([]);
  const [products, setProducts]         = useState([]);
  const [activeCatId, setActiveCatId]   = useState(null);
  const [loadingCats, setLoadingCats]   = useState(true);
  const [loadingProds, setLoadingProds] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsToShow, setItemsToShow]   = useState(3);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);

  const router = useRouter();
  const { user } = useAuth();
  const addToCartStore = useCartStore((state) => state.addToCart);

  // Fetch categories on mount — builds the tab list
  useEffect(() => {
    fetch(`${API_ROOT}/api/categories`)
      .then((r) => r.json())
      .then((data) => {
        const cats = Array.isArray(data) ? data : [];
        setCategories(cats);
        if (cats.length > 0) setActiveCatId(cats[0].id);
      })
      .catch(() => {})
      .finally(() => setLoadingCats(false));
  }, []);

  // Fetch products whenever the active category changes
  useEffect(() => {
    if (!activeCatId) return;
    setLoadingProds(true);
    fetch(`${API_ROOT}/api/products?category_id=${activeCatId}`)
      .then((r) => r.json())
      .then((data) => setProducts(Array.isArray(data) ? data : []))
      .catch(() => setProducts([]))
      .finally(() => setLoadingProds(false));
  }, [activeCatId]);

  // Responsive items-to-show
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) setItemsToShow(1);
      else if (window.innerWidth < 1024) setItemsToShow(2);
      else setItemsToShow(3);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Lock scroll when any popup is open
  useEffect(() => {
    document.body.style.overflow = (showLoginPopup || showCategoryModal) ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [showLoginPopup, showCategoryModal]);

  const activeCategory = categories.find((c) => c.id === activeCatId);

  const canSlide = products.length > itemsToShow;

  const nextSlide = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) =>
      prev >= products.length - itemsToShow ? 0 : prev + 1
    );
  };

  const prevSlide = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) =>
      prev <= 0 ? Math.max(0, products.length - itemsToShow) : prev - 1
    );
  };

  const handleTabChange = (catId) => {
    setActiveCatId(catId);
    setCurrentIndex(0);
  };

  const handleAddToCart = (item) => {
    if (!user) {
      setShowLoginPopup(true);
      return;
    }
    const image =
      Array.isArray(item.images) && item.images.length > 0
        ? item.images[0]
        : '/images/oatsimg.jpg';
    const variants = Array.isArray(item.variants) ? item.variants : [];
    const firstVariant = variants[0] || null;
    addToCartStore({
      id: item.id,
      name: item.name,
      price: firstVariant ? Number(firstVariant.price) : Number(item.price),
      variant_label: firstVariant?.label || null,
      image,
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

       {/* CATEGORY SELECTOR - CENTERED ON DESKTOP, SCROLLABLE ON MOBILE */}
<div className="w-full mb-8">
  {loadingCats ? (
    <div className="flex gap-3 px-4 overflow-hidden">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-10 w-32 rounded-full bg-gray-100 animate-pulse shrink-0" />
      ))}
    </div>
  ) : (
<div className="flex items-center gap-3 overflow-x-auto visible-scrollbar px-4 md:justify-center md:flex-wrap">      {categories.map((cat) => {
        const isActive = activeCatId === cat.id;
        return (
          <button
            key={cat.id}
            onClick={() => setActiveCatId(cat.id)}
            className={`
              flex items-center gap-3 px-6 py-2.5 rounded-full border-2 
              font-secondary font-black text-[10px] md:text-xs uppercase
              whitespace-nowrap transition-all shrink-0
              ${isActive 
               ? 'bg-[#ede9df] border-zinc-300 text-black'
                : 'border-gray-300 bg-gray-50 text-gray-500'}
            `}
          >
            <div className={`
              w-7 h-7 rounded-full flex items-center justify-center overflow-hidden shrink-0
              ${isActive ? 'bg-white/20' : 'bg-white shadow-sm'}
            `}>
              {cat.image_url ? (
                <img
                  src={cat.image_url}
                  alt={cat.name}
                  className="w-full h-full object-contain p-0.5"
                />
              ) : (
                <Package size={12} className={isActive ? 'text-white' : 'text-gray-300'} />
              )}
            </div>
            <span>{cat.name}</span>
          </button>
        );
      })}
    </div>
  )}
</div>
        {/* SLIDER */}
        <div className="relative flex items-center justify-center min-h-[500px] md:min-h-[650px]">
          {canSlide && (
            <button
              onClick={prevSlide}
              className="absolute left-0 md:left-2 z-[100] w-10 h-10 md:w-14 md:h-14 bg-[#c23d6a] text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all"
            >
              <ArrowLeft className="w-5 h-5 md:w-8 md:h-8" strokeWidth={3} />
            </button>
          )}

          <div className="w-full overflow-hidden px-2">
            {loadingProds ? (
              /* Loading skeletons */
              <div className="flex gap-4 md:gap-8 px-4">
                {Array.from({ length: itemsToShow }).map((_, i) => (
                  <div
                    key={i}
                    className="flex-none animate-pulse"
                    style={{ width: `${100 / itemsToShow}%` }}
                  >
                    <div className="aspect-[3/4] rounded-[15px] bg-gray-100 mb-4" />
                    <div className="h-5 bg-gray-100 rounded-lg mb-3 w-3/4" />
                    <div className="h-10 bg-gray-100 rounded-full" />
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              /* Empty state */
              <div className="flex flex-col items-center justify-center py-16 text-center w-full">
                <div className="w-16 h-16 rounded-2xl bg-[#fff0f5] flex items-center justify-center mb-4">
                  <ShoppingCart size={28} className="text-[#c23d6a]" />
                </div>
                <p className="text-base font-bold text-gray-400 font-secondary">
                  No products in this category yet
                </p>
              </div>
            ) : (
              <div
                className={`flex transition-transform duration-700 ease-in-out ${!canSlide ? 'justify-center' : ''}`}
                style={{ transform: `translateX(-${currentIndex * (100 / itemsToShow)}%)` }}
              >
                {products.map((item) => {
                  const imgSrc =
                    Array.isArray(item.images) && item.images.length > 0
                      ? item.images[0]
                      : '/images/oatsimg.jpg';

                  return (
                    <div
                      key={item.id}
                      className="flex-none px-4 md:px-8 flex flex-col group justify"
                      style={{ width: `${100 / itemsToShow}%` }}
                    >
                      {/* Product Image */}
                      <Link href={`/productsviewpage/${item.id}`}>
                        <div className="relative w-full aspect-[3/4] mb-4 md:mb-8 cursor-pointer rounded-[15px] overflow-hidden bg-[#f8f8f8] border border-black/5">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={imgSrc}
                            alt={item.name}
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />

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
                          <h3 className="text-lg md:text-lg font-secondary leading-tight text-black  max-w-[150px] md:max-w-[200px]">
                            {item.name}
                          </h3>
                          {Array.isArray(item.variants) && item.variants.length > 1 && (
                            <p className="text-[10px] text-gray-400 mt-1">
                              {item.variants.map(v => v.label).join(' / ')}
                            </p>
                          )}
                        </div>
                        <span className="text-lg md:text-lg font-secondary text-black whitespace-nowrap">
                          {Array.isArray(item.variants) && item.variants.length > 0
                            ? `₹${item.variants[0].price}`
                            : `₹${item.price}`}
                        </span>
                      </div>

                      {/* Add to cart — mobile only */}
                      <button
                        onClick={() => handleAddToCart(item)}
                        className="md:hidden w-full flex items-center justify-center gap-2 py-3 rounded-full font-bold text-sm bg-[#c23d6a] text-white font-secondary transition-all active:scale-95"
                      >
                        Add to Cart <ShoppingCart className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {canSlide && (
            <button
              onClick={nextSlide}
              className="absolute right-0 md:right-2 z-[100] w-10 h-10 md:w-14 md:h-14 bg-[#c23d6a] text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all"
            >
              <ArrowRight className="w-5 h-5 md:w-8 md:h-8" strokeWidth={3} />
            </button>
          )}
        </div>

        {/* SHOP ALL BUTTON */}
        <div className="hidden md:flex justify-center">
          <Link href="/productsviewpage">
            <button className="flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-xs shadow-lg bg-[#c23d6a] text-white hover:bg-[#f2eadf] hover:text-black border border-transparent hover:border-black transition-all duration-300 font-secondary">
              Shop all <ShoppingCart className="w-5 h-5 md:w-6 md:h-6" />
            </button>
          </Link>
        </div>

      </div>

      {/* ── Login Required Popup ──────────────────────────────────────── */}
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

          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowLoginPopup(false)}
          />

          <div
            className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 md:p-10 text-center"
            style={{ animation: 'popIn 0.3s cubic-bezier(.22,1,.36,1) forwards' }}
          >
            <button
              onClick={() => setShowLoginPopup(false)}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Close"
            >
              <X size={20} className="text-gray-400" />
            </button>

            <div className="flex justify-center mb-5">
              <div
                className="w-20 h-20 rounded-full border-[3px] border-[#c23d6a]/40 flex items-center justify-center bg-[#fff3f7]"
                style={{ animation: 'pulseRing 2s ease-in-out infinite' }}
              >
                <AlertCircle size={40} className="text-[#c23d6a]" strokeWidth={2.5} />
              </div>
            </div>

            <h3 className="text-2xl md:text-3xl font-bold font-primary text-black mb-2">
              Login Required
            </h3>
            <p className="text-gray-500 font-secondary text-sm md:text-base mb-7 leading-relaxed">
              Please login to add items to your cart
            </p>

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

      {/* ── Category Modal ─────────────────────────────────────────────── */}
      {showCategoryModal && (
        <div
          className="fixed inset-0 z-[999999] flex items-center justify-center p-4"
          style={{ animation: 'fadeIn 0.2s ease forwards' }}
        >
          <style>{`
            @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
            @keyframes popIn  { from { opacity: 0; transform: scale(0.92) translateY(10px); } to { opacity: 1; transform: scale(1) translateY(0); } }
          `}</style>

          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowCategoryModal(false)}
          />

          <div
            className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-6 md:p-8"
            style={{ animation: 'popIn 0.3s cubic-bezier(.22,1,.36,1) forwards' }}
          >
            <button
              onClick={() => setShowCategoryModal(false)}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Close"
            >
              <X size={20} className="text-gray-400" />
            </button>

            <h3 className="text-xl md:text-2xl font-bold font-primary text-black mb-1">
              Select a Category
            </h3>
            <p className="text-gray-500 font-secondary text-sm mb-6">
              Pick a category to view its products
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[60vh] overflow-y-auto pr-1">
              {categories.map((cat) => {
                const isActive = activeCatId === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => { handleTabChange(cat.id); setShowCategoryModal(false); }}
                    className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all
                      ${isActive
                        ? 'bg-[#f0ece2] border-zinc-400'
                        : 'border-gray-100 bg-gray-50 hover:bg-gray-100'}`}
                  >
                    <div className="w-16 h-16 rounded-xl bg-white shadow-sm flex items-center justify-center overflow-hidden">
                      {cat.image_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={cat.image_url}
                          alt={cat.name}
                          className="w-full h-full object-contain p-1"
                        />
                      ) : (
                        <Package size={24} className="text-gray-300" />
                      )}
                    </div>
                    <span className="text-xs font-black uppercase tracking-wider text-center">
                      {cat.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}