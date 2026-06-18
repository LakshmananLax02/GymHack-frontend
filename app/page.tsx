import Image from "next/image";

import Carousel from './Components/Carousel'

import HomeMarquee from './Components/HomeMarquee'

import HomeProducts from './Components/HomeProducts'

import HomeContent from './Components/HomeContent'

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

     <HomeContent/>

     {/* <WhatToEat/> */}

     <TopSelling/>

     <HomeGoodNutrition/>

     <HoverImages/>

     <Philosophy/>

     <Testimonials/>

  

    </>
  );
}
