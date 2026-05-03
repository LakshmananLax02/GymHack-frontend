import React from 'react';
import Image from 'next/image';
import HomeGoodNutrition from '../Components/HomeGoodNutrition'
import AllProducts from '../Components/AllProducts'

export default function Products(){
    return(

        <>
    <section
      style={{ height: '320px' }}
      className="relative w-full overflow-hidden"
    >
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/productsheroimg.png"
          alt="Shop All"
          fill
          className="object-cover object-center"
          priority
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/35" />
      </div>
 
      {/* Text — vertically centered, left aligned */}
      <div className="absolute inset-0 z-10 flex items-center px-8 sm:px-12 md:px-16">
        <h1
          style={{ lineHeight: 1, letterSpacing: '-0.02em' }}
          className="text-white text-5xl sm:text-6xl md:text-7xl font-black uppercase"
        >
          Shop All
        </h1>
      </div>
    </section>

        <AllProducts/>

        <HomeGoodNutrition/>
        </>
    )
}