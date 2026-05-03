import React from 'react';
import { MoveUpRight, Users, Salad, Star, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function Hero() {
  return (
    <section className="relative w-full">
      {/* --- Main Hero Section --- */}
      <div className="relative h-[500px] md:h-[500px] lg:h-[500px] w-full flex flex-col items-center justify-center text-center px-4 overflow-hidden">
        
        {/* Background Image & Overlay */}
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-transform duration-700 hover:scale-105"
          style={{ 
            backgroundImage: "url('/images/carouselimg.png')", // Put your gym man image in public/hero-bg.jpg
            backgroundColor: "#1a1a1a" // Fallback color
          }}
        >
          {/* Dark Overlay to make text readable */}
          <div className="absolute inset-0 bg-black/50" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-[900px] mx-auto">
          <h1 className="text-2xl font-primary md:text-3xl lg:text-5xl font-black text-white uppercase mb-6">
            Stronger Workouts Start <br className="hidden font-primary md:block" /> with Better Fuel
          </h1>
          
          <p className="text-gray-200 text-lg font-secondary md:text-xl font-medium mb-10 max-w-[600px] mx-auto">
            Refuel your body with clean, powerful nutrition after every workout.
          </p>

          <Link 
            href="/products" 
            className="inline-flex items-center gap-2 bg-[#c23d6a] text-white px-8 py-4 rounded-full text-lg font-bold hover:bg-[#f0ece2] hover:text-black transition-all hover:scale-105 active:scale-95 shadow-xl shadow-pink-900/20"
          >
            Explore all products
            <MoveUpRight size={20} strokeWidth={3} />
          </Link>
        </div>
      </div>

      {/* --- Stats Bar Section --- */}
      <div className="bg-[#f0ece2] py-12 md:py-16 border-t border-black/5">
        <div className="max-w-[1440px] mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          
          {/* Stat 1: Happy Customers */}
          <div className="flex items-center gap-4 lg:justify-center lg:border-r border-black/10">
            <Users className="text-[#3a5a40] w-15 h-15 md:w-15 md:h-15" strokeWidth={1.5} />
            <div>
              <p className="text-2xl text-[#3a5a40] font-secondary md:text-3xl font-black leading-none">50K+</p>
              <p className="text-sm font-secondary md:text-base font-bold text-[#3a5a40]">Happy Customers</p>
            </div>
          </div>

          {/* Stat 2: Bowls Enjoyed */}
          <div className="flex items-center gap-4 lg:justify-center lg:border-r border-black/10">
            <Salad className="text-[#3a5a40] w-15 h-15 md:w-15 md:h-15" strokeWidth={1.5} />
            <div>
              <p  className="font-secondary text-2xl md:text-3xl font-black text-[#3a5a40] leading-none">2M+</p>
              <p className="font-secondary text-sm md:text-base font-bold text-[#3a5a40]">Bowls Enjoyed</p>
            </div>
          </div>

          {/* Stat 3: Customer Rating */}
          <div className="flex items-center gap-4 lg:justify-center lg:border-r border-black/10">
            <Star className="text-[#3a5a40] w-15 h-15 md:w-15 md:h-15" strokeWidth={1.5} />
            <div>
              <p className="font-secondary text-2xl md:text-3xl font-black text-[#3a5a40] leading-none">4.8/5</p>
              <p className="font-secondary text-sm md:text-base font-bold text-[#3a5a40]">Customer Rating</p>
            </div>
          </div>

          {/* Stat 4: Clean & Safe */}
          <div className="flex items-center gap-4 lg:justify-center">
            <ShieldCheck className="text-[#3a5a40] w-15 h-15 md:w-15 md:h-15" strokeWidth={1.5} />
            <div>
              <p className="font-secondary text-2xl md:text-3xl font-black text-[#3a5a40] leading-none">100%</p>
              <p className="font-secondary text-sm md:text-base font-bold text-[#3a5a40]">Clean & Safe</p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}