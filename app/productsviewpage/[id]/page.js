'use client'

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useCartStore } from '../../store/useCartStore';
import { useAuth } from '../../context/AuthContext';
import { ChevronDown, AlertCircle, X } from 'lucide-react';

const product = {
  id: 1,
  name: "Gym Hack Rolled Oats",
  subtitle: "Clean Fuel for Everyday Fitness",
  price: 240,
  description:
    "Made from 100% whole grain oats, our Rolled Oats are minimally processed to retain maximum nutrients. Perfect for pre/post workout meals, they provide slow-release energy to fuel your fitness goals.",
  ingredients: "Almond Milk (Water, Almonds), Rolled Oats, Dates, Vanilla Extract, Sea Salt.",
  howToUse: "Add 40g of oats to 200ml of water or milk. Cook on medium heat for 3-5 minutes, stirring occasionally. Add your favourite toppings and enjoy!",
  tags: ["Clean Ingredients", "High in Fiber", "No Added Junk", "Ready in Minutes", "Made for Daily Fitness"],
  images: [
    "/images/oatshoverimg.png",
    "/images/oatsimg.jpg",
    "/images/oatshoverimg.png",
    "/images/oatshoverimg.png",
    "/images/oatshoverimg.png",
  ],
};

const initialReviews = [
  { id: 1, name: "Laxman", rating: 5, title: "Excellent quality!", body: "Ordered for the first time. Very happy with the quality. Will definitely recommend to product.", verified: true, date: "2 days ago" },
  { id: 2, name: "Lohit", rating: 4, title: "Healthy product", body: "Good taste and texture. Easy to cook. The oats are clean and fresh. Good for daily use.", verified: true, date: "1 week ago" },
  { id: 3, name: "Santhosh", rating: 5, title: "Best oats I've tried!", body: "Really good quality oats. No added junk as claimed. Makes a great breakfast with fruits.", verified: false, date: "2 weeks ago" },
];

const tickerItems = [
  { text: "Clean Ingredients", icon: "🌿" },
  { text: "High In Fiber", icon: "💪" },
  { text: "No Added Junk", icon: "🚫" },
  { text: "Ready In Minutes", icon: "⚡" },
  { text: "Made For Daily Fitness", icon: "🥣" },
];

const scrollItems = [...tickerItems, ...tickerItems];

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
      <Star key={i} filled={i <= Math.floor(rating)} half={i === Math.ceil(rating) && rating % 1 >= 0.5} size={size} />
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

// ── Accordion Component ───────────────────────────────────────
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

export default function ProductViewPage() {
  const [selectedImg, setSelectedImg] = useState(0);
  const [showReviewPopup, setShowReviewPopup] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [reviews, setReviews] = useState(initialReviews);
  const [reviewRating, setReviewRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewBody, setReviewBody] = useState("");
  const [reviewName, setReviewName] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const router = useRouter();
  const { user, showToast } = useAuth();
  const addToCartStore = useCartStore((state) => state.addToCart);

  // Lock body scroll when login popup is open
  useEffect(() => {
    document.body.style.overflow = showLoginPopup ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [showLoginPopup]);

  // ✅ Gated Add to Cart — show popup if not logged in
  const handleAddToCart = () => {
    if (!user) {
      setShowLoginPopup(true);
      return;
    }
    addToCartStore({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
    });
    showToast(`${product.name} added to cart 🛒`, 'success', 2000);
  };

  // ✅ Gated Buy Now — show popup if not logged in, else add and go to checkout
  const handleBuyNow = () => {
    if (!user) {
      setShowLoginPopup(true);
      return;
    }
    addToCartStore({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
    });
    showToast('Heading to checkout...', 'info', 1500);
    router.push('/checkout');
  };

  const handleLoginNow = () => {
    setShowLoginPopup(false);
    showToast('Redirecting to login...', 'info', 1500);
    router.push('/login');
  };

  const handleSubmit = () => {
    if (!reviewRating || !reviewTitle || !reviewBody) return;
    setReviews([{
      id: Date.now(),
      name: reviewName || "Anonymous",
      rating: reviewRating,
      title: reviewTitle,
      body: reviewBody,
      verified: false,
      date: "Just now",
    }, ...reviews]);
    setShowReviewPopup(false);
    setReviewRating(0);
    setReviewTitle("");
    setReviewBody("");
    setReviewName("");
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="font-sans bg-[#f8f8f8] min-h-screen">

      {/* ── PRODUCT SECTION ── */}
      <div className="bg-white mb-3 p-4 md:p-24">
        <div className="flex flex-col md:flex-row gap-6">

          {/* IMAGE GALLERY */}
          <div className="w-full md:w-[380px] shrink-0">

            {/* Main Image */}
            <div className="border border-gray-100 rounded-xl overflow-hidden bg-[#f9f9f9] mb-3 mx-auto"
              style={{ width: "100%", maxWidth: 360, aspectRatio: "1/1" }}
            >
              <img
                src={product.images[selectedImg]}
                alt="product"
                className="w-full h-full object-contain"
              />
            </div>

            {/* Thumbnails */}
            <div className="flex gap-2 flex-wrap">
              {product.images.map((img, i) => (
                <div
                  key={i}
                  onClick={() => setSelectedImg(i)}
                  className={`rounded-xl overflow-hidden cursor-pointer border-2 transition-colors shrink-0 ${
                    selectedImg === i ? "border-[#c23d6a]" : "border-gray-200"
                  }`}
                  style={{ width: 72, height: 72 }}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>

          {/* PRODUCT INFO */}
          <div className="flex-1">
            <h1 className="text-xl md:text-2xl font-extrabold text-gray-900 mb-1">{product.name}</h1>
            <p className="text-sm text-[#c23d6a] font-semibold mb-3">{product.subtitle}</p>

            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl md:text-3xl font-extrabold text-gray-900">₹ {product.price}</span>
            </div>

            <p className="text-sm text-gray-500 leading-relaxed mb-5">{product.description}</p>

            {/* BUY NOW + ADD TO CART — both gated on login */}
            <div className="flex gap-3 mb-6">
              <button
                onClick={handleBuyNow}
                className="flex-1 bg-[#c23d6a] text-white rounded-lg py-3 px-5 text-sm font-bold hover:bg-[#a8305a] transition-colors"
              >
                Buy Now
              </button>
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-white text-[#c23d6a] border-2 border-[#c23d6a] rounded-lg py-3 px-5 text-sm font-bold hover:bg-[#fff3f7] transition-colors"
              >
                Add to Cart
              </button>
            </div>

            {/* Accordion */}
            <div className="flex flex-col gap-2">
              <Accordion title="Ingredients">
                Ingredients: {product.ingredients}
              </Accordion>
              <Accordion title="How to Use">
                {product.howToUse}
              </Accordion>
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

        <div className="flex flex-col gap-4">
          {reviews.map(r => (
            <div key={r.id} className="border border-gray-100 rounded-xl p-4">
              <div className="flex items-center gap-2.5 mb-2">
                <div className="w-9 h-9 bg-[#c23d6a] rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0">
                  {r.name[0]}
                </div>
                <div>
                  <div className="font-bold text-sm text-gray-900">{r.name}</div>
                  {r.verified && <div className="text-xs text-green-500 font-semibold">✓ Verified Buyer</div>}
                </div>
                <div className="ml-auto text-xs text-gray-300">{r.date}</div>
              </div>
              <StarRating rating={r.rating} size={14} />
              <div className="font-bold text-sm text-gray-900 mt-1.5 mb-1">{r.title}</div>
              <p className="text-sm text-gray-500 leading-relaxed">{r.body}</p>
            </div>
          ))}
        </div>
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
              className="bg-white rounded-2xl w-full max-w-[480px] p-7 relative"
            >
              <button
                onClick={() => setShowReviewPopup(false)}
                className="absolute top-3.5 right-4 bg-transparent border-none text-xl cursor-pointer text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>

              <div className="text-center mb-4">
                <div className="w-16 h-16 rounded-full inline-flex items-center justify-center overflow-hidden relative">
                  <img src="/images/logoimg.png" alt="Logo" className="absolute w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-[#c23d6a]/60" />
                </div>
              </div>

              <hr className="border-t border-gray-100 mb-4" />

              <div className="flex items-center gap-3 mb-5">
                <img src={product.images[0]} alt="" className="w-14 h-14 rounded-lg object-cover border border-gray-100" />
                <div>
                  <div className="font-bold text-sm text-gray-900">{product.name}</div>
                  <div className="mt-1.5" onMouseLeave={() => setHovered(0)}>
                    <InteractiveStar rating={reviewRating} setRating={setReviewRating} hovered={hovered} setHovered={setHovered} />
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

              <p className="text-xs text-gray-400 text-center mb-4">
                By continuing you agree to Gymhack's{" "}
                <span className="text-[#c23d6a] cursor-pointer">Terms and Conditions</span>{" "}
                and{" "}
                <span className="text-[#c23d6a] cursor-pointer">Privacy Policy</span>.
              </p>

              <button
                onClick={handleSubmit}
                disabled={!reviewRating || !reviewTitle || !reviewBody}
                className={`w-full text-white border-none rounded-xl py-3.5 text-base font-bold transition-colors ${
                  reviewRating && reviewTitle && reviewBody
                    ? "bg-[#c23d6a] cursor-pointer hover:bg-[#a8305a]"
                    : "bg-[#f0a0b8] cursor-not-allowed"
                }`}
              >
                Agree & Submit
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── LOGIN REQUIRED POPUP ── */}
      <AnimatePresence>
        {showLoginPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[999999] flex items-center justify-center p-4"
          >
            <style>{`
              @keyframes pulseRing {
                0%,100% { box-shadow: 0 0 0 0 rgba(194,61,106,0.35); }
                50%     { box-shadow: 0 0 0 14px rgba(194,61,106,0); }
              }
            `}</style>

            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setShowLoginPopup(false)}
            />

            {/* Modal */}
            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 10 }}
              transition={{ type: "spring", damping: 22, stiffness: 280 }}
              className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 md:p-10 text-center"
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
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}