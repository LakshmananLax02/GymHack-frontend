"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
// Note: Ensure you have run 'npm install react-icons lucide-react'
import { FaLinkedin, FaInstagram, FaYoutube } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6'; 
import { Phone, Mail, MapPin, ArrowRight } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#333a3d] text-white">
      <div className="max-w-[1200px] mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-12 items-start">
        
        {/* 1. Logo Section */}
        <div className="lg:col-span-1 flex justify-center lg:justify-start"> 
          <div className="relative w-60 h-60 flex items-center justify-center">
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
          <h4 className="font-primary text-2xl uppercase mb-6 tracking-wider">Customer Support:</h4>
          <p className="text-xl font-bold mb-4">+91 987654323</p>
          <div className="text-gray-300 text-sm leading-relaxed mb-4 flex gap-3">
            <MapPin size={18} className="shrink-0" />
            <div>
              <p>4517 Washington Ave.</p>
              <p>Manchester, Kentucky 39495</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Mail size={18} className="text-gray-400" />
            <Link href="mailto:shop@gymhack.com" className="font-bold hover:text-[#c23d6a] transition-colors">
              shop@gymhack.com
            </Link>
          </div>
        </div>

        {/* 3. Top Category */}
        <div className="font-secondary">
          <h4 className="font-primary text-2xl uppercase mb-6 tracking-wider">Top Category</h4>
          <ul className="space-y-4 text-gray-400 text-sm">
            <li><Link href="/category/oats" className="hover:text-white transition-colors">Oats</Link></li>
            <li><Link href="/category/muesli" className="hover:text-white transition-colors">Muesli</Link></li>
          </ul>
          <Link href="/products" className="mt-8 inline-flex items-center gap-2 bg-[#c23d6a] px-5 py-2.5 rounded-lg text-xs font-bold hover:brightness-110 transition-all hover:bg-[#f0ece2] hover:text-black transition-all hover:scale-105">
            Browse All Product <ArrowRight size={14} />
          </Link>
        </div>

        {/* 4. Quick Links */}
        <div className="font-secondary">
          <h4 className="font-primary text-2xl uppercase mb-6 tracking-wider">Quick Links</h4>
          <ul className="space-y-3 text-gray-400 text-sm">
            <li><Link href="/products" className="hover:text-white transition-colors">Shop Product</Link></li>
            <li><Link href="/cart" className="hover:text-white transition-colors">Shopping Cart</Link></li>
            <li><Link href="/about" className="hover:text-white transition-colors">About us</Link></li>
            <li><Link href="/contact" className="hover:text-white transition-colors">Contact us</Link></li>
            <li><Link href="/help" className="hover:text-white transition-colors">Customer Help</Link></li>
          </ul>
        </div>

        {/* 5. Social Media */}
        <div className="font-secondary">
          <h4 className="font-primary text-3xl uppercase mb-6 tracking-wider text-[#e2e2d5]">Social Media</h4>
          <div className="flex flex-col gap-4">
            <SocialPill label="LinkedIn" href="https://linkedin.com" icon={<FaLinkedin size={18} />} />
            <SocialPill label="Instagram" href="https://instagram.com" icon={<FaInstagram size={18} />} />
            <SocialPill label="twitter" href="https://twitter.com" icon={<FaXTwitter size={18} />} />
            <SocialPill label="Youtube" href="https://youtube.com" icon={<FaYoutube size={18} />} />
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

function SocialPill({ label, href, icon }) {
  return (
    <Link 
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      /* 
         - Changed 'border-gray-700/50' to 'border-gray-500' for better visibility
         - Added 'hover:border-[#c23d6a]' for an interactive border highlight
      */
      className="group flex items-center gap-4 px-4 py-2 border border-gray-500 rounded-full text-[15px] font-medium text-[#e2e2d5] hover:bg-white/5 hover:border-[#c23d6a] transition-all w-fit min-w-[180px]"
    >
      <div className="bg-white text-[#333a3d] p-1 rounded-sm flex items-center justify-center">
        {icon}
      </div>
      <span className="capitalize">{label}</span>
    </Link>
  );
}