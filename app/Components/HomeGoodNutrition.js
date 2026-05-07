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
    "/images/homenutritionimg.png",
    "/images/homenutritionimg.png",
    "/images/homenutritionimg.png",
  ];



  return (
    <section className="w-full h-screen flex flex-col bg-[#f5d32a] overflow-hidden">

      {/* 1. TOP HEADER SECTION */}
      <div className="bg-[#414b56] text-white py-4 px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-4 z-20 shrink-0">
        <div className="flex items-center gap-4">
          <Sprout size={48} strokeWidth={1.5} />
          <div>
            <h2 className="font-primary text-xl md:text-2xl uppercase tracking-wider">
              Good Nutrition, Anytime
            </h2>
            <p className="font-secondary text-xs md:text-sm text-gray-300 max-w-md leading-tight">
              Power your workouts and recovery with the right fuel.
            </p>
          </div>
        </div>
        <button className="bg-[#c23d6a] px-6 py-2.5 rounded-full font-secondary font-bold flex items-center gap-2 text-xs uppercase tracking-widest">
          Choose your fuel <Zap size={14} fill="white" />
        </button>
      </div>

      {/* 2. FULL IMAGE SLIDER SECTION */}
      <div className="flex-1 relative w-full overflow-hidden bg-[#f5d32a]">
        <Swiper
          modules={[Autoplay, Pagination]}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          pagination={{ clickable: true, dynamicBullets: true }}
          loop={true}
          speed={300}
          onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
          className="w-full h-full mySwiper"
        >
          {slidingImages.map((src, index) => (
            <SwiperSlide key={index} className="h-full">
              <div className="w-full h-full flex items-center justify-center bg-[#f5d32a]">

                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${index}-${activeIndex}`}
                    className="relative w-full z-10 slide-image-ratio"
                    animate={activeIndex === index ? "shake" : ""}
                  >
                    <Image
                      src={src}
                      alt={`Nutrition slide ${index + 1}`}
                      fill
                      className="object-fill"
                      priority={index === 0}
                      sizes="100vw"
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
            bottom: 20px !important;
            left: 50% !important;
            transform: translateX(-50%) !important;
            width: auto !important;
            z-index: 30;
          }
          .mySwiper .swiper-pagination-bullet-active {
            background: #c23d6a !important;
            width: 20px;
            border-radius: 5px;
          }

          /* Mobile: taller ratio */
          .slide-image-ratio {
            aspect-ratio: 2 / 1;
          }

          /* Tablet and up: wider ratio */
          @media (min-width: 768px) {
            .slide-image-ratio {
              aspect-ratio: 2.5 / 1;
            }
          }
        `}</style>
      </div>

    </section>
  );
}