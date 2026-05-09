'use client'

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const product = {
  id: 1,
  name: "Gym Hack Rolled Oats",
  subtitle: "Clean Fuel for Everyday Fitness",
  price: 240,
  description:
    "Made from 100% whole grain oats, our Rolled Oats are minimally processed to retain maximum nutrients. Perfect for pre/post workout meals, they provide slow-release energy to fuel your fitness goals.",
  ingredients: "Whole Grain Rolled Oats (100%)",
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
  { id: 1, name: "Laxman", rating: 5, title: "Excellent quality!", body: "Ordered for the first time. Very happy with the quality. Will definitely recommend to product.", verified: true, date: "2 days ago", helpful: 4 },
  { id: 2, name: "Lohit", rating: 4, title: "Healthy product", body: "Good taste and texture. Easy to cook. The oats are clean and fresh. Good for daily use.", verified: true, date: "1 week ago", helpful: 2 },
  { id: 3, name: "Santhosh", rating: 5, title: "Best oats I've tried!", body: "Really good quality oats. No added junk as claimed. Makes a great breakfast with fruits.", verified: false, date: "2 weeks ago", helpful: 7 },
];

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
    {[1,2,3,4,5].map(i => (
      <Star key={i} filled={i <= Math.floor(rating)} half={i === Math.ceil(rating) && rating % 1 >= 0.5} size={size} />
    ))}
  </span>
);

const InteractiveStar = ({ rating, setRating, hovered, setHovered }) => (
  <span style={{ display: "inline-flex", gap: 4 }}>
    {[1,2,3,4,5].map(i => (
      <Star key={i} size={32} filled={i <= (hovered || rating)}
        onClick={() => setRating(i)}
        onHover={() => setHovered(i)}
      />
    ))}
  </span>
);

const ratingDist = { 5: 68, 4: 32, 3: 16, 2: 8, 1: 4 };

export default function ProductViewPage() {
  const [selectedImg, setSelectedImg] = useState(0);
  const [showReviewPopup, setShowReviewPopup] = useState(false);
  const [reviews, setReviews] = useState(initialReviews);
  const [reviewRating, setReviewRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewBody, setReviewBody] = useState("");
  const [reviewName, setReviewName] = useState("");
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState("description");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!reviewRating || !reviewTitle || !reviewBody) return;
    setReviews([{ id: Date.now(), name: reviewName || "Anonymous", rating: reviewRating, title: reviewTitle, body: reviewBody, verified: false, date: "Just now", helpful: 0 }, ...reviews]);
    setShowReviewPopup(false);
    setReviewRating(0); setReviewTitle(""); setReviewBody(""); setReviewName("");
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  const total = reviews.length;
  const avg = (reviews.reduce((a, r) => a + r.rating, 0) / total).toFixed(1);


  const items = [
  { text: "Clean Ingredients", icon: "🌿" },
  { text: "High In Fiber", icon: "💪" },
  { text: "No Added Junk", icon: "🚫" },
  { text: "Ready In Minutes", icon: "⚡" },
  { text: "Made For Daily Fitness", icon: "🥣" },
];

  const scrollItems = [...items, ...items];
  return (
    <div style={{ fontFamily: "'Segoe UI', sans-serif", background: "#f8f8f8", minHeight: "100vh" }}>


      {/* PRODUCT SECTION */}
      <div style={{ background: "#fff", margin: "0 0 12px", padding: "20px" }}>
        <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>

          {/* IMAGE GALLERY */}
          <div style={{ flex: "1 1 280px" }}>
            <div style={{ border: "1px solid #eee", borderRadius: 12, overflow: "hidden", aspectRatio: "1/1", background: "#f9f9f9", position: "relative", marginBottom: 10 }}>
              <img src={product.images[selectedImg]} alt="product" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
              {/* <span style={{ position: "absolute", top: 10, left: 10, background: "#c23d6a", color: "#fff", fontSize: 11, fontWeight: 700, padding: "3px 8px", borderRadius: 4 }}>{product.discount}</span> */}
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              {product.images.map((img, i) => (
                <div key={i} onClick={() => setSelectedImg(i)} style={{ width: 56, height: 56, border: `2px solid ${selectedImg === i ? "#c23d6a" : "#eee"}`, borderRadius: 8, overflow: "hidden", cursor: "pointer" }}>
                  <img src={img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
              ))}
            </div>
          </div>

          {/* PRODUCT INFO */}
          <div style={{ flex: "1 1 280px" }}>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: "#222", margin: "0 0 4px" }}>{product.name}</h1>
            <p style={{ fontSize: 13, color: "#c23d6a", fontWeight: 600, margin: "0 0 10px" }}>{product.subtitle}</p>

            {/* <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <StarRating rating={product.rating} />
              <span style={{ fontSize: 13, color: "#555" }}>{product.rating} ({product.totalReviews} reviews)</span>
            </div> */}

            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <span style={{ fontSize: 28, fontWeight: 800, color: "#222" }}>₹ {product.price}</span>
              {/* <span style={{ fontSize: 16, color: "#999", textDecoration: "line-through" }}>₹ {product.mrp}</span> */}
              <span style={{ background: "#fff3f7", color: "#c23d6a", fontSize: 12, fontWeight: 700, padding: "2px 8px", borderRadius: 4 }}>{product.discount}</span>
            </div>

            <p style={{ fontSize: 13, color: "#555", lineHeight: 1.6, marginBottom: 16 }}>{product.description}</p>

            {/* QTY + ADD TO CART */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
              {/* <div style={{ display: "flex", alignItems: "center", border: "1px solid #eee", borderRadius: 8, overflow: "hidden" }}>
                <button onClick={() => setQty(q => Math.max(1, q - 1))} style={{ width: 36, height: 36, border: "none", background: "#f5f5f5", fontSize: 18, cursor: "pointer" }}>−</button>
                <span style={{ width: 36, textAlign: "center", fontWeight: 700 }}>{qty}</span>
                <button onClick={() => setQty(q => q + 1)} style={{ width: 36, height: 36, border: "none", background: "#f5f5f5", fontSize: 18, cursor: "pointer" }}>+</button>
              </div> */}
              <button style={{ flex: 1, background: "#c23d6a", color: "#fff", border: "none", borderRadius: 8, padding: "12px 20px", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>Buy Now</button>
              <button style={{ flex: 1, background: "#fff", color: "#c23d6a", border: "2px solid #c23d6a", borderRadius: 8, padding: "12px 20px", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>Add to Cart</button>
            </div> 

            {/* TABS */}
            <div style={{ borderBottom: "2px solid #eee", display: "flex", gap: 0, marginBottom: 14 }}>
              {["ingredients", "How to use"].map(t => (
                <button key={t} onClick={() => setTab(t)} style={{ background: "none", border: "none", borderBottom: tab === t ? "2px solid #c23d6a" : "2px solid transparent", marginBottom: -2, padding: "8px 14px", fontSize: 12, fontWeight: 700, color: tab === t ? "#c23d6a" : "#999", cursor: "pointer", textTransform: "capitalize" }}>{t}</button>
              ))}
            </div>
            <div style={{ fontSize: 13, color: "#555", lineHeight: 1.6 }}>
              {tab === "ingredients" && <p><strong>Ingredients:</strong> {product.ingredients}</p>}
              {tab === "How to Use" && <p>How to use details will be updated</p>}

            </div>
          </div>
        </div>
      </div>

      {/* TAGS TICKER */}
      <div className="w-full bg-[#414b56] py-3 overflow-hidden whitespace-nowrap border-y border-white/5">
      <div className="flex w-max animate-marquee-infinite">
        {scrollItems.map((item, index) => (
          <div key={index} className="flex items-center">
            <div className="flex items-center gap-3 px-8 md:px-12">
              <span className="text-base md:text-lg">{item.icon}</span>
              <span className="text-white text-xs md:text-sm tracking-[0.2em] font-primary">
                {item.text}
              </span>
            </div>
            {/* The distinctive pink separator dot */}
            <div className="w-1.5 h-1.5 bg-[#c23d6a] rounded-full mx-2" />
          </div>
        ))}
      </div>
    </div>

      {/* REVIEWS SECTION */}
      <div style={{ background: "#fff", padding: "24px 20px", margin: "0 0 12px" }}>
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <div style={{ width: 10, height: 10, background: "#c23d6a", borderRadius: "50%", display: "inline-block", marginRight: 6 }}></div>
          <span style={{ fontSize: 20, fontWeight: 800, color: "#222" }}>Customer Reviews</span>
          <p style={{ fontSize: 13, color: "#999", marginTop: 4 }}>Fuel your body with the right choice for your routine.</p>
        </div>

  

        {/* WRITE REVIEW BUTTON */}
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          {submitted && <div style={{ background: "#f0fff4", color: "#22c55e", fontSize: 13, padding: "8px 16px", borderRadius: 8, marginBottom: 12, fontWeight: 600 }}>✓ Review submitted successfully!</div>}
          <button onClick={() => setShowReviewPopup(true)} style={{ background: "#fff", border: "2px solid #c23d6a", color: "#c23d6a", borderRadius: 24, padding: "10px 32px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>Write a Review</button>
        </div>

        {/* REVIEW CARDS */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {reviews.map(r => (
            <div key={r.id} style={{ border: "1px solid #f0f0f0", borderRadius: 12, padding: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <div style={{ width: 36, height: 36, background: "#c23d6a", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 14, flexShrink: 0 }}>
                  {r.name[0]}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 13, color: "#222" }}>{r.name}</div>
                  {r.verified && <div style={{ fontSize: 11, color: "#22c55e", fontStyle: "bold" }}>✓ Verified Buyer</div>}
                </div>
                <div style={{ marginLeft: "auto", fontSize: 11, color: "#bbb" }}>{r.date}</div>
              </div>
              <StarRating rating={r.rating} size={14} color="yellow"/>
              <div style={{ fontWeight: 700, fontSize: 14, color: "#222", marginTop: 6, marginBottom: 4 }}>{r.title}</div>
              <p style={{ fontSize: 13, color: "#555", lineHeight: 1.6, margin: 0 }}>{r.body}</p>
              <div style={{ marginTop: 10, fontSize: 12, color: "#999" }}>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* REVIEW POPUP */}
      <AnimatePresence>
        {showReviewPopup && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}
            onClick={(e) => e.target === e.currentTarget && setShowReviewPopup(false)}
          >
            <motion.div
              initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 60, opacity: 0 }}
              transition={{ type: "spring", damping: 20 }}
              style={{ background: "#fff", borderRadius: 20, width: "100%", maxWidth: 480, padding: 28, position: "relative" }}
            >
              {/* CLOSE */}
              <button onClick={() => setShowReviewPopup(false)} style={{ position: "absolute", top: 14, right: 16, background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "#999" }}>✕</button>

              {/* LOGO */}
              <div style={{ textAlign: "center", marginBottom: 16 }}>
                <div style={{ 
  width: 64, 
  height: 64, 
  position: "relative", 
  borderRadius: "50%", 
  display: "inline-flex", 
  alignItems: "center", 
  justifyContent: "center",
  overflow: "hidden" 
}}>
  {/* The Image */}
  <img 
    src="/images/logoimg.png" 
    alt="Badge"
    style={{ position: "absolute", width: "100%", height: "100%", objectCover: "cover" }} 
  />
  
  {/* Dark Overlay to make white text pop */}
  <div style={{ position: "absolute", inset: 0, background: "rgba(194, 61, 106, 0.6)" }} />

 
</div>
              </div>

              <hr style={{ border: "none", borderTop: "1px solid #eee", marginBottom: 16 }} />

              {/* PRODUCT ROW */}
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                <img src={product.images[0]} alt="" style={{ width: 56, height: 56, borderRadius: 8, objectFit: "cover", border: "1px solid #eee" }} />
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: "#222" }}>{product.name}</div>
                  <div style={{ marginTop: 6 }} onMouseLeave={() => setHovered(0)}>
                    <InteractiveStar rating={reviewRating} setRating={setReviewRating} hovered={hovered} setHovered={setHovered} />
                  </div>
                </div>
              </div>

              {/* NAME */}
              <input
                value={reviewName}
                onChange={e => setReviewName(e.target.value)}
                placeholder="Your Name (optional)"
                style={{ width: "100%", border: "1px solid #eee", borderRadius: 8, padding: "12px 14px", fontSize: 13, marginBottom: 12, boxSizing: "border-box", outline: "none" }}
              />

              {/* TITLE */}
              <input
                value={reviewTitle}
                onChange={e => setReviewTitle(e.target.value)}
                placeholder="Review Title"
                style={{ width: "100%", border: "1px solid #eee", borderRadius: 8, padding: "12px 14px", fontSize: 13, marginBottom: 12, boxSizing: "border-box", outline: "none" }}
              />

              {/* BODY */}
              <textarea
                value={reviewBody}
                onChange={e => setReviewBody(e.target.value)}
                placeholder="Review Description"
                rows={4}
                style={{ width: "100%", border: "1px solid #eee", borderRadius: 8, padding: "12px 14px", fontSize: 13, marginBottom: 16, boxSizing: "border-box", resize: "none", outline: "none" }}
              />

              <p style={{ fontSize: 11, color: "#999", textAlign: "center", marginBottom: 16 }}>
                By continuing you agree to Gymhack's <span style={{ color: "#c23d6a", cursor: "pointer" }}>Terms and Conditions</span> and <span style={{ color: "#c23d6a", cursor: "pointer" }}>Privacy Policy</span>.
              </p>

              <button
                onClick={handleSubmit}
                disabled={!reviewRating || !reviewTitle || !reviewBody}
                style={{ width: "100%", background: reviewRating && reviewTitle && reviewBody ? "#c23d6a" : "#f0a0b8", color: "#fff", border: "none", borderRadius: 12, padding: "14px", fontSize: 15, fontWeight: 700, cursor: reviewRating && reviewTitle && reviewBody ? "pointer" : "not-allowed" }}
              >
                Agree & Submit
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}