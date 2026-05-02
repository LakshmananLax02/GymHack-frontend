'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Search, ChevronRight, Menu, X, ChevronDown } from 'lucide-react';

const products = [
  { name: 'Oats',   imageUrl: '/images/oatshoverimg.png',   link: '/products/oats' },
  { name: 'Muesli', imageUrl: '/images/meuslihoverimg1.png',  link: '/products/muesli' },
];

const TICKER_ITEMS = [
  'Fuel your body the right way',
  'Strong habits create strong bodies',
  'Discipline builds results',
  'Consistency beats motivation',
];

export default function Navbar() {
  const pathname = usePathname();

  const [isMegaMenuOpen,  setIsMegaMenuOpen]  = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileShopOpen, setIsMobileShopOpen] = useState(false);

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    setIsMobileShopOpen(false);
  };

  return (
    <>
      {/* ─── Announcement Ticker ─────────────────────────────────── */}
      <div className="bg-[#f0ece2] py-2 overflow-hidden border-b border-black/5">
        <div
          className="flex whitespace-nowrap"
          style={{ animation: 'ticker 28s linear infinite' }}
        >
          {[0, 1].map((copy) => (
            <div key={copy} className="flex shrink-0">
              {TICKER_ITEMS.map((text) => (
                <span
                  key={text}
                  className="mx-8 text-[13px] font-medium uppercase tracking-tight text-gray-800"
                >
                  • {text}
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

      {/* ─── Main Navigation ─────────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="max-w-[1440px] mx-auto px-4 md:px-10 h-20 flex items-center justify-between">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="w-14 h-14 bg-[#c23d6a] rounded-full flex items-center justify-center p-1">
              <span className="text-white font-black text-[9px] leading-tight text-center uppercase">
                Gym<br />Hack
              </span>
            </div>
            <span className="hidden lg:block text-2xl font-black tracking-tighter">
              GYM HACK
            </span>
          </Link>

          {/* ── Desktop Nav ── */}
          <nav className="hidden md:flex items-center gap-10 font-bold text-gray-900 text-lg uppercase">
            <Link href="/" className="hover:text-[#c23d6a] transition-colors">
              Home
            </Link>

            {/* Mega-menu (hover) */}
            <div
              className="relative py-6"
              onMouseEnter={() => setIsMegaMenuOpen(true)}
              onMouseLeave={() => setIsMegaMenuOpen(false)}
            >
              <button className="hover:text-[#c23d6a] transition-colors flex items-center gap-1">
                Shop all products
                <ChevronDown
                  size={18}
                  strokeWidth={2.5}
                  className={`transition-transform duration-200 ${isMegaMenuOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {isMegaMenuOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 w-screen max-w-[1200px] bg-[#f0ece2] rounded-3xl p-10 shadow-2xl border border-black/5 flex flex-col">
                  <h2 className="text-3xl font-black mb-8 text-black">Products</h2>
                  <div className="flex gap-10">
                    {products.map((item) => (
                      <Link key={item.name} href={item.link} className="group">
                        {/* ── Product image ── */}
                        <div className="relative w-44 h-44 bg-white rounded-3xl overflow-hidden mb-4 border border-black/5 shadow-sm">
                          <Image
                            src={item.imageUrl}
                            alt={item.name}
                            fill
                            className="object-cover"
                            sizes="176px"
                          />
                        </div>
                        <p className="text-center font-black text-xl group-hover:text-[#c23d6a] transition-colors">
                          {item.name}
                        </p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Link href="/about" className="hover:text-[#c23d6a] transition-colors">
              About
            </Link>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <Search size={24} strokeWidth={2.5} />
            </button>

            <Link
              href="/order"
              className="bg-[#c23d6a] text-white px-6 py-2.5 rounded-full flex items-center gap-2 font-bold hover:bg-[#a8325a] transition-all shadow-md active:scale-95"
            >
              Order now
              <ChevronRight size={20} strokeWidth={3} />
            </Link>

            {/* Hamburger */}
            <button
              onClick={() => setIsMobileMenuOpen((v) => !v)}
              className="md:hidden p-2"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {/* ── Mobile Nav Drawer ── */}
        {isMobileMenuOpen && (
          <div className="md:hidden fixed inset-0 top-[120px] bg-white z-[60] p-6 flex flex-col gap-6 overflow-y-auto">
            <Link
              href="/"
              onClick={closeMobileMenu}
              className="text-3xl font-black uppercase hover:text-[#c23d6a] transition-colors"
            >
              Home
            </Link>

            {/* Shop — tap to expand */}
            <div>
              <button
                onClick={() => setIsMobileShopOpen((v) => !v)}
                className="text-3xl font-black uppercase flex items-center gap-2 hover:text-[#c23d6a] transition-colors w-full text-left"
              >
                Shop
                <ChevronDown
                  size={26}
                  strokeWidth={2.5}
                  className={`transition-transform duration-200 ${isMobileShopOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {isMobileShopOpen && (
                <div className="mt-4 pl-4 flex flex-col gap-4">
                  {products.map((item) => (
                    <Link
                      key={item.name}
                      href={item.link}
                      onClick={closeMobileMenu}
                      className="flex items-center gap-3 group"
                    >
                      {/* ── Thumbnail in mobile drawer ── */}
                      <div className="relative w-10 h-10 rounded-xl overflow-hidden border border-black/10 shrink-0">
                        <Image
                          src={item.imageUrl}
                          alt={item.name}
                          fill
                          className="object-cover"
                          sizes="40px"
                        />
                      </div>
                      <span className="text-xl font-bold text-gray-700 group-hover:text-[#c23d6a] transition-colors">
                        {item.name}
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link
              href="/about"
              onClick={closeMobileMenu}
              className="text-3xl font-black uppercase hover:text-[#c23d6a] transition-colors"
            >
              About
            </Link>
          </div>
        )}
      </header>
    </>
  );
}