'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
    const router = useRouter();
    const [auth, setAuth] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('adminToken');
        if (!token) {
            router.replace('/'); // Redirect away if no token
        } else {
            setAuth(true);
        }
    }, [router]);

    if (!auth) return null;

    return (
        <div className="min-h-screen bg-black text-white p-10">
            <div className="max-w-6xl mx-auto">
                <header className="flex justify-between items-center mb-10 border-b border-white/10 pb-6">
                    <h1 className="text-4xl font-black italic">ADMIN<span className="text-red-600">PANEL</span></h1>
                    <button onClick={() => { localStorage.removeItem('adminToken'); router.push('/'); }} className="bg-zinc-800 px-6 py-2 rounded-full text-xs font-bold">LOGOUT</button>
                </header>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-zinc-900 p-8 rounded-3xl border border-white/5">
                        <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">Total Users</p>
                        <h2 className="text-4xl font-black mt-2">1,240</h2>
                    </div>
                    {/* Add more stats here */}
                </div>
            </div>
        </div>
    );
}