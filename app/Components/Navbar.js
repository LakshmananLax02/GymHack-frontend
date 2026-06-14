'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import {
  Search, ChevronDown, ShoppingCart, User, Menu, X, LogIn,
  ArrowUpRight, Home, Store, AlignJustify, Minus, Plus,
  ShoppingBag, LogOut, CheckCircle, Info, AlertCircle,
  Package, Phone, MapPin, UserCircle2, Send,
} from 'lucide-react';
import { useCartStore } from '../store/useCartStore';
import { useAuth } from '../context/AuthContext';

const API_ROOT = process.env.NEXT_PUBLIC_API_URL;

const TICKER_ITEMS = [
  'Free Shipping on orders over ₹500',
  'Discipline builds results',
  'Fuel your body the right way',
];

// ─── Social Icons (inline SVG) ────────────────────────────────────────────────
const FacebookIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.128 22 16.991 22 12z" />
  </svg>
);
const InstagramIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);
const YoutubeIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);
const LinkedinIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.063 2.063 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const SOCIAL_LINKS = [
  { name: 'Facebook',  Icon: FacebookIcon,  href: 'https://www.facebook.com/',  color: '#1877F2' },
  { name: 'Instagram', Icon: InstagramIcon, href: 'https://www.instagram.com/', color: '#E4405F' },
  { name: 'YouTube',   Icon: YoutubeIcon,   href: 'https://www.youtube.com/',   color: '#FF0000' },
  { name: 'LinkedIn',  Icon: LinkedinIcon,  href: 'https://www.linkedin.com/',  color: '#0A66C2' },
];

// ─── Toast ────────────────────────────────────────────────────────────────────
const TOAST_STYLES = {
  success: { bg: '#1a1a1a', border: '#c23d6a', Icon: CheckCircle, iconColor: '#c23d6a' },
  info:    { bg: '#1a1a1a', border: '#6b7280', Icon: Info,        iconColor: '#9ca3af' },
  error:   { bg: '#1a1a1a', border: '#ef4444', Icon: AlertCircle, iconColor: '#ef4444' },
};

function Toast({ toast }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (toast) {
      const raf = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(raf);
    } else {
      setVisible(false);
    }
  }, [toast]);

  if (!toast) return null;
  const { bg, border, Icon, iconColor } = TOAST_STYLES[toast.type] ?? TOAST_STYLES.success;

  return (
    <div
      style={{
        position: 'fixed', top: '88px', left: '50%',
        transform: visible ? 'translate(-50%, 0)' : 'translate(-50%, -16px)',
        opacity: visible ? 1 : 0,
        transition: 'transform 0.35s cubic-bezier(.22,1,.36,1), opacity 0.3s ease',
        zIndex: 9999999, background: bg, border: `1.5px solid ${border}`,
        borderRadius: '14px', padding: '12px 20px', display: 'flex',
        alignItems: 'center', gap: '10px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.28)',
        minWidth: '260px', maxWidth: '90vw', pointerEvents: 'none',
      }}
    >
      <Icon size={18} color={iconColor} strokeWidth={2.5} style={{ flexShrink: 0 }} />
      <span style={{ color: '#f9fafb', fontSize: '13px', fontWeight: 600, lineHeight: 1.4 }}>
        {toast.message}
      </span>
    </div>
  );
}

// ─── Navbar ───────────────────────────────────────────────────────────────────
export default function Navbar() {
  const pathname = usePathname();
  const router   = useRouter();

  const { user, logout, toast, setToast, showToast } = useAuth();

  const [isSidebarOpen,     setIsSidebarOpen]     = useState(false);
  const [isShopOpen,        setIsShopOpen]        = useState(false);
  const [isMoreOpen,        setIsMoreOpen]        = useState(false);
  // const [isCartOpen,        setIsCartOpen]        = useState(false);
  const isCartOpen  = useCartStore(s => s.isOpen);
const openCart    = useCartStore(s => s.openCart);
const closeCart   = useCartStore(s => s.closeCart);
  const [isAddProductsOpen, setIsAddProductsOpen] = useState(false);
  const [isSearchOpen,      setIsSearchOpen]      = useState(false);
  const [isBulkOpen,        setIsBulkOpen]        = useState(false);

  // ✅ Login Required popup — message changes based on what was clicked
  const [loginPopup, setLoginPopup] = useState({ open: false, message: '' });

  const [searchQuery,    setSearchQuery]    = useState('');
  const [activeCategory, setActiveCategory] = useState(null); // category ID
  const [mounted,        setMounted]        = useState(false);
  const [localToast,     setLocalToast]     = useState(null);

  // Live data from API
  const [apiCategories, setApiCategories] = useState([]);
  const [apiProducts,   setApiProducts]   = useState([]);
  const [modalProducts, setModalProducts] = useState([]);
  const [modalLoading,  setModalLoading]  = useState(false);

  // Bulk Order form state
  const [bulkForm,    setBulkForm]    = useState({ name: '', phone: '', address: '' });
  const [bulkErr,     setBulkErr]     = useState('');
  const [bulkLoading, setBulkLoading] = useState(false);
  const [bulkSent,    setBulkSent]    = useState(false);

  const sidebarRef = useRef(null);
  const moreRef    = useRef(null);

  // Scroll-shrink for the header
  const [isScrolled, setIsScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const cart           = useCartStore(s => s.cart);
  const removeFromCart = useCartStore(s => s.removeFromCart);
  const updateQuantity = useCartStore(s => s.updateQuantity);
  const addToCart      = useCartStore(s => s.addToCart);

  useEffect(() => { setMounted(true); }, []);

  // Fetch categories once for Shop dropdown + Add Products modal
  useEffect(() => {
    fetch(`${API_ROOT}/api/categories`)
      .then(r => r.json())
      .then(data => {
        const cats = Array.isArray(data) ? data : [];
        setApiCategories(cats);
        if (cats.length > 0) setActiveCategory(cats[0].id);
      })
      .catch(() => {});
  }, []);

  // Fetch all products once for search bar
  useEffect(() => {
    fetch(`${API_ROOT}/api/products`)
      .then(r => r.json())
      .then(data => setApiProducts(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, []);

  // When Add Products modal opens or category tab changes, fetch products for that category
  useEffect(() => {
    if (!isAddProductsOpen || !activeCategory) return;
    setModalLoading(true);
    fetch(`${API_ROOT}/api/products?category_id=${activeCategory}`)
      .then(r => r.json())
      .then(data => setModalProducts(Array.isArray(data) ? data : []))
      .catch(() => setModalProducts([]))
      .finally(() => setModalLoading(false));
  }, [isAddProductsOpen, activeCategory]);

  const totalItems    = cart.reduce((a, i) => a + i.quantity, 0);
  const totalPrice    = cart.reduce((a, i) => a + i.price * i.quantity, 0);
  const searchResults = searchQuery.trim()
    ? apiProducts.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.subtitle || '').toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  useEffect(() => {
    document.body.style.overflow =
      isCartOpen || isAddProductsOpen || isSearchOpen || isBulkOpen || loginPopup.open
        ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isCartOpen, isAddProductsOpen, isSearchOpen, isBulkOpen, loginPopup.open]);

  useEffect(() => {
    const handle = (e) => {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target)) setIsSidebarOpen(false);
      if (moreRef.current    && !moreRef.current.contains(e.target))    setIsMoreOpen(false);
    };
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, []);

  useEffect(() => {
    if (!localToast) return;
    const t = setTimeout(() => setLocalToast(null), 2500);
    return () => clearTimeout(t);
  }, [localToast]);

  const closeSearch = () => { setIsSearchOpen(false); setSearchQuery(''); };

  const handleLogout = () => {
    setIsMoreOpen(false);
    setIsSidebarOpen(false);
    logout();
  };

  // ✅ Open Login Required popup with a custom message
  const openLoginPopup = (message) => {
    setIsSidebarOpen(false);
    setIsMoreOpen(false);
    setLoginPopup({ open: true, message });
  };

  // ✅ Cart click — popup if not logged in, otherwise open cart drawer
  const handleOpenCart = () => {
    if (!user) {
      openLoginPopup('Please login to view your cart');
      return;
    }
   openCart()
  };

  // ✅ Profile click — popup if not logged in, otherwise navigate to /profile
  const handleProfileClick = (e) => {
    if (!user) {
      e.preventDefault();
      openLoginPopup('Please login to view your profile');
      return;
    }
    setIsSidebarOpen(false);
    router.push('/profile');
  };

  const handleLoginNow = () => {
    setLoginPopup({ open: false, message: '' });
    if (typeof showToast === 'function') {
      showToast('Redirecting to login...', 'info', 1500);
    }
    router.push('/login');
  };

  // ── Bulk Orders popup open ───────────────────────────────────────────────
  const handleOpenBulk = () => {
    setIsMoreOpen(false);
    setIsSidebarOpen(false);
    setBulkErr('');
    setBulkSent(false);
    setIsBulkOpen(true);
  };

  // ── Submit Bulk Order → Telegram ─────────────────────────────────────────
  const handleSubmitBulk = async (e) => {
    e.preventDefault();
    setBulkErr('');

    const name    = bulkForm.name.trim();
    const phone   = bulkForm.phone.trim();
    const address = bulkForm.address.trim();

    if (!name)                       return setBulkErr('Please enter your name.');
    if (!/^[6-9]\d{9}$/.test(phone)) return setBulkErr('Enter a valid 10-digit Indian mobile number.');
    if (address.length < 10)         return setBulkErr('Please enter a complete address.');

    const token  = process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN;
    const chatId = process.env.NEXT_PUBLIC_TELEGRAM_CHAT_ID;

    if (!token || !chatId) {
      setBulkErr('Bulk-order service is not configured. Please try again later.');
      return;
    }

    const message =
      `🛒 *New Bulk Order Enquiry*\n\n` +
      `👤 *Name:* ${name}\n` +
      `📞 *Phone:* +91 ${phone}\n` +
      `📍 *Address:* ${address}\n\n` +
      `🕒 ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}`;

    setBulkLoading(true);
    try {
      const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ chat_id: chatId, text: message, parse_mode: 'Markdown' }),
      });
      const data = await res.json();

      if (!res.ok || !data.ok) {
        console.error('Telegram error:', data);
        setBulkErr('Could not send your request. Please try again.');
        return;
      }

      setBulkSent(true);
      setBulkForm({ name: '', phone: '', address: '' });
      if (typeof showToast === 'function') {
        showToast('Bulk order request sent! We\'ll contact you soon. 🙌', 'success', 3000);
      }
      setTimeout(() => { setIsBulkOpen(false); setBulkSent(false); }, 2000);
    } catch (err) {
      console.error(err);
      setBulkErr('Network error. Please check your connection.');
    } finally {
      setBulkLoading(false);
    }
  };

  const userInitial = user ? (user.name || user.email || 'U')[0].toUpperCase() : null;

  const UserAvatar = ({ size = 22 }) =>
    user ? (
      <div
        style={{ width: size + 4, height: size + 4 }}
        className="rounded-full bg-[#c23d6a] flex items-center justify-center text-white font-black text-[11px] shrink-0"
      >
        {userInitial}
      </div>
    ) : (
      <User size={size} />
    );

  return (
    <>
      <style>{`
        @keyframes ticker       { from { transform: translateX(0);     } to { transform: translateX(-50%);  } }
        @keyframes slideInLeft  { from { transform: translateX(-100%); } to { transform: translateX(0);     } }
        @keyframes slideInRight { from { transform: translateX(100%);  } to { transform: translateX(0);     } }
        @keyframes fadeInUp     { from { opacity:0; transform: translateY(40px);  } to { opacity:1; transform: translateY(0); } }
        @keyframes fadeInDown   { from { opacity:0; transform: translateY(-20px); } to { opacity:1; transform: translateY(0); } }
        @keyframes popIn        { from { opacity:0; transform: scale(0.92) translateY(10px); } to { opacity:1; transform: scale(1) translateY(0); } }
        @keyframes pulseRing    { 0%,100% { box-shadow: 0 0 0 0 rgba(194,61,106,0.35); } 50% { box-shadow: 0 0 0 14px rgba(194,61,106,0); } }
      `}</style>

      <Toast toast={toast ?? localToast} />

      {/* ── Ticker ─────────────────────────────────────────────────────────── */}
      <div className="bg-[#f3ead8] py-2 overflow-hidden border-b border-black/5">
        <div className="flex whitespace-nowrap" style={{ animation: 'ticker 20s linear infinite' }}>
          {[0, 1].map(i => (
            <div key={i} className="flex shrink-0">
              {TICKER_ITEMS.map(text => (
                <span key={text} className="mx-20 text-[11px] font-bold uppercase tracking-widest text-gray-800">
                  • &nbsp;&nbsp; {text} &nbsp;&nbsp;
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ── Navbar ─────────────────────────────────────────────────────────── */}
      <header
        className={`sticky top-0 z-50 border-b overflow-visible transition-all duration-300 ease-out ${
          isScrolled
            ? 'bg-white/85 backdrop-blur-md border-gray-200 shadow-md'
            : 'bg-white border-gray-100 shadow-sm'
        }`}
      >
        <div
          className={`max-w-[1440px] mx-auto px-2 md:px-10 flex items-center justify-between gap-4 transition-all duration-300 ease-out ${
            isScrolled ? 'h-16' : 'h-20'
          }`}
        >

          <div className="flex items-center justify-between w-full md:w-auto md:flex-none">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-17 h-17 rounded-full flex items-center justify-center p-1 relative">
                <Image src="/images/logoimg.png" alt="Logo" fill className="object-contain p-1 rounded-full" />
              </div>
            </Link>
            <div className="flex items-center gap-1 md:hidden ml-auto">
              <button onClick={() => setIsSearchOpen(true)} className="p-2 text-black hover:bg-gray-100 rounded-full" aria-label="Search">
                <Search size={24} />
              </button>
              <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-black" aria-label="Menu">
                <Menu size={28} />
              </button>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 flex-1 justify-center ml-40">
            <Link href="/" className={`text-xl font-bold tracking-tight hover:text-[#c23d6a] transition-colors ${pathname === '/' ? 'text-[#c23d6a]' : ''}`}>
              Home
            </Link>

            <div className="relative" onMouseEnter={() => setIsShopOpen(true)} onMouseLeave={() => setIsShopOpen(false)}>
              <Link href='/products' className={`${pathname === '/products' ? 'text-[#c23d6a]' : ''}`}>
              <button className="text-xl font-bold tracking-tight flex items-center gap-1 hover:text-[#c23d6a] transition-colors">
                Shop
                <ChevronDown size={14} strokeWidth={3} className={`transition-transform duration-200 ${isShopOpen ? 'rotate-180' : ''}`} />
              </button>
              </Link>
         {isShopOpen && (
  <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4 z-50">
    <div className="bg-white shadow-2xl rounded-xl border border-gray-100 p-6
                    w-[90vw] max-w-[600px] max-h-[80vh] overflow-y-auto">
      {apiCategories.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-4">Loading categories…</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
          {apiCategories.map((cat) => (
            <Link
              key={cat.id}
              href="/products"
              onClick={() => setIsShopOpen(false)}
              className="flex flex-col items-center gap-3 p-3 hover:bg-gray-50 rounded-xl transition-all group"
            >
              <div className="relative w-full aspect-square bg-gray-100 rounded-xl overflow-hidden shadow-sm">
                {cat.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={cat.image_url}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300 text-3xl">🛒</div>
                )}
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-center">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  </div>
)}
            </div>

            <Link href="/about-us" className={`text-xl font-bold tracking-tight hover:text-[#c23d6a] transition-colors ${pathname === '/about-us' ? 'text-[#c23d6a]' : ''}`}>
              About
            </Link>

            <Link href="/contact-us" className={`text-xl font-bold tracking-tight hover:text-[#c23d6a] transition-colors ${pathname === '/contact-us' ? 'text-[#c23d6a]' : ''}`}>
              Contact
            </Link>
          </nav>

          <div className="flex items-center justify-end gap-1 md:gap-4 flex-1 md:flex-none">

            <button onClick={() => setIsSearchOpen(true)} className="hidden md:flex p-2 text-black hover:bg-gray-100 rounded-full" aria-label="Search">
              <Search size={22} />
            </button>

            {/* ✅ Profile — popup if not logged in */}
            <button
              onClick={handleProfileClick}
              className="hidden md:flex p-2 hover:bg-gray-100 rounded-full transition-colors items-center justify-center"
              aria-label={user ? 'My Profile' : 'Login'}
            >
              <UserAvatar size={22} />
            </button>

            {/* ✅ Cart — popup if not logged in */}
            <button onClick={handleOpenCart} className="hidden md:block relative p-2 text-black hover:bg-gray-100 rounded-full transition-colors" aria-label="Cart">
              <div className="relative">
                <ShoppingCart size={22} />
                {mounted && user && totalItems > 0 && (
                  <span className="absolute bg-[#c23d6a] text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold leading-none border-2 border-white" style={{ top: '-7px', right: '-7px' }}>
                    {totalItems}
                  </span>
                )}
              </div>
            </button>

            <div ref={moreRef} className="hidden md:block relative">
              <button onClick={() => setIsMoreOpen(v => !v)} className="p-2 text-black hover:bg-gray-100 rounded-full transition-colors">
                <AlignJustify size={24} strokeWidth={2.5} />
              </button>

              {isMoreOpen && (
                <div className="absolute top-full right-0 mt-3 z-50" style={{ width: 420 }}>
                  <div className="bg-white shadow-2xl rounded-2xl border border-gray-100 overflow-hidden">
                    {user ? (
                      <>
                        <Link href="/profile" onClick={() => setIsMoreOpen(false)}
                          className="flex items-center gap-3 px-5 py-4 hover:bg-gray-50 transition-colors border-b border-gray-100">
                          <div className="w-9 h-9 rounded-full bg-[#c23d6a] flex items-center justify-center text-white font-black text-sm shrink-0">
                            {userInitial}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-gray-900 truncate">{user.name || 'My Account'}</p>
                            {user.email && <p className="text-xs text-gray-400 truncate">{user.email}</p>}
                          </div>
                          <span className="text-xs font-bold text-[#c23d6a] shrink-0">Profile →</span>
                        </Link>

                        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-5 py-4 hover:bg-red-50 transition-colors border-b border-gray-100 text-left group">
                          <LogOut size={18} className="text-gray-400 group-hover:text-red-500 shrink-0" />
                          <span className="text-sm font-semibold text-gray-700 group-hover:text-red-500">Log out</span>
                        </button>
                      </>
                    ) : (
                      <Link href="/login" onClick={() => setIsMoreOpen(false)}
                        className="flex items-center gap-3 px-5 py-4 hover:bg-gray-50 transition-colors border-b border-gray-100">
                        <LogIn size={18} className="text-gray-700 shrink-0" />
                        <span className="text-sm font-semibold text-gray-900">Login or signup</span>
                      </Link>
                    )}

                    <button onClick={handleOpenBulk} className="w-full flex items-start gap-3 px-5 py-4 hover:bg-gray-50 transition-colors border-b border-gray-100 text-left">
                      <Package size={18} className="text-gray-700 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-semibold text-gray-900">Bulk orders</p>
                        <p className="text-xs text-gray-400 mt-0.5">Contact for bulk orders</p>
                      </div>
                    </button>

                    <div className="py-1">
                      <Link href="/terms-conditions" onClick={() => setIsMoreOpen(false)} className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition-colors">
                        <span className="text-sm font-semibold text-gray-800">Terms and conditions</span>
                      </Link>
                      <Link href="/privacy-policy" onClick={() => setIsMoreOpen(false)} className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition-colors">
                        <span className="text-sm font-semibold text-gray-800">Privacy policy</span>
                      </Link>
                         <Link href="/refund-policy" onClick={() => setIsMoreOpen(false)} className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition-colors">
                        <span className="text-sm font-semibold text-gray-800">Refund policy</span>
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ── Search Overlay ─────────────────────────────────────────────────── */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-[99999] flex items-start justify-center pt-0 md:pt-20">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={closeSearch} />
          <div className="relative w-full md:max-w-2xl bg-white md:rounded-2xl shadow-2xl flex flex-col" style={{ animation: 'fadeInDown 0.25s ease forwards', maxHeight: '90vh' }}>
            <div className="flex items-center gap-3 px-4 md:px-5 py-4 border-b border-gray-100 shrink-0">
              <Search size={22} className="text-gray-400 shrink-0" />
              <input type="text" autoFocus placeholder="Search for oats, muesli..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="flex-1 bg-transparent border-none focus:ring-0 text-base outline-none" />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="p-1 hover:bg-gray-100 rounded-full">
                  <X size={18} className="text-gray-400" />
                </button>
              )}
              <button onClick={closeSearch} className="p-2 hover:bg-gray-100 rounded-full shrink-0"><X size={20} /></button>
            </div>
            <div className="flex-1 overflow-y-auto">
              {searchQuery.trim() === '' ? (
                <div className="p-5">
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Browse Categories</p>
                  <div className="grid grid-cols-2 gap-3">
                    {apiCategories.map(cat => (
                      <Link key={cat.id} href="/products" onClick={closeSearch}
                        className="flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors">
                        <div className="relative w-12 h-12 bg-white rounded-lg overflow-hidden shrink-0 border border-gray-100 flex items-center justify-center">
                          {cat.image_url ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={cat.image_url} alt={cat.name} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-gray-300 text-xl">🛒</span>
                          )}
                        </div>
                        <span className="text-sm font-bold">{cat.name}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              ) : searchResults.length > 0 ? (
                <div className="divide-y divide-gray-100">
                  {searchResults.map(p => {
                    const img = Array.isArray(p.images) && p.images.length > 0 ? p.images[0] : '/images/oatsimg.jpg';
                    const variants = Array.isArray(p.variants) ? p.variants : [];
                    const displayPrice = variants.length > 0 ? variants[0].price : p.price;
                    return (
                      <Link key={p.id} href={`/productsviewpage/${p.id}`} onClick={closeSearch}
                        className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition-colors">
                        <div className="relative w-14 h-14 bg-[#f8f8f8] rounded-lg overflow-hidden shrink-0 border border-gray-100">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={img} alt={p.name} className="w-full h-full object-contain p-1" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-gray-900 line-clamp-1">{p.name}</p>
                          {p.subtitle && <p className="text-xs text-gray-400 mt-0.5">{p.subtitle}</p>}
                        </div>
                        <p className="text-sm font-black text-[#c23d6a] shrink-0">₹ {displayPrice}</p>
                      </Link>
                    );
                  })}
                </div>
              ) : (
                <div className="p-10 text-center">
                  <Search size={48} className="text-gray-200 mx-auto mb-3" />
                  <p className="text-base font-bold text-gray-400">No products found</p>
                  <p className="text-sm text-gray-300 mt-1">Try searching differently</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Cart Off-canvas ────────────────────────────────────────────────── */}
      {isCartOpen && (
        <div className="fixed inset-0 z-[99999] flex justify-end">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => closeCart()} />
          <div className="relative w-full max-w-sm md:max-w-lg bg-white h-full shadow-2xl flex flex-col" style={{ animation: 'slideInRight 0.3s ease forwards' }}>
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 shrink-0">
              <div className="flex items-center gap-2">
                <ShoppingCart size={20} className="text-[#c23d6a]" />
                <span className="font-bold text-base">
                  Your Cart {mounted && totalItems > 0 && <span className="text-[#c23d6a]">({totalItems})</span>}
                </span>
              </div>
              <button onClick={() => closeCart()} className="p-2 hover:bg-gray-100 rounded-full"><X size={20} /></button>
            </div>

            <div className="flex-1 overflow-y-auto">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center px-6">
                  <ShoppingCart size={56} className="text-gray-200 mb-4" />
                  <p className="text-base font-bold text-gray-400">Your cart is empty</p>
                  <p className="text-sm text-gray-300 mt-1 mb-6">Add some products to get started</p>
                  <button onClick={() => { closeCart(); setIsAddProductsOpen(true); }} className="bg-[#c23d6a] text-white px-8 py-3 rounded-full text-sm font-bold hover:bg-[#a8305a] transition-colors">
                    Browse Products
                  </button>
                </div>
              ) : (
                <>
                  <div className="divide-y divide-gray-100 px-5">
                    {cart.map(item => (
                      <div key={`${item.id}-${item.variant_label || ''}`} className="flex gap-3 py-4">
                        <div className="relative w-20 h-20 bg-[#f8f8f8] rounded-xl overflow-hidden shrink-0 border border-gray-100">
                          {item.image && <Image src={item.image} alt={item.name} fill className="object-contain p-1" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-bold text-gray-900 leading-snug line-clamp-2">{item.name}</p>
                              {item.variant_label && (
                                <span className="inline-block text-[10px] font-bold bg-[#fff0f5] text-[#c23d6a] px-2 py-0.5 rounded-full mt-0.5 uppercase tracking-wider">
                                  {item.variant_label}
                                </span>
                              )}
                            </div>
                            <button
                              onClick={() => removeFromCart(item.id, item.variant_label || null)}
                              className="p-1 text-gray-400 hover:text-red-400 hover:bg-red-50 rounded-full shrink-0"
                            >
                              <X size={18} />
                            </button>
                          </div>
                          <p className="text-sm text-[#c23d6a] font-black mt-1 mb-2">₹ {item.price}</p>
                          <div className="flex items-center bg-[#f5f5f5] rounded-full px-1 py-0.5 gap-1 w-fit">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1, item.variant_label || null)}
                              disabled={item.quantity <= 1}
                              className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-white disabled:opacity-30"
                            >
                              <Minus size={12} />
                            </button>
                            <span className="w-6 text-center text-sm font-bold select-none">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1, item.variant_label || null)}
                              className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-white"
                            >
                              <Plus size={12} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="px-5 py-4">
                    <button onClick={() => setIsAddProductsOpen(true)} className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed border-[#c23d6a] text-[#c23d6a] text-sm font-bold hover:bg-[#fff3f7] transition-colors">
                      <Plus size={16} /> Add More Products
                    </button>
                  </div>
                </>
              )}
            </div>

            {cart.length > 0 && (
              <div className="px-5 py-5 border-t border-gray-100 bg-[#fafafa] shrink-0">
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-500 font-semibold">Subtotal</span>
                  <span className="text-sm font-bold text-gray-900">₹ {totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between mb-4">
                  <span className="text-sm text-gray-500 font-semibold">Shipping</span>
                  <span className="text-sm font-bold text-green-500">FREE</span>
                </div>
                <div className="flex justify-between mb-5 pt-3 border-t border-dashed border-gray-200">
                  <span className="text-base font-black text-gray-900">Total</span>
                  <span className="text-xl font-black text-[#c23d6a]">₹ {totalPrice.toFixed(2)}</span>
                </div>
                <Link href="/checkout" onClick={() => closeCart()} className="block w-full bg-[#c23d6a] text-white text-center text-sm font-bold py-4 rounded-full hover:bg-[#a8305a] transition-colors active:scale-95 transform">
                  Proceed to Checkout
                </Link>
                <button onClick={() => closeCart()} className="block w-full text-center text-sm font-semibold text-gray-400 mt-3 hover:text-gray-600 transition-colors">
                  Continue Shopping
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Add Products Modal ─────────────────────────────────────────────── */}
      {isAddProductsOpen && (
        <div className="fixed inset-0 z-[999999] flex items-end md:items-center justify-center p-0 md:p-6">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsAddProductsOpen(false)} />
          <div className="relative w-full md:max-w-2xl bg-white rounded-t-3xl md:rounded-3xl shadow-2xl flex flex-col overflow-hidden" style={{ animation: 'fadeInUp 0.3s ease forwards', maxHeight: '90vh' }}>
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 shrink-0">
              <div className="flex items-center gap-2">
                <ShoppingBag size={20} className="text-[#c23d6a]" />
                <span className="font-bold text-base">Add Products</span>
              </div>
              <button onClick={() => setIsAddProductsOpen(false)} className="p-2 hover:bg-gray-100 rounded-full"><X size={20} /></button>
            </div>
            {/* Category tabs */}
            <div className="flex gap-3 px-5 py-3 border-b border-gray-100 shrink-0 overflow-x-auto">
              {apiCategories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 font-bold text-sm transition-all shrink-0 ${
                    activeCategory === cat.id
                      ? 'bg-[#f0ece2] border-[#c23d6a] text-black'
                      : 'border-gray-200 bg-gray-50 text-gray-400'
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg overflow-hidden bg-gray-100 shrink-0 flex items-center justify-center">
                    {cat.image_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={cat.image_url} alt={cat.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-gray-300 text-sm">🛒</span>
                    )}
                  </div>
                  {cat.name}
                </button>
              ))}
            </div>

            {/* Product grid */}
            <div className="flex-1 overflow-y-auto p-4">
              {modalLoading ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="animate-pulse bg-gray-100 rounded-2xl aspect-[3/4]" />
                  ))}
                </div>
              ) : modalProducts.length === 0 ? (
                <p className="text-center text-gray-400 text-sm py-10">No products in this category yet</p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {modalProducts.map(item => {
                    const imgSrc = Array.isArray(item.images) && item.images.length > 0
                      ? item.images[0]
                      : '/images/oatsimg.jpg';
                    const variants = Array.isArray(item.variants) ? item.variants : [];
                    const firstVariant = variants[0] || null;
                    const displayPrice = firstVariant ? Number(firstVariant.price) : Number(item.price);
                    const variantLabel = firstVariant?.label || null;

                    const inCart = cart.find(c =>
                      Number(c.id) === Number(item.id) &&
                      (c.variant_label || null) === variantLabel
                    );

                    return (
                      <div key={item.id} className="bg-[#fafafa] rounded-2xl p-3 border border-gray-100 flex flex-col">
                        <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-white mb-2">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={imgSrc} alt={item.name} className="w-full h-full object-contain p-3" />
                        </div>
                        <p className="text-xs font-bold text-gray-900 leading-snug mb-1 line-clamp-2">{item.name}</p>
                        <p className="text-sm font-black text-[#c23d6a] mb-2">₹ {displayPrice}</p>
                        {variantLabel && (
                          <span className="text-[10px] font-bold text-gray-400 mb-1">{variantLabel}</span>
                        )}
                        {inCart ? (
                          <div className="flex items-center justify-between bg-[#fff3f7] border border-[#c23d6a] rounded-xl px-2 py-1 mt-auto">
                            <button
                              onClick={() => updateQuantity(item.id, inCart.quantity - 1, variantLabel)}
                              disabled={inCart.quantity <= 1}
                              className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-white disabled:opacity-30"
                            >
                              <Minus size={11} />
                            </button>
                            <span className="text-xs font-black text-[#c23d6a]">{inCart.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, inCart.quantity + 1, variantLabel)}
                              className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-white"
                            >
                              <Plus size={11} />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => addToCart({
                              id: item.id,
                              name: item.name,
                              price: displayPrice,
                              variant_label: variantLabel,
                              image: imgSrc,
                            })}
                            className="w-full mt-auto bg-[#c23d6a] text-white text-xs font-bold py-2 rounded-xl hover:bg-[#a8305a] transition-colors active:scale-95"
                          >
                            + Add
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            <div className="px-5 py-4 border-t border-gray-100 bg-[#fafafa] shrink-0">
              <button onClick={() => setIsAddProductsOpen(false)} className="w-full bg-[#c23d6a] text-white text-sm font-bold py-3.5 rounded-2xl hover:bg-[#a8305a] transition-colors">
                Done — View Cart ({totalItems} items)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Mobile Sidebar ─────────────────────────────────────────────────── */}
      {isSidebarOpen && (
        <div className="fixed inset-0 flex justify-end" style={{ zIndex: 99999 }}>
    <div
      className="absolute inset-0 bg-black/50 backdrop-blur-sm"
      onClick={() => setIsSidebarOpen(false)}
    />
    <div
      ref={sidebarRef}
      className="relative w-[80%] max-w-sm bg-white h-full shadow-2xl flex flex-col"
      style={{ animation: 'slideInRight 0.3s ease forwards' }}
    >

            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <span className="font-black text-xl tracking-tighter">MENU</span>
              <button onClick={() => setIsSidebarOpen(false)} className="p-2 bg-gray-100 rounded-full"><X size={20} /></button>
            </div>

            <nav className="flex-1 overflow-y-auto">
              <div className="p-6 space-y-5 border-b border-gray-100">
                <Link href="/about-us" onClick={() => setIsSidebarOpen(false)} className="block text-lg font-bold">
                  About Us
                </Link>
              </div>

              <div className="p-6 space-y-5 border-b border-gray-100">
                <Link href="/contact-us" onClick={() => setIsSidebarOpen(false)} className="block text-lg font-bold">
                  Contact Us
                </Link>
              </div>

              <div className="p-6 space-y-1">
                {user ? (
                  <>
                    <Link href="/profile" onClick={() => setIsSidebarOpen(false)} className="flex items-center gap-4 py-3">
                      <div className="w-9 h-9 rounded-full bg-[#c23d6a] flex items-center justify-center text-white font-black text-sm shrink-0">
                        {userInitial}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-base font-bold text-gray-900 truncate">{user.name || 'My Account'}</p>
                        {user.email && <p className="text-xs text-gray-400 truncate">{user.email}</p>}
                      </div>
                      <span className="text-xs font-bold text-[#c23d6a]">Profile →</span>
                    </Link>

                    <button onClick={handleLogout} className="w-full flex items-center gap-4 py-3 text-left group">
                      <LogOut size={20} className="text-gray-400 group-hover:text-red-500 shrink-0" />
                      <span className="text-base font-semibold text-gray-700 group-hover:text-red-500">Log out</span>
                    </button>
                  </>
                ) : (
                  <Link href="/login" onClick={() => setIsSidebarOpen(false)} className="flex items-center gap-4 py-3">
                    <LogIn size={20} className="text-gray-700 shrink-0" />
                    <span className="text-base font-semibold text-gray-900">Login or signup</span>
                  </Link>
                )}

                <button onClick={handleOpenBulk} className="w-full flex items-start gap-4 py-3 text-left">
                  <Package size={20} className="text-gray-700 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-base font-semibold text-gray-900">Bulk orders</p>
                    <p className="text-sm text-gray-400">Contact for bulk orders</p>
                  </div>
                </button>

                <div className="border-t border-gray-200 my-2" />

                <Link href="/terms-conditions" onClick={() => setIsSidebarOpen(false)} className="flex items-center gap-4 py-3">
                  <span className="text-base font-semibold text-gray-900">Terms and conditions</span>
                </Link>
                <Link href="/privacy-policy" onClick={() => setIsSidebarOpen(false)} className="flex items-center gap-4 py-3">
                  <span className="text-base font-semibold text-gray-900">Privacy policy</span>
                </Link>
                 <Link href="/refund-policy" onClick={() => setIsSidebarOpen(false)} className="flex items-center gap-4 py-3">
                  <span className="text-base font-semibold text-gray-900">Refund policy</span>
                </Link>
              </div>
            </nav>

            <div className="p-6 bg-gray-50 border-t border-gray-100">
              <p className="text-[10px] text-gray-400 font-bold uppercase mb-4 tracking-widest">Follow Us</p>
              <div className="flex gap-3">
                {SOCIAL_LINKS.map(({ name, Icon, href, color }) => (
                  <a key={name} href={href} target="_blank" rel="noopener noreferrer" aria-label={name}
                    className="w-10 h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center text-gray-700 transition-all duration-200 hover:scale-110 shadow-sm"
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = color; e.currentTarget.style.borderColor = color; e.currentTarget.style.color = '#fff'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#fff'; e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.color = '#374151'; }}
                  >
                    <Icon size={18} />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Mobile Bottom Nav ──────────────────────────────────────────────── */}
<nav className="md:hidden bg-white border-t border-gray-200" style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 9999, paddingBottom: 'env(safe-area-inset-bottom)', boxShadow: '0 -2px 16px rgba(0,0,0,0.08)' }}>
  <div className="flex items-center justify-around h-16 px-2">

    {/* Home */}
    <Link href="/" className={`flex flex-col items-center justify-center flex-1 py-2 transition-colors ${pathname === '/' ? 'text-[#c23d6a]' : 'text-gray-500'}`}>
      <div className="flex items-center justify-center w-[22px] h-[22px]">
        <Home size={22} strokeWidth={2} />
      </div>
      <span className="text-[10px] font-semibold mt-1">Home</span>
    </Link>

  {/* Shop */}
<Link 
  href="/products" 
  className={`flex flex-col items-center justify-center flex-1 py-2 transition-colors ${
    pathname && pathname.startsWith('/products') 
      ? 'text-[#c23d6a]' 
      : 'text-gray-500 hover:text-gray-700'
  }`}
>
  <div className="flex items-center justify-center w-[22px] h-[22px]">
    <Store size={22} strokeWidth={2} />
  </div>
  <span className="text-[10px] font-semibold mt-1">Shop</span>
</Link>

    {/* Cart */}
    <button onClick={handleOpenCart} className="flex flex-col items-center justify-center flex-1 py-2 text-gray-500 transition-colors">
      <div className="relative flex items-center justify-center w-[22px] h-[22px]">
        <ShoppingCart size={22} strokeWidth={2} />
        {mounted && user && totalItems > 0 && (
          <span className="absolute bg-[#c23d6a] text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold leading-none border-2 border-white" style={{ top: '-6px', right: '-8px' }}>
            {totalItems}
          </span>
        )}
      </div>
      <span className="text-[10px] font-semibold mt-1">Cart</span>
    </button>

    {/* Profile / Login */}
    <button
      onClick={handleProfileClick}
      className={`flex flex-col items-center justify-center flex-1 py-2 transition-colors ${pathname === '/profile' ? 'text-[#c23d6a]' : 'text-gray-500'}`}
    >
      <div className="flex items-center justify-center w-[22px] h-[22px]">
        {user ? (
          <div className="w-6 h-6 rounded-full bg-[#c23d6a] flex items-center justify-center text-white font-black text-[10px]">
            {userInitial}
          </div>
        ) : (
          <User size={22} strokeWidth={2} />
        )}
      </div>
      <span className="text-[10px] font-semibold mt-1">{user ? 'Profile' : 'Login'}</span>
    </button>

  </div>
</nav>
      {/* ── BULK ORDER POPUP ───────────────────────────────────────────────── */}
      {isBulkOpen && (
        <div className="fixed inset-0 z-[9999999] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => !bulkLoading && setIsBulkOpen(false)} />

          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden" style={{ animation: 'popIn 0.3s cubic-bezier(.22,1,.36,1) forwards' }}>
            <div className="bg-gradient-to-br from-[#c23d6a] to-[#a8305a] px-6 py-5 text-white relative">
              <button onClick={() => !bulkLoading && setIsBulkOpen(false)} disabled={bulkLoading} className="absolute top-4 right-4 p-1.5 hover:bg-white/20 rounded-full transition-colors disabled:opacity-50" aria-label="Close">
                <X size={18} />
              </button>
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
                  <Package size={22} />
                </div>
                <div>
                  <h3 className="text-lg font-black">Bulk Order Enquiry</h3>
                  <p className="text-xs text-white/85 font-medium mt-0.5">We'll get back to you within 24 hours</p>
                </div>
              </div>
            </div>

            {bulkSent ? (
              <div className="px-6 py-10 text-center">
                <div className="w-16 h-16 bg-green-50 border-4 border-green-400 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle size={32} className="text-green-500" strokeWidth={2.5} />
                </div>
                <h4 className="text-xl font-black text-gray-900 mb-1">Request Sent! 🎉</h4>
                <p className="text-sm text-gray-500">Thanks for reaching out. We'll contact you shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmitBulk} className="px-6 py-5 flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-black uppercase tracking-widest text-gray-500">Full Name</label>
                  <div className="relative">
                    <UserCircle2 size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    <input type="text" placeholder="John Doe" value={bulkForm.name}
                      onChange={e => setBulkForm(p => ({ ...p, name: e.target.value }))}
                      required disabled={bulkLoading}
                      className="w-full pl-10 pr-4 py-3 text-sm font-medium text-gray-900 bg-white border-2 border-gray-200 rounded-xl outline-none transition-all placeholder:text-gray-400 focus:border-[#c23d6a] focus:ring-4 focus:ring-[#c23d6a]/10 hover:border-gray-300 disabled:opacity-60" />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-black uppercase tracking-widest text-gray-500">Contact Number</label>
                  <div className="flex border-2 border-gray-200 rounded-xl overflow-hidden transition-all focus-within:border-[#c23d6a] focus-within:ring-4 focus-within:ring-[#c23d6a]/10 hover:border-gray-300">
                    <div className="flex items-center px-3 bg-gray-50 border-r-2 border-gray-200 text-sm font-bold text-gray-500 shrink-0 select-none">
                      🇮🇳 +91
                    </div>
                    <div className="relative flex-1">
                      <Phone size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                      <input type="tel" placeholder="10-digit number" value={bulkForm.phone}
                        onChange={e => setBulkForm(p => ({ ...p, phone: e.target.value.replace(/\D/g, '').slice(0, 10) }))}
                        maxLength={10} required disabled={bulkLoading}
                        className="w-full pl-9 pr-4 py-3 text-sm font-medium text-gray-900 bg-white outline-none placeholder:text-gray-400 disabled:opacity-60" />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-black uppercase tracking-widest text-gray-500">Delivery Address</label>
                  <div className="relative">
                    <MapPin size={15} className="absolute left-3.5 top-3.5 text-gray-400 pointer-events-none" />
                    <textarea placeholder="House no., street, city, state, pincode" value={bulkForm.address}
                      onChange={e => setBulkForm(p => ({ ...p, address: e.target.value }))}
                      rows={3} required disabled={bulkLoading}
                      className="w-full pl-10 pr-4 py-3 text-sm font-medium text-gray-900 bg-white border-2 border-gray-200 rounded-xl outline-none transition-all placeholder:text-gray-400 resize-none focus:border-[#c23d6a] focus:ring-4 focus:ring-[#c23d6a]/10 hover:border-gray-300 disabled:opacity-60" />
                  </div>
                </div>

                {bulkErr && (
                  <div className="flex items-start gap-2.5 bg-red-50 border-2 border-red-200 rounded-xl px-3.5 py-3">
                    <AlertCircle size={15} className="text-red-500 shrink-0 mt-0.5" />
                    <p className="text-xs text-red-700 font-semibold leading-snug">{bulkErr}</p>
                  </div>
                )}

                <button type="submit" disabled={bulkLoading}
                  className="w-full py-3.5 bg-[#c23d6a] text-white text-sm font-black rounded-2xl hover:bg-[#a8305a] active:scale-[0.98] transition-all shadow-lg shadow-[#c23d6a]/25 disabled:opacity-60 disabled:cursor-not-allowed disabled:shadow-none flex items-center justify-center gap-2">
                  {bulkLoading ? (
                    <>
                      <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                      Sending…
                    </>
                  ) : (
                    <>Send Enquiry <Send size={15} /></>
                  )}
                </button>

                <p className="text-[11px] text-gray-400 text-center font-medium">
                  Our team will reach out via call/WhatsApp on your provided number.
                </p>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ── LOGIN REQUIRED POPUP ───────────────────────────────────────────── */}
      {loginPopup.open && (
        <div
          className="fixed inset-0 z-[9999998] flex items-center justify-center p-4"
          style={{ animation: 'fadeInDown 0.2s ease forwards' }}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setLoginPopup({ open: false, message: '' })}
          />

          {/* Modal */}
          <div
            className="relative w-full max-w-md bg-white rounded-xl shadow-2xl p-8 md:p-10 text-center"
            style={{ animation: 'popIn 0.3s cubic-bezier(.22,1,.36,1) forwards' }}
          >
            {/* Close button */}
            <button
              onClick={() => setLoginPopup({ open: false, message: '' })}
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
            <h3 className="text-2xl md:text-3xl font-bold text-black mb-2">
              Login Required
            </h3>

            {/* Message */}
            <p className="text-gray-500 text-sm md:text-base mb-7 leading-relaxed">
              {loginPopup.message}
            </p>

            {/* Buttons */}
            <div className="flex gap-3 justify-center">
              <button
                onClick={handleLoginNow}
                className="flex-1 max-w-[160px] bg-[#c23d6a] text-white font-bold text-sm py-3 rounded-full hover:bg-[#a8305a] active:scale-95 transition-all shadow-md"
              >
                Login Now
              </button>
              <button
                onClick={() => setLoginPopup({ open: false, message: '' })}
                className="flex-1 max-w-[160px] bg-gray-100 text-gray-700 font-bold text-sm py-3 rounded-full hover:bg-gray-200 active:scale-95 transition-all"
              >
                Maybe later
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}