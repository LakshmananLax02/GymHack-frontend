'use client';
import React from 'react';
import Image from 'next/image';
import HomeGoodNutrition from '../Components/HomeGoodNutrition';
import AllProducts from '../Components/AllProducts';
import { Reveal, Parallax } from '../Components/scroll/Reveal';

export default function Products() {
  return (
    <>
      <section
        style={{ height: '320px' }}
        className="relative w-full overflow-hidden"
      >
        {/* Background Image with parallax drift */}
        <Parallax amount={40} direction="down" className="absolute inset-0 z-0">
          <Image
            src="/images/shopallheroimg.png"
            alt="Shop All"
            fill
            className="object-cover object-center scale-110"
            priority
          />
          <div className="absolute inset-0 bg-black/35" />
        </Parallax>

        {/* Text — vertically centered, left aligned, reveal-on-mount */}
        <div className="absolute inset-0 z-10 flex items-center px-8 sm:px-12 md:px-16">
          <Reveal variant="left" duration={0.9} amount={0}>
            <h1
              style={{ lineHeight: 1, letterSpacing: '-0.02em' }}
              className="font-primary text-white text-5xl sm:text-6xl md:text-7xl font-black uppercase"
            >
              Shop All
            </h1>
          </Reveal>
        </div>
      </section>

      <AllProducts />

      <HomeGoodNutrition />
    </>
  );
}
