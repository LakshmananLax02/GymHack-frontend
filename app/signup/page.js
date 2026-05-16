'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Mail, Lock, User, Phone, CheckCircle2, ArrowRight, ArrowLeft, 
  ShieldCheck, Dumbbell, AlertCircle, Eye, EyeOff 
} from 'lucide-react';

export default function SignupPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', phone: '', email: '', otp: '', password: '', confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false); // For the confirmation box
  const router = useRouter();

  const set = (key) => (e) => setFormData(p => ({ ...p, [key]: e.target.value }));

  // ── Step 1: Validate Personal Info ──
  const nextToStep2 = () => {
    if (!formData.firstName || !formData.lastName) return setError('Name is required.');
    if (!/^[6-9]\d{9}$/.test(formData.phone)) return setError('Enter a valid 10-digit number.');
    setError('');
    setStep(2);
  };

  // ── Step 2: API Call - Send OTP ──
  const sendOTP = async () => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) return setError('Invalid email.');
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email }),
      });
      if (res.ok) alert('OTP sent to ' + formData.email);
      else setError('Failed to send OTP. Email might already exist.');
    } catch (err) { setError('Server connection failed.'); }
    setLoading(false);
  };

  // ── Step 2: API Call - Verify OTP ──
  const verifyOTP = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, otp: formData.otp }),
      });
      if (res.ok) {
        setError('');
        setStep(3);
      } else setError('Invalid or expired OTP.');
    } catch (err) { setError('Verification failed.'); }
    setLoading(false);
  };

  // ── Step 3: API Call - Final Registration ──
  const handleFinalSubmit = async (e) => {
    e.preventDefault();
    if (formData.password.length < 6) return setError('Password too short.');
    if (formData.password !== formData.confirmPassword) return setError('Passwords do not match.');
    
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
          email: formData.email,
          password: formData.password
        }),
      });

      if (res.ok) {
        setSuccess(true); // Trigger the confirmation UI
        setTimeout(() => router.push('/login'), 3000); // Redirect after 3 seconds
      } else {
        const data = await res.json();
        setError(data.message || 'Registration failed.');
      }
    } catch (err) {
      setError('Could not connect to server.');
    } finally {
      setLoading(false);
    }
  };

  // ── Success Confirmation Box ──
  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fdf8f9] px-4">
        <div className="w-full max-w-sm bg-white rounded-3xl p-10 shadow-2xl text-center border-2 border-green-100 animate-in zoom-in-95">
          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={40} className="text-green-500" />
          </div>
          <h2 className="text-2xl font-black text-gray-900 mb-2">Account Created!</h2>
          <p className="text-gray-500 font-medium">Welcome to GymHack. Redirecting you to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: '#fdf8f9' }}>
      <div className="w-full max-w-[460px] bg-white rounded-3xl p-8 shadow-xl border-2 border-gray-100">
        
        {/* Progress Bar */}
        <div className="flex gap-2 mb-8">
          {[1, 2, 3].map(i => (
            <div key={i} className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${step >= i ? 'bg-[#c23d6a]' : 'bg-gray-100'}`} />
          ))}
        </div>

        {/* STEP 1: PERSONAL INFO */}
        {step === 1 && (
          <div className="space-y-5">
            <h2 className="text-xl font-black">Let's get started</h2>
            <div className="grid grid-cols-2 gap-3">
              <input placeholder="First Name" value={formData.firstName} onChange={set('firstName')} className="border-2 p-3.5 rounded-2xl outline-none focus:border-[#c23d6a]" />
              <input placeholder="Last Name" value={formData.lastName} onChange={set('lastName')} className="border-2 p-3.5 rounded-2xl outline-none focus:border-[#c23d6a]" />
            </div>
            <input placeholder="Mobile Number" value={formData.phone} onChange={set('phone')} maxLength={10} className="border-2 w-full p-3.5 rounded-2xl outline-none focus:border-[#c23d6a]" />
            <button onClick={nextToStep2} className="w-full bg-[#c23d6a] text-white py-4 rounded-2xl font-black flex items-center justify-center gap-2">
              Continue <ArrowRight size={18} />
            </button>
          </div>
        )}

        {/* STEP 2: EMAIL & OTP */}
        {step === 2 && (
          <div className="space-y-5">
            <button onClick={() => setStep(1)} className="text-gray-400 flex items-center gap-1 text-xs font-bold"><ArrowLeft size={14}/> BACK</button>
            <h2 className="text-xl font-black">Verify Email</h2>
            <div className="flex gap-2">
              <input placeholder="email@example.com" value={formData.email} onChange={set('email')} className="border-2 flex-1 p-3.5 rounded-2xl outline-none focus:border-[#c23d6a]" />
              <button onClick={sendOTP} disabled={loading} className="bg-black text-white px-4 rounded-2xl text-xs font-bold disabled:opacity-50">
                {loading ? '...' : 'Send OTP'}
              </button>
            </div>
            <input placeholder="Enter OTP" value={formData.otp} onChange={set('otp')} maxLength={6} className="border-2 w-full p-4 rounded-2xl text-center text-2xl font-black tracking-widest outline-none focus:border-black" />
            <button onClick={verifyOTP} disabled={!formData.otp || loading} className="w-full bg-black text-white py-4 rounded-2xl font-black disabled:opacity-50">
              {loading ? 'Verifying...' : 'Verify & Continue'}
            </button>
          </div>
        )}

        {/* STEP 3: PASSWORDS */}
        {step === 3 && (
          <form onSubmit={handleFinalSubmit} className="space-y-5">
            <h2 className="text-xl font-black">Set Password</h2>
            <div className="bg-green-50 p-3 rounded-2xl flex items-center gap-2 border border-green-100">
              <ShieldCheck size={18} className="text-green-600" />
              <span className="text-xs font-bold text-green-700">{formData.email} verified</span>
            </div>
            <input type="password" placeholder="New Password" value={formData.password} onChange={set('password')} className="border-2 w-full p-3.5 rounded-2xl outline-none focus:border-[#c23d6a]" />
            <input type="password" placeholder="Confirm Password" value={formData.confirmPassword} onChange={set('confirmPassword')} className="border-2 w-full p-3.5 rounded-2xl outline-none focus:border-[#c23d6a]" />
            <button type="submit" disabled={loading} className="w-full bg-[#c23d6a] text-white py-4 rounded-2xl font-black shadow-lg shadow-[#c23d6a]/30">
              {loading ? 'Saving...' : 'Create My Account'}
            </button>
          </form>
        )}

        {error && (
          <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-xl flex items-center gap-2 text-xs font-bold border border-red-100">
            <AlertCircle size={14} /> {error}
          </div>
        )}
      </div>
    </div>
  );
}