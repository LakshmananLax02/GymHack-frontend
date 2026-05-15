'use client';
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { 
  User, Mail, Phone, Package, 
  MapPin, LogOut, ChevronRight, Settings 
} from 'lucide-react';

export default function ProfilePage() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();

  // Protect the route: If not logged in, send to login
  if (!loading && !user) {
    router.push('/login');
    return null;
  }

  if (loading) return <ProfileSkeleton />;

  return (
    <div className="min-h-screen bg-[#fcfaff] pb-20">
      {/* Header Profile Card */}
      <div className="bg-[#072654] text-white pt-12 pb-20 px-6 rounded-b-[40px] shadow-2xl">
        <div className="max-w-md mx-auto flex items-center gap-5">
          <div className="w-20 h-20 bg-[#c23d6a] rounded-full flex items-center justify-center text-3xl font-black italic border-4 border-white/20">
            {user?.firstName?.charAt(0)}
          </div>
          <div>
            <h1 className="text-2xl font-black italic uppercase tracking-tight">
              {user?.firstName} {user?.lastName}
            </h1>
            <p className="text-white/60 text-xs font-medium uppercase tracking-widest">Premium Member</p>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 -mt-10 space-y-4">
        {/* Account Details Section */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-6">Account Information</h3>
          
          <div className="space-y-6">
            <InfoRow icon={<Mail size={18}/>} label="Email" value={user?.email} />
            <InfoRow icon={<Phone size={18}/>} label="Phone" value={user?.phone || 'Not provided'} />
            <InfoRow icon={<MapPin size={18}/>} label="Default Address" value="No address saved" />
          </div>
        </div>

        {/* Quick Actions / Logs */}
        <div className="grid grid-cols-2 gap-4">
          <button 
            onClick={() => router.push('/cart')}
            className="bg-white p-6 rounded-3xl border border-gray-100 flex flex-col items-center gap-3 shadow-sm active:scale-95 transition-all"
          >
            <div className="p-3 bg-pink-50 text-[#c23d6a] rounded-2xl"><Package size={24}/></div>
            <span className="text-xs font-black italic">MY ORDERS</span>
          </button>

          <button className="bg-white p-6 rounded-3xl border border-gray-100 flex flex-col items-center gap-3 shadow-sm active:scale-95 transition-all">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl"><Settings size={24}/></div>
            <span className="text-xs font-black italic">SETTINGS</span>
          </button>
        </div>

        {/* Logout Button */}
        <button 
          onClick={logout}
          className="w-full py-5 bg-white text-red-500 rounded-3xl font-black italic flex items-center justify-center gap-3 border border-red-50 shadow-sm active:bg-red-50 transition-all"
        >
          <LogOut size={20} />
          LOGOUT SESSION
        </button>
      </div>
    </div>
  );
}

// ─── Sub-Components ──────────────────────────────────────────────────────────

function InfoRow({ icon, label, value }) {
  return (
    <div className="flex items-center gap-4">
      <div className="text-gray-300">{icon}</div>
      <div>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter leading-none">{label}</p>
        <p className="text-sm font-bold text-gray-800">{value}</p>
      </div>
    </div>
  );
}

function ProfileSkeleton() {
  return (
    <div className="max-w-md mx-auto p-10 text-center">
      <div className="w-10 h-10 border-4 border-[#c23d6a] border-t-transparent rounded-full animate-spin mx-auto"></div>
    </div>
  );
}