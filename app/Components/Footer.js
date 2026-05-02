"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import dynamic from 'next/dynamic';

// 1. Setup dynamic imports with a fallback to avoid the "Promise" error
const Icon = (name) => dynamic(() => 
  import('lucide-react').then((mod) => {
    const Component = mod[name];
    // Fallback to a span if the icon is missing to prevent crashing
    return Component || (() => <span className="w-3.5 h-3.5" />);
  }), 
  { 
    ssr: false,
    loading: () => <span className="w-3.5 h-3.5 animate-pulse bg-gray-600 rounded-full" />
  }
);

// Define the components outside the main Footer render
const Linkedin = Icon('Linkedin');
const Instagram = Icon('Instagram');
const Twitter = Icon('Twitter');
const Youtube = Icon('Youtube');
const ArrowRight = Icon('ArrowRight');

export default function Footer() {
  return (
    <footer className="bg-[#333a3d] text-white">
      <div className="max-w-[1200px] mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-12 items-start">
        
      {/* 1. Logo Section */}
<div className="lg:col-span-1 flex justify-center lg:justify-start"> 
  {/* Added 'flex justify-center' to center on mobile, 'lg:justify-start' to keep left-aligned on desktop */}
  <div className="relative w-60 h-60 flex items-center justify-center">
    {/* Added 'flex items-center justify-center' to center the Image inside the relative div */}
    <Image 
      src="/images/logoimg.png" 
      alt="Gym Hack Logo"
      width={190}
      height={190}
      className="object-contain"
      priority
    />
  </div>
</div>

        {/* 2. Customer Support */}
        <div className="font-secondary">
          <h4 className="font-primary text-2xl uppercase mb-6 tracking-wider">Customer Supports:</h4>
          <p className="text-xl font-bold mb-4">+91 987654323</p>
          <div className="text-gray-300 text-sm leading-relaxed mb-4">
            <p>4517 Washington Ave.</p>
            <p>Manchester, Kentucky 39495</p>
          </div>
          <Link href="mailto:Shop@gymhack.com" className="font-bold hover:text-[#c23d6a] transition-colors">
            Shop@gymhack.com
          </Link>
        </div>

        {/* 3. Top Category */}
        <div className="font-secondary">
          <h4 className="font-primary text-2xl uppercase mb-6 tracking-wider">Top Category</h4>
          <ul className="space-y-4 text-gray-400 text-sm">
            <li><Link href="#" className="hover:text-white transition-colors">Oats</Link></li>
            <li><Link href="#" className="hover:text-white transition-colors">Muesli</Link></li>
          </ul>
          <Link href="#" className="mt-8 inline-flex items-center gap-2 bg-[#c23d6a] px-5 py-2.5 rounded-lg text-xs font-bold uppercase hover:brightness-110 transition-all">
            Browse All Product <ArrowRight size={14} />
          </Link>
        </div>

        {/* 4. Quick Links */}
        <div className="font-secondary">
          <h4 className="font-primary text-2xl uppercase mb-6 tracking-wider">Quick Links</h4>
          <ul className="space-y-3 text-gray-400 text-sm">
            <li><Link href="#" className="hover:text-white">Shop Product</Link></li>
            <li><Link href="#" className="hover:text-white">Shoping Cart</Link></li>
            <li><Link href="#" className="hover:text-white">About us</Link></li>
            <li><Link href="#" className="hover:text-white">All products</Link></li>
            <li><Link href="#" className="hover:text-white">Contact us</Link></li>
            <li><Link href="#" className="hover:text-white">Customer Help</Link></li>
          </ul>
        </div>

        {/* 5. Social Media */}
        <div className="font-secondary">
          <h4 className="font-primary text-2xl uppercase mb-6 tracking-wider">Social Media</h4>
          <div className="flex flex-col gap-3">
            <SocialPill label="LinkedIn"><Linkedin size={14} /></SocialPill>
            <SocialPill label="Instagram"><Instagram size={14} /></SocialPill>
            <SocialPill label="Twitter"><Twitter size={14} /></SocialPill>
            <SocialPill label="Youtube"><Youtube size={14} /></SocialPill>
          </div>
        </div>
      </div>

      <div className="bg-[#1e2325] py-6 border-t border-gray-700/50">
        <p className="text-center text-gray-500 text-[12px] tracking-wide font-secondary px-4">
          Copyrights gymhack © 2026. Designed and developed by wexoraa infotech
        </p>
      </div>
    </footer>
  );
}

// 2. Separate helper component to ensure children render correctly
function SocialPill({ children, label }) {
  return (
    <Link 
      href="#" 
      className="flex items-center gap-3 px-5 py-2 border border-gray-600 rounded-full text-[11px] font-bold text-gray-300 hover:bg-white/5 hover:text-white hover:border-white transition-all w-fit min-w-[130px]"
    >
      {children}
      <span className="capitalize">{label}</span>
    </Link>
  );
}