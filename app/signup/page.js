'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  User, Phone, Mail, Lock, Eye, EyeOff,
  ArrowRight, ArrowLeft, ShieldCheck,
  CheckCircle2, AlertCircle, RefreshCw,
} from 'lucide-react';
import { Reveal } from '../Components/scroll/Reveal';

// ── Shared input class — matches LoginPage exactly ───────────────────────────
const inputClass = [
  'w-full py-3 text-sm font-medium text-gray-900 bg-white',
  'border-2 border-gray-200 rounded-xl outline-none transition-all',
  'placeholder:text-gray-400',
  'focus:border-[#c23d6a] focus:ring-4 focus:ring-[#c23d6a]/8',
  'hover:border-gray-300',
].join(' ');

// ── Field label + children wrapper ──────────────────────────────────────────
function Field({ label, error, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[11px] font-black uppercase tracking-widest text-gray-500">
        {label}
      </label>
      {children}
      {error && (
        <span className="flex items-center gap-1 text-[11px] text-red-500 font-semibold">
          <AlertCircle size={10} /> {error}
        </span>
      )}
    </div>
  );
}

// ── Step indicator ───────────────────────────────────────────────────────────
function StepBar({ step }) {
  const steps = ['Personal', 'Email', 'Password'];
  return (
    <div className="flex items-center justify-center mb-8">
      {steps.map((label, i) => {
        const idx    = i + 1;
        const done   = step > idx;
        const active = step === idx;
        return (
          <div key={label} className="flex items-center">
            {/* Circle + label */}
            <div className="flex flex-col items-center gap-1">
              <div className={[
                'w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all text-[11px] font-black',
                done   ? 'bg-[#c23d6a] border-[#c23d6a] text-white'
                : active ? 'bg-white border-[#c23d6a] text-[#c23d6a] ring-4 ring-pink-100'
                :          'bg-white border-gray-200 text-gray-300',
              ].join(' ')}>
                {done ? <CheckCircle2 size={14} /> : idx}
              </div>
              <span className={`text-[9px] font-bold uppercase tracking-wider whitespace-nowrap
                ${done || active ? 'text-[#c23d6a]' : 'text-gray-300'}`}>
                {label}
              </span>
            </div>
            {/* Connector line between steps */}
            {i < steps.length - 1 && (
              <div className={`w-16 h-0.5 mx-2 mb-4 transition-all ${step > idx ? 'bg-[#c23d6a]' : 'bg-gray-200'}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Main ────────────────────────────────────────────────────────────────────
export default function SignupPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', phone: '',
    email: '', otp: '', password: '', confirmPassword: '',
  });
  const [loading,     setLoading]    = useState(false);
  const [error,       setError]      = useState('');
  const [success,     setSuccess]    = useState(false);
  const [showPw,      setShowPw]     = useState(false);
  const [showCpw,     setShowCpw]    = useState(false);
  const [otpSent,     setOtpSent]    = useState(false);
  const [resendTimer, setResendTimer]= useState(0); // 60-second cooldown
  const [toast,       setToast]      = useState(null); // { type, msg }

  const router    = useRouter();
  const otpRefs   = useRef([]);
  const set = k => e => { setFormData(p => ({ ...p, [k]: e.target.value })); setError(''); };

  // Toast helper
  const showToast = (type, msg) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 4000);
  };

  // Resend countdown
  useEffect(() => {
    if (resendTimer <= 0) return;
    const id = setInterval(() => setResendTimer(t => t - 1), 1000);
    return () => clearInterval(id);
  }, [resendTimer]);

  // ── handleResendOTP — reuses sendOTP, sets 60s cooldown ─────────────────
  const handleResendOTP = async () => {
    if (resendTimer > 0) return;
    setFormData(p => ({ ...p, otp: '' }));  // clear previous OTP
    setError('');
    setResendTimer(60);
    await sendOTP();
  };

  // ── Step 1: validate personal info ──────────────────────────────────────
  const goToStep2 = () => {
    if (!formData.firstName.trim() || !formData.lastName.trim())
      return setError('Please enter your full name.');
    if (!/^[6-9]\d{9}$/.test(formData.phone))
      return setError('Enter a valid 10-digit Indian mobile number.');
    setError('');
    setStep(2);
  };

  // ── Step 2: send OTP ────────────────────────────────────────────────────
  const sendOTP = async () => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      return setError('Enter a valid email address.');
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email }),
      });
      if (res.ok) {
        setOtpSent(true);
        setResendTimer(60);
        showToast('success', `OTP sent to ${formData.email}`);
        setTimeout(() => otpRefs.current[0]?.focus(), 100);
      } else {
        const d = await res.json();
        setError(d.message || 'Failed to send OTP. Email may already be registered.');
      }
    } catch { setError('Server connection failed.'); }
    setLoading(false);
  };

  // ── Step 2: OTP input handling ──────────────────────────────────────────
  const handleOtpKey = (val, idx) => {
    if (!/^\d?$/.test(val)) return;
    const digits = formData.otp.split('');
    digits[idx]  = val;
    setFormData(p => ({ ...p, otp: digits.join('') }));
    setError('');
    if (val && idx < 5) otpRefs.current[idx + 1]?.focus();
  };

  const handleOtpBackspace = (e, idx) => {
    if (e.key === 'Backspace' && !formData.otp[idx] && idx > 0)
      otpRefs.current[idx - 1]?.focus();
  };

  const handleOtpPaste = (e) => {
    const p = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (p.length === 6) {
      setFormData(f => ({ ...f, otp: p }));
      otpRefs.current[5]?.focus();
    }
    e.preventDefault();
  };

  // ── Step 2: verify OTP ──────────────────────────────────────────────────
  const verifyOTP = async () => {
    if (formData.otp.length < 6) return setError('Enter the complete 6-digit OTP.');
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, otp: formData.otp }),
      });
      if (res.ok) { setError(''); setStep(3); }
      else { const d = await res.json(); setError(d.message || 'Invalid or expired OTP.'); }
    } catch { setError('Verification failed. Please try again.'); }
    setLoading(false);
  };

  // ── Step 3: register ────────────────────────────────────────────────────
  const handleRegister = async (e) => {
    e.preventDefault();
    if (formData.password.length < 8) return setError('Password must be at least 8 characters.');
    if (formData.password !== formData.confirmPassword) return setError('Passwords do not match.');
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName:  formData.lastName,
          phone:     formData.phone,
          email:     formData.email,
          password:  formData.password,
        }),
      });
      const data = await res.json();
      if (res.ok) { setSuccess(true); setTimeout(() => router.push('/login'), 2500); }
      else setError(data.message || data.error || 'Registration failed. Please try again.');
    } catch { setError('Could not connect to server. Please try again.'); }
    setLoading(false);
  };

  // ── Password strength ────────────────────────────────────────────────────
  const pw            = formData.password;
  const cpw           = formData.confirmPassword;
  const strColor      = pw.length === 0 ? '' : pw.length < 6 ? 'bg-red-400' : pw.length < 10 ? 'bg-amber-400' : 'bg-green-400';
  const strLabel      = pw.length === 0 ? '' : pw.length < 6 ? 'Weak'       : pw.length < 10 ? 'Fair'         : 'Strong';
  const strLabelColor = pw.length === 0 ? '' : pw.length < 6 ? 'text-red-500' : pw.length < 10 ? 'text-amber-500' : 'text-green-500';
  const matchState    = cpw.length === 0 ? 'idle' : cpw === pw ? 'match' : 'mismatch';

  // ── Success screen ───────────────────────────────────────────────────────
  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-12"
        style={{ background: 'linear-gradient(135deg, #fdf4f7 0%, #f8f4f0 50%, #f0f4fd 100%)' }}>
        <div className="w-full max-w-[440px]">
          <div className="bg-white rounded-3xl p-12 shadow-xl border-2 border-gray-100 text-center space-y-4">
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

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12"
      style={{ background: 'linear-gradient(135deg, #fdf4f7 0%, #f8f4f0 50%, #f0f4fd 100%)' }}>
      <Reveal variant="up" duration={0.7} amount={0} className="w-full max-w-[460px]">

        {/* ── Browser-top Toast Alert ── */}
        {toast && (
          <div
            style={{ animation: 'toastSlideDown 0.3s ease forwards' }}
            className={[
              'fixed top-5 left-0 right-0 mx-auto z-[99999]',
              'flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl border-2',
              'text-sm font-semibold w-fit min-w-[300px] max-w-[460px]',
              toast.type === 'success' ? 'bg-white border-green-300 text-green-800'
              : toast.type === 'error' ? 'bg-white border-red-300 text-red-700'
              :                          'bg-white border-[#c23d6a]/40 text-gray-800',
            ].join(' ')}
          >
            {/* Icon */}
            <div className={[
              'w-8 h-8 rounded-xl flex items-center justify-center text-white shrink-0 text-sm font-black',
              toast.type === 'success' ? 'bg-green-500'
              : toast.type === 'error' ? 'bg-red-500'
              :                          'bg-[#c23d6a]',
            ].join(' ')}>
              {toast.type === 'success' ? '✓' : toast.type === 'error' ? '✕' : '✉'}
            </div>
            {/* Message */}
            <p className="flex-1 leading-snug">{toast.msg}</p>
            {/* Close */}
            <button
              onClick={() => setToast(null)}
              className="text-gray-300 hover:text-gray-600 transition-colors shrink-0 ml-1"
            >
              ✕
            </button>
          </div>
        )}

        <style>{`
          @keyframes toastSlideDown {
            from { opacity: 0; transform: translateY(-16px); }
            to   { opacity: 1; transform: translateY(0); }
          }
        `}</style>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-xl bg-[#c23d6a] flex items-center justify-center mx-auto mb-4 shadow-lg shadow-[#c23d6a]/30 relative overflow-hidden">
            <Image src="/images/logoimg.png" alt="GymHack" fill className="object-contain p-2" />
          </div>
          <h1 className="text-2xl font-black text-gray-900 mb-1 tracking-tight">Create your account</h1>
          <p className="text-sm text-gray-500 font-medium">Join GymHack and fuel your journey</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-xl p-8 shadow-xl shadow-gray-200/80 border-2 border-gray-300">

          <StepBar step={step} />

          {/* ── STEP 1: Personal Info ── */}
          {step === 1 && (
            <div className="flex flex-col gap-5">
              <div>
                <h2 className="text-base font-black text-gray-900">Personal Information</h2>
                <p className="text-xs text-gray-400 font-medium mt-0.5">Tell us a bit about yourself</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Field label={<span className="text-gray-900">First Name</span>}>
                  <div className="relative">
                    <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    <input type="text" placeholder="First"
                      value={formData.firstName} onChange={set('firstName')}
                      className={`${inputClass} pl-10 pr-3`} />
                  </div>
                </Field>
                <Field label={<span className="text-gray-900">Last Name</span>}>
                  <div className="relative">
                    <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    <input type="text" placeholder="Last"
                      value={formData.lastName} onChange={set('lastName')}
                      className={`${inputClass} pl-10 pr-3`} />
                  </div>
                </Field>
              </div>

              <Field label={<span className="text-gray-900">Mobile Number</span>}>
                <div className="flex border-2 border-gray-200 rounded-xl overflow-hidden transition-all focus-within:border-[#c23d6a] focus-within:ring-4 focus-within:ring-[#c23d6a]/8 hover:border-gray-300">
                  <div className="flex items-center px-3 bg-gray-50 border-r-2 border-gray-200 text-sm font-bold text-gray-500 shrink-0 select-none">
                    🇮🇳 +91
                  </div>
                  <div className="relative flex-1">
                    <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    <input type="tel" placeholder="10-digit number"
                      value={formData.phone} onChange={set('phone')} maxLength={10}
                      className="w-full pl-9 pr-4 py-3 text-sm font-medium text-gray-900 bg-white outline-none placeholder:text-gray-400" />
                  </div>
                </div>
              </Field>

              {error && (
                <div className="flex items-start gap-2.5 bg-red-50 border-2 border-red-200 rounded-xl px-3.5 py-3">
                  <AlertCircle size={14} className="text-red-500 shrink-0 mt-0.5" />
                  <p className="text-xs text-red-700 font-semibold">{error}</p>
                </div>
              )}

              <button onClick={goToStep2}
                className="w-full py-3.5 bg-[#c23d6a] text-white text-sm font-black rounded-full
                           hover:bg-[#a8305a] active:scale-[0.98] transition-all
                           shadow-lg shadow-[#c23d6a]/25 flex items-center justify-center gap-2">
                Continue <ArrowRight size={17} />
              </button>
            </div>
          )}

          {/* ── STEP 2: Email + OTP ── */}
          {step === 2 && (
            <div className="flex flex-col gap-5">
              <button onClick={() => { setStep(1); setError(''); setOtpSent(false); }}
                className="flex items-center gap-1.5 text-[11px] font-bold text-gray-400 hover:text-gray-600 transition-colors -mt-1">
                <ArrowLeft size={13} /> Back
              </button>

              <div>
                <h2 className="text-base font-black text-gray-900">Verify Email</h2>
                <p className="text-xs text-gray-400 font-medium mt-0.5">We'll send a 6-digit OTP to confirm</p>
              </div>

              {/* Email + send button */}
              <Field label={<span className="text-gray-900">Email Address</span>}>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    <input type="email" placeholder="you@example.com"
                      value={formData.email} onChange={set('email')}
                      disabled={otpSent}
                      className={`${inputClass} pl-10 pr-4 ${otpSent ? 'bg-gray-50 text-gray-500' : ''}`} />
                  </div>
                  <button
                    onClick={sendOTP}
                    disabled={loading || (otpSent && resendTimer > 0)}
                    className="shrink-0 px-4 py-3 rounded-xl border-2 border-gray-200 text-xs font-black text-gray-700
                               hover:border-[#c23d6a] hover:text-[#c23d6a] transition-all disabled:opacity-50 disabled:cursor-not-allowed
                               flex items-center gap-1.5 whitespace-nowrap"
                  >
                    {loading && !otpSent ? (
                      <span className="w-3.5 h-3.5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <RefreshCw size={13} className={otpSent && resendTimer > 0 ? '' : 'text-current'} />
                    )}
                    {!otpSent ? 'Send OTP'
                      : resendTimer > 0 ? `${resendTimer}s`
                      : 'Resend'}
                  </button>
                </div>
              </Field>

              {/* OTP boxes — only shown after OTP sent */}
              {otpSent && (
                <>
                  <Field label="Enter OTP">
                    <div className="flex gap-2 justify-between" onPaste={handleOtpPaste}>
                      {Array.from({ length: 6 }).map((_, i) => (
                        <input
                          key={i}
                          ref={el => otpRefs.current[i] = el}
                          type="tel"
                          inputMode="numeric"
                          maxLength={1}
                          value={formData.otp[i] || ''}
                          onChange={e => handleOtpKey(e.target.value, i)}
                          onKeyDown={e => handleOtpBackspace(e, i)}
                          className={[
                            'w-11 h-13 h-[52px] text-center text-lg font-black rounded-xl border-2 outline-none transition-all',
                            formData.otp[i]
                              ? 'border-[#c23d6a] bg-[#fff0f5] text-[#c23d6a]'
                              : 'border-gray-200 bg-white text-gray-900',
                            'focus:border-[#c23d6a] focus:ring-4 focus:ring-pink-100',
                          ].join(' ')}
                        />
                      ))}
                    </div>
                  </Field>

                  <div className="flex items-center justify-center gap-1.5 text-xs text-gray-400 font-medium -mt-1">
                    <ShieldCheck size={13} className="text-green-500" />
                    OTP sent to <span className="font-bold text-gray-700">{formData.email}</span>
                  </div>
                </>
              )}

              {error && (
                <div className="flex items-start gap-2.5 bg-red-50 border-2 border-red-200 rounded-xl px-3.5 py-3">
                  <AlertCircle size={14} className="text-red-500 shrink-0 mt-0.5" />
                  <p className="text-xs text-red-700 font-semibold">{error}</p>
                </div>
              )}

              {otpSent && (
                <button onClick={verifyOTP} disabled={formData.otp.length < 6 || loading}
                  className="w-full py-3.5 bg-[#c23d6a] text-white text-sm font-black rounded-full
                             hover:bg-[#a8305a] active:scale-[0.98] transition-all
                             shadow-lg shadow-[#c23d6a]/25 disabled:opacity-60 disabled:cursor-not-allowed
                             flex items-center justify-center gap-2">
                  {loading
                    ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Verifying…</>
                    : <>Verify & Continue <ArrowRight size={17} /></>}
                </button>
              )}

              {/* Resend section — shown after OTP sent */}
              {otpSent && (
                <div className="flex justify-center">
                  {resendTimer > 0 ? (
                    <p className="text-xs text-gray-400 font-bold">
                      Resend code in <span className="text-[#c23d6a] font-black">{resendTimer}s</span>
                    </p>
                  ) : (
                    <button
                      type="button"
                      onClick={handleResendOTP}
                      className="flex items-center gap-1.5 text-xs font-black text-[#c23d6a] hover:underline uppercase tracking-tight"
                    >
                      <RefreshCw size={12} /> Didn't get the code? Resend
                    </button>
                  )}
                </div>
              )}

              {!otpSent && (
                <p className="text-center text-xs text-gray-400 font-medium">
                  Enter your email and click <span className="font-bold text-gray-600">Send OTP</span> to continue
                </p>
              )}
            </div>
          )}

          {/* ── STEP 3: Set Password ── */}
          {step === 3 && (
            <form onSubmit={handleRegister} className="flex flex-col gap-5">
              <div>
                <h2 className="text-base font-black text-gray-900">Set Your Password</h2>
                <p className="text-xs text-gray-400 font-medium mt-0.5">Choose a strong password to secure your account</p>
              </div>

              {/* Email verified badge */}
              <div className="flex items-center gap-2.5 bg-green-50 border-2 border-green-200 rounded-xl px-4 py-3">
                <ShieldCheck size={16} className="text-green-600 shrink-0" />
                <div>
                  <p className="text-xs font-black text-green-800">Email Verified</p>
                  <p className="text-[11px] text-green-600 font-medium">{formData.email}</p>
                </div>
              </div>

              {/* Password */}
              <Field label={<span className="text-gray-900">Password</span>}>
                <div className="relative">
                  <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  <input type={showPw ? 'text' : 'password'} placeholder="Min. 8 characters"
                    value={formData.password} onChange={set('password')} required
                    className={`${inputClass} pl-10 pr-11`} autoComplete="new-password"/>
                  <button type="button" onClick={() => setShowPw(v => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition-colors p-0.5">
                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {pw.length > 0 && (
                  <div className="mt-1.5 space-y-1">
                    <div className="flex gap-1">
                      {[0,1,2,3].map(i => (
                        <div key={i} className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${pw.length > i * 3 ? strColor : 'bg-gray-200'}`} />
                      ))}
                    </div>
                    <p className={`text-[11px] font-bold ${strLabelColor}`}>{strLabel} password</p>
                  </div>
                )}
              </Field>

              {/* Confirm password */}
              <Field label={<span className="text-gray-900">Confirm Password</span>}>
                <div className="relative">
                  <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  <input type={showCpw ? 'text' : 'password'} placeholder="Re-enter your password"
                    value={formData.confirmPassword} onChange={set('confirmPassword')} required
                    className={[
                      inputClass, 'pl-10 pr-20',
                      matchState === 'match'    ? 'border-green-400 focus:border-green-500' : '',
                      matchState === 'mismatch' ? 'border-red-300 focus:border-red-400'     : '',
                    ].join(' ')} autoComplete="new-password"/>
                  {matchState === 'match' && (
                    <CheckCircle2 size={15} className="absolute right-10 top-1/2 -translate-y-1/2 text-green-500 pointer-events-none" />
                  )}
                  <button type="button" onClick={() => setShowCpw(v => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition-colors p-0.5">
                    {showCpw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {matchState === 'mismatch' && (
                  <p className="text-[11px] font-bold text-red-500 flex items-center gap-1">
                    <AlertCircle size={11} /> Passwords do not match
                  </p>
                )}
                {matchState === 'match' && (
                  <p className="text-[11px] font-bold text-green-600 flex items-center gap-1">
                    <CheckCircle2 size={11} /> Passwords match
                  </p>
                )}
              </Field>

              {error && (
                <div className="flex items-start gap-2.5 bg-red-50 border-2 border-red-200 rounded-xl px-3.5 py-3">
                  <AlertCircle size={14} className="text-red-500 shrink-0 mt-0.5" />
                  <p className="text-xs text-red-700 font-semibold">{error}</p>
                </div>
              )}

              <button type="submit" disabled={loading || matchState === 'mismatch'}
                className="w-full py-3.5 bg-[#c23d6a] text-white text-sm font-black rounded-full
                           hover:bg-[#a8305a] active:scale-[0.98] transition-all
                           shadow-lg shadow-[#c23d6a]/25 disabled:opacity-60 disabled:cursor-not-allowed disabled:shadow-none
                           flex items-center justify-center gap-2">
                {loading
                  ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Creating account…</>
                  : 'Create My Account'}
              </button>
            </form>
          )}

          {/* Login link */}
          <div className="mt-6 pt-6 border-t-2 border-gray-100 text-center">
            <p className="text-sm text-gray-500">
              Already have an account?{' '}
              <Link href="/login" className="text-[#c23d6a] font-black hover:underline">Log in</Link>
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

      </Reveal>
    </div>
  );
}