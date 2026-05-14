'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const router = useRouter();
  const { setUser } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        // 1. Save Token and User Data
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // 2. Update Global State
        setUser(data.user);
        
        // 3. Redirect to Shop or Checkout
        router.push('/');
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('Connection to server failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-8 bg-white rounded-3xl shadow-2xl border border-gray-100">
      <h2 className="text-3xl font-black italic mb-2">WELCOME <span className="text-[#c23d6a]">BACK</span></h2>
      <p className="text-gray-400 text-sm mb-8 font-medium">Log in to sync your individual cart.</p>
      
      <form onSubmit={handleLogin} className="space-y-5">
        <input 
          type="email" 
          placeholder="Email Address" 
          className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-[#c23d6a] transition-all"
          onChange={(e) => setEmail(e.target.value)}
          required 
        />
        <input 
          type="password" 
          placeholder="Password" 
          className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-[#c23d6a] transition-all"
          onChange={(e) => setPassword(e.target.value)}
          required 
        />

        {error && <p className="text-red-500 text-xs font-bold bg-red-50 p-3 rounded-xl italic">! {error}</p>}

        <button 
          disabled={loading}
          className="w-full py-4 bg-[#c23d6a] text-white rounded-2xl font-black shadow-lg hover:shadow-pink-200 active:scale-95 transition-all"
        >
          {loading ? 'AUTHENTICATING...' : 'LOGIN NOW'}
        </button>
      </form>

      <p className="text-center mt-6 text-sm text-gray-500">
        New to Gym Hack? <Link href="/signup" className="text-[#c23d6a] font-bold underline">Create Account</Link>
      </p>
    </div>
  );
}