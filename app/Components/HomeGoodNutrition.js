"use client";

import React from 'react';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-fade';

// Dynamic loading for icons to avoid Turbopack build errors
const Zap = dynamic(() => import('lucide-react').then((mod) => mod.Zap), { ssr: false });
const Sprout = dynamic(() => import('lucide-react').then((mod) => mod.Sprout), { ssr: false });

export default function NutritionHero() {
  // Replace these with your actual image paths
  const slidingImages = [
    "/images/homenutritionimg.png",
    "/images/homenutritionimg.png",
    "/images/homenutritionimg.png"
  ];

  return (
    <section className="w-full">
      {/* --- Top Dark Banner --- */}
      <div className="bg-[#4a5568] text-white py-4 px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="text-white">
            <Sprout size={48} strokeWidth={1.5} />
          </div>
          <div>
            <h2 className="font-primary text-2xl md:text-3xl uppercase tracking-wide">
              Good Nutrition, Anytime
            </h2>
            <p className="font-secondary text-sm text-gray-300 max-w-md leading-tight">
              Power your workouts, recovery, and everyday energy with the right fuel. 
              Train better. Recover smarter.
            </p>
          </div>
        </div>
        
        <button className="bg-[#c23d6a] hover:bg-[#a13258] transition-colors px-6 py-3 rounded-full font-secondary font-bold flex items-center gap-2 text-sm uppercase tracking-wider">
          Choose your fuel <Zap size={16} fill="white" />
        </button>
      </div>

      {/* --- Main Content Grid --- */}
      <div className="grid grid-cols-1 md:grid-cols-12 w-full h-[600px]">
        
    
        {/* Center & Right Column: Automatic Sliding Images */}
        <div className="md:col-span-7 grid grid-cols-2">
            {/* We use one Swiper that spans both columns, or separate them. 
                Based on your image, we'll use a single Swiper for the "sliding" effect 
                covering the remaining visual area. */}
            <div className="col-span-2 w-full h-full">
                <Swiper
                    modules={[Autoplay, EffectFade]}
                    effect="fade"
                    autoplay={{
                        delay: 3000,
                        disableOnInteraction: false,
                    }}
                    loop={true}
                    className="w-full h-full"
                >
                    {slidingImages.map((src, index) => (
                        <SwiperSlide key={index}>
                            <div className="relative w-full h-full">
                                <Image
                                    src={src}
                                    alt={`Nutrition slide ${index + 1}`}
                                    fill
                                    className="object-cover"
                                    priority={index === 0}
                                />
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </div>
      </div>
    </section>
  );
}