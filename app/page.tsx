import Image from "next/image";

import Carousel from './Components/Carousel'

import HomeMarquee from './Components/HomeMarquee'

import HomeProducts from './Components/HomeProducts'

import WhatToEat from './Components/HomeWhenToEat'

import TopSelling from './Components/HomeTopSelling'

import HomeGoodNutrition from './Components/HomeGoodNutrition'

import HoverImages from './Components/HomeHoverImages'

import Philosophy from './Components/HomePhilosophy'

import Testimonials from './Components/Testimonials'

import Link from "next/link";



export default function Home() {
  return (
    <>

     <Carousel/>

     <HomeMarquee/>

     <HomeProducts/>

     <section className="w-full bg-[#fcf5ef] py-16 md:py-24 px-4 sm:px-6 lg:px-8 text-center">
      <div className="max-w-[850px] mx-auto flex flex-col items-center">
        
        {/* Main Paragraph Body */}
        <p className="text-gray-900 font-secondary font-medium tracking-wide text-lg sm:text-xl md:text-2xl lg:text-[26px] leading-[1.6] md:leading-[1.65] mb-8 md:mb-10">
          95% of Indians aren’t getting enough fiber. 
          Not because they don’t care, but because it isn’t always easy. So we made it simple and delicious.
        </p>

        <p className="text-gray-900 font-secondary font-medium tracking-wide text-lg sm:text-xl md:text-2xl lg:text-[26px] leading-[1.6] md:leading-[1.65] mb-10 md:mb-12">
          A crunchy, grain-free granola made with a variety of fiber-rich plant ingredients. No added sugar. Nothing artificial.
        </p>

        {/* Minimal Underlined Link Button */}
        <Link 
          href="/products" 
          className="text-xs font-black uppercase tracking-[0.2em] text-gray-900 hover:text-pink-600 border-b border-gray-900 hover:border-pink-600 pb-1 transition-all duration-300"
        >
          Shop Better Granola
        </Link>

      </div>
    </section>

     {/* <WhatToEat/> */}

     <TopSelling/>

     <HomeGoodNutrition/>

     <HoverImages/>

     <Philosophy/>

     <Testimonials/>

  

    </>
  );
}
