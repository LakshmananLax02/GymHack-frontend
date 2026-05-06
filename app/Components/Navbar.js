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
  FileText,
  Shield,
  AlignJustify,
} from 'lucide-react';

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
  const sidebarRef = useRef(null);
  const moreRef = useRef(null);

  // Close sidebar when clicking outside
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
      {/* ─── Top Utility Ticker ─── */}
      <div className="bg-[#f3ead8] py-2 overflow-hidden border-b border-black/5">
        <div
          className="flex whitespace-nowrap"
          style={{ animation: 'ticker 20s linear infinite' }}
        >
          {[0, 1].map((i) => (
            <div key={i} className="flex shrink-0">
              {TICKER_ITEMS.map((text) => (
                <span key={text} className="mx-20 text-[11px] font-bold tracking-widest text-gray-800">
                  • &nbsp;&nbsp; {text} &nbsp;&nbsp;
                </span>
              ))}
            </div>
          ))}
        </div>

        <style>{`
          @keyframes ticker {
            0%   { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
        `}</style>
      </div>

      {/* ─── Main Navbar ─── */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-[1440px] mx-auto px-4 md:px-10 h-20 flex items-center justify-between gap-4">

          {/* 1. Mobile Menu Toggle & Brand */}
          <div className="flex items-center gap-3 flex-1 md:flex-none">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden p-2 text-black"
            >
              <Menu size={28} />
            </button>
            <Link href="/" className="flex items-center gap-2">
              <div className="w-15 h-15 bg-[#c23d6a] rounded-full flex items-center justify-center p-1 relative">
                <Image src="/images/logoimg.png" alt="Logo" fill className="object-contain p-1" />
              </div>
            </Link>
          </div>

          {/* 2. Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 flex-1 justify-center">
            <Link
              href="/"
              className={`text-xl font-bold tracking-tight hover:text-[#c23d6a] transition-colors ${pathname === '/' ? 'text-[#c23d6a]' : ''}`}
            >
              Home
            </Link>

            {/* Shop Dropdown */}
            <div
              className="relative group"
              onMouseEnter={() => setIsShopOpen(true)}
              onMouseLeave={() => setIsShopOpen(false)}
            >
              <button className="text-xl font-bold tracking-tight flex items-center gap-1 hover:text-[#c23d6a] transition-colors">
                Shop <ChevronDown size={14} strokeWidth={3} className={`transition-transform duration-200 ${isShopOpen ? 'rotate-180' : ''}`} />
              </button>
              {isShopOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4 w-64 z-50">
                  <div className="bg-white shadow-xl rounded-xl border border-gray-100 p-4">
                    {products.map((item) => (
                      <Link
                        key={item.name}
                        href={item.link}
                        className="flex items-center gap-4 p-2 hover:bg-gray-50 rounded-lg transition-colors"
                      >
                        <div className="relative w-12 h-12 bg-gray-100 rounded-md overflow-hidden">
                          <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
                        </div>
                        <span className="text-sm font-bold">{item.name}</span>
                      </Link>
                    ))}
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
            {/* Search */}
            <div className="hidden lg:flex items-center bg-gray-100 rounded-full px-4 py-2 border border-transparent focus-within:bg-white focus-within:border-gray-200 transition-all">
              <Search size={18} className="text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                className="bg-transparent border-none focus:ring-0 text-sm ml-2 w-40 outline-none"
              />
            </div>

            <button className="lg:hidden p-2 text-black hover:bg-gray-100 rounded-full transition-colors">
              <Search size={22} />
            </button>

            

            <Link href="/profile" className="p-2 text-black hover:bg-gray-100 rounded-full transition-colors">
              <User size={22} />
            </Link>

            <Link href="/cart" className="p-2 text-black hover:bg-gray-100 rounded-full relative transition-colors">
              <ShoppingCart size={22} />
              <span className="absolute top-0.5 right-0.5 bg-[#c23d6a] text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                3
              </span>
            </Link>

            {/* Desktop hamburger menu — opens More panel */}
            <div ref={moreRef} className="hidden md:block relative">
              <button
                onClick={() => setIsMoreOpen((v) => !v)}
                className="p-2 text-black hover:bg-gray-100 rounded-full transition-colors"
                aria-label="More options"
              >
                <AlignJustify size={24} strokeWidth={2.5} />
              </button>

              {isMoreOpen && (
                <div className="absolute top-full right-0 mt-3 z-50" style={{ width: '420px' }}>
                  <div className="bg-white shadow-2xl rounded-2xl border border-gray-100 overflow-hidden">
                    {/* Login / Signup */}
                    <Link
                      href="/login"
                      className="flex items-center gap-3 px-5 py-4 hover:bg-gray-50 transition-colors border-b border-gray-100"
                      onClick={() => setIsMoreOpen(false)}
                    >
                      <LogIn size={18} className="text-gray-700 shrink-0" />
                      <span className="text-sm font-semibold text-gray-900">Login or signup</span>
                    </Link>

                    {/* Bulk Orders */}
                    <Link
                      href="/bulk"
                      className="flex items-start gap-3 px-5 py-4 hover:bg-gray-50 transition-colors border-b border-gray-100"
                      onClick={() => setIsMoreOpen(false)}
                    >
                      <ArrowUpRight size={18} className="text-gray-700 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-semibold text-gray-900">Bulk orders</p>
                        <p className="text-xs text-gray-400 mt-0.5">Contact for bulk orders</p>
                      </div>
                    </Link>

                    {/* Terms & Privacy */}
                    <div className="py-1">
                      <Link
                        href="/terms"
                        className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition-colors"
                        onClick={() => setIsMoreOpen(false)}
                      >
                        <span className="text-sm font-semibold text-gray-800">Terms and conditions</span>
                      </Link>
                      <Link
                        href="/privacy"
                        className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition-colors"
                        onClick={() => setIsMoreOpen(false)}
                      >
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

      {/* ─── Mobile Sidebar Overlay ─── */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-[100] flex">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsSidebarOpen(false)}
          />

          {/* Sidebar Content */}
          <div
            ref={sidebarRef}
            className="relative w-[80%] max-w-sm bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-left duration-300"
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <span className="font-black text-xl tracking-tighter">MENU</span>
              <button onClick={() => setIsSidebarOpen(false)} className="p-2 bg-gray-100 rounded-full">
                <X size={20} />
              </button>
            </div>

            {/* Scrollable Body */}
            <nav className="flex-1 overflow-y-auto">
              {/* Main nav links */}
              <div className="p-6 space-y-5 border-b border-gray-100">
                <Link href="/" className="block text-lg font-bold" onClick={() => setIsSidebarOpen(false)}>
                  Home
                </Link>

                {/* Shop — accordion dropdown */}
                <div>
                  <button
                    onClick={() => setIsShopMobileOpen((v) => !v)}
                    className="w-full flex items-center justify-between text-lg font-bold py-0.5"
                  >
                    <span>Shop</span>
                    <ChevronDown
                      size={18}
                      strokeWidth={3}
                      className={`transition-transform duration-200 ${isShopMobileOpen ? 'rotate-180' : ''}`}
                    />
                  </button>

                  {isShopMobileOpen && (
                    <div className="mt-3 space-y-2 pl-1">
                      <p className="text-[10px] font-black text-gray-400 tracking-widest mb-2">Shop Categories</p>
                      {products.map((item) => (
                        <Link
                          key={item.name}
                          href={item.link}
                          className="flex items-center gap-4 p-1"
                          onClick={() => setIsSidebarOpen(false)}
                        >
                          <div className="w-10 h-10 bg-gray-50 rounded-lg relative overflow-hidden shrink-0">
                            <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
                          </div>
                          <span className="font-bold">{item.name}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                <Link href="/about" className="block text-lg font-bold" onClick={() => setIsSidebarOpen(false)}>
                  About Us
                </Link>
              </div>

              {/* ─── The menu section from the screenshot ─── */}
              <div className="p-6 space-y-1">
                {/* Login or signup */}
                <Link
                  href="/login"
                  className="flex items-center gap-4 py-3"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <LogIn size={20} className="text-gray-700 shrink-0" />
                  <span className="text-base font-semibold text-gray-900">Login or signup</span>
                </Link>

                {/* Bulk orders */}
                <Link
                  href="/bulk"
                  className="flex items-start gap-4 py-3"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <ArrowUpRight size={20} className="text-gray-700 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-base font-semibold text-gray-900">Bulk orders</p>
                    <p className="text-sm text-gray-400">Contact for bulk orders</p>
                  </div>
                </Link>

                {/* Divider */}
                <div className="border-t border-gray-200 my-2" />

                {/* Terms and conditions */}
                <Link
                  href="/terms"
                  className="flex items-center gap-4 py-3"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <span className="text-base font-semibold text-gray-900">Terms and conditions</span>
                </Link>

                {/* Privacy policy */}
                <Link
                  href="/privacy"
                  className="flex items-center gap-4 py-3"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <span className="text-base font-semibold text-gray-900">Privacy policy</span>
                </Link>
              </div>
            </nav>

            {/* Footer */}
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
    </>
  );
}


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
//   const sidebarRef = useRef(null);
//   const moreRef = useRef(null);

//   // Cart count — replace with your real cart state/context
//   const cartCount = 3;

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
//       {/* ─── Top Utility Ticker ─── */}
//       <div className="bg-[#f3ead8] py-6 overflow-hidden border-b border-black/5">
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

//         <style>{`
//           @keyframes ticker {
//             0%   { transform: translateX(0); }
//             100% { transform: translateX(-50%); }
//           }
//           @keyframes slideInLeft {
//             0%   { transform: translateX(-100%); }
//             100% { transform: translateX(0); }
//           }
//           html, body {
//             min-height: 100%;
//             height: 100%;
//           }
//           #__next, main {
//             min-height: 100vh;
//           }
//         `}</style>
//       </div>

//       {/* ─── Main Navbar ─── */}
//       <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
//         <div className="max-w-[1440px] mx-auto px-4 md:px-10 h-20 flex items-center justify-between gap-4">

//           {/* 1. Mobile Menu Toggle & Brand */}
//           <div className="flex items-center gap-3 flex-1 md:flex-none">
//             {/* Hamburger — mobile only */}
//             <button
//               onClick={() => setIsSidebarOpen(true)}
//               className="md:hidden p-2 text-black"
//             >
//               <Menu size={28} />
//             </button>

//             <Link href="/" className="flex items-center gap-2">
//               <div className="w-15 h-15 bg-[#c23d6a] rounded-full flex items-center justify-center p-1 relative">
//                 <Image src="/images/logoimg.png" alt="Logo" fill className="object-contain p-1" />
//               </div>
//             </Link>
//           </div>

//           {/* 2. Desktop Navigation Links */}
//           <nav className="hidden md:flex items-center gap-8 flex-1 justify-center">
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
//              {isShopOpen && (
//   <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4 z-50">
//     <div className="bg-white shadow-xl rounded-xl border border-gray-100 p-4 min-w-max">
//       {/* Changed to flex-row and added gap between horizontal items */}
//       <div className="flex flex-row items-center gap-6">
//         {products.map((item) => (
//           <Link
//             key={item.name}
//             href={item.link}
//             className="flex flex-col items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors min-w-[120px]"
//           >
//             {/* Image Container */}
//             <div className="relative w-20 h-20 bg-gray-100 rounded-lg overflow-hidden shrink-0">
//               <Image 
//                 src={item.imageUrl} 
//                 alt={item.name} 
//                 fill 
//                 className="object-cover" 
//               />
//             </div>
//             {/* Text now appears below the image for a cleaner horizontal look */}
//             <span className="text-sm font-bold uppercase tracking-tight">
//               {item.name}
//             </span>
//           </Link>
//         ))}
//       </div>
//     </div>
//   </div>
// )}
//             </div>

//             <Link href="/about" className="text-xl font-bold tracking-tight hover:text-[#c23d6a] transition-colors">
//               About
//             </Link>
//           </nav>

//           {/* 3. Utility Icons — desktop only (mobile uses bottom nav) */}
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

//             {/* Search icon — tablet only (md but not lg) */}
//             <button className="hidden md:flex lg:hidden p-2 text-black hover:bg-gray-100 rounded-full transition-colors">
//               <Search size={22} />
//             </button>

//             {/* Desktop hamburger menu — opens More panel */}
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
//                     <Link
//                       href="/login"
//                       className="flex items-center gap-3 px-5 py-4 hover:bg-gray-50 transition-colors border-b border-gray-100"
//                       onClick={() => setIsMoreOpen(false)}
//                     >
//                       <LogIn size={18} className="text-gray-700 shrink-0" />
//                       <span className="text-sm font-semibold text-gray-900">Login or signup</span>
//                     </Link>

//                     <Link
//                       href="/bulk"
//                       className="flex items-start gap-3 px-5 py-4 hover:bg-gray-50 transition-colors border-b border-gray-100"
//                       onClick={() => setIsMoreOpen(false)}
//                     >
//                       <ArrowUpRight size={18} className="text-gray-700 shrink-0 mt-0.5" />
//                       <div>
//                         <p className="text-sm font-semibold text-gray-900">Bulk orders</p>
//                         <p className="text-xs text-gray-400 mt-0.5">Contact for bulk orders</p>
//                       </div>
//                     </Link>

//                     <div className="py-1">
//                       <Link
//                         href="/terms"
//                         className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition-colors"
//                         onClick={() => setIsMoreOpen(false)}
//                       >
//                         <span className="text-sm font-semibold text-gray-800">Terms and conditions</span>
//                       </Link>
//                       <Link
//                         href="/privacy"
//                         className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition-colors"
//                         onClick={() => setIsMoreOpen(false)}
//                       >
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

//        {/* Cart — desktop only */}
// <Link 
//   href="/cart" 
//   className="hidden md:flex relative p-2 text-black hover:bg-gray-100 rounded-full transition-colors"
// >
//   <div className="relative">
//     <ShoppingCart size={22} />
//     {cartCount > 0 && (
//       <span 
//         className="absolute bg-[#c23d6a] text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold leading-none border-2 border-white"
//         style={{ 
//           top: '-7px', 
//           right: '-7px' 
//         }}
//       >
//         {cartCount}
//       </span>
//     )}
//   </div>
// </Link>
//           </div>
//         </div>
//       </header>

//       {/* ─── Mobile Sidebar Overlay ─── */}
//       {isSidebarOpen && (
//         <div className="fixed inset-0 flex" style={{ zIndex: 99999 }}>
//           {/* Backdrop */}
//           <div
//             className="absolute inset-0 bg-black/50 backdrop-blur-sm"
//             onClick={() => setIsSidebarOpen(false)}
//           />

//           {/* Sidebar Content */}
//           <div
//             ref={sidebarRef}
//             className="relative w-[80%] max-w-sm bg-white h-full shadow-2xl flex flex-col"
//             style={{
//               animation: 'slideInLeft 0.3s ease forwards',
//             }}
//           >
//             {/* Header */}
//             <div className="p-6 border-b border-gray-100 flex items-center justify-between">
//               <span className="font-black text-xl tracking-tighter">MENU</span>
//               <button onClick={() => setIsSidebarOpen(false)} className="p-2 bg-gray-100 rounded-full">
//                 <X size={20} />
//               </button>
//             </div>

//             {/* Scrollable Body */}
//             <nav className="flex-1 overflow-y-auto">
//               <div className="p-6 space-y-5 border-b border-gray-100">
//                 <Link href="/" className="block text-lg font-bold" onClick={() => setIsSidebarOpen(false)}>
//                   Home
//                 </Link>

//                 {/* Shop accordion */}
//                 <div>
//                   <button
//                     onClick={() => setIsShopMobileOpen((v) => !v)}
//                     className="w-full flex items-center justify-between text-lg font-bold py-0.5"
//                   >
//                     <span>Shop</span>
//                     <ChevronDown
//                       size={18}
//                       strokeWidth={3}
//                       className={`transition-transform duration-200 ${isShopMobileOpen ? 'rotate-180' : ''}`}
//                     />
//                   </button>

//                   {isShopMobileOpen && (
//                     <div className="mt-3 space-y-2 pl-1">
//                       <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Shop Categories</p>
//                       {products.map((item) => (
//                         <Link
//                           key={item.name}
//                           href={item.link}
//                           className="flex items-center gap-4"
//                           onClick={() => setIsSidebarOpen(false)}
//                         >
//                           <div className="w-10 h-10 bg-gray-50 rounded-lg relative overflow-hidden shrink-0">
//                             <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
//                           </div>
//                           <span className="font-bold">{item.name}</span>
//                         </Link>
//                       ))}
//                     </div>
//                   )}
//                 </div>

//                 <Link href="/about" className="block text-lg font-bold" onClick={() => setIsSidebarOpen(false)}>
//                   About Us
//                 </Link>
//               </div>

//               <div className="p-6 space-y-1">
//                 <Link
//                   href="/login"
//                   className="flex items-center gap-4 py-3"
//                   onClick={() => setIsSidebarOpen(false)}
//                 >
//                   <LogIn size={20} className="text-gray-700 shrink-0" />
//                   <span className="text-base font-semibold text-gray-900">Login or signup</span>
//                 </Link>

//                 <Link
//                   href="/bulk"
//                   className="flex items-start gap-4 py-3"
//                   onClick={() => setIsSidebarOpen(false)}
//                 >
//                   <ArrowUpRight size={20} className="text-gray-700 shrink-0 mt-0.5" />
//                   <div>
//                     <p className="text-base font-semibold text-gray-900">Bulk orders</p>
//                     <p className="text-sm text-gray-400">Contact for bulk orders</p>
//                   </div>
//                 </Link>

//                 <div className="border-t border-gray-200 my-2" />

//                 <Link
//                   href="/terms"
//                   className="flex items-center gap-4 py-3"
//                   onClick={() => setIsSidebarOpen(false)}
//                 >
//                   <span className="text-base font-semibold text-gray-900">Terms and conditions</span>
//                 </Link>

//                 <Link
//                   href="/privacy"
//                   className="flex items-center gap-4 py-3"
//                   onClick={() => setIsSidebarOpen(false)}
//                 >
//                   <span className="text-base font-semibold text-gray-900">Privacy policy</span>
//                 </Link>
//               </div>
//             </nav>

//             {/* Footer */}
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

//           {/* Cart — badge positioned relative to icon only, not the label */}
//     <Link
//   href="/cart"
//   className="flex flex-col items-center justify-center flex-1 py-2 text-gray-500 transition-colors"
// >
//   {/* Wrap the icon in a div with 'relative' and 'w-fit' */}
//   <div className="relative w-fit h-fit flex items-center justify-center">
//     <ShoppingCart size={22} strokeWidth={2} />
    
//     {cartCount > 0 && (
//       <span 
//         className="absolute bg-[#c23d6a] text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold leading-none border-2 border-white"
//         style={{ 
//           top: '-6px',    // Move it UP
//           right: '-8px'   // Move it to the RIGHT
//         }}
//       >
//         {cartCount}
//       </span>
//     )}
//   </div>
//   <span className="text-[10px] font-semibold mt-1">Cart</span>
// </Link>

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

//       {/* Bottom nav spacer — accounts for nav height + iOS safe area */}
//       <div className="md:hidden" style={{ height: 'calc(4rem + env(safe-area-inset-bottom))' }} />
//     </>
//   );
// }