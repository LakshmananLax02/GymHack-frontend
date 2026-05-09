import React from 'react';
import { MoveUpRight, Users, Salad, Star, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function Hero() {
  return (
    <section className="relative w-full">
      {/* --- Main Hero Section with Background Video --- */}
      <div className="relative h-[500px] md:h-[650px] w-full flex flex-col items-center justify-center text-center px-4 overflow-hidden">
        
        {/* Background Video Implementation */}
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover brightness-[0.5]"
          >
            <source src="/images/carouselvideo.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          {/* Subtle dark overlay for text contrast */}
          <div className="absolute inset-0 bg-black/20" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-[900px] mx-auto">
          <h1 className="text-3xl md:text-5xl lg:text-7xl font-primary font-bold mb-6 text-white leading-[1.2]">
            Stronger Workouts Start <br className="hidden md:block" /> with Better Fuel
          </h1>

          <p className="text-lg md:text-xl font-secondary font-medium mb-10 max-w-[600px] mx-auto text-gray-200">
            Refuel your body with clean, powerful nutrition after every workout.
          </p>

          <Link 
            href="/products" 
            className="inline-flex items-center gap-2 bg-[#c23d6a] text-white px-8 py-4 rounded-full text-lg font-bold hover:bg-[#f0ece2] hover:text-black transition-all hover:scale-105 active:scale-95 shadow-2xl"
          >
            Explore all products
            <MoveUpRight size={20} strokeWidth={3} />
          </Link>
        </div>
      </div>

      {/* --- Static Stats Bar Section - Single Line --- */}
      <div className="bg-[#f0ece2] py-4 md:py-4 border-t border-black/5">
        <div className="max-w-[1440px] mx-auto px-2 md:px-6 grid grid-cols-4 gap-1 md:gap-4">
          
          {/* Stat 1: Happy Customers */}
          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 text-center md:text-left lg:justify-center lg:border-r border-black/10">
            <Users className="text-[#3a5a40] w-6 h-6 md:w-12 md:h-12" strokeWidth={1.5} />
            <div>
              <p className="font-primary text-sm md:text-3xl lg:text-4xl font-black text-[#3a5a40] leading-none">
                50K+
              </p>
              <p className="font-secondary p-1 text-[8px] md:text-[10px] lg:text-xs font-bold text-[#3a5a40] tracking-tighter md:tracking-widest">
                Happy Customers
              </p>
            </div>
          </div>

          {/* Stat 2: Bowls Enjoyed */}
          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 text-center md:text-left lg:justify-center lg:border-r border-black/10">
            <Salad className="text-[#3a5a40] w-6 h-6 md:w-12 md:h-12" strokeWidth={1.5} />
            <div>
              <p className="font-primary text-sm md:text-3xl lg:text-4xl font-black text-[#3a5a40] leading-none">
                2M+
              </p>
              <p className="font-secondary p-1 text-[8px] md:text-[10px] lg:text-xs font-bold text-[#3a5a40] tracking-tighter md:tracking-widest">
                Bowls Enjoyed
              </p>
            </div>
          </div>

          {/* Stat 3: Customer Rating */}
          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 text-center md:text-left lg:justify-center lg:border-r border-black/10">
            <Star className="text-[#3a5a40] w-6 h-6 md:w-12 md:h-12" strokeWidth={1.5} />
            <div>
              <p className="font-primary text-sm md:text-3xl lg:text-4xl font-black text-[#3a5a40] leading-none">
                4.8/5
              </p>
              <p className="font-secondary p-1 text-[8px] md:text-[10px] lg:text-xs font-bold text-[#3a5a40] tracking-tighter md:tracking-widest">
                Rating
              </p>
            </div>
          </div>

          {/* Stat 4: Clean & Safe */}
          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 text-center md:text-left lg:justify-center">
            <ShieldCheck className="text-[#3a5a40] w-6 h-6 md:w-12 md:h-12" strokeWidth={1.5} />
            <div>
              <p className="font-primary text-sm md:text-3xl lg:text-4xl font-black text-[#3a5a40] leading-none">
                100%
              </p>
              <p className="font-secondary p-1 text-[8px] md:text-[10px] lg:text-xs font-bold text-[#3a5a40] tracking-tighter md:tracking-widest">
                Clean & Safe
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}