// 'use client';
// import { useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { ShieldAlert, Loader2 } from 'lucide-react';

// export default function AdminLogin() {
//     const [form, setForm] = useState({ email: '', password: '', secretKey: '' });
//     const [error, setError] = useState('');
//     const [loading, setLoading] = useState(false);
//     const router = useRouter();

//     const handleLogin = async (e) => {
//         e.preventDefault();
//         setLoading(true);
//         try {
//             const res = await fetch(`${process.env.NEXT_PUBLIC_API}/api/admin/login`, {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify(form)
//             });
//             const data = await res.json();
//             if (!res.ok) throw new Error(data.error);

//             localStorage.setItem('adminToken', data.token);
//             router.push('/Admin/Dashboard');
//         } catch (err) {
//             setError(err.message);
//         } finally { setLoading(false); }
//     };

//     return (
//         <div className="min-h-screen bg-black flex items-center justify-center p-6">
//             <form onSubmit={handleLogin} className="w-full max-w-sm space-y-4 bg-zinc-900 p-8 rounded-3xl border border-white/5">
//                 <div className="text-center mb-6">
//                     <ShieldAlert className="text-red-600 mx-auto mb-2" size={40} />
//                     <h1 className="text-white font-black uppercase tracking-widest text-lg">Vault Login</h1>
//                 </div>
//                 <input type="email" placeholder="Admin Email" className="w-full bg-black border border-zinc-800 p-4 rounded-xl text-white outline-none" onChange={(e) => setForm({...form, email: e.target.value})} />
//                 <input type="password" placeholder="Passphrase" className="w-full bg-black border border-zinc-800 p-4 rounded-xl text-white outline-none" onChange={(e) => setForm({...form, password: e.target.value})} />
//                 <input type="password" placeholder="System Master Key" className="w-full bg-black border border-zinc-800 p-4 rounded-xl text-white outline-none font-mono" onChange={(e) => setForm({...form, secretKey: e.target.value})} />
//                 {error && <p className="text-red-500 text-xs font-bold text-center">{error}</p>}
//                 <button className="w-full py-4 bg-red-600 text-white font-black rounded-xl hover:bg-red-500 transition-all">
//                     {loading ? <Loader2 className="animate-spin mx-auto" /> : 'AUTHENTICATE'}
//                 </button>
//             </form>
//         </div>
//     );
// }

'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Loader2, User, Lock } from 'lucide-react';

export default function AdminLogin() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      localStorage.setItem('adminToken', data.token);
      router.push('/Admin/Dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-sm bg-[#0f0f0f] border border-white/5 rounded-[40px] p-10 shadow-2xl">
        <div className="text-center mb-10">
          <ShieldCheck className="text-red-600 mx-auto mb-4" size={40} />
          <h1 className="text-white text-xl font-black tracking-tighter">SECURE ACCESS</h1>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="relative">
            <User className="absolute left-4 top-4 text-zinc-600" size={18} />
            <input 
              type="text" required placeholder="Username"
              className="w-full bg-white/5 border border-white/10 p-4 pl-12 rounded-2xl text-white outline-none focus:border-red-600 transition-all"
              onChange={(e) => setForm({...form, username: e.target.value})}
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-4 text-zinc-600" size={18} />
            <input 
              type="password" required placeholder="Password"
              className="w-full bg-white/5 border border-white/10 p-4 pl-12 rounded-2xl text-white outline-none focus:border-red-600 transition-all"
              onChange={(e) => setForm({...form, password: e.target.value})}
              autoComplete="new-password"
            />
          </div>

          {error && <p className="text-red-500 text-xs font-bold text-center bg-red-500/5 p-3 rounded-xl border border-red-500/10">{error}</p>}

          <button 
            type="submit" disabled={loading}
            className="w-full py-4 bg-red-600 hover:bg-red-500 text-white font-black rounded-2xl transition-all flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" /> : 'SIGN IN'}
          </button>
        </form>
      </div>
    </div>
  );
}