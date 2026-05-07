import React from 'react';
import Image from 'next/image';
import { Star, ChevronDown, CheckCircle } from 'lucide-react';

export default function ProductView() {
  return (
    <div className="bg-white min-h-screen">
      {/* 1. MAIN PRODUCT SECTION */}
      <div className="max-w-xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-2 gap-12">
        
        {/* Left: Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-square rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
            <Image src="/images/rolled-oats-main.jpg" fill className="object-cover" alt="Gym hack Rolled oats" />
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="relative w-20 h-20 shrink-0 rounded-lg border hover:border-[#c23d6a] cursor-pointer overflow-hidden">
                <Image src={`/images/thumb-${i}.jpg`} fill className="object-cover" alt="thumbnail" />
              </div>
            ))}
          </div>
        </div>

        {/* Right: Details */}
        <div className="flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-4xl font-black text-gray-900 leading-tight uppercase">
              Gym hack <br /> Rolled oats
            </h1>
            <div className="bg-[#c23d6a] text-white text-2xl font-bold px-4 py-2 rounded-lg">
              ₹ 240
            </div>
          </div>

          <h3 className="text-[#c23d6a] font-bold text-lg mb-2">Clean Fuel for Everyday Fitness</h3>
          <p className="text-gray-600 text-sm leading-relaxed mb-8">
            Made from whole-grain oats, our rolled oats are lightly processed to retain natural 
            fiber and nutrients. They provide steady energy, support digestion, and keep you 
            full longer — making them perfect for your daily routine. Easy to prepare, easy to 
            enjoy, and built for consistency.
          </p>

          <button className="w-full bg-[#c23d6a] text-white py-4 rounded-full font-bold text-lg hover:opacity-90 transition-all mb-6">
            Buy now »
          </button>

          {/* Accordion Style Info */}
          <div className="border-t border-b border-gray-100 py-4 space-y-4 text-sm font-medium">
            <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
              <span className="uppercase tracking-widest text-gray-500">Ingredients</span>
              <ChevronDown size={18} />
            </div>
            <p className="px-3 text-gray-500 text-xs">Almond Milk (Water, Almonds), Rolled Oats, Dates, Vanilla Extract, Sea Salt.</p>
            
            <div className="flex justify-between items-center bg-white p-3 border rounded-lg">
              <span className="uppercase tracking-widest text-gray-500">How to use</span>
              <ChevronDown size={18} />
            </div>
          </div>
        </div>
      </div>

      {/* 2. TICKER BAR */}
      <div className="bg-[#414b56] py-3 overflow-hidden whitespace-nowrap">
        <div className="flex gap-8 animate-marquee text-white text-[10px] font-bold uppercase tracking-widest px-4">
          <span>⚡ Clean Ingredients</span>
          <span>💪 High in Fiber</span>
          <span>🚫 No Added Junk</span>
          <span>🔥 Ready in Minutes</span>
          <span>🥣 Made for Daily Fitness</span>
        </div>
      </div>

      {/* 3. REVIEWS SECTION */}
      <section className="max-w-4xl mx-auto py-20 px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-black text-gray-900 flex items-center justify-center gap-2">
            <span className="w-4 h-4 bg-[#c23d6a] rounded-full inline-block"></span> 
            Customer reviews
          </h2>
          <p className="text-gray-500 mt-2">Fuel your body with the right choice for your routine</p>
          <button className="mt-8 bg-[#f0ece2] px-10 py-3 rounded-full font-bold text-sm">Write a review</button>
        </div>

        {/* Individual Review Card */}
        <div className="space-y-6">
          {[1, 2].map((r) => (
            <div key={r} className="flex flex-col md:flex-row gap-6 p-6 bg-gray-50 rounded-2xl border border-gray-100">
              <div className="md:w-1/4 flex flex-col items-center text-center gap-2 border-r border-gray-200 pr-6">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center font-bold">M</div>
                <span className="text-xs font-bold">Maitun</span>
                <div className="flex items-center gap-1 text-[10px] text-teal-600 bg-white px-2 py-1 rounded-md border">
                  <CheckCircle size={10} /> Verified Buyer
                </div>
              </div>
              <div className="md:w-3/4">
                <div className="flex text-yellow-400 mb-2">
                  {[1,2,3,4,5].map(s => <Star key={s} size={14} fill="currentColor" />)}
                </div>
                <h4 className="font-bold text-sm mb-2">Delicious healthy snack</h4>
                <p className="text-gray-600 text-sm leading-relaxed">
                  I absolutely love these oats. They are healthy with very clean and natural ingredients.
                </p>
                <div className="mt-4 flex items-center gap-2 text-[10px] text-gray-400 uppercase font-bold">
                  <span>Verified by Gymhack</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}