import React from 'react';

const InfiniteMarquee = () => {
const items = [
  { text: "Clean Ingredients", icon: "🌿" },
  { text: "High In Fiber", icon: "💪" },
  { text: "No Added Junk", icon: "🚫" },
  { text: "Ready In Minutes", icon: "⚡" },
  { text: "Made For Daily Fitness", icon: "🥣" },
];

  const scrollItems = [...items, ...items];

  return (
    <div className="w-full bg-[#414b56] py-3 overflow-hidden whitespace-nowrap border-y border-white/5">
      <div className="flex w-max animate-marquee-infinite">
        {scrollItems.map((item, index) => (
          <div key={index} className="flex items-center">
            <div className="flex items-center gap-3 px-8 md:px-12">
              <span className="text-base md:text-lg">{item.icon}</span>
              <span className="text-white text-xl md:text-xl tracking-[0.2em] font-primary">
                {item.text}
              </span>
            </div>
            {/* The distinctive pink separator dot */}
            <div className="w-1.5 h-1.5 bg-[#c23d6a] rounded-full mx-2" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default InfiniteMarquee;