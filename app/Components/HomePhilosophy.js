import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRightCircle } from 'lucide-react';

// ── Outline SVG Icons matching the design ──────────────────────────────────
const LeafIcon = () => (
  <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#22d3ee" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z" />
    <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
  </svg>
);

const FitnessIcon = () => (
  <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#22d3ee" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
    <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
    <line x1="6" y1="1" x2="6" y2="4" />
    <line x1="10" y1="1" x2="10" y2="4" />
    <line x1="14" y1="1" x2="14" y2="4" />
  </svg>
);

const ClockIcon = () => (
  <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#22d3ee" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

export default function Philosophy() {
  return (
    <section className="relative pt-0 pb-14 lg:pt-0 lg:pb-24  px-4 sm:px-6 bg-white overflow-hidden">
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">

        {/* ── Left Content ── */}
        <div className="order-2 lg:order-1">

          {/* Section label */}
          <div className="flex items-center gap-3 mb-2">
            <div className="w-4 h-4 rounded-full bg-[#c23d6a] flex-shrink-0" />
            <h2 className="font-primary text-3xl sm:text-4xl uppercase tracking-tight text-black">
              Our Philosophy
            </h2>
          </div>

          <p className="font-secondary text-lg sm:text-xl text-gray-400 mb-7 pl-7">
            Built for Real Routines
          </p>

          {/* Body copy */}
          <div className="font-secondary text-gray-600 space-y-4 text-sm sm:text-base leading-relaxed max-w-lg">
            <p>
              We created Gym Hack with one simple goal —<br />
              to make clean, effective nutrition easy for everyday life.
              No complicated diets. No unnecessary ingredients.
            </p>
            <p>
              Just simple food that supports your workouts, recovery, and routine.
            </p>
            <p className="text-[#c23d6a] font-bold text-base sm:text-lg !mt-6">
              Because what you eat every day matters.
            </p>
          </div>

          {/* ── Feature icons row ── */}
          <div className="mt-5 pt-8 border-t border-gray-200">
            <div className="flex items-start">

              {/* Clean Ingredients */}
              <div className="flex-1 flex flex-col items-center text-center px-2">
                <LeafIcon />
                <h4 className="font-primary text-sm sm:text-base uppercase font-bold text-black mt-3 mb-1 leading-tight">
                  Clean Ingredients
                </h4>
                <p className="text-gray-500 text-[11px] sm:text-xs font-secondary leading-relaxed">
                  No junk, no fillers.<br />Just real nutrition.
                </p>
              </div>

              {/* Divider */}
              <div className="w-px bg-gray-300 h-20 self-center flex-shrink-0" />

              {/* Fitness Focused */}
              <div className="flex-1 flex flex-col items-center text-center px-2">
                <FitnessIcon />
                <h4 className="font-primary text-sm sm:text-base uppercase font-bold text-black mt-3 mb-1 leading-tight">
                  Fitness Focused
                </h4>
                <p className="text-gray-500 text-[11px] sm:text-xs font-secondary leading-relaxed">
                  Designed to support<br />workouts and recovery
                </p>
              </div>

              {/* Divider */}
              <div className="w-px bg-gray-300 h-20 self-center flex-shrink-0" />

              {/* Made Simple */}
              <div className="flex-1 flex flex-col items-center text-center px-2">
                <ClockIcon />
                <h4 className="font-primary text-sm sm:text-base uppercase font-bold text-black mt-3 mb-1 leading-tight">
                  Made Simple
                </h4>
                <p className="text-gray-500 text-[11px] sm:text-xs font-secondary leading-relaxed">
                  Easy to prepare,<br />easy to stick with.
                </p>
              </div>

            </div>
          </div>

      {/* CTA Container */}
<div className="w-full text-center md:text-left"> 
  <Link
    href="/about"
    className="inline-flex items-center gap-2 bg-[#c23d6a] text-white px-6 py-3 rounded-full hover:bg-[#f2eadf] hover:text-black hover:border-black border-transparent border font-bold text-sm transition-all mt-8 font-secondary"
  >
    See More about Gym Hack <ArrowRightCircle size={18} />
  </Link>
</div>
        </div>

        {/* ── Right Image ── */}
        <div className="order-1 lg:order-2 relative">

          {/* Cyan decorative block — bottom-right corner, behind image */}
          <div className="absolute -bottom-4 -right-4 sm:bottom-0 sm:right-0 w-28 h-28 sm:w-36 sm:h-36 rounded-3xl z-0" />

          {/* Image sits above the cyan block */}
          <div className="relative z-10 rounded-xl overflow-hidden shadow-lg">
            <Image
              src="/images/homephilosophyimg.png"
              alt="Gym Hack Philosophy"
              width={600}
              height={480}
              className="object-cover w-full h-auto"
              priority
            />
          </div>

        </div>

      </div>
    </section>
  );
}