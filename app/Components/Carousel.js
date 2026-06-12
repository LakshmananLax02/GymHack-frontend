'use client';
import React from 'react';
import { MoveUpRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Reveal, RevealGroup, Parallax } from './scroll/Reveal';

export default function Hero() {
  return (
    <section className="relative w-full">
      {/* --- Main Hero Section with Background Video --- */}
      <div className="relative h-[500px] md:h-[550px] w-full flex flex-col items-center justify-center text-center px-4 overflow-hidden">

        {/* Background Video with subtle parallax drift */}
        <Parallax amount={40} direction="down" className="absolute inset-0 z-0 will-change-transform">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-[110%] object-cover brightness-[0.5]"
          >
            <source src="/images/carouselvideo.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <div className="absolute inset-0 bg-black/20" />
        </Parallax>

        {/* Hero Content — staggered reveal */}
        <RevealGroup
          stagger={0.12}
          delay={0.1}
          amount={0.2}
          className="relative z-10 max-w-[900px] mx-auto"
        >
          <RevealGroup.Item variant="up" duration={0.85}>
            <h1 className="text-3xl md:text-5xl lg:text-7xl font-primary font-bold mb-6 text-white leading-[1.2]">
              Stronger Workouts Start <br className="hidden md:block" /> with Better Fuel
            </h1>
          </RevealGroup.Item>

          <RevealGroup.Item variant="up" duration={0.8}>
            <p className="text-lg md:text-xl font-secondary font-medium mb-10 max-w-[600px] mx-auto text-gray-200">
              Nutritious snacks make with clean, nutrient-dense ingredients using raw food techniques for optional health
            </p>
          </RevealGroup.Item>

          <RevealGroup.Item variant="scale" duration={0.7}>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 bg-[#c23d6a] text-white px-5 py-2.5 rounded-full text-sm font-bold hover:bg-[#f0ece2] hover:text-black transition-all hover:scale-105 active:scale-95 shadow-2xl"
            >
              Explore all products
              <MoveUpRight size={20} strokeWidth={3} />
            </Link>
          </RevealGroup.Item>
        </RevealGroup>
      </div>

      {/* --- Static Stats Bar Section --- */}
      <Reveal variant="up" amount={0.3}>
        <div className="bg-[#f0ece2] py-3 md:py-5 border-t border-b border-black/10">
          <RevealGroup stagger={0.1} className="max-w-[1440px] mx-auto px-4 md:px-40 grid grid-cols-4">

            <RevealGroup.Item variant="up" className="flex flex-col md:flex-row items-center justify-center gap-1 md:gap-4 border-r border-black/10 px-1 md:px-6">
              <div className="relative w-15 h-15 md:w-20 md:h-20 lg:w-20 lg:h-20 shrink-0">
                <Image src="/images/carouselbottomimg1.png" alt="Plant Based" fill className="object-contain" />
              </div>
            </RevealGroup.Item>

            <RevealGroup.Item variant="up" className="flex flex-col md:flex-row items-center justify-center gap-1 md:gap-4 border-r border-black/10 px-1 md:px-6">
              <div className="relative w-15 h-15 md:w-20 md:h-20 lg:w-20 lg:h-20 shrink-0">
                <Image src="/images/carouselbottomimg2.png" alt="Certified Vegan" fill className="object-contain" />
              </div>
            </RevealGroup.Item>

            <RevealGroup.Item variant="up" className="flex flex-col md:flex-row items-center justify-center gap-1 md:gap-4 border-r border-black/10 px-1 md:px-6">
              <div className="relative w-15 h-15 md:w-20 md:h-20 lg:w-20 lg:h-20 shrink-0">
                <Image src="/images/carouselbottomimg3.png" alt="Gluten Free" fill className="object-contain" />
              </div>
            </RevealGroup.Item>

            <RevealGroup.Item variant="up" className="flex flex-col md:flex-row items-center justify-center gap-1 md:gap-4 px-1 md:px-6">
              <div className="relative w-15 h-15 md:w-20 md:h-20 lg:w-20 lg:h-20 shrink-0">
                <Image src="/images/carouselbottomimg4.png" alt="Nutrient Dense" fill className="object-contain" />
              </div>
            </RevealGroup.Item>

          </RevealGroup>
        </div>
      </Reveal>
    </section>
  );
}
