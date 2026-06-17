'use client';

import Image from 'next/image';
import Link from 'next/link';
import {
  ShieldCheck, BadgeCheck, Leaf, FlaskConical, Award, Factory,
  Target, Eye, ArrowRightCircle, Headset,
} from 'lucide-react';
import { Reveal, RevealGroup, Parallax } from '../Components/scroll/Reveal';

// ── Alternating image/content rows ───────────────────────────────────────────
const SECTIONS = [
  {
    eyebrow: 'Who We Are',
    title: 'Our Story',
    image: '/images/aboutourstoryimg.png',
    alt: 'The Gym Hack story',
    reverse: false,
    body: [
      'Gym Hack began with a simple idea — healthy eating should be easy, honest, and accessible to everyone.',
      'What started as a passion for fitness grew into a mission to create wholesome oat-based foods made with real ingredients and no unnecessary additives. From Rolled Oats and Steel Cut Oats to Muesli, every product is crafted to support healthier lifestyles and everyday wellness.',
      'We believe that small, consistent choices lead to lasting results, and great nutrition should be something every family can enjoy.'
    ],
    highlight: 'Real Ingredients. Real Nutrition. Real Progress.',
  },
  {
    eyebrow: 'What Drives Us',
    title: 'Our Mission',
    image: '/images/aboutourvisionimg.png',
    alt: 'Gym Hack mission',
    reverse: true,
    icon: Target,
    body: [
      'To make clean and wholesome nutrition accessible to everyone. We are committed to creating high-quality oat-based foods made with simple, honest ingredients.',
      'Our products are designed to support healthier lifestyles, active routines, and everyday wellness.',
      'We believe good nutrition should be easy, affordable, and enjoyable.',
      'Every product we make is driven by our passion for health, fitness, and better living.'
    ],
    highlight: 'Clean nutrition, made effortless.',
  },
  {
    eyebrow: 'Where We’re Headed',
    title: 'Our Vision',
    image: '/images/aboutourmissionimg.png',
    alt: 'Gym Hack vision',
    reverse: false,
    icon: Eye,
    body: [
      'To become India’s most trusted everyday-nutrition brand — the name people reach for when they want food that works as hard as they do.',
      'A future where eating well is the easy choice, and where great nutrition is never a compromise on taste, price or trust.',
    ],
    highlight: 'Building a healthier everyday, one bowl at a time.',
  },
];

// ── Food-safety / quality certifications ─────────────────────────────────────
const CERTS = [
  { Icon: ShieldCheck,  name: 'FSSAI Licensed',  desc: 'Compliant with India’s food-safety standards.' },
  { Icon: BadgeCheck,   name: 'ISO 22000',       desc: 'Certified food-safety management system.' },
  { Icon: Factory,      name: 'HACCP',           desc: 'Hazard analysis at every critical control point.' },
  { Icon: Award,        name: 'GMP Certified',   desc: 'Good Manufacturing Practices, end to end.' },
  { Icon: Leaf,         name: '100% Vegetarian', desc: 'Pure-veg ingredients, no compromises.' },
  { Icon: FlaskConical, name: 'Lab Tested',      desc: 'Every batch checked for quality & purity.' },
];

export default function AboutUs() {
  return (
    <main className="bg-white overflow-hidden">

      {/* ───────────────────────── HERO ───────────────────────── */}
       <section
        className="relative px-4 sm:px-6 pt-16 pb-20 lg:pt-24 lg:pb-28 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/images/aboutheroimg.png')" }}
      >
        {/* Cream overlay — keeps the dark heading/text readable over the image.
            Lower opacity (/70) to show more image, raise (/90) for less. */}
        <div className="absolute inset-0 bg-black/35" />

        <div className="relative z-10 max-w-[1100px] mx-auto text-center">
          <Reveal variant="up" amount={0}>
            <div className="inline-flex items-center gap-2.5 mb-5">
              <span className="w-3 h-3 rounded-full bg-[#c23d6a]" />
              <span className="font-secondary text-xs font-bold uppercase tracking-[0.25em] text-white">
                About Us
              </span>
            </div>
          </Reveal>

          <Reveal variant="up" delay={0.05} amount={0}>
            <h1 className="font-primary text-4xl sm:text-5xl lg:text-6xl uppercase tracking-tight text-white font-black leading-[1.05]">
              Nutrition You Can Trust<br />
            </h1>
          </Reveal>

          <Reveal variant="up" delay={0.12} amount={0}>
            <p className="font-secondary text-white text-base sm:text-lg max-w-2xl mx-auto mt-6 leading-relaxed">
              At Gym Hack, we believe great health starts with honest ingredients. Our products are crafted to deliver wholesome nutrition, exceptional quality, and the fuel you need for everyday life.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ───────────────── ALTERNATING STORY / MISSION / VISION ───────────────── */}
      {SECTIONS.map((s, i) => (
        <FeatureRow key={s.title} {...s} index={i} />
      ))}

      {/* ───────────────────── CERTIFICATIONS ───────────────────── */}
      <section className="bg-[#fdf5e6] px-4 md:px-27 sm:px-6 py-6 lg:py-5">
        <div className="max-w-[1200px] mx-auto">
          <Reveal variant="up" amount={0.2} className="text-center max-w-2xl mx-auto mb-12">
            <div className="flex items-center justify-center gap-3 mb-3">
              <span className="w-4 h-4 rounded-full bg-[#c23d6a]" />
              <h2 className="font-primary text-3xl sm:text-4xl uppercase tracking-tight text-black">
                Certified &amp; Trusted
              </h2>
            </div>
            <p className="font-secondary text-gray-500 text-base leading-relaxed">
              Every Gym Hack product is made in facilities that meet India&apos;s most
              rigorous food-safety standards — so you can trust every spoonful.
            </p>
          </Reveal>

          <RevealGroup
            stagger={0.08}
            amount={0.1}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {CERTS.map(({ Icon, name, desc }) => (
              <RevealGroup.Item key={name} variant="up">
                <div className="h-full bg-white border border-gray-100 rounded-xl p-6 flex items-start gap-4 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                  <span className="flex-shrink-0 w-12 h-12 rounded-xl bg-[#fff0f5] flex items-center justify-center">
                    <Icon size={22} className="text-[#c23d6a]" strokeWidth={1.8} />
                  </span>
                  <div>
                    <h3 className="font-primary text-lg uppercase tracking-tight text-black leading-tight">
                      {name}
                    </h3>
                    <p className="font-secondary text-sm text-gray-500 mt-1 leading-relaxed">
                      {desc}
                    </p>
                  </div>
                </div>
              </RevealGroup.Item>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* ───────────────────── CONTACT / CUSTOMER CARE CTA ───────────────────── */}
      <section className="px-4 sm:px-6 py-5 lg:py-5 bg-white">
        <Reveal variant="scale" amount={0.2} className="max-w-[1040px] mx-auto">
          <div className="relative overflow-hidden rounded-xl bg-[#c23d6a] px-6 py-12 sm:px-12 sm:py-14 text-center">
            <div className="relative z-10">
              <Headset size={40} className="mx-auto text-white/90 mb-4" strokeWidth={1.6} />
              <h2 className="font-primary text-3xl sm:text-4xl uppercase tracking-tight text-white">
                Have a Question?
              </h2>
              <p className="font-secondary text-white/85 text-base sm:text-lg max-w-xl mx-auto mt-3 leading-relaxed">
                Our customer care team is here to help — with your order, our products,
                or anything else. We&apos;d love to hear from you.
              </p>

              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-white text-[#c23d6a] px-7 py-3.5 rounded-full font-bold text-sm transition-all mt-8 font-secondary hover:bg-[#111] hover:text-white active:scale-95"
              >
                Contact Customer Care <ArrowRightCircle size={18} />
              </Link>
            </div>

            {/* Decorative glow */}
            <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-white/10" />
            <div className="absolute -bottom-20 -left-12 w-64 h-64 rounded-full bg-black/5" />
          </div>
        </Reveal>
      </section>

    </main>
  );
}

// ── Reusable alternating image/content row ───────────────────────────────────
function FeatureRow({ eyebrow, title, body, highlight, image, alt, reverse, icon: Icon }) {
  return (
    <section className="px-4 sm:px-6 py-8 md:px-27 lg:py-8 bg-white">
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">

        {/* ── Content ── */}
        <div className={reverse ? 'order-2 lg:order-2' : 'order-2 lg:order-1'}>
          <Reveal variant={reverse ? 'right' : 'left'} amount={0.2}>
            <div className="flex items-center gap-3 mb-2">
              {Icon ? (
                <span className="w-9 h-9 rounded-xl bg-[#fff0f5] flex items-center justify-center flex-shrink-0">
                  <Icon size={18} className="text-[#c23d6a]" strokeWidth={1.9} />
                </span>
              ) : (
                <span className="w-4 h-4 rounded-full bg-[#c23d6a] flex-shrink-0" />
              )}
              <h2 className="font-primary text-3xl sm:text-4xl uppercase tracking-tight text-black">
                {title}
              </h2>
            </div>
            <p className="font-secondary text-lg text-gray-400 mb-6 pl-12">
              {eyebrow}
            </p>
          </Reveal>

          <RevealGroup
            stagger={0.1}
            delay={0.1}
            amount={0.15}
            className="font-secondary text-gray-600 space-y-4 text-sm sm:text-base leading-relaxed max-w-lg"
          >
            {body.map((para, idx) => (
              <RevealGroup.Item key={idx} variant="up">
                <p>{para}</p>
              </RevealGroup.Item>
            ))}
            {highlight && (
              <RevealGroup.Item variant="up">
                <p className="text-[#c23d6a] font-bold text-base sm:text-lg !mt-6">
                  {highlight}
                </p>
              </RevealGroup.Item>
            )}
          </RevealGroup>
        </div>

        {/* ── Image — gentle parallax drift ── */}
        <div className={reverse ? 'order-1 lg:order-1' : 'order-1 lg:order-2'}>
          <Parallax amount={28} direction="up" className="relative rounded-xl overflow-hidden shadow-lg">
            <Reveal variant="scale" duration={0.9} amount={0.15}>
              <Image
                src={image}
                alt={alt}
                width={600}
                height={480}
                className="object-cover w-full h-auto"
              />
            </Reveal>
          </Parallax>
        </div>

      </div>
    </section>
  );
}