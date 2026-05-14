import React from 'react';
import { MoveUpRight, Users, Salad, Star, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function Hero() {
  return (
    <section className="relative w-full">
      {/* --- Main Hero Section with Background Video --- */}
      <div className="relative h-[500px] md:h-[550px] w-full flex flex-col items-center justify-center text-center px-4 overflow-hidden">
        
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
            // className="inline-flex items-center gap-2 bg-[#c23d6a] text-white px-8 py-4 rounded-full text-lg font-bold hover:bg-[#f0ece2] hover:text-black transition-all hover:scale-105 active:scale-95 shadow-2xl"
                        className="inline-flex items-center gap-2 bg-[#c23d6a] text-white px-5 py-2.5 rounded-full text-sm font-bold hover:bg-[#f0ece2] hover:text-black transition-all hover:scale-105 active:scale-95 shadow-2xl"

          >
            Explore all products
            <MoveUpRight size={20} strokeWidth={3} />
          </Link>
        </div>
      </div>
{/* --- Static Stats Bar Section --- */}
<div className="bg-[#f0ece2] py-3 md:py-5 border-t border-b border-black/10">
  <div className="max-w-[1440px] mx-auto px-4 md:px-40 grid grid-cols-4">

    {/* Stat 1: Plant Based */}
    <div className="flex flex-col md:flex-row items-center justify-center gap-1 md:gap-4 border-r border-black/10 px-1 md:px-6">
      <div className="relative w-15 h-15 md:w-20 md:h-20 lg:w-20 lg:h-20 shrink-0">
        <Image
          src="/images/carouselbottomimg1.png"
          alt="Plant Based"
          fill
          className="object-contain"
        />
      </div>
    </div>

    {/* Stat 2: Certified Vegan */}
    <div className="flex flex-col md:flex-row items-center justify-center gap-1 md:gap-4 border-r border-black/10 px-1 md:px-6">
      <div className="relative w-15 h-15 md:w-20 md:h-20 lg:w-20 lg:h-20 shrink-0">
        <Image
          src="/images/carouselbottomimg2.png"
          alt="Certified Vegan"
          fill
          className="object-contain"
        />
      </div>

    </div>

    {/* Stat 3: Gluten Free */}
    <div className="flex flex-col md:flex-row items-center justify-center gap-1 md:gap-4 border-r border-black/10 px-1 md:px-6">
      <div className="relative w-15 h-15 md:w-20 md:h-20 lg:w-20 lg:h-20 shrink-0">
        <Image
          src="/images/carouselbottomimg3.png"
          alt="Gluten Free"
          fill
          className="object-contain"
        />
      </div>
      
    </div>

    {/* Stat 4: Nutrient Dense */}
    <div className="flex flex-col md:flex-row items-center justify-center gap-1 md:gap-4 px-1 md:px-6">
      <div className="relative w-15 h-15 md:w-20 md:h-20 lg:w-20 lg:h-20 shrink-0">
        <Image
          src="/images/carouselbottomimg4.png"
          alt="Nutrient Dense"
          fill
          className="object-contain"
        />
      </div>
    </div>

  </div>
</div>
    </section>
  );
}