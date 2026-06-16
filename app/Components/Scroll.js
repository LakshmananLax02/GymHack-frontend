"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { FiArrowUpRight, FiTrendingUp, FiMonitor, FiSmartphone, FiSettings, FiPackage } from "react-icons/fi";
import { MdBrush } from "react-icons/md";
import { BsRobot } from "react-icons/bs";
import Link from "next/link";

/* ─────────────────────────────────────────
   SERVICES DATA
───────────────────────────────────────── */
const SERVICES = [
  {
    id: "01",
    title: "Digital marketing that drives real growth.",
    desc: "We plan and run campaigns across SEO, paid ads, and social to bring qualified traffic to your business. Each sprint ships a content calendar, ad creatives, and performance reports so you can see exactly what's working.",
    bg: "#1b1b1f",
    icon: FiTrendingUp,
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1200",
  },
  {
    id: "02",
    title: "Web development built for speed & scale.",
    desc: "We build fast, responsive, SEO-friendly websites using modern frameworks. Every project ships clean, maintainable code, optimized performance, and a CMS your team can manage without calling us for every change.",
    bg: "#20242b",
    icon: FiMonitor,
    image: "https://images.unsplash.com/photo-1552581234-26160f608093?auto=format&fit=crop&q=80&w=1200",
  },
  {
    id: "03",
    title: "Design that makes your brand unforgettable.",
    desc: "We craft distinctive visual identities, UI/UX systems, and brand guidelines that set you apart. Each sprint ships logos, design systems, and pixel-perfect interfaces ready for development.",
    bg: "#262220",
    icon: MdBrush,
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=1200",
  },
  {
    id: "04",
    title: "Mobile apps users actually love.",
    desc: "We design and build native and cross-platform apps for iOS and Android. From wireframes to App Store launch, every sprint ships smooth UX, clean architecture, and a product ready to scale.",
    bg: "#1f2622",
    icon: FiSmartphone,
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1200",
  },
  {
    id: "05",
    title: "Custom software for your unique workflow.",
    desc: "We build tailored software solutions that fit your business processes exactly — internal tools, dashboards, automations, and integrations. Every sprint ships tested, documented, production-ready code.",
    bg: "#221f26",
    icon: FiSettings,
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1200",
  },
  {
    id: "06",
    title: "AI development that puts data to work.",
    desc: "We design and deploy AI-powered features — chatbots, automation, recommendation engines, and custom models — tailored to your product. Each sprint ships working prototypes you can test and iterate on fast.",
    bg: "#1a2226",
    icon: BsRobot,
    image: "https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&q=80&w=1200",
  },
];

/* ─────────────────────────────────────────
   SCROLL REVEAL ANIMATION COMPONENT
───────────────────────────────────────── */
function FadeInReveal({ children, delay = 0, className = "" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─────────────────────────────────────────
   SINGLE STACKING CARD
───────────────────────────────────────── */
function StackingCard({ service, index, total, progress }) {
  const Icon = service.icon;
  const cardRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "start start"],
  });
  const imageScale = useTransform(scrollYProgress, [0, 1], [1.3, 1]);

  const targetScale = 1 - (total - 1 - index) * 0.04;
  const scale = useTransform(progress, [index / total, 1], [1, targetScale]);

  return (
    <div
      ref={cardRef}
      className="sticky top-0 h-screen flex items-center justify-center px-3 sm:px-6"
    >
      <motion.div
        style={{
          backgroundColor: service.bg,
          scale,
          top: `calc(-5vh + ${index * 26}px)`,
          transformOrigin: "top",
        }}
        className="relative w-full max-w-[1200px] flex flex-col lg:flex-row rounded-[24px] md:rounded-[28px] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.35)] min-h-[58vh] lg:min-h-0 lg:h-[540px]"
      >
        {/* ── Left Side: Content ── */}
        <div className="relative z-[2] w-full lg:w-[55%] flex flex-col justify-center p-8 md:p-14 lg:p-16">

          {/* Icon Block */}
          <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-white/5 flex items-center justify-center text-[#86C232] mb-6 md:mb-8 shadow-sm border border-white/10">
            <Icon size={28} />
          </div>

          {/* Index Number */}
          <span className="block text-[#86C232] text-[14px] md:text-[15px] font-bold tracking-[0.05em] mb-3 md:mb-4">
            {service.id}.
          </span>

          {/* Title */}
          <h3 className="text-white text-3xl md:text-4xl lg:text-[2.6rem] font-medium leading-[1.1] mb-5 tracking-tight">
            {service.title}
          </h3>

          {/* Description */}
          <p className="text-white/70 text-[15px] md:text-[1.05rem] leading-[1.7] mb-8 md:mb-10 max-w-xl font-normal">
            {service.desc}
          </p>

          {/* CTA Button */}
          <Link
            href="#"
            className="group inline-flex items-center gap-3 bg-[#86C232] hover:bg-[#61892F] transition-colors duration-300 rounded-full pl-6 pr-2 py-2 w-fit shadow-lg"
          >
            <span className="text-[#222629] font-bold text-sm md:text-[15px]">
              Learn More
            </span>
            <span className="flex items-center justify-center w-8 h-8 md:w-9 md:h-9 rounded-full bg-[#222629] text-white transition-colors duration-300">
              <FiArrowUpRight
                size={18}
                className="group-hover:rotate-45 transition-transform duration-300 ease-out"
              />
            </span>
          </Link>
        </div>

        {/* ── Right Side: Image ── */}
        <div className="relative z-[2] w-full lg:w-[45%] h-[220px] sm:h-[280px] lg:h-auto overflow-hidden border-t lg:border-t-0 lg:border-l border-white/5">
          <motion.img
            style={{ scale: imageScale }}
            src={service.image}
            alt={service.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-black/30 via-transparent to-transparent" />
        </div>
      </motion.div>
    </div>
  );
}

/* ─────────────────────────────────────────
   MAIN SECTION COMPONENT
───────────────────────────────────────── */
export default function ServiceSection() {
  const stackRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: stackRef,
    offset: ["start start", "end end"],
  });

  return (
    <section className="w-full bg-[#f8f9f8] relative font-['Manrope',_sans-serif]">

      {/* ══════════════════════════════════════════
          1. HEADER SECTION
      ══════════════════════════════════════════ */}
      <div className="flex flex-col items-center justify-center pt-24 pb-12 md:pb-16 px-6 text-center">
        <FadeInReveal>
          <span className="inline-block text-[#86C232] border border-[#86C232] px-[16px] py-[6px] rounded-[5px] text-[11px] font-extrabold tracking-[2px] uppercase mb-[20px]">
            Our Services
          </span>
        </FadeInReveal>

        <FadeInReveal delay={0.1}>
          <h2 className="text-[#222629] text-4xl md:text-5xl lg:text-[4rem] font-extrabold tracking-tight max-w-4xl leading-[1.1] mb-6">
            What we do best
          </h2>
        </FadeInReveal>
      </div>

      {/* ══════════════════════════════════════════
          2. STACKING CARD STICKY SCROLL ANIMATION
      ══════════════════════════════════════════ */}
      <div ref={stackRef} className="relative w-full">
        {SERVICES.map((service, index) => (
          <StackingCard
            key={service.id}
            service={service}
            index={index}
            total={SERVICES.length}
            progress={scrollYProgress}
          />
        ))}
      </div>

      {/* ══════════════════════════════════════════
          3. FOOTER BANNER
      ══════════════════════════════════════════ */}
      <div
        className="relative w-full mt-10 md:mt-16 px-6 flex items-center justify-center text-center md:text-left pt-10 pb-16"
        style={{ zIndex: SERVICES.length + 10 }}
      >
        <FadeInReveal>
          <div className="flex flex-col md:flex-row items-center gap-3 md:gap-4 text-[#474B4F] text-lg md:text-xl font-medium">
            <div className="flex items-center gap-3">
              <FiPackage className="text-[#86C232] shrink-0" size={24} />
              <span>Unlock tailored solutions without the wasted effort.</span>
            </div>

            <Link
              href="/contact"
              className="inline-flex items-center gap-1 font-bold text-[#222629] hover:text-[#86C232] transition-colors duration-300 underline decoration-[#86C232] decoration-2 underline-offset-4"
            >
              Talk to us today <FiArrowUpRight size={20} />
            </Link>
          </div>
        </FadeInReveal>
      </div>

    </section>
  );
}