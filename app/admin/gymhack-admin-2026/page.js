'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import Image from 'next/image';

export default function AdminLogin() {
  const [form,    setForm]    = useState({ username: '', password: '' });
  const [showPw,  setShowPw]  = useState(false);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');
  const router = useRouter();

  const set = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }));

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res  = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/login`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');
      localStorage.setItem('adminToken', data.token);
      router.push('/admin/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const inputClass = [
    'w-full py-3 text-sm font-medium text-gray-900 bg-white',
    'border-2 border-gray-200 rounded-xl outline-none transition-all',
    'placeholder:text-gray-400',
    'focus:border-[#2d7a3a] focus:ring-4 focus:ring-[#2d7a3a]/8',
    'hover:border-gray-300',
  ].join(' ');

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-12"
      style={{ background: 'linear-gradient(135deg, #f4fdf6 0%, #f8f4f0 50%, #f0f4fd 100%)' }}
    >
      <div className="w-full max-w-[440px]">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Image src="/images/logoimg.png" alt="Logo" width={42} height={42} className="object-contain" />
          </div>
          <h1 className="text-2xl font-black text-gray-900 mb-1 tracking-tight">Admin Portal</h1>
          <p className="text-sm text-gray-500 font-medium">Restricted access — authorised personnel only</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-xl p-8 shadow-xl shadow-gray-200/80 border-2 border-gray-300">
          <form onSubmit={handleLogin} className="flex flex-col gap-5">

            {/* Username */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-black uppercase tracking-widest text-gray-500">
                Username
              </label>
              <div className="relative">
                <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input
                  type="text" required placeholder="Enter your username"
                  value={form.username} onChange={set('username')}
                  className={`${inputClass} pl-10 pr-4`}
                />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-black uppercase tracking-widest text-gray-500">
                Password
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input
                  type={showPw ? 'text' : 'password'} required placeholder="Enter your password"
                  value={form.password} onChange={set('password')}
                  autoComplete="current-password"
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
              type="submit" disabled={loading}
              className="w-full py-3.5 bg-[#2d7a3a] text-white text-sm font-black rounded-full
                         hover:bg-[#246331] active:scale-[0.98] transition-all mt-1
                         shadow-lg shadow-[#2d7a3a]/25
                         disabled:opacity-60 disabled:cursor-not-allowed disabled:shadow-none"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Signing in…
                </span>
              ) : 'Sign In'}
            </button>

          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-400 mt-6 font-medium">
          Exploring Munnar &copy; {new Date().getFullYear()}
        </p>

      </div>
    </div>
  );
}