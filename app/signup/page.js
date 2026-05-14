'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';

export default function SignupPage() {
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', phone: '', password: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false); // New Success State
  const router = useRouter();
  const { setUser } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (res.ok) {
        setSuccess(true);
        // Give the UI a moment to show success before navigating
        setTimeout(() => {
          router.push('/login');
        }, 1500);
      } else {
        setError(data.message || "Registration failed");
      }
    } catch (err) {
      setError("Server connection failed. Is your backend running?");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded-3xl shadow-xl border">
      <h2 className="text-2xl font-black italic mb-6">JOIN GYM<span className="text-[#c23d6a]">HACK</span></h2>
      
      {success ? (
        <div className="text-center py-10 space-y-4">
          <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto animate-bounce">
            ✓
          </div>
          <h3 className="font-bold text-lg">Account Created!</h3>
          <p className="text-sm text-gray-500 italic uppercase tracking-widest">Redirecting to login...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-2">
            <input className="w-full p-3 border rounded-xl bg-gray-50 focus:border-[#c23d6a] outline-none transition-all" placeholder="First Name" onChange={e => setFormData({...formData, firstName: e.target.value})} required />
            <input className="w-full p-3 border rounded-xl bg-gray-50 focus:border-[#c23d6a] outline-none transition-all" placeholder="Last Name" onChange={e => setFormData({...formData, lastName: e.target.value})} required />
          </div>
          <input className="w-full p-3 border rounded-xl bg-gray-50 focus:border-[#c23d6a] outline-none transition-all" type="email" placeholder="Email" onChange={e => setFormData({...formData, email: e.target.value})} required />
          <input className="w-full p-3 border rounded-xl bg-gray-50 focus:border-[#c23d6a] outline-none transition-all" placeholder="Phone" onChange={e => setFormData({...formData, phone: e.target.value})} required />
          <input className="w-full p-3 border rounded-xl bg-gray-50 focus:border-[#c23d6a] outline-none transition-all" type="password" placeholder="Password" onChange={e => setFormData({...formData, password: e.target.value})} required />
          
          {error && <p className="text-red-500 text-xs font-bold bg-red-50 p-2 rounded-lg italic">! {error}</p>}
          
          <button className="w-full py-4 bg-[#c23d6a] text-white rounded-2xl font-black shadow-lg hover:opacity-90 active:scale-95 transition-all">
            CREATE ACCOUNT
          </button>
        </form>
      )}
    </div>
  );
}