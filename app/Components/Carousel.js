'use client';
import React from 'react';
import { MoveUpRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Reveal, RevealGroup, Parallax } from './scroll/Reveal';

export default function Hero() {
  const statsItems = [
  { src: "/images/homeheroicons1.png", alt: "Plant Based" },
  { src: "/images/homeheroicons2.png", alt: "Certified Vegan" },
  { src: "/images/homeheroicons3.png", alt: "Gluten Free" },
  { src: "/images/homeheroicon4.png", alt: "Nutrient Dense" },
  { src: "/images/homeheroicon5.png", alt: "Nutrient Dense" },
  { src: "/images/homeheroicon6.png", alt: "Nutrient Dense" },
  { src: "/images/homeheroicon7.png", alt: "Nutrient Dense" },
  { src: "/images/homeheroicon8.png", alt: "Nutrient Dense" },
  { src: "/images/homeheroicon9.png", alt: "Nutrient Dense" },
  { src: "/images/homeheroicon10.png", alt: "Nutrient Dense" },
];

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

       {/* Hero Content Container — Centers everything vertically and horizontally */}
<div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 md:px-8 z-10">
  
  <RevealGroup
    stagger={0.12}
    delay={0.1}
    amount={0.2}
    className="max-w-[900px] mx-auto flex flex-col items-center justify-center"
  >
    {/* Heading Element */}
    <RevealGroup.Item variant="up" duration={0.85}>
      <h1 className="text-4xl md:text-6xl lg:text-7xl font-primary font-bold mb-4 md:mb-6 text-white leading-[1.15] tracking-tight">
        Nothing Added <br className="hidden md:block" /> Nothing Hidden
      </h1>
    </RevealGroup.Item>

    {/* Paragraph Element */}
    <RevealGroup.Item variant="up" duration={0.8}>
      <p className="text-base md:text-lg lg:text-xl font-secondary font-medium mb-6 md:mb-8 max-w-[650px] mx-auto text-gray-200 leading-relaxed">
        Nutritious snacks made with clean, nutrient-dense ingredients using raw food techniques for optimal health
      </p>
    </RevealGroup.Item>

    {/* Button Element */}
    <RevealGroup.Item variant="scale" duration={0.7} className="w-auto flex justify-center">
      <Link
        href="/products"
        className="inline-flex items-center gap-2 bg-[#c23d6a] text-white px-6 py-3 rounded-full text-sm font-bold hover:bg-[#f0ece2] hover:text-black transition-all hover:scale-105 active:scale-95 shadow-2xl"
      >
        Explore all products
        <MoveUpRight size={18} strokeWidth={3} />
      </Link>
    </RevealGroup.Item>
  </RevealGroup>

</div>
      </div>

      {/* --- Static Stats Bar Section --- */}
      
<Reveal variant="up" amount={0.3}>
  <div className="bg-[#f0ece2] py-5 md:py-6 border-t border-b border-black/10">
    <RevealGroup
      stagger={0.1}
      className="statsbar max-w-[1440px] mx-auto px-4 md:px-10 lg:px-20 flex md:flex-wrap lg:grid lg:grid-cols-10 items-center md:justify-center overflow-x-auto md:overflow-visible gap-6 md:gap-8 lg:gap-4"
    >
      {statsItems.map((item, index) => (
        <RevealGroup.Item
          key={index}
          variant="up"
          className="shrink-0 flex items-center justify-center"
        >
          <div className="relative w-14 h-14 md:w-20 md:h-20">
            <Image src={item.src} alt={item.alt} fill className="object-contain" />
          </div>
        </RevealGroup.Item>
      ))}
    </RevealGroup>

    <style jsx>{`
      .statsbar::-webkit-scrollbar {
        display: none;
      }
      .statsbar {
        scrollbar-width: none;
      }
    `}</style>
  </div>
</Reveal>
    </section>
  );
}
