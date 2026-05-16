'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import Link from 'next/link';
import { Mail, Lock, Eye, EyeOff, Dumbbell, AlertCircle } from 'lucide-react';
import Image from 'next/image';

export default function LoginPage() {
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [showPw,   setShowPw]   = useState(false);
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);

  const router         = useRouter();
  const { loginUser }  = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res  = await fetch('http://localhost:5000/api/auth/login', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        loginUser(data.user, data.token);
        router.push('/');
      } else {
        setError(data.message || 'Invalid email or password');
      }
    } catch {
      setError('Could not connect to server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = [
    'w-full py-3 text-sm font-medium text-gray-900 bg-white',
    'border-2 border-gray-200 rounded-xl outline-none transition-all',
    'placeholder:text-gray-400',
    'focus:border-[#c23d6a] focus:ring-4 focus:ring-[#c23d6a]/8',
    'hover:border-gray-300',
  ].join(' ');

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12"
      style={{ background: 'linear-gradient(135deg, #fdf4f7 0%, #f8f4f0 50%, #f0f4fd 100%)' }}>
      <div className="w-full max-w-[440px]">

        {/* Header */}
        <div className="text-center mb-8">

<div className="w-14 h-14 rounded-2xl  flex items-center justify-center mx-auto mb-4 shadow-[#c23d6a]/30">
  <Image
    src="/images/logoimg.png"
    alt="Logo"
    width={42}
    height={42}
    className="object-contain"
  />
</div>
          <h1 className="text-2xl font-black text-gray-900 mb-1 tracking-tight">Welcome back</h1>
          <p className="text-sm text-gray-500 font-medium">Log in to sync your cart and orders</p>
        </div>

        {/* ── Card with visible border + shadow ── */}
        <div className="bg-white rounded-3xl p-8 shadow-xl shadow-gray-200/80 border-2 border-gray-100">
          <form onSubmit={handleLogin} className="flex flex-col gap-5">

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-black uppercase tracking-widest text-gray-500">
                Email Address
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  className={`${inputClass} pl-10 pr-4`}
                />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-black uppercase tracking-widest text-gray-500">
                  Password
                </label>
                <Link href="/forgot-password"
                  className="text-[11px] font-bold text-[#c23d6a] hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input
                  type={showPw ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  className={`${inputClass} pl-10 pr-11`}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(v => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition-colors p-0.5"
                  aria-label={showPw ? 'Hide password' : 'Show password'}
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-start gap-2.5 bg-red-50 border-2 border-red-200 rounded-xl px-3.5 py-3">
                <AlertCircle size={15} className="text-red-500 shrink-0 mt-0.5" />
                <p className="text-xs text-red-700 font-semibold leading-snug">{error}</p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-[#c23d6a] text-white text-sm font-black rounded-full
                         hover:bg-[#a8305a] active:scale-[0.98] transition-all mt-1
                         shadow-lg shadow-[#c23d6a]/25
                         disabled:opacity-60 disabled:cursor-not-allowed disabled:shadow-none"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Authenticating…
                </span>
              ) : 'Log in'}
            </button>

          </form>

          {/* Divider + signup */}
          <div className="mt-6 pt-6 border-t-2 border-gray-100 text-center">
            <p className="text-sm text-gray-500">
              New to GymHack?{' '}
              <Link href="/signup" className="text-[#c23d6a] font-black hover:underline">
                Create an account
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-400 mt-6 font-medium">
          By logging in you agree to our{' '}
          <Link href="/terms" className="underline hover:text-gray-600 font-semibold">Terms</Link>
          {' '}and{' '}
          <Link href="/privacy" className="underline hover:text-gray-600 font-semibold">Privacy policy</Link>
        </p>

      </div>
    </div>
  );
}