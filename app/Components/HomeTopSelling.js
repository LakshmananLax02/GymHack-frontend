'use client';
import React, { useState, useEffect } from 'react';
import { ShoppingCart, AlertCircle, X, Star } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCartStore } from '../store/useCartStore';
import { useAuth } from '../context/AuthContext';
import { Reveal, RevealGroup } from './scroll/Reveal';

const API_ROOT = process.env.NEXT_PUBLIC_API_URL;

// Individual product card — animation handled by parent RevealGroup
function ProductCard({ product, onAddToCart }) {
  const imgSrc =
    Array.isArray(product.images) && product.images.length > 0
      ? product.images[0]
      : '/images/oatsimg.jpg';

  const displayPrice =
    Array.isArray(product.variants) && product.variants.length > 0
      ? `₹${product.variants[0].price}`
      : `₹${product.price}`;

  return (
    <RevealGroup.Item variant="up" duration={0.6} className="flex flex-col items-center text-center">
      {/* Image */}
      <Link href={`/productsviewpage/${product.id}`} className="w-full">
        <div className="w-full aspect-[4/5] rounded-2xl overflow-hidden bg-[#f5f0eb] mb-4 cursor-pointer relative group/img">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imgSrc}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-[700ms] ease-out group-hover/img:scale-105"
          />
        </div>
      </Link>

      {/* Name */}
      <p className="font-secondary text-[14px] font-semibold text-gray-800 leading-snug mb-1 px-1">
        {product.name}
      </p>

      {/* Variant labels */}
      {Array.isArray(product.variants) && product.variants.length > 1 && (
        <p className="text-[11px] text-gray-400 mb-1">
          {product.variants.map((v) => v.label).join(' / ')}
        </p>
      )}

      {/* Price */}
      <p className="font-secondary text-[15px] font-bold text-gray-700 mb-3">
        {displayPrice}
      </p>

      {/* Add to Cart */}
      <button
        onClick={() => onAddToCart(product)}
        className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-full font-bold text-xs shadow-md bg-[#c23d6a] text-white hover:bg-[#f2eadf] hover:text-black border border-transparent hover:border-black transition-all duration-300 font-secondary w-full max-w-[280px]"
      >
        Add to Cart <ShoppingCart size={14} />
      </button>
    </RevealGroup.Item>
  );
}

export default function OurTopSelling() {
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [showLoginPopup, setShowLoginPopup] = useState(false);

  const router = useRouter();
  const { user, showToast } = useAuth();
  const addToCartStore = useCartStore((state) => state.addToCart);

  useEffect(() => {
    fetch(`${API_ROOT}/api/products?is_highlighted=true`)
      .then((r) => r.json())
      .then((data) => setProducts(Array.isArray(data) ? data : []))
      .catch(() => setProducts([]))
      .finally(() => setLoadingProducts(false));
  }, []);

  useEffect(() => {
    document.body.style.overflow = showLoginPopup ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [showLoginPopup]);

  const handleAddToCart = (product) => {
    if (!user) { setShowLoginPopup(true); return; }
    const image =
      Array.isArray(product.images) && product.images.length > 0
        ? product.images[0]
        : '/images/oatsimg.jpg';
    const variants = Array.isArray(product.variants) ? product.variants : [];
    const firstVariant = variants[0] || null;
    addToCartStore({
      id: product.id,
      name: product.name,
      price: firstVariant ? Number(firstVariant.price) : Number(product.price),
      variant_label: firstVariant?.label || null,
      image,
    });
    showToast(`${product.name} added to cart 🛒`, 'success', 2000);
  };

  const handleLoginNow = () => {
    setShowLoginPopup(false);
    showToast('Redirecting to login...', 'info', 1500);
    router.push('/login');
  };

  // ── Loading skeletons ──────────────────────────────────────────────
  if (loadingProducts) {
    return (
      <section className="py-10 bg-white overflow-hidden">
        <div className="max-w-[1200px] mx-auto px-7">
          <div className="flex flex-row items-center justify-center gap-3 mb-12 w-full px-4">
            <div className="w-4 h-4 md:w-5 md:h-5 bg-[#c23d6a] rounded-full shrink-0" />
            <h2 className="text-3xl md:text-4xl font-primary font-bold text-black text-center leading-tight">
              Our top selling products
            </h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="animate-pulse flex flex-col items-center">
                <div className="bg-gray-100 rounded-2xl aspect-[4/5] w-full mb-4" />
                <div className="h-4 bg-gray-100 rounded-lg mb-2 w-3/4" />
                <div className="h-4 bg-gray-100 rounded-lg mb-3 w-1/3" />
                <div className="h-9 bg-gray-100 rounded-full w-[140px]" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // ── Empty state ────────────────────────────────────────────────────
  if (products.length === 0) {
    return (
      <section className="py-10 bg-white overflow-hidden">
        <div className="max-w-[1200px] mx-auto px-7 flex flex-col items-center py-12">
          <div className="w-16 h-16 rounded-2xl bg-[#fff0f5] flex items-center justify-center mb-4">
            <Star size={28} className="text-[#c23d6a]" />
          </div>
          <h2 className="text-2xl font-primary font-bold text-black text-center mb-2">
            Our top selling products
          </h2>
          <p className="text-sm text-gray-400 font-secondary">Highlights coming soon — check back later!</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-10 bg-white overflow-hidden">
      <div className="max-w-[1200px] mx-auto px-7">

        {/* Header */}
        <Reveal variant="up" amount={0.3} className="flex flex-row items-center justify-center gap-3 mb-12 w-full px-4">
          <div className="w-4 h-4 md:w-5 md:h-5 bg-[#c23d6a] rounded-full shrink-0" />
          <h2 className="text-3xl md:text-4xl font-primary font-bold text-black text-center leading-tight">
            Our top selling products
          </h2>
        </Reveal>

        {/* Grid — 2 cols mobile, 4 cols desktop, staggered reveal */}
        <RevealGroup stagger={0.1} delay={0.1} amount={0.1} className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={handleAddToCart}
            />
          ))}
        </RevealGroup>

        {/* Shop All button */}
        <Reveal variant="scale" delay={0.15} className="hidden md:flex justify-center mt-12">
          <Link href="/products">
            <button className="flex items-center gap-2 px-6 py-3 rounded-full font-bold text-xs shadow-lg bg-[#c23d6a] text-white hover:bg-[#f2eadf] hover:text-black border border-transparent hover:border-black transition-all duration-300 font-secondary">
              Shop all <ShoppingCart className="w-4 h-4" />
            </button>
          </Link>
        </Reveal>
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

            <h3 className="text-2xl md:text-3xl font-bold font-primary text-black mb-2">Login Required</h3>
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
    </section>
  );
}
