'use client';
import React from 'react';
import { Sun, Dumbbell, Clock, ArrowRight } from 'lucide-react';
import Image from 'next/image';

const timings = [
  {
    id: 1,
    title: "Morning Start",
    description: "Oats with fruits for a fresh, balanced and energetic start.",
    image: "/images/oatshoverimg.png",
    label: "MORNING",
    labelBg: "bg-[#d4edda]",
    labelColor: "text-green-800",
    icon: <Sun className="w-6 h-6 text-black" />,
    iconBg: "bg-[#b8e0b8]",
    tags: ["Light", "Clean", "Everyday"],
    tagBg: "bg-green-200",
    tagColor: "text-green-700"
  },
  {
    id: 2,
    title: "Post workout",
    description: "Muesli with milk for complete recovery, energy and muscle support.",
    image: "/images/oatshoverimg.png", 
    label: "POST WORKOUT",
    labelBg: "bg-[#e67e22]",
    labelColor: "text-white",
    icon: <Dumbbell className="w-6 h-6 text-white" />,
    iconBg: "bg-[#d35400]",
    tags: ["Filling", "High Energy", "Recovery"],
    tagBg: "bg-red-200",
    tagColor: "text-red-700"
  },
  {
    id: 3,
    title: "Quick Meal",
    description: "Just add milk and enjoy a quick, clean and nutritious meal.",
    image: "/images/oatshoverimg.png", 
    label: "ANYTIME",
    labelBg: "bg-[#2980b9]",
    labelColor: "text-white",
    icon: <Dumbbell className="w-6 h-6 text-white" />,
    iconBg: "bg-[#2980b9]",
    tags: ["Fast", "Easy", "Convinent"],
    tagBg: "bg-blue-200",
    tagColor: "text-black"
  }
];

export default function MealTiming() {
  return (
    <section className="py-5 bg-[#fdf5e6] font-sans">
      <div className="max-w-[1200px] mx-auto px-6">
        
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="w-6 h-6 bg-[#c23d6a] rounded-full" />
            <h2 className="text-4xl md:text-5xl font-bold text-black font-primary">
              When to eat what?
            </h2>
          </div>
          <p className="text-xl text-gray-700 font-secondary">Fuel your day in the right way</p>
        </div>

        {/* Cards Container */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-4">
          {timings.map((item, index) => (
            <React.Fragment key={item.id}>
              <div className="bg-white rounded-[15px] p-4 shadow-sm w-full max-w-[350px] relative">
                
                {/* Image Section with Top-Left Label */}
                <div className="relative h-[220px] w-full rounded-[15px] overflow-hidden mb-12">
                  <Image 
                    src={item.image} 
                    alt={item.title} 
                    fill 
                    className="object-cover"
                  />
                  <div className={`absolute top-4 left-4 ${item.labelBg} px-4 py-1.5 rounded-xl flex items-center gap-2 shadow-sm`}>
                    {item.id === 1 ? <Sun size={20} color='green' /> : item.id === 2 ? <span className="text-[15px]">💪</span> : <Clock color='white' size={20} />}
                    <span className={`text-[10px] tracking-wider ${item.labelColor} text-black md:text-xs`}>
                      {item.label}
                    </span>
                  </div>
                </div>

                {/* Overlapping Center Icon */}
                <div className={`rotate-45 absolute left-1/2 -translate-x-1/2 top-[190px] w-16 h-16 ${item.iconBg} rounded-full flex items-center justify-center border-4 border-white shadow-md z-10`}>
                  {item.icon}
                </div>

                {/* Text Content */}
                <div className="text-center mt-4 px-2">
                  <h3 className="text-2xl font-secondary font-bold text-black mb-3">{item.title}</h3>
                  <p className="text-sm font-secondary text-black leading-relaxed mb-6">
                    {item.description}
                  </p>

                  {/* Tags */}
                  <div className="flex justify-center gap-2 mb-4">
                    {item.tags.map(tag => (
                      <span key={tag} className={`${item.tagBg} ${item.tagColor} text-[13px] px-3 py-1 rounded-full text-gray-700`}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Arrow between cards (hidden on mobile) */}
              {index < timings.length - 1 && (
                <div className="hidden md:block">
                  <ArrowRight className="text-[#c23d6a] w-8 h-8" strokeWidth={3} />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}