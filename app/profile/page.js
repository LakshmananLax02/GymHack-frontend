'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  User, Mail, Phone, Package, MapPin, LogOut,
  ChevronRight, Lock, ArrowLeft, X, Clock,
  CheckCircle2, Truck, AlertCircle,
} from 'lucide-react';

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function ProfileSkeleton() {
  return (
    <div className="min-h-screen bg-[#fdf8f9]">
      <div className="h-52 bg-gradient-to-br from-[#c23d6a] to-[#072654] animate-pulse" />
      <div className="max-w-lg mx-auto px-4 -mt-12 space-y-4 pb-24">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 animate-pulse">
            <div className="h-4 bg-gray-100 rounded w-1/3 mb-4" />
            <div className="space-y-3">
              <div className="h-10 bg-gray-50 rounded-xl" />
              <div className="h-10 bg-gray-50 rounded-xl" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Info Row ─────────────────────────────────────────────────────────────────
function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-4 py-3.5 border-b border-gray-50 last:border-0">
      <div className="w-9 h-9 rounded-xl bg-[#fff0f5] flex items-center justify-center shrink-0">
        <Icon size={15} className="text-[#c23d6a]" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-0.5">{label}</p>
        <p className="text-sm font-semibold text-gray-800 truncate">
          {value || <span className="text-gray-300 font-normal italic text-xs">Not provided</span>}
        </p>
      </div>
    </div>
  );
}

// ─── Action Row ───────────────────────────────────────────────────────────────
function ActionRow({ icon: Icon, label, sublabel, onClick, iconBg, iconColor, danger }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all text-left
        ${danger ? 'hover:bg-red-50 active:bg-red-100' : 'hover:bg-gray-50 active:bg-gray-100'}`}
    >
      <div className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center shrink-0`}>
        <Icon size={17} className={iconColor} />
      </div>
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-bold ${danger ? 'text-red-600' : 'text-gray-900'}`}>{label}</p>
        {sublabel && <p className="text-xs text-gray-400 font-medium mt-0.5">{sublabel}</p>}
      </div>
      <ChevronRight size={15} className={danger ? 'text-red-300' : 'text-gray-300'} />
    </button>
  );
}

// ─── Modal Shell ──────────────────────────────────────────────────────────────
function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-[99999] flex items-end md:items-center justify-center px-4 pb-0 md:pb-0">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div
        className="relative w-full max-w-md bg-white rounded-t-3xl md:rounded-3xl shadow-2xl flex flex-col overflow-hidden"
        style={{ animation: 'slideUpModal 0.25s ease forwards', maxHeight: '85vh' }}
      >
        {/* Modal header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 shrink-0">
          <h3 className="font-black text-base text-gray-900">{title}</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X size={18} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}

// ─── Orders Modal ─────────────────────────────────────────────────────────────
function OrdersModal({ onClose }) {
  // Replace with real API call: useEffect → fetch('/api/orders')
  const orders = []; // empty for now — wire to your backend

  const statusConfig = {
    delivered:  { icon: CheckCircle2, color: 'text-green-600',  bg: 'bg-green-50',  label: 'Delivered'   },
    processing: { icon: Clock,        color: 'text-amber-600',  bg: 'bg-amber-50',  label: 'Processing'  },
    shipped:    { icon: Truck,        color: 'text-blue-600',   bg: 'bg-blue-50',   label: 'Shipped'     },
    cancelled:  { icon: AlertCircle,  color: 'text-red-500',    bg: 'bg-red-50',    label: 'Cancelled'   },
  };

  return (
    <Modal title="My Orders" onClose={onClose}>
      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-[#fff0f5] flex items-center justify-center mb-4">
            <Package size={28} className="text-[#c23d6a]" />
          </div>
          <p className="font-black text-gray-900 text-base">No orders yet</p>
          <p className="text-sm text-gray-400 font-medium mt-1.5 mb-6">
            Your placed orders will appear here
          </p>
          <button
            onClick={onClose}
            className="px-6 py-3 bg-[#c23d6a] text-white text-sm font-bold rounded-2xl hover:bg-[#a8305a] transition-colors"
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="divide-y divide-gray-50 px-4 py-2">
          {orders.map(order => {
            const cfg = statusConfig[order.status] || statusConfig.processing;
            const StatusIcon = cfg.icon;
            return (
              <div key={order.id} className="py-4 flex gap-3">
                <div className={`w-10 h-10 rounded-xl ${cfg.bg} flex items-center justify-center shrink-0 mt-0.5`}>
                  <StatusIcon size={18} className={cfg.color} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-bold text-gray-900">Order #{order.id}</p>
                    <span className={`text-[10px] font-black ${cfg.color} ${cfg.bg} px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0`}>
                      {cfg.label}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 font-medium mt-0.5">{order.date}</p>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-1">{order.items?.join(', ')}</p>
                  <p className="text-sm font-black text-[#c23d6a] mt-1">₹{order.total}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Modal>
  );
}

// ─── Addresses Modal ──────────────────────────────────────────────────────────
function AddressesModal({ onClose }) {
  // Replace with real API call: useEffect → fetch('/api/addresses')
  const addresses = []; // empty for now — wire to your backend

  return (
    <Modal title="Saved Addresses" onClose={onClose}>
      {addresses.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-[#fff0f5] flex items-center justify-center mb-4">
            <MapPin size={28} className="text-[#c23d6a]" />
          </div>
          <p className="font-black text-gray-900 text-base">No saved addresses</p>
          <p className="text-sm text-gray-400 font-medium mt-1.5 mb-6">
            Addresses saved during checkout will appear here
          </p>
          <button
            onClick={onClose}
            className="px-6 py-3 bg-[#c23d6a] text-white text-sm font-bold rounded-2xl hover:bg-[#a8305a] transition-colors"
          >
            Close
          </button>
        </div>
      ) : (
        <div className="divide-y divide-gray-50 px-4 py-2">
          {addresses.map((addr, i) => (
            <div key={i} className="py-4 flex gap-3 items-start">
              <div className="w-10 h-10 rounded-xl bg-[#fff0f5] flex items-center justify-center shrink-0 mt-0.5">
                <MapPin size={17} className="text-[#c23d6a]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="text-sm font-bold text-gray-900">{addr.label || 'Address'}</p>
                  {addr.isDefault && (
                    <span className="text-[9px] font-black bg-[#fff0f5] text-[#c23d6a] px-2 py-0.5 rounded-full uppercase tracking-wider">
                      Default
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 font-medium leading-relaxed">
                  {addr.line1}{addr.line2 ? `, ${addr.line2}` : ''}<br />
                  {addr.city}, {addr.state} – {addr.pincode}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </Modal>
  );
}

// ─── Logout Confirm Modal ─────────────────────────────────────────────────────
function LogoutModal({ onConfirm, onClose, loading }) {
  return (
    <div className="fixed inset-0 z-[99999] flex items-end md:items-center justify-center px-4 pb-6 md:pb-0">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div
        className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl p-6 space-y-5"
        style={{ animation: 'slideUpModal 0.25s ease forwards' }}
      >
        <div className="flex justify-center">
          <div className="w-14 h-14 rounded-2xl bg-red-50 border-2 border-red-100 flex items-center justify-center">
            <LogOut size={22} className="text-red-500" />
          </div>
        </div>
        <div className="text-center space-y-1.5">
          <h3 className="text-lg font-black text-gray-900">Log out?</h3>
          <p className="text-sm text-gray-500 font-medium leading-relaxed">
            You'll need to sign in again to access your account and orders.
          </p>
        </div>
        <div className="flex flex-col gap-2.5">
          <button
            onClick={onConfirm}
            disabled={loading}
            className="w-full py-3.5 bg-red-500 hover:bg-red-600 text-white font-black rounded-2xl transition-all active:scale-[0.98] disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading
              ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Signing out…</>
              : <><LogOut size={16} /> Yes, Log Out</>}
          </button>
          <button
            onClick={onClose}
            className="w-full py-3.5 bg-gray-50 hover:bg-gray-100 text-gray-700 font-bold rounded-2xl transition-all border-2 border-gray-200"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function ProfilePage() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();

  const [modal,       setModal]       = useState(null); // 'orders' | 'addresses' | 'logout'
  const [loggingOut,  setLoggingOut]  = useState(false);
  const [mounted,     setMounted]     = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [loading, user, router]);

  if (loading || !mounted) return <ProfileSkeleton />;
  if (!user) return null;

  const initial  = (user.firstName || user.name || user.email || 'U')[0].toUpperCase();
  const fullName = user.firstName && user.lastName
    ? `${user.firstName} ${user.lastName}`
    : (user.name || 'My Account');

  const handleLogout = async () => {
    setLoggingOut(true);
    await new Promise(r => setTimeout(r, 600));
    logout();
    router.push('/');
  };

  return (
    <div className="min-h-screen pb-28" style={{ background: '#fdf8f9' }}>

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <div
        className="relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #c23d6a 0%, #8b1a42 60%, #072654 100%)' }}
      >
        {/* Decorative blobs */}
        <div className="absolute -top-12 -right-12 w-52 h-52 rounded-full bg-white/5" />
        <div className="absolute -bottom-6 -left-6 w-36 h-36 rounded-full bg-white/5" />

        <div className="relative max-w-lg mx-auto px-4 pt-10 pb-20">
          {/* Back */}
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1.5 text-white/70 hover:text-white transition-colors mb-6 text-sm font-semibold"
          >
            <ArrowLeft size={16} /> Back
          </button>

          {/* Identity */}
          <div className="flex items-center gap-4">
            <div className="relative shrink-0">
              <div className="w-18 h-18 w-[72px] h-[72px] rounded-2xl bg-white/20 border-2 border-white/30 flex items-center justify-center text-2xl font-black text-white shadow-xl">
                {initial}
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-xl font-black text-white leading-tight truncate">{fullName}</h1>
              <p className="text-white/60 text-xs font-semibold mt-0.5 truncate">{user.email}</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Cards ────────────────────────────────────────────────────────── */}
      <div className="max-w-lg mx-auto px-4 -mt-10 space-y-4">

        {/* Account Info */}
        <div className="bg-white rounded-3xl shadow-md border border-gray-100 overflow-hidden">
          <div className="px-5 pt-5 pb-1">
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Account Information</p>
          </div>
          <div className="px-5 pb-4">
            <InfoRow icon={User}  label="Full Name" value={fullName}   />
            <InfoRow icon={Mail}  label="Email"     value={user.email} />
            <InfoRow icon={Phone} label="Phone"     value={user.phone} />
          </div>
        </div>

        {/* Actions */}
        <div className="bg-white rounded-3xl shadow-md border border-gray-100 overflow-hidden">
          <div className="px-5 pt-5 pb-1">
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">My Account</p>
          </div>
          <div className="px-2 pb-3 space-y-0.5">
            <ActionRow
              icon={Package} label="My Orders"
              sublabel="View your order history"
              onClick={() => setModal('orders')}
              iconBg="bg-[#fff0f5]" iconColor="text-[#c23d6a]"
            />
            <ActionRow
              icon={MapPin} label="Saved Addresses"
              sublabel="Manage delivery addresses"
              onClick={() => setModal('addresses')}
              iconBg="bg-blue-50" iconColor="text-blue-600"
            />
            <ActionRow
              icon={Lock} label="Change Password"
              sublabel="Update your account password"
              onClick={() => router.push('/change-password')}
              iconBg="bg-amber-50" iconColor="text-amber-600"
            />
          </div>
        </div>

        {/* Logout */}
        <div className="bg-white rounded-3xl shadow-sm border border-red-100 overflow-hidden">
          <div className="px-2 py-2">
            <ActionRow
              icon={LogOut}
              label="Log Out"
              sublabel="Sign out of your account"
              onClick={() => setModal('logout')}
              iconBg="bg-red-50" iconColor="text-red-500"
              danger
            />
          </div>
        </div>

        <p className="text-center text-[10px] text-gray-300 font-medium pb-4">
          GymHack · Built for real routines
        </p>
      </div>

      {/* ── Modals ───────────────────────────────────────────────────────── */}
      {modal === 'orders'    && <OrdersModal    onClose={() => setModal(null)} />}
      {modal === 'addresses' && <AddressesModal onClose={() => setModal(null)} />}
      {modal === 'logout'    && (
        <LogoutModal
          loading={loggingOut}
          onConfirm={handleLogout}
          onClose={() => setModal(null)}
        />
      )}

      <style>{`
        @keyframes slideUpModal {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}