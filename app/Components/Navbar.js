// 'use client';

// import React, { useState, useEffect, useRef } from 'react';
// import Link from 'next/link';
// import Image from 'next/image';
// import { usePathname } from 'next/navigation';
// import {
//   Search,
//   ChevronDown,
//   ShoppingCart,
//   User,
//   Menu,
//   X,
//   LogIn,
//   ArrowUpRight,
//   Home,
//   Store,
//   AlignJustify,
// } from 'lucide-react';
// import { useCartStore } from '../store/useCartStore';

// const products = [
//   { name: 'Oats', imageUrl: '/images/oatshoverimg.png', link: '/products?category=OATS' },
//   { name: 'Muesli', imageUrl: '/images/meuslihoverimg1.png', link: '/products?category=Muesli' },
// ];

// const TICKER_ITEMS = [
//   'Free Shipping on orders over $50',
//   'Discipline builds results',
//   'Fuel your body the right way',
// ];

// export default function Navbar() {
//   const pathname = usePathname();
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//   const [isShopOpen, setIsShopOpen] = useState(false);
//   const [isMoreOpen, setIsMoreOpen] = useState(false);
//   const [isShopMobileOpen, setIsShopMobileOpen] = useState(false);
//   const [mounted, setMounted] = useState(false);
//   const sidebarRef = useRef(null);
//   const moreRef = useRef(null);

//   const cart = useCartStore((state) => state.cart);

//   useEffect(() => {
//     setMounted(true);
//   }, []);

//   const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

//   useEffect(() => {
//     function handleClickOutside(event) {
//       if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
//         setIsSidebarOpen(false);
//       }
//       if (moreRef.current && !moreRef.current.contains(event.target)) {
//         setIsMoreOpen(false);
//       }
//     }
//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, []);

//   return (
//     <>
//       <style>{`
//         @keyframes ticker {
//           0%   { transform: translateX(0); }
//           100% { transform: translateX(-50%); }
//         }
//         @keyframes slideInLeft {
//           0%   { transform: translateX(-100%); }
//           100% { transform: translateX(0); }
//         }
//       `}</style>

//       {/* ─── Top Utility Ticker ─── */}
//       <div className="bg-[#f3ead8] py-2 overflow-hidden border-b border-black/5">
//         <div
//           className="flex whitespace-nowrap"
//           style={{ animation: 'ticker 20s linear infinite' }}
//         >
//           {[0, 1].map((i) => (
//             <div key={i} className="flex shrink-0">
//               {TICKER_ITEMS.map((text) => (
//                 <span key={text} className="mx-20 text-[11px] font-bold uppercase tracking-widest text-gray-800">
//                   • &nbsp;&nbsp; {text} &nbsp;&nbsp;
//                 </span>
//               ))}
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* ─── Main Navbar ─── */}
//       <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm overflow-visible">
//         <div className="max-w-[1440px] mx-auto px-4 md:px-25 h-20 flex items-center justify-between gap-4">

//           {/* 1. Logo + Mobile Hamburger */}
//           <div className="flex items-center justify-between w-full md:w-auto md:flex-none">

//             {/* Logo — LEFT on mobile */}
//             <Link href="/" className="flex items-center gap-2">
//               <div className="w-17 h-17 bg-[#c23d6a] rounded-full flex items-center justify-center p-1 relative">
//                 <Image src="/images/logoimg.png" alt="Logo" fill className="object-contain p-1" />
//               </div>
//             </Link>

//             {/* Hamburger — RIGHT on mobile */}
//             <button
//               onClick={() => setIsSidebarOpen(true)}
//               className="md:hidden text-black ml-auto"
//             >
//               <Menu size={28} />
//             </button>
//           </div>

//           {/* 2. Desktop Navigation Links */}
//           <nav className="hidden md:flex items-center gap-8 flex-1 justify-center ml-70">
//             <Link
//               href="/"
//               className={`text-xl font-bold tracking-tight hover:text-[#c23d6a] transition-colors ${pathname === '/' ? 'text-[#c23d6a]' : ''}`}
//             >
//               Home
//             </Link>

//             {/* Shop Dropdown */}
//             <div
//               className="relative group"
//               onMouseEnter={() => setIsShopOpen(true)}
//               onMouseLeave={() => setIsShopOpen(false)}
//             >
//               <button className="text-xl font-bold tracking-tight flex items-center gap-1 hover:text-[#c23d6a] transition-colors">
//                 Shop <ChevronDown size={14} strokeWidth={3} className={`transition-transform duration-200 ${isShopOpen ? 'rotate-180' : ''}`} />
//               </button>
//               {isShopOpen && (
//                 <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4 z-50">
//                   <div className="bg-white shadow-xl rounded-xl border border-gray-100 p-4 min-w-max">
//                     <div className="flex flex-row items-center gap-6">
//                       {products.map((item) => (
//                         <Link
//                           key={item.name}
//                           href={item.link}
//                           className="flex flex-col items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors min-w-[120px]"
//                         >
//                           <div className="relative w-20 h-20 bg-gray-100 rounded-lg overflow-hidden shrink-0">
//                             <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
//                           </div>
//                           <span className="text-sm font-bold uppercase tracking-tight">{item.name}</span>
//                         </Link>
//                       ))}
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>

//             <Link href="/about" className="text-xl font-bold tracking-tight hover:text-[#c23d6a] transition-colors">
//               About
//             </Link>
//           </nav>

//           {/* 3. Utility Icons — desktop only */}
//           <div className="flex items-center justify-end gap-1 md:gap-4 flex-1 md:flex-none">

//             {/* Search — desktop only */}
//             <div className="hidden lg:flex items-center bg-gray-100 rounded-full px-4 py-2 border border-transparent focus-within:bg-white focus-within:border-gray-200 transition-all">
//               <Search size={18} className="text-gray-400" />
//               <input
//                 type="text"
//                 placeholder="Search products..."
//                 className="bg-transparent border-none focus:ring-0 text-sm ml-2 w-40 outline-none"
//               />
//             </div>

//             {/* Search icon — tablet only */}
//             <button className="hidden md:flex lg:hidden p-2 text-black hover:bg-gray-100 rounded-full transition-colors">
//               <Search size={22} />
//             </button>

//             {/* More menu */}
//             <div ref={moreRef} className="hidden md:block relative">
//               <button
//                 onClick={() => setIsMoreOpen((v) => !v)}
//                 className="p-2 text-black hover:bg-gray-100 rounded-full transition-colors"
//                 aria-label="More options"
//               >
//                 <AlignJustify size={24} strokeWidth={2.5} />
//               </button>

//               {isMoreOpen && (
//                 <div className="absolute top-full right-0 mt-3 z-50" style={{ width: '420px' }}>
//                   <div className="bg-white shadow-2xl rounded-2xl border border-gray-100 overflow-hidden">
//                     <Link href="/login" className="flex items-center gap-3 px-5 py-4 hover:bg-gray-50 transition-colors border-b border-gray-100" onClick={() => setIsMoreOpen(false)}>
//                       <LogIn size={18} className="text-gray-700 shrink-0" />
//                       <span className="text-sm font-semibold text-gray-900">Login or signup</span>
//                     </Link>
//                     <Link href="/bulk" className="flex items-start gap-3 px-5 py-4 hover:bg-gray-50 transition-colors border-b border-gray-100" onClick={() => setIsMoreOpen(false)}>
//                       <ArrowUpRight size={18} className="text-gray-700 shrink-0 mt-0.5" />
//                       <div>
//                         <p className="text-sm font-semibold text-gray-900">Bulk orders</p>
//                         <p className="text-xs text-gray-400 mt-0.5">Contact for bulk orders</p>
//                       </div>
//                     </Link>
//                     <div className="py-1">
//                       <Link href="/terms" className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition-colors" onClick={() => setIsMoreOpen(false)}>
//                         <span className="text-sm font-semibold text-gray-800">Terms and conditions</span>
//                       </Link>
//                       <Link href="/privacy" className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition-colors" onClick={() => setIsMoreOpen(false)}>
//                         <span className="text-sm font-semibold text-gray-800">Privacy policy</span>
//                       </Link>
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>

//             {/* Profile — desktop only */}
//             <Link href="/profile" className="hidden md:flex p-2 text-black hover:bg-gray-100 rounded-full transition-colors">
//               <User size={22} />
//             </Link>

//             {/* Cart — navigates to /cart page */}
//             <Link
//               href="/ProductsCart"
//               className="hidden md:flex relative p-2 text-black hover:bg-gray-100 rounded-full transition-colors"
//             >
//               <div className="relative">
//                 <ShoppingCart size={22} />
//                 {mounted && totalItems > 0 && (
//                   <span
//                     className="absolute bg-[#c23d6a] text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold leading-none border-2 border-white"
//                     style={{ top: '-7px', right: '-7px' }}
//                   >
//                     {totalItems}
//                   </span>
//                 )}
//               </div>
//             </Link>

//           </div>
//         </div>
//       </header>

//       {/* ─── Mobile Sidebar Overlay ─── */}
//       {isSidebarOpen && (
//         <div className="fixed inset-0 flex" style={{ zIndex: 99999 }}>
//           <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)} />
//           <div
//             ref={sidebarRef}
//             className="relative w-[80%] max-w-sm bg-white h-full shadow-2xl flex flex-col"
//             style={{ animation: 'slideInLeft 0.3s ease forwards' }}
//           >
//             <div className="p-6 border-b border-gray-100 flex items-center justify-between">
//               <span className="font-black text-xl tracking-tighter">MENU</span>
//               <button onClick={() => setIsSidebarOpen(false)} className="p-2 bg-gray-100 rounded-full">
//                 <X size={20} />
//               </button>
//             </div>

//             <nav className="flex-1 overflow-y-auto">
//               <div className="p-6 space-y-5 border-b border-gray-100">
//                 <Link href="/about" className="block text-lg font-bold" onClick={() => setIsSidebarOpen(false)}>
//                   About Us
//                 </Link>
//               </div>

//               <div className="p-6 space-y-1">
//                 <Link href="/login" className="flex items-center gap-4 py-3" onClick={() => setIsSidebarOpen(false)}>
//                   <LogIn size={20} className="text-gray-700 shrink-0" />
//                   <span className="text-base font-semibold text-gray-900">Login or signup</span>
//                 </Link>
//                 <Link href="/bulk" className="flex items-start gap-4 py-3" onClick={() => setIsSidebarOpen(false)}>
//                   <ArrowUpRight size={20} className="text-gray-700 shrink-0 mt-0.5" />
//                   <div>
//                     <p className="text-base font-semibold text-gray-900">Bulk orders</p>
//                     <p className="text-sm text-gray-400">Contact for bulk orders</p>
//                   </div>
//                 </Link>
//                 <div className="border-t border-gray-200 my-2" />
//                 <Link href="/terms" className="flex items-center gap-4 py-3" onClick={() => setIsSidebarOpen(false)}>
//                   <span className="text-base font-semibold text-gray-900">Terms and conditions</span>
//                 </Link>
//                 <Link href="/privacy" className="flex items-center gap-4 py-3" onClick={() => setIsSidebarOpen(false)}>
//                   <span className="text-base font-semibold text-gray-900">Privacy policy</span>
//                 </Link>
//               </div>
//             </nav>

//             <div className="p-6 bg-gray-50 border-t border-gray-100">
//               <p className="text-[10px] text-gray-400 font-bold uppercase mb-4">Follow Us</p>
//               <div className="flex gap-4">
//                 <div className="w-8 h-8 bg-gray-200 rounded-full" />
//                 <div className="w-8 h-8 bg-gray-200 rounded-full" />
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ─── Mobile Bottom Nav Bar ─── */}
//       <nav
//         className="md:hidden bg-white border-t border-gray-200"
//         style={{
//           position: 'fixed',
//           bottom: 0,
//           left: 0,
//           right: 0,
//           zIndex: 9999,
//           paddingBottom: 'env(safe-area-inset-bottom)',
//           boxShadow: '0 -2px 16px rgba(0,0,0,0.08)',
//         }}
//       >
//         <div className="flex items-center justify-around h-16 px-2">

//           {/* Home */}
//           <Link
//             href="/"
//             onClick={() => setIsSidebarOpen(false)}
//             className={`flex flex-col items-center gap-1 flex-1 py-2 transition-colors ${pathname === '/' ? 'text-[#c23d6a]' : 'text-gray-500'}`}
//           >
//             <Home size={22} strokeWidth={2} />
//             <span className="text-[10px] font-semibold">Home</span>
//           </Link>

//           {/* Shop */}
//           <button
//             onClick={() => { setIsSidebarOpen(true); setIsShopMobileOpen(true); }}
//             className="flex flex-col items-center gap-1 flex-1 py-2 text-gray-500 transition-colors"
//           >
//             <Store size={22} strokeWidth={2} />
//             <span className="text-[10px] font-semibold">Shop</span>
//           </button>

//           {/* Cart — navigates to /cart page */}
//           <Link
//             href="/ProductsCart"
//             className={`flex flex-col items-center justify-center flex-1 py-2 transition-colors ${pathname === '/cart' ? 'text-[#c23d6a]' : 'text-gray-500'}`}
//           >
//             <div className="relative w-fit h-fit flex items-center justify-center">
//               <ShoppingCart size={22} strokeWidth={2} />
//               {mounted && totalItems > 0 && (
//                 <span
//                   className="absolute bg-[#c23d6a] text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold leading-none border-2 border-white"
//                   style={{ top: '-6px', right: '-8px' }}
//                 >
//                   {totalItems}
//                 </span>
//               )}
//             </div>
//             <span className="text-[10px] font-semibold mt-1">Cart</span>
//           </Link>

//           {/* Profile */}
//           <Link
//             href="/profile"
//             className={`flex flex-col items-center gap-1 flex-1 py-2 transition-colors ${pathname === '/profile' ? 'text-[#c23d6a]' : 'text-gray-500'}`}
//           >
//             <User size={22} strokeWidth={2} />
//             <span className="text-[10px] font-semibold">Profile</span>
//           </Link>

//         </div>
//       </nav>
//     </>
//   );
// }

'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  Search,
  ChevronDown,
  ShoppingCart,
  User,
  Menu,
  X,
  LogIn,
  ArrowUpRight,
  Home,
  Store,
  AlignJustify,
  Minus,
  Plus,
  Trash2,
} from 'lucide-react';
import { useCartStore } from '../store/useCartStore';

const products = [
  { name: 'Oats', imageUrl: '/images/oatshoverimg.png', link: '/products?category=OATS' },
  { name: 'Muesli', imageUrl: '/images/meuslihoverimg1.png', link: '/products?category=Muesli' },
];

const TICKER_ITEMS = [
  'Free Shipping on orders over $50',
  'Discipline builds results',
  'Fuel your body the right way',
];

export default function Navbar() {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isShopOpen, setIsShopOpen] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [isShopMobileOpen, setIsShopMobileOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const sidebarRef = useRef(null);
  const moreRef = useRef(null);

  const cart = useCartStore((state) => state.cart);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const updateQuantity = useCartStore((state) => state.updateQuantity);

  useEffect(() => {
    setMounted(true);
  }, []);

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  // Lock body scroll when cart is open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isCartOpen]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsSidebarOpen(false);
      }
      if (moreRef.current && !moreRef.current.contains(event.target)) {
        setIsMoreOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      <style>{`
        @keyframes ticker {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes slideInLeft {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(0); }
        }
        @keyframes slideInRight {
          0%   { transform: translateX(100%); }
          100% { transform: translateX(0); }
        }
      `}</style>

      {/* ─── Top Utility Ticker ─── */}
      <div className="bg-[#f3ead8] py-2 overflow-hidden border-b border-black/5">
        <div
          className="flex whitespace-nowrap"
          style={{ animation: 'ticker 20s linear infinite' }}
        >
          {[0, 1].map((i) => (
            <div key={i} className="flex shrink-0">
              {TICKER_ITEMS.map((text) => (
                <span key={text} className="mx-20 text-[11px] font-bold uppercase tracking-widest text-gray-800">
                  • &nbsp;&nbsp; {text} &nbsp;&nbsp;
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ─── Main Navbar ─── */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm overflow-visible">
        <div className="max-w-[1440px] mx-auto px-2 md:px-10 h-20 flex items-center justify-between gap-4">

          {/* 1. Logo + Mobile Hamburger */}
          <div className="flex items-center justify-between w-full md:w-auto md:flex-none">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-15 h-15 bg-[#c23d6a] rounded-full flex items-center justify-center p-1 relative">
                <Image src="/images/logoimg.png" alt="Logo" fill className="object-contain p-1" />
              </div>
            </Link>
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden text-black ml-auto"
            >
              <Menu size={28} />
            </button>
          </div>

          {/* 2. Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 flex-1 justify-center">
            <Link
              href="/"
              className={`text-xl font-bold tracking-tight hover:text-[#c23d6a] transition-colors ${pathname === '/' ? 'text-[#c23d6a]' : ''}`}
            >
              Home
            </Link>

            <div
              className="relative group"
              onMouseEnter={() => setIsShopOpen(true)}
              onMouseLeave={() => setIsShopOpen(false)}
            >
              <button className="text-xl font-bold tracking-tight flex items-center gap-1 hover:text-[#c23d6a] transition-colors">
                Shop <ChevronDown size={14} strokeWidth={3} className={`transition-transform duration-200 ${isShopOpen ? 'rotate-180' : ''}`} />
              </button>
              {isShopOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4 z-50">
                  <div className="bg-white shadow-xl rounded-xl border border-gray-100 p-4 min-w-max">
                    <div className="flex flex-row items-center gap-6">
                      {products.map((item) => (
                        <Link
                          key={item.name}
                          href={item.link}
                          className="flex flex-col items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors min-w-[120px]"
                        >
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

          {/* 3. Utility Icons */}
          <div className="flex items-center justify-end gap-1 md:gap-4 flex-1 md:flex-none">

            <div className="hidden lg:flex items-center bg-gray-100 rounded-full px-4 py-2 border border-transparent focus-within:bg-white focus-within:border-gray-200 transition-all">
              <Search size={18} className="text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                className="bg-transparent border-none focus:ring-0 text-sm ml-2 w-40 outline-none"
              />
            </div>

            <button className="hidden md:flex lg:hidden p-2 text-black hover:bg-gray-100 rounded-full transition-colors">
              <Search size={22} />
            </button>

            <div ref={moreRef} className="hidden md:block relative">
              <button
                onClick={() => setIsMoreOpen((v) => !v)}
                className="p-2 text-black hover:bg-gray-100 rounded-full transition-colors"
              >
                <AlignJustify size={24} strokeWidth={2.5} />
              </button>
              {isMoreOpen && (
                <div className="absolute top-full right-0 mt-3 z-50" style={{ width: '420px' }}>
                  <div className="bg-white shadow-2xl rounded-2xl border border-gray-100 overflow-hidden">
                    <Link href="/login" className="flex items-center gap-3 px-5 py-4 hover:bg-gray-50 transition-colors border-b border-gray-100" onClick={() => setIsMoreOpen(false)}>
                      <LogIn size={18} className="text-gray-700 shrink-0" />
                      <span className="text-sm font-semibold text-gray-900">Login or signup</span>
                    </Link>
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

            <Link href="/profile" className="hidden md:flex p-2 text-black hover:bg-gray-100 rounded-full transition-colors">
              <User size={22} />
            </Link>

            {/* Cart icon — opens offcanvas on ALL screens */}
            <button
              onClick={() => setIsCartOpen(true)}
               className="hidden md:block relative p-2 text-black hover:bg-gray-100 rounded-full transition-colors"            >
              <div className="relative">
                <ShoppingCart size={22} />
                {mounted && totalItems > 0 && (
                  <span
                    className="absolute bg-[#c23d6a] text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold leading-none border-2 border-white"
                    style={{ top: '-7px', right: '-7px' }}
                  >
                    {totalItems}
                  </span>
                )}
              </div>
            </button>

          </div>
        </div>
      </header>

      {/* ─── Cart OffCanvas (Right Side — ALL screens) ─── */}
      {isCartOpen && (
        <div className="fixed inset-0 z-[99999] flex justify-end">

          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsCartOpen(false)}
          />

          {/* Offcanvas Panel */}
          {/* <div
            className="relative w-full max-w-sm bg-white h-full shadow-2xl flex flex-col"
            style={{ animation: 'slideInRight 0.3s ease forwards' }}
          > */}

          <div
  className="relative w-full max-w-lg bg-white h-full shadow-2xl flex flex-col"
  style={{ animation: 'slideInRight 0.3s ease forwards' }}
>
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <ShoppingCart size={20} className="text-[#c23d6a]" />
                <span className="font-bold text-base">
                  Your Cart {mounted && totalItems > 0 && (
                    <span className="text-[#c23d6a]">({totalItems})</span>
                  )}
                </span>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center px-6">
                  <ShoppingCart size={56} className="text-gray-200 mb-4" />
                  <p className="text-base font-bold text-gray-400">Your cart is empty</p>
                  <p className="text-sm text-gray-300 mt-1 mb-6">Add some products to get started</p>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="bg-[#c23d6a] text-white px-8 py-3 rounded-full text-sm font-bold hover:bg-[#a8305a] transition-colors"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <div className="divide-y divide-gray-100 px-5">
                  {cart.map((item) => (
                    <div key={item.id} className="flex gap-3 py-4">

                      {/* Product Image */}
                      <div className="relative w-20 h-20 bg-[#f8f8f8] rounded-xl overflow-hidden shrink-0 border border-gray-100">
                        {item.image && (
                          <Image src={item.image} alt={item.name} fill className="object-contain p-1" />
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-gray-900 leading-snug mb-1 line-clamp-2">{item.name}</p>
                        <p className="text-sm text-[#c23d6a] font-black mb-2">₹ {item.price}</p>

                        {/* Qty + Remove row */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center bg-[#f5f5f5] rounded-full px-1 py-0.5 gap-1">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                              className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-white transition-colors disabled:opacity-30"
                            >
                              <Minus size={12} />
                            </button>
                            <span className="w-6 text-center text-sm font-bold select-none">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-white transition-colors"
                            >
                              <Plus size={12} />
                            </button>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="p-1.5 text-gray-300 hover:text-red-400 transition-colors"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>

                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {cart.length > 0 && (
              <div className="px-5 py-5 border-t border-gray-100 bg-[#fafafa]">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-500 font-semibold">Subtotal</span>
                  <span className="text-sm font-bold text-gray-900">₹ {totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-gray-500 font-semibold">Shipping</span>
                  <span className="text-sm font-bold text-green-500">FREE</span>
                </div>
                <div className="flex items-center justify-between mb-5 pt-3 border-t border-dashed border-gray-200">
                  <span className="text-base font-black text-gray-900">Total</span>
                  <span className="text-xl font-black text-[#c23d6a]">₹ {totalPrice.toFixed(2)}</span>
                </div>
                <Link
                  href="/cart"
                  onClick={() => setIsCartOpen(false)}
                  className="block w-full bg-[#c23d6a] text-white text-center text-sm font-bold py-4 rounded-full hover:bg-[#a8305a] transition-colors active:scale-95 transform"
                >
                  Proceed to Checkout
                </Link>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="block w-full text-center text-sm font-semibold text-gray-400 mt-3 hover:text-gray-600 transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ─── Mobile Sidebar Overlay ─── */}
      {isSidebarOpen && (
        <div className="fixed inset-0 flex" style={{ zIndex: 99999 }}>
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)} />
          <div
            ref={sidebarRef}
            className="relative w-[80%] max-w-sm bg-white h-full shadow-2xl flex flex-col"
            style={{ animation: 'slideInLeft 0.3s ease forwards' }}
          >
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <span className="font-black text-xl tracking-tighter">MENU</span>
              <button onClick={() => setIsSidebarOpen(false)} className="p-2 bg-gray-100 rounded-full">
                <X size={20} />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto">
              <div className="p-6 space-y-5 border-b border-gray-100">
                <Link href="/about" className="block text-lg font-bold" onClick={() => setIsSidebarOpen(false)}>
                  About Us
                </Link>
              </div>
              <div className="p-6 space-y-1">
                <Link href="/login" className="flex items-center gap-4 py-3" onClick={() => setIsSidebarOpen(false)}>
                  <LogIn size={20} className="text-gray-700 shrink-0" />
                  <span className="text-base font-semibold text-gray-900">Login or signup</span>
                </Link>
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

      {/* ─── Mobile Bottom Nav Bar ─── */}
      <nav
        className="md:hidden bg-white border-t border-gray-200"
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 9999,
          paddingBottom: 'env(safe-area-inset-bottom)',
          boxShadow: '0 -2px 16px rgba(0,0,0,0.08)',
        }}
      >
        <div className="flex items-center justify-around h-16 px-2">

          <Link
            href="/"
            onClick={() => setIsSidebarOpen(false)}
            className={`flex flex-col items-center gap-1 flex-1 py-2 transition-colors ${pathname === '/' ? 'text-[#c23d6a]' : 'text-gray-500'}`}
          >
            <Home size={22} strokeWidth={2} />
            <span className="text-[10px] font-semibold">Home</span>
          </Link>

          <button
            onClick={() => { setIsSidebarOpen(true); setIsShopMobileOpen(true); }}
            className="flex flex-col items-center gap-1 flex-1 py-2 text-gray-500 transition-colors"
          >
            <Store size={22} strokeWidth={2} />
            <span className="text-[10px] font-semibold">Shop</span>
          </button>

          {/* Cart bottom nav — opens offcanvas */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="flex flex-col items-center justify-center flex-1 py-2 text-gray-500 transition-colors"
          >
            <div className="relative w-fit h-fit flex items-center justify-center">
              <ShoppingCart size={22} strokeWidth={2} />
              {mounted && totalItems > 0 && (
                <span
                  className="absolute bg-[#c23d6a] text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold leading-none border-2 border-white"
                  style={{ top: '-6px', right: '-8px' }}
                >
                  {totalItems}
                </span>
              )}
            </div>
            <span className="text-[10px] font-semibold mt-1">Cart</span>
          </button>

          <Link
            href="/profile"
            className={`flex flex-col items-center gap-1 flex-1 py-2 transition-colors ${pathname === '/profile' ? 'text-[#c23d6a]' : 'text-gray-500'}`}
          >
            <User size={22} strokeWidth={2} />
            <span className="text-[10px] font-semibold">Profile</span>
          </Link>

        </div>
      </nav>
    </>
  );
}