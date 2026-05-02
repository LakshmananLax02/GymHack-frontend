'use client';
import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, ShoppingCart } from 'lucide-react';
import Image from 'next/image';

const allProducts = [
  { id: 1, category: 'OATS', name: 'Premium Rolled Oats - High Protein', price: 180, image: '/images/oatsimg.jpg' },
  { id: 2, category: 'OATS', name: 'Instant Oats - Quick Energy', price: 150, image: '/images/oatsimg.jpg' },
  { id: 3, category: 'Muesli', name: 'Gourmet Muesli-Rich fruits, Nuts & Seeds', price: 250, image: '/images/meusliimg.png' },
  { id: 4, category: 'Muesli', name: 'Berries & Seeds Muesli Mix', price: 280, image: '/images/meusliimg.png' },
  { id: 5, category: 'Muesli', name: 'Crunchy Nut Muesli', price: 240, image: '/images/meusliimg.png' },
  { id: 6, category: 'Muesli', name: 'Berries & Seeds Muesli Mix', price: 280, image: '/images/meusliimg.png' },
  { id: 7, category: 'OATS', name: 'Premium Rolled Oats - High Protein', price: 180, image: '/images/oatsimg.jpg' },
  { id: 8, category: 'OATS', name: 'Instant Oats - Quick Energy', price: 150, image: '/images/oatsimg.jpg' },
];

export default function HomeProducts() {
  const [activeTab, setActiveTab] = useState('OATS');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsToShow, setItemsToShow] = useState(3);

  const filteredProducts = allProducts.filter(p => p.category === activeTab);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setItemsToShow(1);
      } else if (window.innerWidth < 1024) {
        setItemsToShow(2);
      } else {
        setItemsToShow(3);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const nextSlide = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => 
      prev >= filteredProducts.length - itemsToShow ? 0 : prev + 1
    );
  };

  const prevSlide = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => 
      prev <= 0 ? Math.max(0, filteredProducts.length - itemsToShow) : prev - 1
    );
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentIndex(0); 
  };

  return (
    <section className="py-6 md:py-14 bg-white overflow-hidden font-sans">
      <div className="max-w-[1440px] mx-auto px-4 md:px-6">
        
        {/* --- HEADER SECTION --- */}
        <div className="text-center mb-8 md:mb-12">
          <div className="flex items-center justify-center gap-2 md:gap-3 mb-2 md:mb-3">
            <div className="w-3 h-3 md:w-5 md:h-5 bg-[#c23d6a] rounded-full" />
            <h2 className="text-3xl md:text-5xl font-bold  font-primary text-black">
              Find Your Perfect Meal
            </h2>
          </div>
          <p className="text-gray-500 font-secondary text-sm md:text-xl font-medium tracking-tight px-4">
            Fuel your body with the right choice for your routine
          </p>
        </div>

        {/* --- FILTER TABS --- */}
        <div className="flex justify-center gap-3 md:gap-6 mb-10 md:mb-16">
          <button 
            onClick={() => handleTabChange('OATS')}
            className={`px-6 md:px-12 font-secondary py-2 rounded-full border-2 font-bold text-sm md:text-lg uppercase tracking-widest transition-all duration-300 ${
              activeTab === 'OATS' ? 'border-black text-black bg-white' : 'border-transparent bg-gray-100 text-gray-400'
            }`}
          >
            OATS
          </button>
          <button 
            onClick={() => handleTabChange('Muesli')}
            className={`px-6 md:px-12 font-secondary py-2 rounded-full border-2 font-bold text-sm md:text-lg uppercase tracking-widest transition-all duration-300 ${
              activeTab === 'Muesli' ? 'bg-[#f0ece2] border-[#f0ece2] text-black' : 'border-transparent bg-gray-100 text-gray-400'
            }`}
          >
            Muesli
          </button>
        </div>

        {/* --- SLIDER AREA --- */}
        <div className="relative flex items-center justify-center min-h-[500px] md:min-h-[650px]">
          <button 
            onClick={prevSlide} 
            className="absolute left-0 md:left-2 z-[100] w-10 h-10 md:w-14 md:h-14 bg-[#c23d6a] text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all"
          >
            <ArrowLeft className="w-5 h-5 md:w-8 md:h-8" strokeWidth={3} />
          </button>

          <div className="w-full overflow-hidden px-2">
            <div 
              className="flex transition-transform duration-700 ease-in-out"
              style={{ 
                transform: `translateX(-${currentIndex * (100 / itemsToShow)}%)`,
              }}
            >
              {filteredProducts.map((product) => (
                <div 
                  key={product.id} 
                  className="flex-none px-4 md:px-8 flex flex-col group"
                  style={{ width: `${100 / itemsToShow}%` }}
                >
                  <div className="relative w-full aspect-[3/4] mb-6 md:mb-8 cursor-pointer rounded-[15px] md:rounded-[15px] overflow-hidden bg-[#f8f8f8] border border-black/5">
                    <div className="absolute inset-0">
                       <Image 
                          src={product.image} 
                          alt={product.name}
                          fill
                          className="object-contain p-6 md:p-10 group-hover:scale-105 transition-transform duration-500"
                          sizes="(max-width: 768px) 100vw, 33vw"
                       />
                    </div>
                    <div className="absolute inset-0 z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/40 backdrop-blur-[2px]">
                      <button className="flex items-center font-secondary gap-2 px-6 md:px-8 py-3 md:py-4 rounded-full font-bold uppercase text-xs md:text-sm shadow-xl transition-all duration-300 bg-[#c23d6a] text-white hover:bg-[#f2eadf] hover:text-black hover:border-black border-transparent border">
                        Add to cart <ShoppingCart className="w-4 h-4 md:w-5 md:h-5" />
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-between items-start w-full px-2 gap-2 md:gap-4">
                    <div className="min-h-[60px] md:min-h-[80px]">
                      <h3 className="text-lg md:text-xl font-secondary font-bold leading-tight text-black uppercase max-w-[150px] md:max-w-[200px]">
                        {product.name}
                      </h3>
                    </div>
                    <span className="text-2xl md:text-4xl font-secondary font-black text-black whitespace-nowrap">
                      ₹{product.price}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button 
            onClick={nextSlide} 
            className="absolute right-0 md:right-2 z-[100] w-10 h-10 md:w-14 md:h-14 bg-[#c23d6a] text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all"
          >
            <ArrowRight className="w-5 h-5 md:w-8 md:h-8" strokeWidth={3} />
          </button>
        </div>

        {/* --- BOTTOM SECTION (Shop All Button) --- */}
        <div className="flex justify-center mt-8 md:mt-10">
          <button className="font-secondary flex items-center gap-3 px-10 py-4 bg-[#c23d6a] text-white rounded-full font-bold text-lg md:text-xl shadow-lg hover:bg-[#f2eadf] hover:text-black hover:border-black border-transparent border hover:scale-105 active:scale-95 transition-all duration-300">
            Shop all <ShoppingCart className="w-5 h-5 md:w-6 md:h-6" />
          </button>
        </div>

      </div>
    </section>
  );
}