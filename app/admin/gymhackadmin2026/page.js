'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, Lock, Eye, EyeOff, AlertCircle, ShieldCheck } from 'lucide-react';
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
    'focus:border-[#c23d6a] focus:ring-4 focus:ring-[#c23d6a]/10',
    'hover:border-gray-300',
  ].join(' ');

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-12"
      style={{ background: 'linear-gradient(135deg, #fdf4f7 0%, #f8f4f0 50%, #f0f4fd 100%)' }}
    >
      <div className="w-full max-w-[440px]">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-[#c23d6a] flex items-center justify-center mx-auto mb-4 shadow-lg shadow-[#c23d6a]/30 relative overflow-hidden">
            <Image src="/images/logoimg.png" alt="Logo" fill className="object-contain p-2" />
          </div>
          <h1 className="text-2xl font-black text-gray-900 mb-1 tracking-tight">Admin Portal</h1>
          <p className="text-sm text-gray-500 font-medium">Restricted — authorised personnel only</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl p-8 shadow-xl shadow-gray-200/80 border-2 border-gray-100">

          {/* Admin badge */}
          <div className="flex items-center gap-2.5 bg-[#fff0f5] border-2 border-[#f0c0d0] rounded-2xl px-4 py-3 mb-6">
            <ShieldCheck size={16} className="text-[#c23d6a] shrink-0" />
            <p className="text-xs font-bold text-[#c23d6a]">Secure Admin Access</p>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-5">

            {/* Username */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-black uppercase tracking-widest text-gray-500">
                Username
              </label>
              <div className="relative">
                <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
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
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input
                  type={showPw ? 'text' : 'password'} required placeholder="Enter your password"
                  value={form.password} onChange={set('password')}
                  autoComplete="current-password"
                  className={`${inputClass} pl-10 pr-11`}
                  autoComplete="new-password"
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
              className="w-full py-3.5 bg-[#c23d6a] text-white text-sm font-black rounded-2xl
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
                  Signing in…
                </span>
              ) : 'Sign In to Admin'}
            </button>

          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-400 mt-6 font-medium">
          GymHack Admin &copy; {new Date().getFullYear()}
        </p>

      </div>
    </div>
  );
}