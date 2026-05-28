'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import {
  User, Mail, Phone, Package, Lock, LogOut,
  ChevronRight, ArrowLeft, X, Clock,
  CheckCircle2, Truck, AlertCircle, Eye, EyeOff,
} from 'lucide-react';

const API = process.env.NEXT_PUBLIC_API_BASE_URL || '${process.env.NEXT_PUBLIC_API_URL}';

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function ProfileSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="h-48 animate-pulse" style={{ background: 'linear-gradient(135deg,#c23d6a,#072654)' }} />
      <div className="max-w-[480px] mx-auto px-5 -mt-8 space-y-3 pb-24">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-white rounded-2xl p-5 animate-pulse border border-gray-100">
            <div className="h-3 bg-gray-100 rounded w-1/4 mb-4" />
            <div className="space-y-3">
              <div className="h-9 bg-gray-50 rounded-xl" />
              <div className="h-9 bg-gray-50 rounded-xl" />
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
    <div className="flex items-center gap-3.5 py-2.5 border-b border-gray-50 last:border-0">
      <div className="w-9 h-9 rounded-xl bg-[#fff0f5] flex items-center justify-center shrink-0">
        <Icon size={15} className="text-[#c23d6a]" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-bold tracking-widest text-gray-400 mb-0.5">{label}</p>
        <p className="text-sm font-semibold text-gray-800 truncate">
          {value || <span className="text-gray-300 text-xs font-normal italic">Not provided</span>}
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
      className={`w-full flex items-center gap-3.5 px-3 py-2.5 rounded-xl transition-colors text-left
        ${danger ? 'hover:bg-red-50 active:bg-red-100' : 'hover:bg-gray-50 active:bg-gray-100'}`}
    >
      <div className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center shrink-0`}>
        <Icon size={17} className={iconColor} />
      </div>
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-semibold ${danger ? 'text-red-500' : 'text-gray-900'}`}>{label}</p>
        {sublabel && <p className="text-xs text-gray-400 mt-0.5">{sublabel}</p>}
      </div>
      <ChevronRight size={15} className={danger ? 'text-red-200' : 'text-gray-300'} />
    </button>
  );
}

// ─── Section Card ─────────────────────────────────────────────────────────────
function Card({ label, children, danger }) {
  return (
    <div className={`bg-white rounded-xl border shadow-lg overflow-hidden ${danger ? 'border-red-50' : 'border-gray-100'}`}>
      {label && (
        <p className="text-[10px] font-bold tracking-widest text-gray-400 px-5 pt-4 pb-1">{label}</p>
      )}
      <div className="px-2 py-2">{children}</div>
    </div>
  );
}

// ─── Modal Shell ──────────────────────────────────────────────────────────────
function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-[99999] flex items-end md:items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div
        className="relative w-full max-w-md bg-white rounded-t-xl md:rounded-xl shadow-2xl flex flex-col overflow-hidden"
        style={{ animation: 'slideUpModal 0.25s ease forwards', maxHeight: '85vh' }}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 shrink-0">
          <h3 className="font-bold text-base text-gray-900">{title}</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X size={18} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}

// ─── Change Password Modal ────────────────────────────────────────────────────
function ChangePasswordModal({ onClose }) {
  const [show,     setShow]     = useState({ current: false, next: false });
  const [form,     setForm]     = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');
  const [success,  setSuccess]  = useState(false);

  const set = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.newPassword !== form.confirmPassword) return setError('Passwords do not match.');
    if (form.newPassword.length < 6)               return setError('Must be at least 6 characters.');
    setLoading(true); setError('');
    try {
      const token = localStorage.getItem('token');
      const res   = await fetch(`${API}/api/auth/change-password`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body:    JSON.stringify({ currentPassword: form.currentPassword, newPassword: form.newPassword }),
      });
      const data  = await res.json();
      if (res.ok) setSuccess(true);
      else setError(data.error || 'Update failed.');
    } catch { setError('Connection error.'); }
    setLoading(false);
  };

  if (success) {
    return (
      <div className="p-8 text-center space-y-4">
        <div className="w-14 h-14 bg-green-50 border border-green-100 rounded-xl flex items-center justify-center mx-auto">
          <CheckCircle2 size={26} className="text-green-500" />
        </div>
        <div>
          <h3 className="font-bold text-base text-gray-900">Password updated</h3>
          <p className="text-sm text-gray-500 mt-1">Your account is now more secure.</p>
        </div>
        <button onClick={onClose}        className="w-full py-3 bg-[#c23d6a] text-white text-sm font-bold rounded-full hover:bg-[#a8305a] active:scale-[0.98] transition-all disabled:opacity-60"
>
          Done
        </button>
      </div>
    );
  }
const inputCls = 'w-full bg-white border-2 border-gray-200 focus:border-[#c23d6a] focus:ring-4 focus:ring-[#c23d6a]/10 focus:shadow-[0_0_0_4px_rgba(194,61,106,0.08)] px-4 py-3 rounded-xl outline-none transition-all text-sm font-semibold';
  

  return (
    <form onSubmit={handleSubmit} className="p-5 space-y-4">
      {[
        { key: 'currentPassword', label: 'Current Password', showKey: 'current' },
        { key: 'newPassword',     label: 'New Password',     showKey: 'next'    },
      ].map(({ key, label, showKey }) => (
        <div key={key}>
          <label className="block text-xs font-semibold text-gray-500 mb-1.5 tracking-wide">{label}</label>
          <div className="relative">
            <input
              type={show[showKey] ? 'text' : 'password'} required
              onChange={set(key)}
              className={`${inputCls} pr-10`}
            />
            <button
              type="button"
              onClick={() => setShow(p => ({ ...p, [showKey]: !p[showKey] }))}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {show[showKey] ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>
      ))}

      <div>
        <label className="block text-xs font-semibold text-gray-500 mb-1.5 tracking-wide">Confirm New Password</label>
        <input type="password" required onChange={set('confirmPassword')} className={inputCls} />
      </div>

      {error && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-100 rounded-xl px-3 py-2.5">
          <AlertCircle size={14} className="text-red-500 shrink-0" />
          <p className="text-xs font-semibold text-red-600">{error}</p>
        </div>
      )}

      <button
        type="submit" disabled={loading}
        className="w-full py-3 bg-[#c23d6a] text-white text-sm font-bold rounded-full hover:bg-[#a8305a] active:scale-[0.98] transition-all disabled:opacity-60"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            Updating...
          </span>
        ) : 'Save New Password'}
      </button>
    </form>
  );
}

// ─── Orders Modal ─────────────────────────────────────────────────────────────
const STATUS_CFG = {
  paid:       { icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50',  label: 'Paid'       },
  delivered:  { icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50',  label: 'Delivered'  },
  processing: { icon: Clock,        color: 'text-amber-600', bg: 'bg-amber-50',  label: 'Processing' },
  shipped:    { icon: Truck,        color: 'text-blue-600',  bg: 'bg-blue-50',   label: 'Shipped'    },
  cancelled:  { icon: AlertCircle,  color: 'text-red-500',   bg: 'bg-red-50',    label: 'Cancelled'  },
};

function OrdersModal({ onClose }) {
  const [orders,   setOrders]   = useState([]);
  const [fetching, setFetching] = useState(true);
  const [error,    setError]    = useState('');

  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Not authenticated');
        const res  = await fetch(`${API}/api/orders/my-orders`, { headers: { Authorization: `Bearer ${token}` } });
        const data = await res.json();
        setOrders(data.orders || []);
      } catch { setError('Could not load orders.'); }
      finally  { setFetching(false); }
    })();
  }, []);

  return (
    <Modal title="My Orders" onClose={onClose}>
      {fetching ? (
        <div className="p-4 space-y-3">
          {[1, 2, 3].map(i => <div key={i} className="h-16 bg-gray-50 rounded-xl animate-pulse" />)}
        </div>
      ) : error ? (
        <div className="py-14 text-center px-6">
          <AlertCircle size={36} className="mx-auto text-gray-200 mb-3" />
          <p className="text-sm font-semibold text-gray-400">{error}</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="py-14 text-center px-6">
          <Package size={36} className="mx-auto text-gray-200 mb-3" />
          <p className="text-sm font-bold text-gray-400">No orders yet</p>
          <p className="text-xs text-gray-300 mt-1">Your orders will appear here</p>
        </div>
      ) : (
        <div className="divide-y divide-gray-50 px-4 py-2">
          {orders.map(order => {
            const cfg  = STATUS_CFG[order.payment_status] ?? { icon: Clock, color: 'text-gray-400', bg: 'bg-gray-50', label: order.payment_status };
            const Icon = cfg.icon;
            return (
              <div key={order.id} className="flex items-center gap-3 py-3.5">
                <div className={`w-10 h-10 rounded-xl ${cfg.bg} flex items-center justify-center shrink-0`}>
                  <Icon size={17} className={cfg.color} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-bold text-gray-900">Order #{order.id}</p>
                    <span className={`text-[10px] font-bold uppercase tracking-wider ${cfg.color}`}>{cfg.label}</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                  <p className="text-sm font-bold text-[#c23d6a] mt-0.5">₹{order.total_amount}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Modal>
  );
}

// ─── Logout Confirm Modal ─────────────────────────────────────────────────────
function LogoutModal({ onConfirm, onClose, loggingOut }) {
  return (
    <div className="fixed inset-0 z-[99999] flex items-end md:items-center justify-center px-4 pb-6 md:pb-0">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div
        className="relative w-full max-w-sm bg-white rounded-xl shadow-2xl p-6 space-y-5"
        style={{ animation: 'slideUpModal 0.25s ease forwards' }}
      >
        <div className="flex justify-center">
          <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center">
            <LogOut size={22} className="text-red-500" />
          </div>
        </div>
        <div className="text-center">
          <h3 className="text-base font-bold text-gray-900">Log out?</h3>
          <p className="text-sm text-gray-500 mt-1">You'll need to sign in again to access your account.</p>
        </div>
        <div className="flex flex-col gap-2.5">
          <button
            onClick={onConfirm} disabled={loggingOut}
            className="w-full py-3 bg-red-500 text-white text-sm font-bold rounded-full hover:bg-red-600 active:scale-[0.98] transition-all disabled:opacity-60"
          >
            {loggingOut ? 'Signing out...' : 'Yes, Log Out'}
          </button>
          <button
            onClick={onClose}
            className="w-full py-3 bg-gray-50 text-gray-700 text-sm font-bold rounded-full border border-gray-200 hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Profile Page ────────────────────────────────────────────────────────
export default function ProfilePage() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();

  const [profile,    setProfile]    = useState(null);
  const [fetching,   setFetching]   = useState(true);
  const [modal,      setModal]      = useState(null); // 'orders' | 'password' | 'logout'
  const [loggingOut, setLoggingOut] = useState(false);
  const [mounted,    setMounted]    = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [loading, user, router]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      setFetching(true);
      try {
        const token = localStorage.getItem('token');
        const res   = await fetch(`${API}/api/auth/me`, { headers: { Authorization: `Bearer ${token}` } });
        if (res.ok) {
          const data = await res.json();
          setProfile(data.user);
        }
      } catch (err) { console.error(err); }
      finally { setFetching(false); }
    })();
  }, [user]);

  const handleLogout = async () => {
    setLoggingOut(true);
    await new Promise(r => setTimeout(r, 500));
    logout();
    router.push('/');
  };

  if (loading || !mounted || fetching) return <ProfileSkeleton />;
  if (!user) return null;

  const firstName = profile?.firstName ?? user.firstName ?? '';
  const lastName  = profile?.lastName  ?? user.lastName  ?? '';
  const fullName  = [firstName, lastName].filter(Boolean).join(' ') || user.name || 'My Account';
  const email     = profile?.email ?? user.email ?? '';
  const phone     = profile?.phone ?? user.phone ?? '';
  const initial   = (firstName || user.name || email || 'U')[0].toUpperCase();

  return (
    <>
      <style>{`
        @keyframes slideUpModal {
          from { opacity:0; transform:translateY(20px); }
          to   { opacity:1; transform:translateY(0);    }
        }
      `}</style>

      <div className="min-h-screen bg-gray-50 pb-28">

        {/* ── Hero Banner ── */}
        <div
          className="relative overflow-hidden pt-10 pb-20"
          style={{ background: 'linear-gradient(135deg,#c23d6a 0%,#8b1a42 60%,#072654 100%)' }}
        >
          {/* decorative circles */}
          <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/5 pointer-events-none" />
          <div className="absolute -bottom-16 -left-6  w-56 h-56 rounded-full bg-white/[0.03] pointer-events-none" />

          <div className="max-w-[480px] mx-auto px-5 relative">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-all px-3 py-1.5 rounded-full text-xs font-semibold mb-6"
            >
              <ArrowLeft size={14} /> Back
            </button>

            <div className="flex items-center gap-4">
              <div className="w-[68px] h-[68px] rounded-[18px] bg-white/15 border-2 border-white/25 flex items-center justify-center text-2xl font-bold text-white shrink-0 shadow-lg">
                {initial}
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-xl font-bold text-white truncate">{fullName}</h1>
                <p className="text-white/55 text-[11px] font-semibold tracking-widest mt-0.5 truncate">{email}</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Cards ── */}
        <div className="max-w-[480px] mx-auto px-5 -mt-10 space-y-3">

          {/* Account details */}
          <Card label="Account Details">
            <div className="px-3 pb-1">
              <InfoRow icon={User}  label="Full Name" value={fullName} />
              <InfoRow icon={Mail}  label="Email"     value={email}    />
              <InfoRow icon={Phone} label="Mobile"    value={phone ? `+91 ${phone}` : ''} />
            </div>
          </Card>

          {/* Management */}
          <Card label="Management">
            <ActionRow
              icon={Package} label="My Orders" sublabel="View your order history"
              onClick={() => setModal('orders')}
              iconBg="bg-[#fff0f5]" iconColor="text-[#c23d6a]"
            />
            <ActionRow
              icon={Lock} label="Change Password" sublabel="Keep your account secure"
              onClick={() => setModal('password')}
              iconBg="bg-amber-50" iconColor="text-amber-600"
            />
          </Card>

          {/* Log out */}
          <Card danger>
            <ActionRow
              icon={LogOut} label="Log Out" sublabel="Sign out safely"
              onClick={() => setModal('logout')}
              iconBg="bg-red-50" iconColor="text-red-500"
              danger
            />
          </Card>

        </div>
      </div>

      {/* ── Modals ── */}
      {modal === 'orders' && (
        <OrdersModal onClose={() => setModal(null)} />
      )}

      {modal === 'password' && (
        <Modal title="Change Password" onClose={() => setModal(null)}>
          <ChangePasswordModal onClose={() => setModal(null)} />
        </Modal>
      )}

      {modal === 'logout' && (
        <LogoutModal
          loggingOut={loggingOut}
          onConfirm={handleLogout}
          onClose={() => setModal(null)}
        />
      )}
    </>
  );
}