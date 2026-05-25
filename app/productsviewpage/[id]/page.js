'use client'

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, useParams } from "next/navigation";
import { useCartStore } from '../../store/useCartStore';
import { useAuth } from '../../context/AuthContext';
import { ChevronDown, AlertCircle, X } from 'lucide-react';

const API_ROOT = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const tickerItems = [
  { text: "Clean Ingredients", icon: "🌿" },
  { text: "High In Fiber",     icon: "💪" },
  { text: "No Added Junk",     icon: "🚫" },
  { text: "Ready In Minutes",  icon: "⚡" },
  { text: "Made For Daily Fitness", icon: "🥣" },
];
const scrollItems = [...tickerItems, ...tickerItems];

// ── Star components ───────────────────────────────────────────
const Star = ({ filled, half, size = 18, onClick, onHover }) => (
  <svg
    width={size} height={size} viewBox="0 0 24 24"
    onClick={onClick} onMouseEnter={onHover}
    style={{ cursor: onClick ? "pointer" : "default", display: "inline-block" }}
  >
    <defs>
      <linearGradient id={`half-${size}`}>
        <stop offset="50%" stopColor="#c23d6a" />
        <stop offset="50%" stopColor="#e5e7eb" />
      </linearGradient>
    </defs>
    <polygon
      points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"
      fill={filled ? "#c23d6a" : half ? `url(#half-${size})` : "#e5e7eb"}
      stroke={filled || half ? "#c23d6a" : "#d1d5db"}
      strokeWidth="1"
    />
  </svg>
);

const StarRating = ({ rating, size = 18 }) => (
  <span style={{ display: "inline-flex", gap: 2 }}>
    {[1, 2, 3, 4, 5].map(i => (
      <Star key={i}
        filled={i <= Math.floor(rating)}
        half={i === Math.ceil(rating) && rating % 1 >= 0.5}
        size={size}
      />
    ))}
  </span>
);

const InteractiveStar = ({ rating, setRating, hovered, setHovered }) => (
  <span style={{ display: "inline-flex", gap: 4 }}>
    {[1, 2, 3, 4, 5].map(i => (
      <Star key={i} size={32} filled={i <= (hovered || rating)}
        onClick={() => setRating(i)}
        onHover={() => setHovered(i)}
      />
    ))}
  </span>
);

// ── Accordion ─────────────────────────────────────────────────
const Accordion = ({ title, children }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-gray-200">
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between px-4 py-4 bg-[#f5f0e8] rounded-lg mb-1 font-bold text-sm uppercase tracking-widest text-gray-800"
      >
        {title}
        <ChevronDown
          size={18}
          className={`text-[#c23d6a] transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="px-1 pb-4 text-sm text-[#c23d6a] leading-relaxed">
          {children}
        </div>
      )}
    </div>
  );
};

// ── Loading skeleton ──────────────────────────────────────────
function ProductSkeleton() {
  return (
    <div className="bg-white mb-3 p-4 md:p-24 animate-pulse">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-[380px] shrink-0">
          <div className="rounded-xl bg-gray-100 mb-3" style={{ aspectRatio: '1/1' }} />
          <div className="flex gap-2">
            {[1,2,3].map(i => <div key={i} className="w-[72px] h-[72px] rounded-xl bg-gray-100" />)}
          </div>
        </div>
        <div className="flex-1 space-y-4 pt-2">
          <div className="h-7 bg-gray-100 rounded-lg w-2/3" />
          <div className="h-4 bg-gray-100 rounded-lg w-1/3" />
          <div className="h-8 bg-gray-100 rounded-lg w-1/4" />
          <div className="h-20 bg-gray-100 rounded-lg" />
          <div className="flex gap-3">
            <div className="flex-1 h-12 bg-gray-100 rounded-lg" />
            <div className="flex-1 h-12 bg-gray-100 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────
export default function ProductViewPage() {
  const { id } = useParams();

  const [product, setProduct]             = useState(null);
  const [reviews, setReviews]             = useState([]);
  const [loadingProduct, setLoadingProduct] = useState(true);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [notFound, setNotFound]           = useState(false);

  const [selectedImg, setSelectedImg]     = useState(0);
  const [selectedVariantIdx, setSelectedVariantIdx] = useState(0);
  const [showReviewPopup, setShowReviewPopup] = useState(false);
  const [showLoginPopup, setShowLoginPopup]   = useState(false);
  const [reviewRating, setReviewRating]   = useState(0);
  const [hovered, setHovered]             = useState(0);
  const [reviewTitle, setReviewTitle]     = useState("");
  const [reviewBody, setReviewBody]       = useState("");
  const [reviewName, setReviewName]       = useState("");
  const [submitted, setSubmitted]         = useState(false);
  const [submitting, setSubmitting]       = useState(false);
  const [reviewError, setReviewError]     = useState("");

  const router = useRouter();
  const { user, showToast } = useAuth();
  const addToCartStore = useCartStore((state) => state.addToCart);

  // Fetch product
  useEffect(() => {
    if (!id) return;
    setLoadingProduct(true);
    fetch(`${API_ROOT}/api/products/${id}`)
      .then((r) => {
        if (r.status === 404) { setNotFound(true); return null; }
        return r.json();
      })
      .then((data) => { if (data) setProduct(data); })
      .catch(() => setNotFound(true))
      .finally(() => setLoadingProduct(false));
  }, [id]);

  // Fetch reviews
  useEffect(() => {
    if (!id) return;
    setLoadingReviews(true);
    fetch(`${API_ROOT}/api/reviews/${id}`)
      .then((r) => r.json())
      .then((data) => setReviews(Array.isArray(data) ? data : []))
      .catch(() => setReviews([]))
      .finally(() => setLoadingReviews(false));
  }, [id]);

  // Lock scroll when login popup is open
  useEffect(() => {
    document.body.style.overflow = showLoginPopup ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [showLoginPopup]);

  // ── Variants ─────────────────────────────────────────────────
  const variants = Array.isArray(product?.variants) ? product.variants : [];
  const hasVariants = variants.length > 0;
  const activeVariant = hasVariants ? variants[selectedVariantIdx] : null;
  const displayPrice = activeVariant ? Number(activeVariant.price) : Number(product?.price);

  // ── Cart / Buy handlers ──────────────────────────────────────
  const getCartItem = () => ({
    id: product.id,
    name: product.name,
    price: displayPrice,
    variant_label: activeVariant?.label || null,
    image: Array.isArray(product.images) && product.images.length > 0
      ? product.images[0]
      : '/images/oatsimg.jpg',
  });

  const handleAddToCart = () => {
    if (!user) { setShowLoginPopup(true); return; }
    addToCartStore(getCartItem());
    showToast(`${product.name} added to cart 🛒`, 'success', 2000);
  };

  const handleBuyNow = () => {
    if (!user) { setShowLoginPopup(true); return; }
    addToCartStore(getCartItem());
    showToast('Heading to checkout...', 'info', 1500);
    router.push('/checkout');
  };

  const handleLoginNow = () => {
    setShowLoginPopup(false);
    showToast('Redirecting to login...', 'info', 1500);
    router.push('/login');
  };

  // ── Submit review to API ─────────────────────────────────────
  const handleSubmit = async () => {
    if (!reviewRating || !reviewTitle || !reviewBody) return;

    // If not logged in, show login popup
    if (!user) {
      setShowReviewPopup(false);
      setShowLoginPopup(true);
      return;
    }

    setSubmitting(true);
    setReviewError("");
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('adminToken');
      const res = await fetch(`${API_ROOT}/api/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          product_id: Number(id),
          rating: reviewRating,
          title: reviewTitle,
          body: reviewBody,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit');

      // Optimistically add the new review to the top
      setReviews((prev) => [{
        ...data,
        user_name: user.firstName || user.first_name || reviewName || 'You',
        is_verified: false,
      }, ...prev]);

      setShowReviewPopup(false);
      setReviewRating(0); setReviewTitle(""); setReviewBody(""); setReviewName("");
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
    } catch (e) {
      setReviewError(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  // ── Avg rating ───────────────────────────────────────────────
  const avgRating = reviews.length
    ? reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length
    : 0;

  // ── Loading / not found states ───────────────────────────────
  if (loadingProduct) return <div className="font-sans bg-[#f8f8f8] min-h-screen"><ProductSkeleton /></div>;

  if (notFound || !product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#f8f8f8] font-sans">
        <div className="text-6xl mb-4">📦</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Product not found</h2>
        <p className="text-gray-500 mb-6">This product may have been removed or doesn&apos;t exist.</p>
        <button
          onClick={() => router.push('/products')}
          className="bg-[#c23d6a] text-white px-6 py-3 rounded-full font-bold hover:bg-[#a8305a] transition-colors"
        >
          Browse Products
        </button>
      </div>
    );
  }

  const images = Array.isArray(product.images) && product.images.length > 0
    ? product.images
    : ['/images/oatsimg.jpg'];

  return (
    <div className="font-sans bg-[#f8f8f8] min-h-screen">

      {/* ── PRODUCT SECTION ── */}
      <div className="bg-white mb-3 p-4 md:p-24">
        <div className="flex flex-col md:flex-row gap-6">

          {/* IMAGE GALLERY */}
          <div className="w-full md:w-[380px] shrink-0">
            <div
              className="border border-gray-100 rounded-xl overflow-hidden bg-[#f9f9f9] mb-3 mx-auto"
              style={{ width: "100%", maxWidth: 360, aspectRatio: "1/1" }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={images[selectedImg]}
                alt={product.name}
                className="w-full h-full object-contain"
              />
            </div>

            {/* Thumbnails */}
            <div className="flex gap-2 flex-wrap">
              {images.map((img, i) => (
                <div
                  key={i}
                  onClick={() => setSelectedImg(i)}
                  className={`rounded-xl overflow-hidden cursor-pointer border-2 transition-colors shrink-0 ${
                    selectedImg === i ? "border-[#c23d6a]" : "border-gray-200"
                  }`}
                  style={{ width: 72, height: 72 }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>

          {/* PRODUCT INFO */}
          <div className="flex-1">
            <h1 className="text-xl md:text-2xl font-extrabold text-gray-900 mb-1">
              {product.name}
            </h1>
            {product.subtitle && (
              <p className="text-sm text-[#c23d6a] font-semibold mb-3">{product.subtitle}</p>
            )}

            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl md:text-3xl font-extrabold text-gray-900">
                ₹ {displayPrice}
              </span>
              {reviews.length > 0 && (
                <span className="flex items-center gap-1.5">
                  <StarRating rating={avgRating} size={14} />
                  <span className="text-xs text-gray-400 font-semibold">
                    ({reviews.length})
                  </span>
                </span>
              )}
            </div>

            {/* Weight / Size Variants */}
            {hasVariants && (
              <div className="mb-5">
                <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2">
                  Select Weight
                </p>
                <div className="flex flex-wrap gap-2">
                  {variants.map((v, i) => {
                    const active = i === selectedVariantIdx;
                    return (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setSelectedVariantIdx(i)}
                        className={`px-4 py-2 rounded-full text-sm font-bold border-2 transition-all ${
                          active
                            ? 'bg-[#c23d6a] border-[#c23d6a] text-white shadow-md shadow-[#c23d6a]/25'
                            : 'bg-white border-gray-200 text-gray-700 hover:border-[#c23d6a] hover:text-[#c23d6a]'
                        }`}
                      >
                        {v.label}
                        <span className={`ml-1.5 text-xs font-black ${active ? 'text-white/80' : 'text-gray-400'}`}>
                          ₹{v.price}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {product.description && (
              <p className="text-sm text-gray-500 leading-relaxed mb-5">
                {product.description}
              </p>
            )}

            {/* Stock badge */}
            {product.stock_quantity !== null && product.stock_quantity !== undefined && (
              <div className="mb-5">
                {product.stock_quantity > 0 ? (
                  <span className="text-xs font-bold text-green-600 bg-green-50 border border-green-200 px-3 py-1 rounded-full">
                    In Stock ({product.stock_quantity} left)
                  </span>
                ) : (
                  <span className="text-xs font-bold text-red-500 bg-red-50 border border-red-200 px-3 py-1 rounded-full">
                    Out of Stock
                  </span>
                )}
              </div>
            )}

            {/* Buy Now + Add to Cart */}
            <div className="flex gap-3 mb-6">
              <button
                onClick={handleBuyNow}
                disabled={product.stock_quantity === 0}
                className="flex-1 bg-[#c23d6a] text-white rounded-lg py-3 px-5 text-sm font-bold hover:bg-[#a8305a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Buy Now
              </button>
              <button
                onClick={handleAddToCart}
                disabled={product.stock_quantity === 0}
                className="flex-1 bg-white text-[#c23d6a] border-2 border-[#c23d6a] rounded-lg py-3 px-5 text-sm font-bold hover:bg-[#fff3f7] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add to Cart
              </button>
            </div>

            {/* Accordions */}
            <div className="flex flex-col gap-2">
              {product.ingredients && (
                <Accordion title="Ingredients">
                  {product.ingredients}
                </Accordion>
              )}
              {product.how_to_use && (
                <Accordion title="How to Use">
                  {product.how_to_use}
                </Accordion>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── TAGS TICKER ── */}
      <div className="w-full bg-[#414b56] py-3 overflow-hidden whitespace-nowrap border-y border-white/5 mb-3">
        <div className="flex w-max animate-marquee-infinite">
          {scrollItems.map((item, index) => (
            <div key={index} className="flex items-center">
              <div className="flex items-center gap-3 px-8 md:px-12">
                <span className="text-base md:text-lg">{item.icon}</span>
                <span className="text-white text-xs md:text-sm tracking-[0.2em] font-primary">
                  {item.text}
                </span>
              </div>
              <div className="w-1.5 h-1.5 bg-[#c23d6a] rounded-full mx-2" />
            </div>
          ))}
        </div>
      </div>

      {/* ── REVIEWS SECTION ── */}
      <div className="bg-white px-5 py-6 mb-3">
        <div className="text-center mb-5">
          <span className="inline-block w-2.5 h-2.5 bg-[#c23d6a] rounded-full mr-1.5" />
          <span className="text-xl font-extrabold text-gray-900">Customer Reviews</span>
          <p className="text-sm text-gray-400 mt-1">Fuel your body with the right choice for your routine.</p>
          {reviews.length > 0 && (
            <div className="flex items-center justify-center gap-2 mt-2">
              <StarRating rating={avgRating} size={16} />
              <span className="text-sm font-bold text-gray-700">
                {avgRating.toFixed(1)} out of 5
              </span>
              <span className="text-xs text-gray-400">({reviews.length} reviews)</span>
            </div>
          )}
        </div>

        <div className="text-center mb-6">
          {submitted && (
            <div className="bg-green-50 text-green-500 text-sm px-4 py-2 rounded-lg mb-3 font-semibold">
              ✓ Review submitted successfully!
            </div>
          )}
          <button
            onClick={() => setShowReviewPopup(true)}
            className="bg-white border-2 border-[#c23d6a] text-[#c23d6a] rounded-full px-8 py-2.5 text-sm font-bold hover:bg-[#fff3f7] transition-colors"
          >
            Write a Review
          </button>
        </div>

        {/* Review list */}
        {loadingReviews ? (
          <div className="flex flex-col gap-4">
            {[1, 2].map(i => (
              <div key={i} className="border border-gray-100 rounded-xl p-4 animate-pulse">
                <div className="flex gap-2.5 mb-3">
                  <div className="w-9 h-9 rounded-full bg-gray-100 shrink-0" />
                  <div className="flex-1 space-y-1.5">
                    <div className="h-3.5 bg-gray-100 rounded w-1/4" />
                    <div className="h-3 bg-gray-100 rounded w-1/5" />
                  </div>
                </div>
                <div className="h-3 bg-gray-100 rounded w-1/3 mb-2" />
                <div className="h-12 bg-gray-100 rounded" />
              </div>
            ))}
          </div>
        ) : reviews.length === 0 ? (
          <p className="text-center text-gray-400 text-sm py-8 font-secondary">
            No reviews yet — be the first to review this product!
          </p>
        ) : (
          <div className="flex flex-col gap-4">
            {reviews.map(r => (
              <div key={r.id} className="border border-gray-100 rounded-xl p-4">
                <div className="flex items-center gap-2.5 mb-2">
                  <div className="w-9 h-9 bg-[#c23d6a] rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0">
                    {(r.user_name || 'A')[0].toUpperCase()}
                  </div>
                  <div>
                    <div className="font-bold text-sm text-gray-900">{r.user_name || 'Anonymous'}</div>
                    {r.is_verified && (
                      <div className="text-xs text-green-500 font-semibold">✓ Verified Buyer</div>
                    )}
                  </div>
                  <div className="ml-auto text-xs text-gray-300">
                    {r.created_at
                      ? new Date(r.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
                      : ''}
                  </div>
                </div>
                <StarRating rating={r.rating} size={14} />
                <div className="font-bold text-sm text-gray-900 mt-1.5 mb-1">{r.title}</div>
                <p className="text-sm text-gray-500 leading-relaxed">{r.body}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── REVIEW POPUP ── */}
      <AnimatePresence>
        {showReviewPopup && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-5"
            onClick={(e) => e.target === e.currentTarget && setShowReviewPopup(false)}
          >
            <motion.div
              initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 60, opacity: 0 }}
              transition={{ type: "spring", damping: 20 }}
              className="bg-white rounded-2xl w-full max-w-[480px] p-7 relative max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setShowReviewPopup(false)}
                className="absolute top-3.5 right-4 bg-transparent border-none text-xl cursor-pointer text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>

              <div className="text-center mb-4">
                <div className="w-16 h-16 rounded-full inline-flex items-center justify-center overflow-hidden relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/images/logoimg.png" alt="Logo" className="absolute w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-[#c23d6a]/60" />
                </div>
              </div>

              <hr className="border-t border-gray-100 mb-4" />

              <div className="flex items-center gap-3 mb-5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={images[0]}
                  alt=""
                  className="w-14 h-14 rounded-lg object-cover border border-gray-100"
                />
                <div>
                  <div className="font-bold text-sm text-gray-900">{product.name}</div>
                  <div className="mt-1.5" onMouseLeave={() => setHovered(0)}>
                    <InteractiveStar
                      rating={reviewRating} setRating={setReviewRating}
                      hovered={hovered} setHovered={setHovered}
                    />
                  </div>
                </div>
              </div>

              <input
                value={reviewName}
                onChange={e => setReviewName(e.target.value)}
                placeholder="Your Name (optional)"
                className="w-full border border-gray-100 rounded-lg px-3.5 py-3 text-sm mb-3 outline-none focus:border-[#c23d6a] transition-colors"
              />
              <input
                value={reviewTitle}
                onChange={e => setReviewTitle(e.target.value)}
                placeholder="Review Title"
                className="w-full border border-gray-100 rounded-lg px-3.5 py-3 text-sm mb-3 outline-none focus:border-[#c23d6a] transition-colors"
              />
              <textarea
                value={reviewBody}
                onChange={e => setReviewBody(e.target.value)}
                placeholder="Review Description"
                rows={4}
                className="w-full border border-gray-100 rounded-lg px-3.5 py-3 text-sm mb-4 outline-none resize-none focus:border-[#c23d6a] transition-colors"
              />

              {reviewError && (
                <p className="text-xs text-red-500 font-semibold mb-3">{reviewError}</p>
              )}

              <p className="text-xs text-gray-400 text-center mb-4">
                By continuing you agree to Gymhack&apos;s{" "}
                <span className="text-[#c23d6a] cursor-pointer">Terms and Conditions</span>{" "}
                and{" "}
                <span className="text-[#c23d6a] cursor-pointer">Privacy Policy</span>.
              </p>

              <button
                onClick={handleSubmit}
                disabled={!reviewRating || !reviewTitle || !reviewBody || submitting}
                className={`w-full text-white border-none rounded-xl py-3.5 text-base font-bold transition-colors ${
                  reviewRating && reviewTitle && reviewBody && !submitting
                    ? "bg-[#c23d6a] cursor-pointer hover:bg-[#a8305a]"
                    : "bg-[#f0a0b8] cursor-not-allowed"
                }`}
              >
                {submitting ? 'Submitting…' : 'Agree & Submit'}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── LOGIN REQUIRED POPUP ── */}
      <AnimatePresence>
        {showLoginPopup && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[999999] flex items-center justify-center p-4"
          >
            <style>{`
              @keyframes pulseRing {
                0%,100% { box-shadow: 0 0 0 0 rgba(194,61,106,0.35); }
                50%     { box-shadow: 0 0 0 14px rgba(194,61,106,0); }
              }
            `}</style>

            <div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setShowLoginPopup(false)}
            />

            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 10 }}
              transition={{ type: "spring", damping: 22, stiffness: 280 }}
              className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 md:p-10 text-center"
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
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
