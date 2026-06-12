'use client';
import React, { useState, useEffect } from 'react';
import { ShoppingCart, AlertCircle, X, Package } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCartStore } from '../store/useCartStore';
import { useAuth } from '../context/AuthContext';
import { Reveal, RevealGroup } from './scroll/Reveal';

const API_ROOT = process.env.NEXT_PUBLIC_API_URL;

// Single product card — animation handled by parent RevealGroup
function ProductCard({ item, onAddToCart }) {
  const imgSrc =
    Array.isArray(item.images) && item.images.length > 0
      ? item.images[0]
      : '/images/oatsimg.jpg';

  return (
    <RevealGroup.Item variant="up" duration={0.55} className="group flex flex-col h-full">
      {/* Image */}
      <Link href={`/productsviewpage/${item.id}`}>
        <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-[#f8f8f8] border border-black/5 mb-3 cursor-pointer">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imgSrc}
            alt={item.name}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-[700ms] ease-out group-hover:scale-105"
          />
          {/* Hover overlay — desktop only */}
          <div className="hidden md:flex absolute inset-0 z-10 items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/40 backdrop-blur-[2px]">
            <button
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); onAddToCart(item); }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-xs shadow-lg bg-[#c23d6a] text-white hover:bg-[#f2eadf] hover:text-black border border-transparent hover:border-black transition-all duration-300 font-secondary"
            >
              Add to cart <ShoppingCart className="w-4 h-4" />
            </button>
          </div>
        </div>
      </Link>

      {/* Name + Price */}
      <div className="flex flex-col flex-1 px-1">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-secondary text-xs sm:text-sm font-semibold text-black leading-snug flex-1">
            {item.name}
          </h3>
          <span className="font-secondary text-base sm:text-lg font-black text-black whitespace-nowrap">
            {Array.isArray(item.variants) && item.variants.length > 0
              ? `₹${item.variants[0].price}`
              : `₹${item.price}`}
          </span>
        </div>

        {Array.isArray(item.variants) && item.variants.length > 1 && (
          <p className="text-[10px] text-gray-400 font-secondary mb-2">
            {item.variants.map(v => v.label).join(' / ')}
          </p>
        )}

        <div className="flex-1" />

        <button
          onClick={() => onAddToCart(item)}
          className="flex md:hidden w-full items-center justify-center gap-2 py-2.5 mt-3 rounded-full font-bold text-xs bg-[#c23d6a] text-white font-secondary transition-all active:scale-95"
        >
          Add to Cart <ShoppingCart className="w-4 h-4" />
        </button>
      </div>
    </RevealGroup.Item>
  );
}

export default function AllProducts() {
  const [categories, setCategories]         = useState([]);
  const [products, setProducts]             = useState([]);
  const [activeCatId, setActiveCatId]       = useState(null);
  const [loadingCats, setLoadingCats]       = useState(true);
  const [loadingProds, setLoadingProds]     = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);

  const router = useRouter();
  const { user, showToast } = useAuth();
  const addToCartStore = useCartStore((state) => state.addToCart);

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

  useEffect(() => {
    if (!activeCatId) return;
    setLoadingProds(true);
    fetch(`${API_ROOT}/api/products?category_id=${activeCatId}`)
      .then((r) => r.json())
      .then((data) => setProducts(Array.isArray(data) ? data : []))
      .catch(() => setProducts([]))
      .finally(() => setLoadingProds(false));
  }, [activeCatId]);

  useEffect(() => {
    document.body.style.overflow = (showLoginPopup || showCategoryModal) ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [showLoginPopup, showCategoryModal]);

  const handleTabChange = (catId) => setActiveCatId(catId);

  const handleAddToCart = (item) => {
    if (!user) { setShowLoginPopup(true); return; }
    const image =
      Array.isArray(item.images) && item.images.length > 0
        ? item.images[0]
        : '/images/oatsimg.jpg';
    const variants = Array.isArray(item.variants) ? item.variants : [];
    const firstVariant = variants[0] || null;
    addToCartStore({
      id: item.id,
      name: item.name,
      price: firstVariant ? Number(firstVariant.price) : item.price,
      variant_label: firstVariant?.label || null,
      image,
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
        <Reveal variant="up" amount={0.2} className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-4 h-4 bg-[#c23d6a] rounded-full" />
            <h2 className="font-primary text-3xl md:text-5xl font-bold text-black">
              Find products by category
            </h2>
          </div>
          <p className="text-gray-500 font-secondary text-sm md:text-base mt-1">
            Fuel your body with the right choice for your routine
          </p>
        </Reveal>

        {/* ── Category Selector ── */}
        <Reveal variant="up" delay={0.1} amount={0.15} className="w-full mb-10">
          {loadingCats ? (
            <div className="flex gap-3 px-4 overflow-hidden">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-12 w-40 rounded-2xl bg-gray-100 animate-pulse shrink-0" />
              ))}
            </div>
          ) : (
            <div className="flex items-center gap-3 overflow-x-auto visible-scrollbar px-4 md:justify-center md:flex-wrap">
              {categories.map((cat) => {
                const isActive = activeCatId === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCatId(cat.id)}
                    className={`
                      flex items-center gap-3 px-6 py-1.5 rounded-full border-2
                      font-secondary font-black text-xs uppercase tracking-widest
                      whitespace-nowrap transition-all shrink-0 active:scale-[0.98]
                      ${isActive
                        ? 'bg-[#ede9df] border-zinc-300 text-black'
                        : 'border-gray-300 bg-gray-50 text-gray-400'}
                    `}
                  >
                    <div className={`
                      w-10 h-10 rounded-xl flex items-center justify-center overflow-hidden shrink-0
                      ${isActive ? 'bg-white/20' : 'bg-white shadow-sm'}
                    `}>
                      {cat.image_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={cat.image_url} alt={cat.name} className="w-full h-full object-contain p-1" />
                      ) : (
                        <Package size={18} className={isActive ? 'text-white' : 'text-gray-300'} />
                      )}
                    </div>
                    <span>{cat.name}</span>
                  </button>
                );
              })}
            </div>
          )}
        </Reveal>

        {/* ── Product Count ── */}
        {!loadingProds && (
          <Reveal variant="fade" delay={0.15} className="text-center text-gray-400 font-secondary text-sm mb-8">
            <p>({products.length} product{products.length !== 1 ? 's' : ''})</p>
          </Reveal>
        )}

        {/* ── Product Grid ── */}
        {loadingProds ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="animate-pulse flex flex-col">
                <div className="aspect-[3/4] rounded-2xl bg-gray-100 mb-3" />
                <div className="h-4 bg-gray-100 rounded-lg mb-2 w-3/4" />
                <div className="h-8 bg-gray-100 rounded-full" />
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-2xl bg-[#fff0f5] flex items-center justify-center mb-4">
              <Package size={28} className="text-[#c23d6a]" />
            </div>
            <p className="text-base font-bold text-gray-400 font-secondary">
              No products in this category yet
            </p>
          </div>
        ) : (
          <RevealGroup
            key={activeCatId}
            stagger={0.06}
            amount={0.05}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 items-stretch"
          >
            {products.map((item) => (
              <ProductCard
                key={item.id}
                item={item}
                onAddToCart={handleAddToCart}
              />
            ))}
          </RevealGroup>
        )}

      </div>

      {/* ── Login Required Popup ── */}
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

          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowLoginPopup(false)} />

          <div
            className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 md:p-10 text-center"
            style={{ animation: 'popIn 0.3s cubic-bezier(.22,1,.36,1) forwards' }}
          >
            <button onClick={() => setShowLoginPopup(false)} className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors" aria-label="Close">
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

            <h3 className="text-2xl md:text-3xl font-bold font-primary text-black mb-2">Login Required</h3>
            <p className="text-gray-500 font-secondary text-sm md:text-base mb-7 leading-relaxed">
              Please login to add items to your cart
            </p>

            <div className="flex gap-3 justify-center">
              <button onClick={handleLoginNow} className="flex-1 max-w-[160px] bg-[#c23d6a] text-white font-bold text-sm py-3 rounded-full font-secondary hover:bg-[#a8305a] active:scale-95 transition-all shadow-md">
                Login Now
              </button>
              <button onClick={() => setShowLoginPopup(false)} className="flex-1 max-w-[160px] bg-gray-100 text-gray-700 font-bold text-sm py-3 rounded-full font-secondary hover:bg-gray-200 active:scale-95 transition-all">
                Maybe later
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Category Modal ── */}
      {showCategoryModal && (
        <div
          className="fixed inset-0 z-[999999] flex items-center justify-center p-4"
          style={{ animation: 'fadeIn 0.2s ease forwards' }}
        >
          <style>{`
            @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
            @keyframes popIn  { from { opacity: 0; transform: scale(0.92) translateY(10px); } to { opacity: 1; transform: scale(1) translateY(0); } }
          `}</style>

          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowCategoryModal(false)} />

          <div
            className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-6 md:p-8"
            style={{ animation: 'popIn 0.3s cubic-bezier(.22,1,.36,1) forwards' }}
          >
            <button onClick={() => setShowCategoryModal(false)} className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors" aria-label="Close">
              <X size={20} className="text-gray-400" />
            </button>

            <h3 className="text-xl md:text-2xl font-bold font-primary text-black mb-1">Select a Category</h3>
            <p className="text-gray-500 font-secondary text-sm mb-6">Pick a category to view its products</p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[60vh] overflow-y-auto pr-1">
              {categories.map((cat) => {
                const isActive = activeCatId === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => { handleTabChange(cat.id); setShowCategoryModal(false); }}
                    className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all
                      ${isActive ? 'bg-[#ede9df] border-zinc-400' : 'border-gray-100 bg-gray-50 hover:bg-gray-100'}`}
                  >
                    <div className="w-16 h-16 rounded-xl bg-white shadow-sm flex items-center justify-center overflow-hidden">
                      {cat.image_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={cat.image_url} alt={cat.name} className="w-full h-full object-contain p-1" />
                      ) : (
                        <Package size={24} className="text-gray-300" />
                      )}
                    </div>
                    <span className="text-xs font-black uppercase tracking-wider text-center">{cat.name}</span>
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
