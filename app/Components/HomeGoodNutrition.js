"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import { motion, AnimatePresence } from 'framer-motion';

import 'swiper/css';
import 'swiper/css/pagination';

const Sprout = dynamic(() => import('lucide-react').then((mod) => mod.Sprout), { ssr: false });
const Zap = dynamic(() => import('lucide-react').then((mod) => mod.Zap), { ssr: false });

export default function HomeGoodNutrition() {
  const [activeIndex, setActiveIndex] = useState(0);

  const slidingImages = [
    "/images/homeslideimg1.png",
    "/images/homeslideimg2.png",
    "/images/homeslideimg3.png",
  ];

  return (
    <section className="w-full h-screen flex flex-col overflow-hidden bg-white">

      {/* 1. HEADER */}
      <div className="bg-[#414b56] text-white py-4 px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-4 z-20 shrink-0">
        <div className="flex items-center gap-4">
          <Sprout size={48} strokeWidth={1.5} className="text-[#f0ece2]" />
          <div>
            <h2 className="font-primary text-xl md:text-2xl uppercase tracking-wider">
              Good Nutrition, Anytime
            </h2>
            <p className="font-secondary text-xs md:text-sm text-gray-300 max-w-md leading-tight">
              Power your workouts and recovery with the right fuel.
            </p>
          </div>
        </div>
        <button className="bg-[#c23d6a] px-6 py-2.5 rounded-full font-secondary font-bold flex items-center gap-2 text-xs uppercase tracking-widest hover:scale-105 transition-transform">
          Choose your fuel <Zap size={14} fill="white" />
        </button>
      </div>

      {/* 2. IMAGE SLIDER */}
      <div className="relative w-full overflow-hidden bg-white h-[500px] md:flex-1">
        <Swiper
          modules={[Autoplay, Pagination]}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          pagination={{ clickable: true, dynamicBullets: true }}
          loop={true}
          speed={600}
          onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
          className="w-full h-full mySwiper"
        >
          {slidingImages.map((src, index) => (
            <SwiperSlide key={index} className="h-full">
              <div className="w-full h-full relative p-2 md:p-0">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${index}-${activeIndex}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="relative w-full h-full"
                  >
                    <Image
                      src={src}
                      alt={`Nutrition slide ${index + 1}`}
                      fill
                      priority={index === 0}
                      sizes="100vw"
                      className="object-contain"
                    />
                  </motion.div>
                </AnimatePresence>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        <style jsx global>{`
          .mySwiper { height: 100% !important; }
          .mySwiper .swiper-pagination {
            bottom: 15px !important;
            z-index: 30;
          }
          .mySwiper .swiper-pagination-bullet {
            background: #414b56 !important;
            opacity: 0.3;
          }
          .mySwiper .swiper-pagination-bullet-active {
            background: #c23d6a !important;
            width: 24px;
            border-radius: 5px;
            opacity: 1;
          }
        `}</style>
      </div>

    </section>
  );
}