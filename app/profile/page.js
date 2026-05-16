'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  User, Mail, Phone, Package, MapPin, LogOut,
  ChevronRight, Settings, Edit3, Shield,
  ShoppingCart, Star, Clock, CheckCircle2,
  ArrowLeft, Camera, Dumbbell,
} from 'lucide-react';

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function ProfileSkeleton() {
  return (
    <div className="min-h-screen bg-[#fdf8f9]">
      {/* Hero skeleton */}
      <div className="h-56 bg-gradient-to-br from-[#c23d6a] to-[#a8305a] animate-pulse" />
      <div className="max-w-lg mx-auto px-4 -mt-16 space-y-4 pb-24">
        <div className="bg-white rounded-3xl p-6 shadow-md border border-gray-100 animate-pulse">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-gray-200" />
            <div className="flex-1 space-y-2">
              <div className="h-5 bg-gray-200 rounded-lg w-3/4" />
              <div className="h-3 bg-gray-100 rounded-lg w-1/2" />
            </div>
          </div>
        </div>
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 animate-pulse">
            <div className="h-4 bg-gray-100 rounded w-1/3 mb-3" />
            <div className="h-12 bg-gray-50 rounded-xl" />
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Info Row ─────────────────────────────────────────────────────────────────
function InfoRow({ icon: Icon, label, value, accent = false }) {
  return (
    <div className="flex items-center gap-4 py-3 border-b border-gray-50 last:border-0">
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${accent ? 'bg-[#fff0f5]' : 'bg-gray-50'}`}>
        <Icon size={16} className={accent ? 'text-[#c23d6a]' : 'text-gray-400'} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-0.5">{label}</p>
        <p className="text-sm font-semibold text-gray-800 truncate">{value || <span className="text-gray-300 font-normal italic">Not provided</span>}</p>
      </div>
    </div>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ icon: Icon, label, value, color, bg }) {
  return (
    <div className={`${bg} border border-white/60 rounded-2xl p-4 flex flex-col items-center gap-2 text-center`}>
      <div className={`w-10 h-10 rounded-xl ${color} bg-white flex items-center justify-center shadow-sm`}>
        <Icon size={18} className="shrink-0" />
      </div>
      <p className="text-xl font-black text-gray-900">{value}</p>
      <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">{label}</p>
    </div>
  );
}

// ─── Action Row ───────────────────────────────────────────────────────────────
function ActionRow({ icon: Icon, label, sublabel, onClick, href, iconBg, iconColor, danger }) {
  const inner = (
    <div className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all cursor-pointer
      ${danger ? 'hover:bg-red-50 active:bg-red-100' : 'hover:bg-gray-50 active:bg-gray-100'}`}
      onClick={onClick}>
      <div className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center shrink-0`}>
        <Icon size={18} className={iconColor} />
      </div>
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-bold ${danger ? 'text-red-600' : 'text-gray-900'}`}>{label}</p>
        {sublabel && <p className="text-xs text-gray-400 font-medium mt-0.5">{sublabel}</p>}
      </div>
      <ChevronRight size={16} className={danger ? 'text-red-300' : 'text-gray-300'} />
    </div>
  );
  return href ? <Link href={href}>{inner}</Link> : inner;
}

// ─── Main Profile Page ────────────────────────────────────────────────────────
export default function ProfilePage() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  // Route guard
  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [loading, user, router]);

  if (loading || !mounted) return <ProfileSkeleton />;
  if (!user) return null;

  const initial    = (user.firstName || user.name || user.email || 'U')[0].toUpperCase();
  const fullName   = user.firstName && user.lastName
    ? `${user.firstName} ${user.lastName}`
    : user.name || 'My Account';
  const memberSince = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })
    : 'GymHack Member';

  const handleLogout = async () => {
    setLoggingOut(true);
    await new Promise(r => setTimeout(r, 600)); // brief pause for UX
    logout();
    router.push('/');
  };

  return (
    <div className="min-h-screen pb-24" style={{ background: '#fdf8f9' }}>

      {/* ── Hero Banner ──────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #c23d6a 0%, #8b1a42 60%, #072654 100%)' }}>

        {/* Decorative circles */}
        <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-white/5" />
        <div className="absolute -bottom-8 -left-8 w-40 h-40 rounded-full bg-white/5" />
        <div className="absolute top-8 right-1/3 w-20 h-20 rounded-full bg-white/5" />

        <div className="relative max-w-lg mx-auto px-4 pt-10 pb-24">
          {/* Back button */}
          <button onClick={() => router.back()}
            className="flex items-center gap-1.5 text-white/70 hover:text-white transition-colors mb-6 text-sm font-semibold">
            <ArrowLeft size={16} /> Back
          </button>

          {/* Profile identity */}
          <div className="flex items-center gap-5">
            {/* Avatar */}
            <div className="relative shrink-0">
              <div className="w-20 h-20 rounded-2xl bg-white/20 border-2 border-white/30 flex items-center justify-center text-3xl font-black text-white shadow-xl">
                {initial}
              </div>
              {/* Online dot */}
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 rounded-full border-2 border-white" />
            </div>

            <div className="flex-1 min-w-0">
              <h1 className="text-xl font-black text-white leading-tight truncate">{fullName}</h1>
              <p className="text-white/60 text-xs font-semibold mt-0.5 truncate">{user.email}</p>
              <div className="flex items-center gap-1.5 mt-2">
                <div className="flex items-center gap-1 bg-white/15 rounded-full px-2.5 py-1">
                  <Dumbbell size={11} className="text-white/80" />
                  <span className="text-[10px] font-bold text-white/80 uppercase tracking-wider">Premium Member</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Content ──────────────────────────────────────────────────────── */}
      <div className="max-w-lg mx-auto px-4 -mt-14 space-y-4">

        {/* ── Stats row ── */}
        <div className="grid grid-cols-3 gap-3">
          <StatCard icon={Package}      label="Orders"  value="0"  color="text-[#c23d6a]" bg="bg-[#fff0f5]" />
          <StatCard icon={Star}         label="Points"  value="0"  color="text-amber-500" bg="bg-amber-50" />
          <StatCard icon={ShoppingCart} label="Wishlist" value="0" color="text-blue-500"  bg="bg-blue-50"  />
        </div>

        {/* ── Account Info ── */}
        <div className="bg-white rounded-3xl shadow-md border border-gray-100 overflow-hidden">
          <div className="px-5 pt-5 pb-2 flex items-center justify-between">
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Account Information</p>
            <button className="flex items-center gap-1 text-[11px] font-bold text-[#c23d6a] hover:underline">
              <Edit3 size={11} /> Edit
            </button>
          </div>
          <div className="px-5 pb-4">
            <InfoRow icon={User}  label="Full Name" value={fullName}      accent />
            <InfoRow icon={Mail}  label="Email"     value={user.email}    />
            <InfoRow icon={Phone} label="Phone"     value={user.phone}    />
            <InfoRow icon={MapPin} label="Default Address" value={user.address} />
          </div>
        </div>

        {/* ── Member since ── */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-5 py-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-green-50 flex items-center justify-center shrink-0">
            <Shield size={16} className="text-green-600" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Member Since</p>
            <p className="text-sm font-bold text-gray-800">{memberSince}</p>
          </div>
          <div className="ml-auto">
            <span className="text-[10px] font-black bg-green-100 text-green-700 px-2.5 py-1 rounded-full uppercase tracking-wider">
              Verified
            </span>
          </div>
        </div>

        {/* ── Quick Actions ── */}
        <div className="bg-white rounded-3xl shadow-md border border-gray-100 overflow-hidden">
          <div className="px-5 pt-5 pb-2">
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Quick Actions</p>
          </div>
          <div className="px-2 pb-3 space-y-0.5">
            <ActionRow
              icon={Package} label="My Orders" sublabel="View your order history"
              href="/orders"
              iconBg="bg-[#fff0f5]" iconColor="text-[#c23d6a]"
            />
            <ActionRow
              icon={MapPin} label="Saved Addresses" sublabel="Manage delivery addresses"
              href="/addresses"
              iconBg="bg-blue-50" iconColor="text-blue-600"
            />
            <ActionRow
              icon={Settings} label="Account Settings" sublabel="Password, notifications"
              href="/settings"
              iconBg="bg-gray-100" iconColor="text-gray-600"
            />
          </div>
        </div>

        {/* ── Logout ── */}
        <div className="bg-white rounded-3xl shadow-sm border border-red-100 overflow-hidden">
          <div className="px-2 py-2">
            <ActionRow
              icon={LogOut}
              label="Log Out"
              sublabel="Sign out of your account"
              onClick={() => setShowLogoutConfirm(true)}
              iconBg="bg-red-50" iconColor="text-red-500"
              danger
            />
          </div>
        </div>

        {/* App version */}
        <p className="text-center text-[10px] text-gray-300 font-medium pb-4">
          GymHack v1.0 · Made with 💪 for fitness
        </p>
      </div>

      {/* ── Logout Confirmation Modal ─────────────────────────────────────── */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[99999] flex items-end md:items-center justify-center px-4 pb-6 md:pb-0">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowLogoutConfirm(false)}
          />

          {/* Sheet */}
          <div
            className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl p-6 space-y-5"
            style={{ animation: 'slideUpModal 0.25s ease forwards' }}
          >
            {/* Icon */}
            <div className="flex justify-center">
              <div className="w-14 h-14 rounded-2xl bg-red-50 border-2 border-red-100 flex items-center justify-center">
                <LogOut size={24} className="text-red-500" />
              </div>
            </div>

            {/* Text */}
            <div className="text-center space-y-1.5">
              <h3 className="text-lg font-black text-gray-900">Log out?</h3>
              <p className="text-sm text-gray-500 font-medium leading-relaxed">
                You'll need to sign in again to access your account, cart and orders.
              </p>
            </div>

            {/* Buttons */}
            <div className="flex flex-col gap-2.5">
              <button
                onClick={handleLogout}
                disabled={loggingOut}
                className="w-full py-3.5 bg-red-500 hover:bg-red-600 text-white font-black rounded-2xl transition-all active:scale-[0.98] disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {loggingOut ? (
                  <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Signing out…</>
                ) : (
                  <><LogOut size={16} /> Yes, Log Out</>
                )}
              </button>
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="w-full py-3.5 bg-gray-50 hover:bg-gray-100 text-gray-700 font-bold rounded-2xl transition-all active:scale-[0.98] border-2 border-gray-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideUpModal {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}