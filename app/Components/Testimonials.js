"use client";

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { Reveal } from './scroll/Reveal';

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
    name: "Arjun Kumar",
    role: "Chennai, Tamil Nadu",
    text: "Gym Hack Rolled Oats are part of my daily breakfast. They keep me energized all morning and fit perfectly into my fitness routine.",
    rating: 5
  },
  {
    id: 2,
    name: "Priya Sharma",
    role: "Bengaluru, Karnataka",
    text: "The Muesli is fresh, delicious, and packed with quality ingredients. Gym Hack created the absolute perfect combination of taste and morning nutrition.",
    rating: 5
  },
  {
    id: 3,
    name: "Rahul Verma",
    role: "Hyderabad, Telangana",
    text: "Steel Cut Oats from Gym Hack are excellent. They keep me full for longer and help me stay consistent with my health goals.",
    rating: 5
  },
  {
    id: 4,
    name: "Meena Ramesh",
    role: "Coimbatore, Tamil Nadu",
    text: "I love that the products are made with simple, clean ingredients. My entire family enjoys them every day.",
    rating: 5
  },
  {
    id: 5,
    name: "Vikram Kumar",
    role: "Chennai, Tamil Nadu",
    text: "Great quality, premium packaging, and fast delivery. Gym Hack has quickly become one of my favorite nutrition brands.",
    rating: 5
  },
  {
    id: 6,
    name: "Sneha Patel",
    role: "Ahmedabad, Gujarat",
    text: "The Rolled Oats and Muesli are both fantastic. Healthy eating feels easy and enjoyable with Gym Hack products.",
    rating: 5
  }
];

export default function Testimonials() {
  const [activeDir, setActiveDir] = useState('next');

  return (
    <section className="bg-[#f2ead3] py-16 px-6 md:px-28 overflow-hidden">
      <div className="max-w-[1200px] mx-auto">

        {/* Section Header */}
        <Reveal variant="up" amount={0.3} className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-2">
            <span className="w-4 h-4 bg-[#c23d6a] rounded-full"></span>
            <h2 className="font-primary text-3xl font-bold md:text-4xl tracking-tight ">
              What Our customers Say
            </h2>
          </div>
          <p className="font-secondary text-gray-500 lowercase tracking-widest text-lg">
            testimonials
          </p>
        </Reveal>

        {/* Swiper Slider */}
        <Reveal variant="up" delay={0.1} amount={0.15} className="relative group">
          <Swiper
            modules={[Navigation]}
            spaceBetween={30}
            slidesPerView={1}
            navigation={{
              prevEl: '.prev-btn',
              nextEl: '.next-btn',
            }}
            onSlideChange={(swiper) => {
              if (swiper.activeIndex > swiper.previousIndex) setActiveDir('next');
              else if (swiper.activeIndex < swiper.previousIndex) setActiveDir('prev');
            }}
            breakpoints={{
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            className="pb-12"
          >
            {testimonialData.map((item) => (
              <SwiperSlide key={item.id}>
                <div className="bg-white p-10 rounded-xl shadow-sm border border-gray-100 flex flex-col h-full min-h-[320px] transition-transform duration-500 hover:-translate-y-1 hover:shadow-md">
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
                    <h5 className="font-primary text-xl font-bold tracking-wide uppercase">
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
            <button
              onClick={() => setActiveDir('prev')}
              className={`prev-btn w-14 h-12 flex items-center justify-center border border-gray-200 rounded-l-lg transition-all duration-300 ${
                activeDir === 'prev'
                  ? 'bg-[#2b2b2b] text-white border-[#2b2b2b] z-10'
                  : 'bg-white text-gray-400 hover:bg-gray-50'
              }`}
            >
              <MoveLeft size={20} />
            </button>

            <button
              onClick={() => setActiveDir('next')}
              className={`next-btn w-14 h-12 flex items-center justify-center border border-gray-200 rounded-r-lg transition-all duration-300 ${
                activeDir === 'next'
                  ? 'bg-[#2b2b2b] text-white border-[#2b2b2b] z-10'
                  : 'bg-white text-gray-400 hover:bg-gray-50'
              }`}
            >
              <MoveRight size={20} />
            </button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
