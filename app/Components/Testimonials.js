"use client";

import React from 'react';
import dynamic from 'next/dynamic';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';

// Dynamic Icons to prevent Turbopack errors
const MoveLeft = dynamic(() => import('lucide-react').then((mod) => mod.MoveLeft), { ssr: false });
const MoveRight = dynamic(() => import('lucide-react').then((mod) => mod.MoveRight), { ssr: false });
const Star = dynamic(() => import('lucide-react').then((mod) => mod.Star), { ssr: false });

const testimonialData = [
  {
    id: 1,
    name: "Sabo Masties",
    role: "Founder @ Rolex",
    text: "Yet preference connection unpleasant yet melancholy but end appearance. And excellence partiality estimating terminated day everything.",
    rating: 5
  },
  {
    id: 2,
    name: "Sabo Masties",
    role: "Founder @ Migelko",
    text: "Yet preference connection unpleasant yet melancholy but end appearance. And excellence partiality estimating terminated day everything.",
    rating: 5
  },
  {
    id: 3,
    name: "Sabo Masties",
    role: "Founder @ Google",
    text: "Yet preference connection unpleasant yet melancholy but end appearance. And excellence partiality estimating terminated day everything.",
    rating: 5
  },
  {
    id: 4,
    name: "Sabo Masties",
    role: "Founder @ Apple",
    text: "Yet preference connection unpleasant yet melancholy but end appearance. And excellence partiality estimating terminated day everything.",
    rating: 5
  }
];

export default function Testimonials() {
  return (
    <section className="bg-[#f2ead3] py-20 px-6 overflow-hidden">
      <div className="max-w-[1200px] mx-auto">
        
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-2">
            <span className="w-4 h-4 bg-[#c23d6a] rounded-full"></span>
            <h2 className="font-primary text-4xl font-bold md:text-4xl tracking-tight">
              What Our customers Say About Gymhack
            </h2>
          </div>
          <p className="font-secondary text-gray-500 lowercase tracking-widest text-lg">
            testimonals
          </p>
        </div>

        {/* Swiper Slider */}
        <div className="relative group">
          <Swiper
            modules={[Navigation]}
            spaceBetween={30}
            slidesPerView={1}
            navigation={{
              prevEl: '.prev-btn',
              nextEl: '.next-btn',
            }}
            breakpoints={{
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            className="pb-12"
          >
            {testimonialData.map((item) => (
              <SwiperSlide key={item.id}>
                <div className="bg-white p-10 rounded-xl shadow-sm border border-gray-100 flex flex-col h-full min-h-[320px]">
                  {/* Stars */}
                  <div className="flex gap-1 mb-6">
                    {[...Array(item.rating)].map((_, i) => (
                      <Star key={i} size={14} className="fill-orange-400 text-orange-400" />
                    ))}
                  </div>

                  {/* Feedback Text */}
                  <p className="font-secondary text-gray-600 leading-relaxed mb-10 flex-grow italic">
                    "{item.text}"
                  </p>

                  {/* Author Info */}
                  <div>
                    <h5 className="font-primary text-xl font-bold uppercase tracking-wide">
                      {item.name}
                    </h5>
                    <p className="font-secondary text-gray-400 text-sm">
                      {item.role}
                    </p>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Navigation Controls */}
          <div className="flex justify-center items-center gap-0 mt-8">
            <button className="prev-btn w-14 h-12 flex items-center justify-center bg-white border border-gray-200 rounded-l-lg hover:bg-gray-50 transition-colors">
              <MoveLeft size={20} className="text-gray-400" />
            </button>
            <button className="next-btn w-14 h-12 flex items-center justify-center bg-[#2b2b2b] rounded-r-lg hover:bg-black transition-colors">
              <MoveRight size={20} className="text-white" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}