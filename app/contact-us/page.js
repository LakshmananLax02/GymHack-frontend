'use client';

import { useState } from 'react';
import {
  User, Mail, Phone, MessageSquare, Send, MapPin, Clock,
  CheckCircle2, AlertCircle, ChevronDown, Loader2, Tag,
} from 'lucide-react';
import { Reveal } from '../Components/scroll/Reveal';

// ── Telegram config (same env vars used by checkout + bulk-order form) ────────
const TELEGRAM_BOT_TOKEN = process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID   = process.env.NEXT_PUBLIC_TELEGRAM_CHAT_ID;

const INQUIRY_REASONS = [
  'General Inquiry',
  'Order Support',
  'Product Question',
  'Bulk / Wholesale Order',
  'Feedback / Suggestion',
  'Partnership',
  'Other',
];

// ── Business details — REPLACE these with your real info ──────────────────────
const BUSINESS = {
  name: 'Gym Hack Nutrition',
  address: ['No 5 Lakshmi nagar, Thoppampatti', 'Coimbatore, Tamil Nadu 641 017', 'India'],
  phoneDisplay: '+91 98765 43210',
  phoneHref: '+919876543210',
  email: 'support@gymhack.in',
  hours: 'Mon – Sat · 9:00 AM – 7:00 PM',
  // Google Maps → Share → "Embed a map" → copy the src URL and paste it here.
  mapSrc: 'https://www.google.com/maps?q=Chennai,Tamil%20Nadu,India&z=12&output=embed',
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const inputBase =
  'w-full py-3 px-4 text-sm font-medium text-gray-900 bg-white border-2 rounded-xl outline-none transition-all placeholder:text-gray-400 focus:ring-4 focus:ring-[#c23d6a]/10';

export default function ContactUs() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', reason: '', comment: '' });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | sending | success | error
  const [serverError, setServerError] = useState('');

  const set = (k) => (e) => {
    setForm((p) => ({ ...p, [k]: e.target.value }));
    if (errors[k]) setErrors((p) => ({ ...p, [k]: '' }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Please enter your name.';
    if (!form.email.trim()) e.email = 'Please enter your email.';
    else if (!EMAIL_RE.test(form.email)) e.email = 'Please enter a valid email address.';
    if (form.phone && !/^[0-9+\-\s]{7,15}$/.test(form.phone)) e.phone = 'Please enter a valid phone number.';
    if (!form.reason) e.reason = 'Please select a reason.';
    if (!form.comment.trim()) e.comment = 'Please enter a message.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    setServerError('');
    if (!validate()) return;
    setStatus('sending');

    const text = [
      '📬 <b>New Contact Enquiry — Gym Hack</b>', '',
      `👤 <b>Name:</b> ${form.name}`,
      `📧 <b>Email:</b> ${form.email}`,
      form.phone ? `📞 <b>Phone:</b> ${form.phone}` : null,
      `🏷️ <b>Reason:</b> ${form.reason}`, '',
      '💬 <b>Message:</b>', form.comment,
    ].filter((l) => l !== null).join('\n');

    try {
      if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
        throw new Error('Messaging isn’t configured yet. Please email us directly for now.');
      }
      const res = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text, parse_mode: 'HTML' }),
      });
      if (!res.ok) throw new Error('Couldn’t send your message. Please try again in a moment.');
      setStatus('success');
      setForm({ name: '', email: '', phone: '', reason: '', comment: '' });
    } catch (err) {
      setServerError(err.message || 'Something went wrong. Please try again.');
      setStatus('error');
    }
  };

  const borderFor = (k) => (errors[k] ? 'border-red-300' : 'border-gray-200 hover:border-gray-300 focus:border-[#c23d6a]');

  return (
    <main className="bg-white overflow-hidden">

      {/* ───────────────────────── HEADER ───────────────────────── */}
          {/* ───────────────────────── HEADER ───────────────────────── */}
      <section
        className="relative px-4 sm:px-6 pt-16 pb-16 lg:pt-20 lg:pb-20 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/images/productsheroimg.png')" }}
      >
        {/* Cream overlay — keeps the dark heading/text readable over the image. */}
        <div className="absolute inset-0 bg-[#fdf5e6]/25" />

        <div className="relative z-10 max-w-[1100px] mx-auto text-center">
          <Reveal variant="up" amount={0}>
            <div className="inline-flex items-center gap-2.5 mb-5">
              <span className="w-3 h-3 rounded-full bg-[#c23d6a]" />
              <span className="font-secondary text-xs font-bold uppercase tracking-[0.25em] text-white">
                Contact Us
              </span>
            </div>
          </Reveal>
          <Reveal variant="up" delay={0.05} amount={0}>
            <h1 className="font-primary text-4xl sm:text-5xl lg:text-6xl uppercase tracking-tight text-black leading-[1.05]">
              Get In <span className="text-[#c23d6a]">Touch</span>
            </h1>
          </Reveal>
          <Reveal variant="up" delay={0.12} amount={0}>
            <p className="font-secondary text-white text-base sm:text-lg max-w-2xl mx-auto mt-6 leading-relaxed">
              Questions about an order, our products, or bulk enquiries? Drop us a message —
              our customer care team usually replies within one business day.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ───────────────────────── FORM ───────────────────────── */}
      <section className="px-4 sm:px-6 py-16 lg:py-20 bg-white">
        <div className="max-w-[640px] mx-auto">
          <Reveal variant="up" amount={0.1}>
            <div className="bg-white border-2 border-gray-100 rounded-xl p-6 sm:p-9 shadow-xl shadow-gray-200/70">

              {status === 'success' ? (
                <div className="text-center py-10">
                  <div className="w-16 h-16 rounded-2xl bg-[#fff0f5] flex items-center justify-center mx-auto mb-5">
                    <CheckCircle2 size={32} className="text-[#c23d6a]" />
                  </div>
                  <h2 className="font-primary text-2xl uppercase tracking-tight text-black mb-2">
                    Message Sent!
                  </h2>
                  <p className="font-secondary text-gray-500 text-sm max-w-sm mx-auto leading-relaxed">
                    Thanks for reaching out. We&apos;ve received your message and will get back
                    to you shortly.
                  </p>
                  <button
                    type="button"
                    onClick={() => setStatus('idle')}
                    className="inline-flex items-center gap-2 bg-[#c23d6a] text-white px-6 py-3 rounded-full font-bold text-sm mt-7 hover:bg-[#a8305a] transition-all active:scale-95 font-secondary"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">

                  <div className="flex items-center gap-3 mb-1">
                    <span className="w-10 h-10 rounded-xl bg-[#fff0f5] flex items-center justify-center flex-shrink-0">
                      <Send size={18} className="text-[#c23d6a]" />
                    </span>
                    <div>
                      <h2 className="font-primary text-xl uppercase tracking-tight text-black leading-none">
                        Send a Message
                      </h2>
                      <p className="font-secondary text-xs text-gray-400 mt-1">We&apos;d love to hear from you</p>
                    </div>
                  </div>

                  {/* Name */}
                  <Field label="Name" required error={errors.name} icon={User}>
                    <input
                      type="text" value={form.name} onChange={set('name')}
                      placeholder="Your full name"
                      className={`${inputBase} pl-11 ${borderFor('name')}`}
                    />
                  </Field>

                  {/* Email */}
                  <Field label="Email" required error={errors.email} icon={Mail}>
                    <input
                      type="email" value={form.email} onChange={set('email')}
                      placeholder="you@example.com"
                      className={`${inputBase} pl-11 ${borderFor('email')}`}
                    />
                  </Field>

                  {/* Phone (optional) */}
                  <Field label="Phone" error={errors.phone} icon={Phone}>
                    <input
                      type="tel" value={form.phone} onChange={set('phone')}
                      placeholder="+91 98765 43210"
                      className={`${inputBase} pl-11 ${borderFor('phone')}`}
                    />
                  </Field>

                  {/* Reason for Inquiry */}
                  <Field label="Reason for Inquiry" required error={errors.reason} icon={Tag}>
                    <div className="relative">
                      <select
                        value={form.reason} onChange={set('reason')}
                        className={`${inputBase} pl-11 pr-10 appearance-none cursor-pointer ${form.reason ? 'text-gray-900' : '!text-gray-400'} ${borderFor('reason')}`}
                      >
                        <option value="" disabled>Please Select</option>
                        {INQUIRY_REASONS.map((r) => <option key={r} value={r}>{r}</option>)}
                      </select>
                      <ChevronDown size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                  </Field>

                  {/* Comment */}
                  <Field label="Comment" required error={errors.comment} icon={MessageSquare} alignTop>
                    <textarea
                      rows={5} value={form.comment} onChange={set('comment')}
                      placeholder="How can we help?"
                      className={`${inputBase} pl-11 pt-3 resize-y ${borderFor('comment')}`}
                    />
                  </Field>

                  {/* Server error */}
                  {serverError && (
                    <div className="flex items-start gap-2.5 bg-red-50 border-2 border-red-200 rounded-xl px-3.5 py-3">
                      <AlertCircle size={15} className="text-red-500 shrink-0 mt-0.5" />
                      <p className="text-xs text-red-700 font-semibold leading-snug">{serverError}</p>
                    </div>
                  )}

                  {/* Submit */}
                  <button
                    type="submit" disabled={status === 'sending'}
                    className="w-full py-3.5 bg-[#c23d6a] text-white text-sm font-black rounded-2xl hover:bg-[#a8305a] active:scale-[0.98] transition-all mt-1 shadow-lg shadow-[#c23d6a]/25 disabled:opacity-60 disabled:cursor-not-allowed font-secondary flex items-center justify-center gap-2"
                  >
                    {status === 'sending'
                      ? (<><Loader2 size={16} className="animate-spin" /> Sending…</>)
                      : (<><Send size={16} /> Send Message</>)}
                  </button>
                </form>
              )}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ─────────────────── MAP (left) + ADDRESS (right) ─────────────────── */}
      <section className="px-4 sm:px-6 pb-20 lg:pb-28 bg-white">
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-stretch">

          {/* Left — Google Map iframe */}
          <Reveal variant="left" amount={0.15} className="w-full">
            <div className="relative w-full h-full min-h-[340px] rounded-xl overflow-hidden shadow-lg border border-gray-100">
              <iframe
                src={BUSINESS.mapSrc}
                title={`${BUSINESS.name} location`}
                className="absolute inset-0 w-full h-full"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </Reveal>

          {/* Right — Address + contact + call button */}
          <Reveal variant="right" amount={0.15}>
            <div className="h-full bg-[#fdf5e6] rounded-xl p-7 sm:p-9 flex flex-col justify-center">
              <div className="flex items-center gap-3 mb-6">
                <span className="w-4 h-4 rounded-full bg-[#c23d6a]" />
                <h2 className="font-primary text-2xl sm:text-3xl uppercase tracking-tight text-black">
                  Visit or Call Us
                </h2>
              </div>

              <ul className="space-y-5 font-secondary">
                <InfoRow icon={MapPin} label="Address">
                  {BUSINESS.address.map((line) => <span key={line} className="block">{line}</span>)}
                </InfoRow>
                <InfoRow icon={Mail} label="Email">
                  <a href={`mailto:${BUSINESS.email}`} className="hover:text-[#c23d6a] transition-colors">
                    {BUSINESS.email}
                  </a>
                </InfoRow>
                <InfoRow icon={Clock} label="Hours">{BUSINESS.hours}</InfoRow>
              </ul>

              <a
                href={`tel:${BUSINESS.phoneHref}`}
                className="inline-flex items-center justify-center gap-2 bg-[#c23d6a] text-white px-7 py-3.5 rounded-full font-bold text-sm mt-8 hover:bg-[#a8305a] transition-all active:scale-95 font-secondary self-start"
              >
                <Phone size={18} /> Call {BUSINESS.phoneDisplay}
              </a>
            </div>
          </Reveal>

        </div>
      </section>

    </main>
  );
}

// ── Labelled field wrapper with leading icon ─────────────────────────────────
function Field({ label, required, error, icon: Icon, alignTop, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[11px] font-black uppercase tracking-widest text-gray-500 font-secondary">
        {label} {required && <span className="text-[#c23d6a]">*</span>}
      </label>
      <div className="relative">
        {Icon && (
          <Icon
            size={16}
            className={`absolute left-3.5 ${alignTop ? 'top-3.5' : 'top-1/2 -translate-y-1/2'} text-gray-400 pointer-events-none z-10`}
          />
        )}
        {children}
      </div>
      {error && <p className="text-[11px] text-red-600 font-semibold mt-0.5">{error}</p>}
    </div>
  );
}

// ── Address / contact info row ───────────────────────────────────────────────
function InfoRow({ icon: Icon, label, children }) {
  return (
    <li className="flex items-start gap-4">
      <span className="w-11 h-11 rounded-xl bg-white shadow-sm flex items-center justify-center flex-shrink-0">
        <Icon size={18} className="text-[#c23d6a]" />
      </span>
      <div>
        <p className="text-[11px] font-black uppercase tracking-widest text-gray-400 mb-0.5">{label}</p>
        <div className="text-sm text-gray-700 leading-relaxed">{children}</div>
      </div>
    </li>
  );
}