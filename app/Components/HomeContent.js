"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

/**
 * Fires once when the wrapped element scrolls into view, then disconnects.
 * No external animation library required.
 */
function useInView(options) {
  const ref = useRef(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25, ...options }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [options]);

  return { ref, isInView };
}

export default function BetterGranolaSection() {
  const { ref: revealRef, isInView } = useInView();

  const reveal =
    "transition-all duration-700 ease-out motion-reduce:transition-none motion-reduce:opacity-100 motion-reduce:translate-y-0";

  return (
    <section
      className="relative w-full overflow-hidden py-16 md:py-24 px-4 sm:px-6 lg:px-8 text-center bg-[url('/images/aboutourstoryimg.png')] bg-fixed bg-center bg-cover"
    >
      {/* Warm overlay so the brand's cream tone and text contrast hold up over the image */}
      <div className="absolute inset-0 bg-black/65" aria-hidden="true" />

      <div
        ref={revealRef}
        className="relative max-w-[850px] mx-auto flex flex-col items-center"
      >
        {/* Main Paragraph Body */}
        <p
          className={`text-white font-secondary font-medium tracking-wide text-lg sm:text-xl md:text-2xl lg:text-[26px] leading-[1.6] md:leading-[1.65] mb-8 md:mb-10 ${reveal} ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          95% of Indians aren&rsquo;t getting enough fiber. Not because they
          don&rsquo;t care, but because it isn&rsquo;t always easy. So we made
          it simple and delicious.
        </p>

        <p
          className={`text-white font-secondary font-medium tracking-wide text-lg sm:text-xl md:text-2xl lg:text-[26px] leading-[1.6] md:leading-[1.65] mb-10 md:mb-12 ${reveal} delay-150 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          A crunchy, grain-free granola made with a variety of fiber-rich
          plant ingredients. No added sugar. Nothing artificial.
        </p>

        {/* Pill CTA Button */}
        <Link
          href="/products"
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-xs uppercase tracking-[0.2em] shadow-lg bg-[#c23d6a] text-white hover:bg-[#f2eadf] hover:text-black border border-transparent hover:border-black transition-all duration-300 font-secondary ${reveal} delay-100 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          Shop Better Granola <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}