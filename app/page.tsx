import Image from "next/image";

import Carousel from './Components/Carousel'

import HomeProducts from './Components/HomeProducts'

import WhatToEat from './Components/HomeWhenToEat'

import TopSelling from './Components/HomeTopSelling'

import HomeGoodNutrition from './Components/HomeGoodNutrition'

import HoverImages from './Components/HomeHoverImages'

import Philosophy from './Components/HomePhilosophy'

import Testimonials from './Components/Testimonials'

export default function Home() {
  return (
    <>

     <Carousel/>

     <HomeProducts/>

     <WhatToEat/>

     <TopSelling/>

     <HomeGoodNutrition/>

     <HoverImages/>

     <Philosophy/>

     <Testimonials/>
    </>
  );
}
