'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import {
  Search, ChevronDown, ShoppingCart, User, Menu, X, LogIn,
  ArrowUpRight, Home, Store, AlignJustify, Minus, Plus,
  ShoppingBag, LogOut,
} from 'lucide-react';
import { useCartStore } from '../store/useCartStore';

import { useAuth } from '../context/AuthContext';

const navProducts = [
  { name: 'Oats',   imageUrl: '/images/oatshoverimg.png',  link: '/products?category=OATS'   },
  { name: 'Muesli', imageUrl: '/images/meuslihoverimg1.png', link: '/products?category=Muesli' },
];

const allProducts = [
  { id: 1, category: 'OATS',   name: 'Premium Rolled Oats',    price: 180, image: '/images/oatsimg.jpg'    },
  { id: 2, category: 'OATS',   name: 'Instant Oats',           price: 150, image: '/images/oatsimg.jpg'    },
  { id: 7, category: 'OATS',   name: 'Steel Cut Oats',         price: 200, image: '/images/oatsimg.jpg'    },
  { id: 8, category: 'OATS',   name: 'Oats & Honey Crunch',    price: 190, image: '/images/oatsimg.jpg'    },
  { id: 3, category: 'Muesli', name: 'Gourmet Muesli',         price: 250, image: '/images/meusliimg.png'  },
  { id: 4, category: 'Muesli', name: 'Berries & Seeds Muesli', price: 280, image: '/images/meusliimg.png'  },
  { id: 5, category: 'Muesli', name: 'Crunchy Nut Muesli',     price: 240, image: '/images/meusliimg.png'  },
  { id: 6, category: 'Muesli', name: 'Dark Chocolate Muesli',  price: 290, image: '/images/meusliimg.png'  },
];

const TICKER_ITEMS = [
  'Free Shipping on orders over ₹500',
  'Discipline builds results',
  'Fuel your body the right way',
];

export default function Navbar() {
  const pathname = usePathname();
  const router   = useRouter();

  // ── Auth ──────────────────────────────────────────────────────────────────
  const { user, logout } = useAuth();

  // ── UI state ──────────────────────────────────────────────────────────────
  const [isSidebarOpen,     setIsSidebarOpen]     = useState(false);
  const [isShopOpen,        setIsShopOpen]         = useState(false);
  const [isMoreOpen,        setIsMoreOpen]         = useState(false);
  const [isShopMobileOpen,  setIsShopMobileOpen]   = useState(false);
  const [isCartOpen,        setIsCartOpen]         = useState(false);
  const [isAddProductsOpen, setIsAddProductsOpen]  = useState(false);
  const [isSearchOpen,      setIsSearchOpen]       = useState(false);
  const [searchQuery,       setSearchQuery]        = useState('');
  const [activeCategory,    setActiveCategory]     = useState('OATS');
  const [mounted,           setMounted]            = useState(false);

  const sidebarRef = useRef(null);
  const moreRef    = useRef(null);

  // ── Cart ──────────────────────────────────────────────────────────────────
  const cart           = useCartStore(s => s.cart);
  const removeFromCart = useCartStore(s => s.removeFromCart);
  const updateQuantity = useCartStore(s => s.updateQuantity);
  const addToCart      = useCartStore(s => s.addToCart);

  useEffect(() => { setMounted(true); }, []);

  const totalItems    = cart.reduce((a, i) => a + i.quantity, 0);
  const totalPrice    = cart.reduce((a, i) => a + i.price * i.quantity, 0);
  const filteredProds = allProducts.filter(p => p.category === activeCategory);
  const searchResults = searchQuery.trim()
    ? allProducts.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  useEffect(() => {
    document.body.style.overflow = (isCartOpen || isAddProductsOpen || isSearchOpen) ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isCartOpen, isAddProductsOpen, isSearchOpen]);

  useEffect(() => {
    const handle = (e) => {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target)) setIsSidebarOpen(false);
      if (moreRef.current    && !moreRef.current.contains(e.target))    setIsMoreOpen(false);
    };
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, []);

  const closeSearch = () => { setIsSearchOpen(false); setSearchQuery(''); };

  // ── Profile routing helper ────────────────────────────────────────────────
  // Used by both the navbar icon AND the dropdown "Profile" row
  const handleProfileClick = () => {
    setIsMoreOpen(false);
    setIsSidebarOpen(false);
    router.push(user ? '/profile' : '/login');
  };

  const handleLogout = () => {
    setIsMoreOpen(false);
    setIsSidebarOpen(false);
    logout();
    router.push('/');
  };

  // ── User avatar / initial ─────────────────────────────────────────────────
  const UserAvatar = ({ size = 22 }) => {
    if (!user) return <User size={size} />;
    // Show first initial in a coloured circle when logged in
    const initial = (user.name || user.email || 'U')[0].toUpperCase();
    return (
      <div
        style={{ width: size + 4, height: size + 4 }}
        className="rounded-full bg-[#c23d6a] flex items-center justify-center text-white font-black text-[11px] shrink-0"
      >
        {initial}
      </div>
    );
  };


  const { fetchUserCart } = useCartStore();

useEffect(() => {
  if (user) {
    fetchUserCart();
  }
}, [user]);
  return (
    <>
      <style>{`
        @keyframes ticker     { 0%   { transform: translateX(0);       } 100% { transform: translateX(-50%);    } }
        @keyframes slideInLeft  { 0%   { transform: translateX(-100%);  } 100% { transform: translateX(0);       } }
        @keyframes slideInRight { 0%   { transform: translateX(100%);   } 100% { transform: translateX(0);       } }
        @keyframes fadeInUp   { 0%   { opacity:0; transform: translateY(40px); } 100% { opacity:1; transform: translateY(0); } }
        @keyframes fadeInDown { 0%   { opacity:0; transform: translateY(-20px); } 100% { opacity:1; transform: translateY(0); } }
      `}</style>

      {/* ─── Ticker ──────────────────────────────────────────────────────── */}
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

      {/* ─── Navbar ──────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm overflow-visible">
        <div className="max-w-[1440px] mx-auto px-2 md:px-10 h-20 flex items-center justify-between gap-4">

          {/* Logo + Mobile actions */}
          <div className="flex items-center justify-between w-full md:w-auto md:flex-none">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-15 h-15 bg-[#c23d6a] rounded-full flex items-center justify-center p-1 relative">
                <Image src="/images/logoimg.png" alt="Logo" fill className="object-contain p-1" />
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

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8 flex-1 justify-center ml-40">
            <Link href="/" className={`text-xl font-bold tracking-tight hover:text-[#c23d6a] transition-colors ${pathname === '/' ? 'text-[#c23d6a]' : ''}`}>
              Home
            </Link>

            <div className="relative" onMouseEnter={() => setIsShopOpen(true)} onMouseLeave={() => setIsShopOpen(false)}>
              <button className="text-xl font-bold tracking-tight flex items-center gap-1 hover:text-[#c23d6a] transition-colors">
                Shop <ChevronDown size={14} strokeWidth={3} className={`transition-transform duration-200 ${isShopOpen ? 'rotate-180' : ''}`} />
              </button>
              {isShopOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4 z-50">
                  <div className="bg-white shadow-xl rounded-xl border border-gray-100 p-4 min-w-max">
                    <div className="flex flex-row items-center gap-6">
                      {navProducts.map(item => (
                        <Link key={item.name} href={item.link} className="flex flex-col items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors min-w-[120px]">
                          <div className="relative w-20 h-20 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                            <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
                          </div>
                          <span className="text-sm font-bold uppercase tracking-tight">{item.name}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <Link href="/about" className="text-xl font-bold tracking-tight hover:text-[#c23d6a] transition-colors">
              About
            </Link>
          </nav>

          {/* Utility icons — desktop */}
          <div className="flex items-center justify-end gap-1 md:gap-4 flex-1 md:flex-none">

            <button onClick={() => setIsSearchOpen(true)} className="hidden md:flex p-2 text-black hover:bg-gray-100 rounded-full" aria-label="Search">
              <Search size={22} />
            </button>

            {/* ── Profile icon — goes to /profile if logged in, /login if not ── */}
            <button
              onClick={handleProfileClick}
              className="hidden md:flex p-2 hover:bg-gray-100 rounded-full transition-colors items-center justify-center"
              aria-label={user ? 'My Profile' : 'Login'}
              title={user ? `Logged in as ${user.name || user.email}` : 'Login or Sign Up'}
            >
              <UserAvatar size={22} />
            </button>

            {/* Cart */}
            <button onClick={() => setIsCartOpen(true)} className="hidden md:block relative p-2 text-black hover:bg-gray-100 rounded-full transition-colors">
              <div className="relative">
                <ShoppingCart size={22} />
                {mounted && totalItems > 0 && (
                  <span className="absolute bg-[#c23d6a] text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold leading-none border-2 border-white" style={{ top: '-7px', right: '-7px' }}>
                    {totalItems}
                  </span>
                )}
              </div>
            </button>

            {/* More (⋮) panel */}
            <div ref={moreRef} className="hidden md:block relative">
              <button onClick={() => setIsMoreOpen(v => !v)} className="p-2 text-black hover:bg-gray-100 rounded-full transition-colors">
                <AlignJustify size={24} strokeWidth={2.5} />
              </button>

              {isMoreOpen && (
                <div className="absolute top-full right-0 mt-3 z-50" style={{ width: 420 }}>
                  <div className="bg-white shadow-2xl rounded-2xl border border-gray-100 overflow-hidden">

                    {/* ── Profile row — dynamic based on auth state ── */}
                    {user ? (
                      /* Logged-in: show avatar + name + "My Profile" */
                      <>
                      <Link href='/profile'>
                        <button
                          onClick={handleProfileClick}
                          className="w-full flex items-center gap-3 px-5 py-4 hover:bg-gray-50 transition-colors border-b border-gray-100 text-left"
                        >
                          <div className="w-9 h-9 rounded-full bg-[#c23d6a] flex items-center justify-center text-white font-black text-sm shrink-0">
                            {(user.name || user.email || 'U')[0].toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-gray-900 truncate">{user.name || 'My Account'}</p>
                            {user.email && <p className="text-xs text-gray-400 truncate">{user.email}</p>}
                          </div>
                          
                          <span className="text-xs font-bold text-[#c23d6a] shrink-0">Profile →</span>
                          
                        </button>
                        </Link>

                        {/* Logout row */}
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-5 py-4 hover:bg-red-50 transition-colors border-b border-gray-100 text-left group"
                        >
                          <LogOut size={18} className="text-gray-400 group-hover:text-red-500 shrink-0" />
                          <span className="text-sm font-semibold text-gray-700 group-hover:text-red-500">Log out</span>
                        </button>
                      </>
                    ) : (
                      /* Logged-out: show "Login or signup" */
                      <button
                        onClick={handleProfileClick}
                        className="w-full flex items-center gap-3 px-5 py-4 hover:bg-gray-50 transition-colors border-b border-gray-100 text-left"
                      >
                        <LogIn size={18} className="text-gray-700 shrink-0" />
                        <span className="text-sm font-semibold text-gray-900">Login or signup</span>
                      </button>
                    )}

                    {/* Bulk orders */}
                    <Link href="/bulk" className="flex items-start gap-3 px-5 py-4 hover:bg-gray-50 transition-colors border-b border-gray-100" onClick={() => setIsMoreOpen(false)}>
                      <ArrowUpRight size={18} className="text-gray-700 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-semibold text-gray-900">Bulk orders</p>
                        <p className="text-xs text-gray-400 mt-0.5">Contact for bulk orders</p>
                      </div>
                    </Link>

                    <div className="py-1">
                      <Link href="/terms" className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition-colors" onClick={() => setIsMoreOpen(false)}>
                        <span className="text-sm font-semibold text-gray-800">Terms and conditions</span>
                      </Link>
                      <Link href="/privacy" className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition-colors" onClick={() => setIsMoreOpen(false)}>
                        <span className="text-sm font-semibold text-gray-800">Privacy policy</span>
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ─── Search Overlay ───────────────────────────────────────────────── */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-[99999] flex items-start justify-center pt-0 md:pt-20">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={closeSearch} />
          <div className="relative w-full md:max-w-2xl bg-white md:rounded-2xl shadow-2xl flex flex-col" style={{ animation: 'fadeInDown 0.25s ease forwards', maxHeight: '90vh' }}>
            <div className="flex items-center gap-3 px-4 md:px-5 py-4 border-b border-gray-100 shrink-0">
              <Search size={22} className="text-gray-400 shrink-0" />
              <input type="text" autoFocus placeholder="Search for oats, muesli..." value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent border-none focus:ring-0 text-base outline-none" />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="p-1 hover:bg-gray-100 rounded-full">
                  <X size={18} className="text-gray-400" />
                </button>
              )}
              <button onClick={closeSearch} className="p-2 hover:bg-gray-100 rounded-full shrink-0">
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              {searchQuery.trim() === '' ? (
                <div className="p-5">
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Popular Searches</p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {['Rolled Oats', 'Muesli'].map(term => (
                      <button key={term} onClick={() => setSearchQuery(term)} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-sm font-semibold text-gray-800 transition-colors">
                        {term}
                      </button>
                    ))}
                  </div>
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Browse Categories</p>
                  <div className="grid grid-cols-2 gap-3">
                    {navProducts.map(item => (
                      <Link key={item.name} href={item.link} onClick={closeSearch} className="flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors">
                        <div className="relative w-12 h-12 bg-white rounded-lg overflow-hidden shrink-0">
                          <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
                        </div>
                        <span className="text-sm font-bold">{item.name}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              ) : searchResults.length > 0 ? (
                <div className="divide-y divide-gray-100">
                  {searchResults.map(p => (
                    <Link key={p.id} href={`/products?category=${p.category}`} onClick={closeSearch} className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition-colors">
                      <div className="relative w-14 h-14 bg-[#f8f8f8] rounded-lg overflow-hidden shrink-0 border border-gray-100">
                        <Image src={p.image} alt={p.name} fill className="object-contain p-1" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-gray-900 line-clamp-1">{p.name}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{p.category}</p>
                      </div>
                      <p className="text-sm font-black text-[#c23d6a] shrink-0">₹ {p.price}</p>
                    </Link>
                  ))}
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

      {/* ─── Cart Off-canvas ─────────────────────────────────────────────── */}
      {isCartOpen && (
        <div className="fixed inset-0 z-[99999] flex justify-end">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsCartOpen(false)} />
          <div className="relative w-full max-w-sm md:max-w-lg bg-white h-full shadow-2xl flex flex-col" style={{ animation: 'slideInRight 0.3s ease forwards' }}>
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 shrink-0">
              <div className="flex items-center gap-2">
                <ShoppingCart size={20} className="text-[#c23d6a]" />
                <span className="font-bold text-base">Your Cart {mounted && totalItems > 0 && <span className="text-[#c23d6a]">({totalItems})</span>}</span>
              </div>
              <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-gray-100 rounded-full"><X size={20} /></button>
            </div>
            <div className="flex-1 overflow-y-auto">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center px-6">
                  <ShoppingCart size={56} className="text-gray-200 mb-4" />
                  <p className="text-base font-bold text-gray-400">Your cart is empty</p>
                  <p className="text-sm text-gray-300 mt-1 mb-6">Add some products to get started</p>
                  <button onClick={() => setIsAddProductsOpen(true)} className="bg-[#c23d6a] text-white px-8 py-3 rounded-full text-sm font-bold hover:bg-[#a8305a] transition-colors">
                    Browse Products
                  </button>
                </div>
              ) : (
                <>
                  <div className="divide-y divide-gray-100 px-5">
                    {cart.map(item => (
                      <div key={item.id} className="flex gap-3 py-4">
                        <div className="relative w-20 h-20 bg-[#f8f8f8] rounded-xl overflow-hidden shrink-0 border border-gray-100">
                          {item.image && <Image src={item.image} alt={item.name} fill className="object-contain p-1" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-sm font-bold text-gray-900 leading-snug line-clamp-2">{item.name}</p>
                            <button onClick={() => removeFromCart(item.id)} className="p-1 text-gray-400 hover:text-red-400 hover:bg-red-50 rounded-full shrink-0">
                              <X size={18} />
                            </button>
                          </div>
                          <p className="text-sm text-[#c23d6a] font-black mt-1 mb-2">₹ {item.price}</p>
                          <div className="flex items-center bg-[#f5f5f5] rounded-full px-1 py-0.5 gap-1 w-fit">
                            <button onClick={() => updateQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1} className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-white disabled:opacity-30">
                              <Minus size={12} />
                            </button>
                            <span className="w-6 text-center text-sm font-bold select-none">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-white">
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
                <Link href="/checkout" onClick={() => setIsCartOpen(false)} className="block w-full bg-[#c23d6a] text-white text-center text-sm font-bold py-4 rounded-2xl hover:bg-[#a8305a] transition-colors active:scale-95 transform">
                  Proceed to Checkout
                </Link>
                <button onClick={() => setIsCartOpen(false)} className="block w-full text-center text-sm font-semibold text-gray-400 mt-3 hover:text-gray-600 transition-colors">
                  Continue Shopping
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ─── Add Products Modal ───────────────────────────────────────────── */}
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
            <div className="flex gap-3 px-5 py-3 border-b border-gray-100 shrink-0">
              {['OATS', 'Muesli'].map(cat => (
                <button key={cat} onClick={() => setActiveCategory(cat)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 font-bold text-sm transition-all ${activeCategory === cat ? 'bg-[#f0ece2] border-[#c23d6a] text-black' : 'border-gray-200 bg-gray-50 text-gray-400'}`}>
                  <div className="relative w-8 h-8 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                    <Image src={cat === 'OATS' ? '/images/oatsimg.jpg' : '/images/meusliimg.png'} alt={cat} fill className="object-contain p-0.5" />
                  </div>
                  {cat === 'OATS' ? 'Oats' : 'Muesli'}
                </button>
              ))}
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {filteredProds.map(item => {
                  const inCart = cart.find(c => c.id === item.id);
                  return (
                    <div key={item.id} className="bg-[#fafafa] rounded-2xl p-3 border border-gray-100 flex flex-col">
                      <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-white mb-2">
                        <Image src={item.image} alt={item.name} fill className="object-contain p-3" />
                      </div>
                      <p className="text-xs font-bold text-gray-900 leading-snug mb-1 line-clamp-2">{item.name}</p>
                      <p className="text-sm font-black text-[#c23d6a] mb-2">₹ {item.price}</p>
                      {inCart ? (
                        <div className="flex items-center justify-between bg-[#fff3f7] border border-[#c23d6a] rounded-xl px-2 py-1 mt-auto">
                          <button onClick={() => updateQuantity(item.id, inCart.quantity - 1)} disabled={inCart.quantity <= 1} className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-white disabled:opacity-30"><Minus size={11} /></button>
                          <span className="text-xs font-black text-[#c23d6a]">{inCart.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, inCart.quantity + 1)} className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-white"><Plus size={11} /></button>
                        </div>
                      ) : (
                        <button onClick={() => addToCart({ id: item.id, name: item.name, price: item.price, image: item.image })} className="w-full mt-auto bg-[#c23d6a] text-white text-xs font-bold py-2 rounded-xl hover:bg-[#a8305a] transition-colors active:scale-95">
                          + Add
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="px-5 py-4 border-t border-gray-100 bg-[#fafafa] shrink-0">
              <button onClick={() => setIsAddProductsOpen(false)} className="w-full bg-[#c23d6a] text-white text-sm font-bold py-3.5 rounded-2xl hover:bg-[#a8305a] transition-colors">
                Done — View Cart ({totalItems} items)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Mobile Sidebar ──────────────────────────────────────────────── */}
      {isSidebarOpen && (
        <div className="fixed inset-0 flex" style={{ zIndex: 99999 }}>
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)} />
          <div ref={sidebarRef} className="relative w-[80%] max-w-sm bg-white h-full shadow-2xl flex flex-col" style={{ animation: 'slideInLeft 0.3s ease forwards' }}>

            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <span className="font-black text-xl tracking-tighter">MENU</span>
              <button onClick={() => setIsSidebarOpen(false)} className="p-2 bg-gray-100 rounded-full"><X size={20} /></button>
            </div>

            <nav className="flex-1 overflow-y-auto">
              <div className="p-6 space-y-5 border-b border-gray-100">
                <Link href="/about" className="block text-lg font-bold" onClick={() => setIsSidebarOpen(false)}>About Us</Link>
              </div>

              <div className="p-6 space-y-1">

                {/* ── Profile row — dynamic based on auth state ── */}
                {user ? (
                  <>
                   <Link href='/profile'>
                    {/* Logged-in: avatar + name row → /profile */}
                    <button
                      onClick={handleProfileClick}
                      className="w-full flex items-center gap-4 py-3 text-left"
                    >
                      <div className="w-9 h-9 rounded-full bg-[#c23d6a] flex items-center justify-center text-white font-black text-sm shrink-0">
                        {(user.name || user.email || 'U')[0].toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-base font-bold text-gray-900 truncate">{user.name || 'My Account'}</p>
                        {user.email && <p className="text-xs text-gray-400 truncate">{user.email}</p>}
                      </div>
                     
                      <span className="text-xs font-bold text-[#c23d6a]">Profile →</span>
                      
                    </button>
                     </Link>

                    {/* Logout */}
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-4 py-3 text-left group"
                    >
                      <LogOut size={20} className="text-gray-400 group-hover:text-red-500 shrink-0" />
                      <span className="text-base font-semibold text-gray-700 group-hover:text-red-500">Log out</span>
                    </button>
                  </>
                ) : (
                  /* Logged-out: "Login or signup" → /login */
                  <button
                    onClick={handleProfileClick}
                    className="w-full flex items-center gap-4 py-3 text-left"
                  >
                    <LogIn size={20} className="text-gray-700 shrink-0" />
                    <span className="text-base font-semibold text-gray-900">Login or signup</span>
                  </button>
                )}

                <Link href="/bulk" className="flex items-start gap-4 py-3" onClick={() => setIsSidebarOpen(false)}>
                  <ArrowUpRight size={20} className="text-gray-700 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-base font-semibold text-gray-900">Bulk orders</p>
                    <p className="text-sm text-gray-400">Contact for bulk orders</p>
                  </div>
                </Link>

                <div className="border-t border-gray-200 my-2" />

                <Link href="/terms" className="flex items-center gap-4 py-3" onClick={() => setIsSidebarOpen(false)}>
                  <span className="text-base font-semibold text-gray-900">Terms and conditions</span>
                </Link>
                <Link href="/privacy" className="flex items-center gap-4 py-3" onClick={() => setIsSidebarOpen(false)}>
                  <span className="text-base font-semibold text-gray-900">Privacy policy</span>
                </Link>
              </div>
            </nav>

            <div className="p-6 bg-gray-50 border-t border-gray-100">
              <p className="text-[10px] text-gray-400 font-bold uppercase mb-4">Follow Us</p>
              <div className="flex gap-4">
                <div className="w-8 h-8 bg-gray-200 rounded-full" />
                <div className="w-8 h-8 bg-gray-200 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── Mobile Bottom Nav ───────────────────────────────────────────── */}
      <nav
        className="md:hidden bg-white border-t border-gray-200"
        style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 9999, paddingBottom: 'env(safe-area-inset-bottom)', boxShadow: '0 -2px 16px rgba(0,0,0,0.08)' }}
      >
        <div className="flex items-center justify-around h-16 px-2">
          <Link href="/" onClick={() => setIsSidebarOpen(false)} className={`flex flex-col items-center gap-1 flex-1 py-2 transition-colors ${pathname === '/' ? 'text-[#c23d6a]' : 'text-gray-500'}`}>
            <Home size={22} strokeWidth={2} />
            <span className="text-[10px] font-semibold">Home</span>
          </Link>

          <button onClick={() => { setIsSidebarOpen(true); setIsShopMobileOpen(true); }} className="flex flex-col items-center gap-1 flex-1 py-2 text-gray-500 transition-colors">
            <Store size={22} strokeWidth={2} />
            <span className="text-[10px] font-semibold">Shop</span>
          </button>

          <button onClick={() => setIsCartOpen(true)} className="flex flex-col items-center justify-center flex-1 py-2 text-gray-500 transition-colors">
            <div className="relative w-fit h-fit flex items-center justify-center">
              <ShoppingCart size={22} strokeWidth={2} />
              {mounted && totalItems > 0 && (
                <span className="absolute bg-[#c23d6a] text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold leading-none border-2 border-white" style={{ top: '-6px', right: '-8px' }}>
                  {totalItems}
                </span>
              )}
            </div>
            <span className="text-[10px] font-semibold mt-1">Cart</span>
          </button>

          {/* ── Profile tab — dynamic ── */}
          <button
            onClick={handleProfileClick}
            className={`flex flex-col items-center gap-1 flex-1 py-2 transition-colors ${pathname === '/profile' ? 'text-[#c23d6a]' : 'text-gray-500'}`}
          >
            {user ? (
              /* Logged-in: coloured initial circle */
              <div className="w-6 h-6 rounded-full bg-[#c23d6a] flex items-center justify-center text-white font-black text-[10px]">
                {(user.name || user.email || 'U')[0].toUpperCase()}
              </div>
            ) : (
              <User size={22} strokeWidth={2} />
            )}
            <span className="text-[10px] font-semibold">{user ? 'Profile' : 'Login'}</span>
          </button>
        </div>
      </nav>
    </>
  );
}