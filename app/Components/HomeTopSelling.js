'use client';
import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, ShoppingCart } from 'lucide-react';
import Image from 'next/image';

const bestSellingProducts = [
  { id: 1, name: 'John Varvatos Star USA Contrast Stitch Jacket', price: 250, image: '/images/oatsimg.jpg' },
  { id: 2, name: 'John Varvatos Star USA Contrast Stitch Jacket', price: 250, image: '/images/oatsimg.jpg' },
  { id: 3, name: 'John Varvatos Star USA Contrast Stitch Jacket', price: 250, image: '/images/oatsimg.jpg' },
  { id: 4, name: 'John Varvatos Star USA Contrast Stitch Jacket', price: 250, image: '/images/oatsimg.jpg' },
  { id: 5, name: 'John Varvatos Star USA Contrast Stitch Jacket', price: 250, image: '/images/oatsimg.jpg' },
];

export default function OurTopSelling() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsToShow, setItemsToShow] = useState(4); // Set to 4 for the desktop card size

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) setItemsToShow(1);
      else if (window.innerWidth < 1024) setItemsToShow(2);
      else setItemsToShow(4); // Exactly 4 cards on desktop as per image_b1391f.jpg
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev >= bestSellingProducts.length - itemsToShow ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev <= 0 ? bestSellingProducts.length - itemsToShow : prev - 1));
  };

  return (
    <section className="py-16 bg-white overflow-hidden">
      <div className="max-w-[1200px] mx-auto px-7">
        
        {/* Header Section */}
        <div className="flex items-center justify-center gap-3 mb-12">
          <div className="w-5 h-5 bg-[#c23d6a] rounded-full" />
          <h2 className="text-4xl font-primary font-black text-black">
            Our top selling products
          </h2>
        </div>

        <div className="relative group">
          {/* Navigation Arrows - Circular Pink Style */}
          <button 
            onClick={prevSlide} 
            className="absolute -left-6 top-[35%] z-20 w-12 h-12 bg-[#c23d6a] text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
          >
            <ArrowLeft size={24} strokeWidth={3} />
          </button>

          {/* Card Container */}
          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${currentIndex * (100 / itemsToShow)}%)` }}
            >
              {bestSellingProducts.map((product) => (
                <div 
                  key={product.id} 
                  className="flex-none px-2" 
                  style={{ width: `${100 / itemsToShow}%` }}
                >
                  {/* Image with thick border from image_b1391f.jpg */}
                  <div className="bg-[#f2eadf]/30 rounded-[15px] p-3 border-[10px] border-[#f2eadf] mb-4 aspect-[4/5] relative overflow-hidden">
                    <div className="relative w-full h-full bg-white rounded-[15px] overflow-hidden">
                      <Image 
                        src={product.image} 
                        alt={product.name}
                        fill
                        className="object-contain p-4"
                      />
                    </div>
                  </div>

                  {/* Text Details - Font Secondary */}
                  <div className="flex justify-between items-start mb-4 px-1">
                    <p className="font-secondary text-[13px] font-bold text-gray-800 leading-tight max-w-[70%]">
                      {product.name}
                    </p>
                    <span className="font-secondary text-xl font-black text-black">
                      ₹{product.price}
                    </span>
                  </div>

                  {/* View Details Button */}
                  <button className="w-full py-3 bg-[#c23d6a] text-white rounded-full font-secondary font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#f2eadf] hover:text-black hover:border-black border-transparent border transition-colors">
                    View details <ShoppingCart size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <button 
            onClick={nextSlide} 
            className="absolute -right-6 top-[35%] z-20 w-12 h-12 bg-[#c23d6a] text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
          >
            <ArrowRight size={24} strokeWidth={3} />
          </button>
        </div>

        {/* Bottom Shop All Button */}
        <div className="mt-12 text-center">
          <button className="px-8 py-3 bg-[#c23d6a] text-white rounded-full font-secondary font-bold text-base flex items-center gap-2 mx-auto hover:scale-105 hover:bg-[#f2eadf] hover:text-black hover:border-black border-transparent border transition-transform">
            Shop all <ShoppingCart size={18} />
          </button>
        </div>
      </div>
    </section>
  );
}