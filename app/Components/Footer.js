"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaLinkedin, FaInstagram, FaYoutube } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { Phone, Mail, MapPin, ArrowRight } from 'lucide-react';
import { Reveal, RevealGroup } from './scroll/Reveal';

export default function Footer() {
  return (
    <footer className="bg-[#333a3d] text-white">
      <RevealGroup stagger={0.1} amount={0.15} className="max-w-[1200px] mx-auto px-6 py-16 md:px-18 grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-12 items-start">

        {/* 1. Logo Section */}
        <RevealGroup.Item variant="up" className="lg:col-span-1 flex justify-center lg:justify-start">
          <div className="relative w-60 h-60 flex items-center justify-center">
            <Image
              src="/images/logoimg.png"
              alt="Gym Hack Logo"
              width={190}
              height={190}
              className="object-contain transition-transform duration-700 ease-out hover:scale-105"
              priority
            />
          </div>
        </RevealGroup.Item>

        {/* 2. Customer Support */}
        <RevealGroup.Item variant="up" className="font-secondary">
          <h4 className="font-primary text-2xl uppercase mb-6 tracking-wider">Customer care</h4>
          <p className="text-xl font-bold mb-4">+91 6379123952</p>
          <div className="text-gray-300 text-sm leading-relaxed mb-4 flex gap-3">
            <MapPin size={18} className="shrink-0" />
            <div>
              <p>8/1, 1st Floor, Mega City</p>
              <p>Madukkarai, Coimbatore</p>
              <p>Tamil Nadu – 641 105.</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Mail size={18} className="text-gray-400" />
            <Link href="mailto:shop@gymhack.com" className="font-bold hover:text-[#c23d6a] transition-colors">
              gymhackwork@gmail.com
            </Link>
          </div>
        </RevealGroup.Item>

        {/* 3. Top Category */}
        <RevealGroup.Item variant="up" className="font-secondary">
          <h4 className="font-primary text-2xl uppercase mb-6 tracking-wider">Top Category</h4>
          <ul className="space-y-4 text-gray-400 text-sm">
            <li><Link href="/products" className="hover:text-white transition-colors">Oats</Link></li>
            <li><Link href="/products" className="hover:text-white transition-colors">Muesli</Link></li>
          </ul>
          <Link href="/products" className="mt-8 inline-flex items-center gap-2 bg-[#c23d6a] px-5 py-2.5 rounded-full text-xs font-bold transition-all hover:bg-[#f0ece2] hover:text-black hover:scale-105">
            Browse All Product <ArrowRight size={14} />
          </Link>
        </RevealGroup.Item>

        {/* 4. Quick Links */}
        <RevealGroup.Item variant="up" className="font-secondary">
          <h4 className="font-primary text-2xl uppercase mb-6 tracking-wider">Quick Links</h4>
          <ul className="space-y-3 text-gray-400 text-sm">
            <li><Link href="/products" className="hover:text-white transition-colors">Shop Product</Link></li>
            <li><Link href="/about-us" className="hover:text-white transition-colors">About us</Link></li>
            <li><Link href="/contact-us" className="hover:text-white transition-colors">Contact us</Link></li>
                        <li><Link href="/terms-conditions" className="hover:text-white transition-colors">Terms and Conditions</Link></li>

            <li><Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link></li>

            
          </ul>
        </RevealGroup.Item>

        {/* 5. Social Media */}
        <RevealGroup.Item variant="up" className="font-secondary">
          <h4 className="font-primary text-2xl uppercase mb-6 tracking-wider">Social Media</h4>
          <div className="flex flex-col gap-4">
            <SocialPill label="LinkedIn" href="https://linkedin.com" icon={<FaLinkedin size={18} />} />
            <SocialPill label="Instagram" href="https://instagram.com" icon={<FaInstagram size={18} />} />
            <SocialPill label="twitter" href="https://twitter.com" icon={<FaXTwitter size={18} />} />
            <SocialPill label="Youtube" href="https://youtube.com" icon={<FaYoutube size={18} />} />
          </div>
        </RevealGroup.Item>
      </RevealGroup>

      <Reveal variant="fade" amount={0.5}>
        <div className="bg-[#1e2325] py-6 border-t border-gray-700/50 pb-20 md:pb-6">
          <p className="text-center text-gray-200 text-[12px] tracking-wide font-secondary px-4">
            Copyrights gymhack © 2026. Designed and developed by <Link className='text-[#c23d6a]' href="https://wexoraa.com/">Wexoraa infotech</Link>
          </p>
        </div>
      </Reveal>
    </footer>
  );
}

function SocialPill({ label, href, icon }) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center gap-4 px-4 py-2 border border-gray-500 rounded-full text-[15px] font-medium text-[#e2e2d5] hover:bg-white/5 hover:border-[#c23d6a] transition-all w-fit min-w-[180px] hover:translate-x-1"
    >
      <div className="bg-white text-[#333a3d] p-1 rounded-sm flex items-center justify-center transition-transform group-hover:scale-110">
        {icon}
      </div>
      <span className="capitalize">{label}</span>
    </Link>
  );
}
