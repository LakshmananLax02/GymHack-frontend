'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import Link from 'next/link';
import {
  Mail, Lock, Eye, EyeOff, Dumbbell, AlertCircle,
  User, Phone, CheckCircle2,
} from 'lucide-react';

export default function SignupPage() {
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', phone: '', password: '',
  });
  const [showPw,  setShowPw]  = useState(false);
  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const router      = useRouter();
  const { setUser } = useAuth();

  const set = (key) => (e) => setFormData(p => ({ ...p, [key]: e.target.value }));

  const validate = () => {
    if (!formData.firstName.trim() || !formData.lastName.trim())
      return 'Please enter your full name.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      return 'Enter a valid email address.';
    if (!/^[6-9]\d{9}$/.test(formData.phone))
      return 'Enter a valid 10-digit Indian mobile number.';
    if (formData.password.length < 8)
      return 'Password must be at least 8 characters.';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const err = validate();
    if (err) { setError(err); return; }
    setLoading(true);
    try {
      const res  = await fetch('http://localhost:5000/api/auth/register', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess(true);
        setTimeout(() => router.push('/login'), 2200);
      } else {
        setError(data.message || 'Registration failed. Please try again.');
      }
    } catch {
      setError('Could not connect to server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Shared input class — white bg, 2px visible border
  const inputClass = [
    'w-full py-3 text-sm font-medium text-gray-900 bg-white',
    'border-2 border-gray-200 rounded-xl outline-none transition-all',
    'placeholder:text-gray-400',
    'focus:border-[#c23d6a] focus:ring-4 focus:ring-[#c23d6a]/8',
    'hover:border-gray-300',
  ].join(' ');

  // Reusable field wrapper
  const Field = ({ label, children }) => (
    <div className="flex flex-col gap-1.5">
      <label className="text-[11px] font-black uppercase tracking-widest text-gray-500">
        {label}
      </label>
      {children}
    </div>
  );

  // ── Success screen ──────────────────────────────────────────────────────────
  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-12"
        style={{ background: 'linear-gradient(135deg, #fdf4f7 0%, #f8f4f0 50%, #f0f4fd 100%)' }}>
        <div className="w-full max-w-[440px]">
          <div className="bg-white rounded-3xl p-12 shadow-xl shadow-gray-200/80 border-2 border-gray-100 text-center space-y-4">
            <div className="w-20 h-20 bg-green-50 border-4 border-green-400 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 size={40} className="text-green-500" strokeWidth={2} />
            </div>
            <h3 className="text-2xl font-black text-gray-900">Account Created! 🎉</h3>
            <p className="text-sm text-gray-500 font-medium">Welcome to GymHack. Redirecting to login…</p>
            <div className="flex justify-center gap-1.5 pt-2">
              {[0, 1, 2].map(i => (
                <div key={i} className="w-2 h-2 rounded-full bg-[#c23d6a] animate-bounce"
                  style={{ animationDelay: `${i * 0.18}s` }} />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Strength meter ──────────────────────────────────────────────────────────
  const pw = formData.password;
  const strengthColor = pw.length === 0 ? '' : pw.length < 6 ? 'bg-red-400' : pw.length < 10 ? 'bg-amber-400' : 'bg-green-400';
  const strengthLabel = pw.length === 0 ? '' : pw.length < 6 ? 'Weak' : pw.length < 10 ? 'Fair' : 'Strong';
  const strengthLabelColor = pw.length === 0 ? '' : pw.length < 6 ? 'text-red-500' : pw.length < 10 ? 'text-amber-500' : 'text-green-500';

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12"
      style={{ background: 'linear-gradient(135deg, #fdf4f7 0%, #f8f4f0 50%, #f0f4fd 100%)' }}>
      <div className="w-full max-w-[460px]">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-[#c23d6a] flex items-center justify-center mx-auto mb-4 shadow-lg shadow-[#c23d6a]/30">
            <Dumbbell size={24} className="text-white" />
          </div>
          <h1 className="text-2xl font-black text-gray-900 mb-1 tracking-tight">Create your account</h1>
          <p className="text-sm text-gray-500 font-medium">Join GymHack and fuel your journey</p>
        </div>

        {/* ── Card with visible border ── */}
        <div className="bg-white rounded-3xl p-8 shadow-xl shadow-gray-200/80 border-2 border-gray-100">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">

            {/* Name row */}
            <div className="grid grid-cols-2 gap-3">
              <Field label="First Name">
                <div className="relative">
                  <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  <input
                    type="text" placeholder="First"
                    value={formData.firstName} onChange={set('firstName')} required
                    className={`${inputClass} pl-10 pr-3`}
                  />
                </div>
              </Field>
              <Field label="Last Name">
                <div className="relative">
                  <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  <input
                    type="text" placeholder="Last"
                    value={formData.lastName} onChange={set('lastName')} required
                    className={`${inputClass} pl-10 pr-3`}
                  />
                </div>
              </Field>
            </div>

            {/* Email */}
            <Field label="Email Address">
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input
                  type="email" placeholder="you@example.com"
                  value={formData.email} onChange={set('email')} required
                  className={`${inputClass} pl-10 pr-4`}
                />
              </div>
            </Field>

            {/* Phone */}
            <Field label="Mobile Number">
              {/* Outer border container so +91 chip and input share ONE border */}
              <div className="flex border-2 border-gray-200 rounded-xl overflow-hidden transition-all focus-within:border-[#c23d6a] focus-within:ring-4 focus-within:ring-[#c23d6a]/8 hover:border-gray-300">
                <div className="flex items-center px-3 bg-gray-50 border-r-2 border-gray-200 text-sm font-bold text-gray-500 shrink-0 select-none">
                  🇮🇳 +91
                </div>
                <div className="relative flex-1">
                  <Phone size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  <input
                    type="tel" placeholder="10-digit number"
                    value={formData.phone} onChange={set('phone')} maxLength={10} required
                    className="w-full pl-9 pr-4 py-3 text-sm font-medium text-gray-900 bg-white outline-none placeholder:text-gray-400"
                  />
                </div>
              </div>
            </Field>

            {/* Password */}
            <Field label="Password">
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input
                  type={showPw ? 'text' : 'password'}
                  placeholder="Min. 8 characters"
                  value={formData.password} onChange={set('password')} required
                  className={`${inputClass} pl-10 pr-11`}
                />
                <button
                  type="button" onClick={() => setShowPw(v => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition-colors p-0.5"
                  aria-label={showPw ? 'Hide password' : 'Show password'}
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {/* Strength bar */}
              {pw.length > 0 && (
                <div className="mt-2 space-y-1">
                  <div className="flex gap-1">
                    {[0, 1, 2, 3].map(i => (
                      <div key={i}
                        className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                          pw.length > i * 3 ? strengthColor : 'bg-gray-200'
                        }`}
                      />
                    ))}
                  </div>
                  <p className={`text-[11px] font-bold ${strengthLabelColor}`}>{strengthLabel} password</p>
                </div>
              )}
            </Field>

            {/* Error */}
            {error && (
              <div className="flex items-start gap-2.5 bg-red-50 border-2 border-red-200 rounded-xl px-3.5 py-3">
                <AlertCircle size={15} className="text-red-500 shrink-0 mt-0.5" />
                <p className="text-xs text-red-700 font-semibold leading-snug">{error}</p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit" disabled={loading}
              className="w-full py-3.5 bg-[#c23d6a] text-white text-sm font-black rounded-2xl mt-1
                         hover:bg-[#a8305a] active:scale-[0.98] transition-all
                         shadow-lg shadow-[#c23d6a]/25
                         disabled:opacity-60 disabled:cursor-not-allowed disabled:shadow-none"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Creating account…
                </span>
              ) : 'Create Account'}
            </button>

          </form>

          {/* Divider */}
          <div className="mt-6 pt-6 border-t-2 border-gray-100 text-center">
            <p className="text-sm text-gray-500">
              Already have an account?{' '}
              <Link href="/login" className="text-[#c23d6a] font-black hover:underline">
                Log in
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-400 mt-6 font-medium">
          By creating an account you agree to our{' '}
          <Link href="/terms" className="underline hover:text-gray-600 font-semibold">Terms</Link>
          {' '}and{' '}
          <Link href="/privacy" className="underline hover:text-gray-600 font-semibold">Privacy policy</Link>
        </p>

      </div>
    </div>
  );
}