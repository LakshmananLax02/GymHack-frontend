'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  ChevronDown, MapPin, Phone, User, CreditCard, Truck,
  ShieldCheck, Lock, CheckCircle2, ArrowLeft, Package,
  Wallet, Banknote, AlertCircle, RefreshCw, Smartphone,
  ChevronRight, Star, Tag,
} from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
// ██  CONFIG  — replace before going live
// ─────────────────────────────────────────────────────────────────────────────
const RAZORPAY_KEY_ID    = 'rzp_test_Soo247cVBCqXX3'; // your key
const TELEGRAM_BOT_TOKEN = 'YOUR_BOT_TOKEN';
const TELEGRAM_CHAT_ID   = 'YOUR_CHAT_ID';
// NOTE: In production the Razorpay order must be created server-side via
// POST /v1/orders using your key_secret. The client only receives order_id.
// ─────────────────────────────────────────────────────────────────────────────

// ─── Telegram ────────────────────────────────────────────────────────────────
async function sendTelegram(text) {
  try {
    await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text, parse_mode: 'HTML' }),
    });
  } catch (e) { console.error('Telegram:', e); }
}

function tgMessage({ form, items, total, method, status, paymentId, orderId }) {
  const lines = items.map(i => `  • ${i.name} ×${i.qty}  ₹${i.price * i.qty}`).join('\n');
  const em = status === 'PAID' ? '✅' : status.startsWith('FAIL') ? '❌' : status === 'INITIATED' ? '🚀' : '🟡';
  return `${em} <b>GYM HACK — New Order</b>

💳 <b>Method:</b> ${method === 'cod' ? 'Cash on Delivery' : 'Razorpay Online'}
📊 <b>Status:</b> ${status}${paymentId ? `\n🔑 <b>Payment ID:</b> <code>${paymentId}</code>` : ''}${orderId ? `\n📋 <b>Order ID:</b> <code>${orderId}</code>` : ''}

👤 <b>${form.firstName} ${form.lastName}</b>
📞 +91 ${form.phone}${form.email ? `\n📧 ${form.email}` : ''}

📦 ${form.address}${form.apartment ? ', ' + form.apartment : ''}
   ${form.city}, ${form.state} – ${form.pincode}

🛒 Items:
${lines}

💰 <b>Total: ₹${total}  |  Shipping: FREE</b>`;
}

// ─── Constants ────────────────────────────────────────────────────────────────
const STATES = [
  'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa',
  'Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala',
  'Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland',
  'Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura',
  'Uttar Pradesh','Uttarakhand','West Bengal',
  'Delhi','Chandigarh','Puducherry','Jammu & Kashmir','Ladakh',
];

// Replace with useCartStore(s => s.cart) in production
const CART = [
  { id: 1, name: 'Premium Rolled Oats',    qty: 2, price: 180, image: '/images/oatsimg.jpg' },
  { id: 3, name: 'Dark Chocolate Muesli',  qty: 1, price: 290, image: '/images/meusliimg.png' },
];

// ─── UI primitives ────────────────────────────────────────────────────────────
function Field({ label, error, optional, children }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-[11px] font-bold uppercase tracking-widest text-gray-400">
        {label}{optional && <span className="text-gray-300 font-normal"> (optional)</span>}
      </label>
      {children}
      {error && (
        <span className="flex items-center gap-1 text-[11px] text-red-500 font-semibold">
          <AlertCircle size={11} /> {error}
        </span>
      )}
    </div>
  );
}

function Input({ error, icon: Icon, className = '', ...props }) {
  return (
    <div className="relative">
      {Icon && <Icon size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none" />}
      <input
        {...props}
        className={`w-full py-3 rounded-xl border text-sm font-medium text-gray-900 bg-white outline-none transition-all
          focus:ring-2 focus:ring-[#c23d6a]/10 focus:border-[#c23d6a]
          ${Icon ? 'pl-9 pr-4' : 'px-4'}
          ${error ? 'border-red-400 bg-red-50' : 'border-gray-200'}
          ${className}`}
      />
    </div>
  );
}

function Select({ error, ...props }) {
  return (
    <div className="relative">
      <select
        {...props}
        className={`w-full px-4 py-3 pr-8 rounded-xl border text-sm font-medium bg-white outline-none appearance-none cursor-pointer transition-all
          focus:ring-2 focus:ring-[#c23d6a]/10 focus:border-[#c23d6a]
          ${error ? 'border-red-400 bg-red-50 text-red-900' : 'border-gray-200'}
          ${props.value ? 'text-gray-900' : 'text-gray-400'}`}
      />
      <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
    </div>
  );
}

function Btn({ children, variant = 'primary', loading, disabled, onClick, className = '' }) {
  const base = 'w-full font-black py-4 rounded-2xl flex items-center justify-center gap-2 text-[15px] tracking-wide transition-all active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100';
  const variants = {
    primary: 'bg-[#c23d6a] hover:bg-[#a8305a] text-white shadow-[0_4px_20px_rgba(194,61,106,0.3)]',
    blue:    'bg-gradient-to-r from-[#072654] to-[#3395FF] text-white shadow-[0_4px_20px_rgba(51,149,255,0.35)] hover:opacity-90',
    ghost:   'bg-transparent text-gray-400 hover:text-gray-600 shadow-none py-2',
  };
  return (
    <button onClick={onClick} disabled={disabled || loading} className={`${base} ${variants[variant]} ${className}`}>
      {loading
        ? <><span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" /> Processing...</>
        : children}
    </button>
  );
}

// ─── Order Summary ────────────────────────────────────────────────────────────
function OrderSummary({ items, collapsed = false }) {
  const [open, setOpen] = useState(!collapsed);
  const sub  = items.reduce((a, i) => a + i.price * i.qty, 0);
  const ship = sub >= 500 ? 0 : 60;
  const total = sub + ship;

  return (
    <div className="bg-[#fafafa] border border-[#f0e8ee] rounded-2xl overflow-hidden">
      <button onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between px-4 py-3.5 cursor-pointer">
        <div className="flex items-center gap-2">
          <Package size={16} className="text-[#c23d6a]" />
          <span className="font-bold text-[13px] text-gray-900">Order Summary</span>
          <span className="bg-[#c23d6a] text-white text-[10px] font-black rounded-full px-2 py-0.5">
            {items.reduce((a, i) => a + i.qty, 0)}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-black text-[#c23d6a]">₹{total}</span>
          <ChevronDown size={14} className={`text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} />
        </div>
      </button>
      {open && (
        <div className="border-t border-[#f0e8ee] px-4 py-3 space-y-0">
          {items.map((item, i) => (
            <div key={i} className={`flex justify-between items-center py-2 ${i < items.length - 1 ? 'border-b border-dashed border-[#f0e8ee]' : ''}`}>
              <div>
                <p className="text-[13px] font-semibold text-gray-800">{item.name}</p>
                <p className="text-[11px] text-gray-400">Qty: {item.qty}</p>
              </div>
              <span className="font-bold text-[13px] text-gray-600">₹{item.price * item.qty}</span>
            </div>
          ))}
          <div className="pt-2.5 mt-1 border-t border-[#f0e8ee] space-y-1.5">
            <div className="flex justify-between text-xs text-gray-400">
              <span>Subtotal</span><span className="font-semibold text-gray-700">₹{sub}</span>
            </div>
            <div className="flex justify-between text-xs text-gray-400">
              <span>Shipping</span>
              <span className={`font-semibold ${ship === 0 ? 'text-green-500' : 'text-gray-700'}`}>
                {ship === 0 ? 'FREE' : `₹${ship}`}
              </span>
            </div>
            {ship > 0 && <p className="text-[10px] text-gray-300">Add ₹{500 - sub} more for free shipping</p>}
            <div className="flex justify-between pt-1 border-t border-gray-100">
              <span className="text-sm font-black text-gray-900">Total</span>
              <span className="font-black text-[#c23d6a]">₹{total}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Step Bar ─────────────────────────────────────────────────────────────────
function StepBar({ step }) {
  const steps = [
    { label: 'Details', icon: User },
    { label: 'Verify', icon: Smartphone },
    { label: 'Payment', icon: CreditCard },
    { label: 'Done', icon: CheckCircle2 },
  ];
  return (
    <div className="flex items-center justify-center mb-7">
      {steps.map((s, i) => (
        <React.Fragment key={s.label}>
          <div className="flex flex-col items-center gap-1">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-[2.5px] transition-all text-[12px] font-black
              ${i < step  ? 'bg-[#c23d6a] border-[#c23d6a] text-white' :
                i === step ? 'bg-white border-[#c23d6a] text-[#c23d6a] ring-4 ring-pink-100' :
                             'bg-white border-gray-200 text-gray-300'}`}>
              {i < step ? <CheckCircle2 size={14} /> : <s.icon size={14} />}
            </div>
            <span className={`text-[9px] font-bold uppercase tracking-wider ${i <= step ? 'text-[#c23d6a]' : 'text-gray-300'}`}>
              {s.label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div className={`w-10 h-0.5 mb-4 mx-0.5 transition-all ${i < step ? 'bg-[#c23d6a]' : 'bg-gray-200'}`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

// ─── SCREEN 1 — Delivery Details ──────────────────────────────────────────────
function DeliveryScreen({ onNext, loading }) {
  const [f, setF] = useState({
    firstName: '', lastName: '', phone: '', email: '',
    address: '', apartment: '', city: '', state: '', pincode: '',
    paymentMethod: 'razorpay',
  });
  const [errs, setErrs] = useState({});
  const [touched, setTouched] = useState(false);

  const s = k => e => setF(p => ({ ...p, [k]: e.target.value }));
  const sub = CART.reduce((a, i) => a + i.price * i.qty, 0);
  const total = sub >= 500 ? sub : sub + 60;

  const validate = () => {
    const e = {};
    if (!f.firstName.trim()) e.firstName = 'Required';
    if (!f.lastName.trim()) e.lastName = 'Required';
    if (!/^[6-9]\d{9}$/.test(f.phone)) e.phone = 'Valid 10-digit Indian number';
    if (f.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) e.email = 'Invalid email';
    if (!f.address.trim()) e.address = 'Required';
    if (!f.city.trim()) e.city = 'Required';
    if (!f.state) e.state = 'Select state';
    if (!/^\d{6}$/.test(f.pincode)) e.pincode = 'Valid 6-digit pincode';
    return e;
  };

  const submit = () => {
    setTouched(true);
    const e = validate();
    setErrs(e);
    if (Object.keys(e).length === 0) onNext(f, total);
  };

  const E = k => touched && errs[k];

  return (
    <div className="flex flex-col gap-4">
      <OrderSummary items={CART} collapsed />

      {/* Contact */}
      <div className="bg-white border border-[#f0e8ee] rounded-2xl p-4 space-y-3.5">
        <div className="flex items-center gap-2">
          <User size={16} className="text-[#c23d6a]" />
          <span className="font-black text-sm text-gray-900">Contact Information</span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="First Name" error={E('firstName')}>
            <Input value={f.firstName} onChange={s('firstName')} error={E('firstName')} placeholder="First name" />
          </Field>
          <Field label="Last Name" error={E('lastName')}>
            <Input value={f.lastName} onChange={s('lastName')} error={E('lastName')} placeholder="Last name" />
          </Field>
        </div>
        <Field label="Mobile Number" error={E('phone')}>
          <div className="flex gap-2">
            <div className="flex items-center px-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold text-gray-500 shrink-0">
              🇮🇳 +91
            </div>
            <Input value={f.phone} onChange={s('phone')} error={E('phone')} placeholder="10-digit number" type="tel" maxLength={10} className="flex-1" />
          </div>
        </Field>
        <Field label="Email" error={E('email')} optional>
          <Input value={f.email} onChange={s('email')} error={E('email')} placeholder="you@example.com" type="email" />
        </Field>
      </div>

      {/* Address */}
      <div className="bg-white border border-[#f0e8ee] rounded-2xl p-4 space-y-3.5">
        <div className="flex items-center gap-2">
          <MapPin size={16} className="text-[#c23d6a]" />
          <span className="font-black text-sm text-gray-900">Delivery Address</span>
        </div>
        <Field label="Street Address" error={E('address')}>
          <Input value={f.address} onChange={s('address')} error={E('address')} icon={MapPin} placeholder="House no., Street, Area" />
        </Field>
        <Field label="Apartment / Landmark" optional>
          <Input value={f.apartment} onChange={s('apartment')} placeholder="Floor, Building, Landmark" />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="City" error={E('city')}>
            <Input value={f.city} onChange={s('city')} error={E('city')} placeholder="City" />
          </Field>
          <Field label="State" error={E('state')}>
            <div className="relative">
              <select
                value={f.state} onChange={s('state')}
                className={`w-full px-4 py-3 pr-8 rounded-xl border text-sm font-medium bg-white outline-none appearance-none cursor-pointer transition-all focus:ring-2 focus:ring-[#c23d6a]/10 focus:border-[#c23d6a] ${E('state') ? 'border-red-400 bg-red-50' : 'border-gray-200'} ${f.state ? 'text-gray-900' : 'text-gray-400'}`}
              >
                <option value="" disabled>State</option>
                {STATES.map(st => <option key={st} value={st}>{st}</option>)}
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </Field>
        </div>
        <Field label="Pincode" error={E('pincode')}>
          <Input value={f.pincode} onChange={s('pincode')} error={E('pincode')} placeholder="6-digit pincode" maxLength={6} />
        </Field>
      </div>

      {/* Payment selection */}
      <div className="bg-white border border-[#f0e8ee] rounded-2xl p-4 space-y-3">
        <div className="flex items-center gap-2">
          <Wallet size={16} className="text-[#c23d6a]" />
          <span className="font-black text-sm text-gray-900">Payment Method</span>
        </div>
        {[
          { v: 'razorpay', label: 'Pay Online', sub: 'UPI · Cards · Net Banking · Wallets', icon: CreditCard, badge: 'Recommended' },
          { v: 'cod',      label: 'Cash on Delivery', sub: 'Pay when order arrives', icon: Banknote, badge: null },
        ].map(opt => (
          <label key={opt.v}
            className={`flex items-center gap-3 px-3.5 py-3 rounded-xl border-2 cursor-pointer transition-all
              ${f.paymentMethod === opt.v ? 'border-[#c23d6a] bg-[#fff0f5]' : 'border-gray-200 hover:border-gray-300'}`}>
            <input type="radio" name="pm" value={opt.v} checked={f.paymentMethod === opt.v}
              onChange={s('paymentMethod')} className="accent-[#c23d6a] w-4 h-4" />
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-all
              ${f.paymentMethod === opt.v ? 'bg-[#c23d6a]' : 'bg-gray-100'}`}>
              <opt.icon size={18} className={f.paymentMethod === opt.v ? 'text-white' : 'text-gray-400'} />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="font-bold text-sm text-gray-900">{opt.label}</p>
                {opt.badge && (
                  <span className="text-[9px] font-black bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                    {opt.badge}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-gray-400">{opt.sub}</p>
            </div>
            {f.paymentMethod === opt.v && <CheckCircle2 size={18} className="text-[#c23d6a] shrink-0" />}
          </label>
        ))}
        {f.paymentMethod === 'cod' && (
          <div className="flex gap-2 bg-amber-50 border border-amber-200 rounded-xl px-3.5 py-2.5">
            <Truck size={14} className="text-amber-600 mt-0.5 shrink-0" />
            <p className="text-[11px] text-amber-800 font-semibold">₹{total} payable on delivery. Keep exact change.</p>
          </div>
        )}
      </div>

      <Btn onClick={submit} loading={loading}>
        {f.paymentMethod === 'cod'
          ? <><CheckCircle2 size={18} /> Place Order (COD)</>
          : <><Smartphone size={18} /> Verify OTP & Continue</>}
      </Btn>
      <div className="flex justify-center gap-1.5 items-center">
        <ShieldCheck size={12} className="text-gray-300" />
        <span className="text-[11px] text-gray-400 font-semibold">Secure & encrypted checkout</span>
      </div>
    </div>
  );
}

// ─── SCREEN 2 — OTP Verification ─────────────────────────────────────────────
function OTPScreen({ phone, onVerified, onBack }) {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [sent, setSent] = useState(true);  // auto-sent on mount
  const [timer, setTimer] = useState(30);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState('');
  const [resending, setResending] = useState(false);
  const refs = useRef([]);

  // Countdown timer
  useEffect(() => {
    if (timer <= 0) return;
    const t = setInterval(() => setTimer(v => v - 1), 1000);
    return () => clearInterval(t);
  }, [timer]);

  const handleOtp = (val, idx) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp];
    next[idx] = val;
    setOtp(next);
    setError('');
    if (val && idx < 5) refs.current[idx + 1]?.focus();
  };

  const handleKey = (e, idx) => {
    if (e.key === 'Backspace' && !otp[idx] && idx > 0) refs.current[idx - 1]?.focus();
  };

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (paste.length === 6) {
      setOtp(paste.split(''));
      refs.current[5]?.focus();
    }
  };

  const resend = async () => {
    setResending(true);
    setOtp(['', '', '', '', '', '']);
    setError('');
    // In production: call your OTP sending API here
    await new Promise(r => setTimeout(r, 1000));
    setTimer(30);
    setResending(false);
    refs.current[0]?.focus();
  };

  const verify = async () => {
    const code = otp.join('');
    if (code.length < 6) { setError('Enter the 6-digit OTP'); return; }
    setVerifying(true);
    setError('');
    // ── In production: verify OTP via your backend ──
    // const res = await fetch('/api/verify-otp', { method:'POST', body: JSON.stringify({ phone, otp: code }) });
    // if (!res.ok) { setError('Wrong OTP. Try again.'); setVerifying(false); return; }
    // For demo, any 6-digit OTP passes:
    await new Promise(r => setTimeout(r, 1200));
    setVerifying(false);
    onVerified();
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Icon */}
      <div className="flex flex-col items-center gap-3 py-4">
        <div className="w-16 h-16 rounded-2xl bg-[#fff0f5] flex items-center justify-center">
          <Smartphone size={32} className="text-[#c23d6a]" />
        </div>
        <div className="text-center">
          <h2 className="font-black text-lg text-gray-900">Verify Your Number</h2>
          <p className="text-sm text-gray-500 mt-1">OTP sent to <span className="font-black text-gray-800">+91 {phone}</span></p>
        </div>
      </div>

      {/* OTP inputs */}
      <div className="flex gap-2.5 justify-center" onPaste={handlePaste}>
        {otp.map((d, i) => (
          <input
            key={i}
            ref={el => refs.current[i] = el}
            type="tel"
            inputMode="numeric"
            maxLength={1}
            value={d}
            onChange={e => handleOtp(e.target.value, i)}
            onKeyDown={e => handleKey(e, i)}
            className={`w-12 h-14 text-center text-xl font-black rounded-xl border-2 outline-none transition-all
              ${d ? 'border-[#c23d6a] bg-[#fff0f5] text-[#c23d6a]' : 'border-gray-200 bg-white text-gray-900'}
              focus:border-[#c23d6a] focus:ring-4 focus:ring-pink-100
              ${error ? 'border-red-400 bg-red-50' : ''}`}
          />
        ))}
      </div>

      {error && (
        <div className="flex items-center justify-center gap-1.5">
          <AlertCircle size={13} className="text-red-500" />
          <p className="text-sm text-red-500 font-semibold">{error}</p>
        </div>
      )}

      {/* Resend */}
      <div className="flex justify-center">
        {timer > 0 ? (
          <p className="text-sm text-gray-400 font-medium">
            Resend OTP in <span className="font-black text-[#c23d6a]">{timer}s</span>
          </p>
        ) : (
          <button onClick={resend} disabled={resending}
            className="flex items-center gap-1.5 text-sm font-bold text-[#c23d6a] hover:underline disabled:opacity-50">
            <RefreshCw size={14} className={resending ? 'animate-spin' : ''} />
            {resending ? 'Sending...' : 'Resend OTP'}
          </button>
        )}
      </div>

      <Btn onClick={verify} loading={verifying}>
        <CheckCircle2 size={18} /> Verify & Proceed
      </Btn>

      <Btn variant="ghost" onClick={onBack}>
        <ArrowLeft size={15} /> Change Number
      </Btn>
    </div>
  );
}

// ─── SCREEN 3 — Razorpay Payment ─────────────────────────────────────────────
function PaymentScreen({ deliveryData, total, onSuccess, onFail, onBack }) {
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState('');
  const [selectedMethod, setSelectedMethod] = useState('upi');

  const launch = () => {
    setPaying(true);
    setError('');

    const options = {
      key: RAZORPAY_KEY_ID,
      amount: total * 100,         // paise
      currency: 'INR',
      name: 'GYM HACK',
      description: `Order for ${deliveryData.firstName} ${deliveryData.lastName}`,
      image: '/images/logoimg.png',
      // order_id: 'order_xxx',    // ← uncomment when created server-side
      prefill: {
        name:    `${deliveryData.firstName} ${deliveryData.lastName}`,
        contact: `+91${deliveryData.phone}`,
        email:   deliveryData.email || 'customer@gymhack.in',
      },
      notes: {
        address: `${deliveryData.address}${deliveryData.apartment ? ', ' + deliveryData.apartment : ''}, ${deliveryData.city}, ${deliveryData.state} – ${deliveryData.pincode}`,
      },
      theme:  { color: '#c23d6a', hide_topbar: false },
      config: {
        display: {
          blocks: {
            utib: { name: 'Pay via UPI',    instruments: [{ method: 'upi' }] },
            other: { name: 'Other Methods', instruments: [{ method: 'card' }, { method: 'netbanking' }, { method: 'wallet' }] },
          },
          sequence: ['block.utib', 'block.other'],
          preferences: { show_default_blocks: true },
        },
      },
      handler: resp => {
        setPaying(false);
        onSuccess({
          paymentId: resp.razorpay_payment_id,
          orderId:   resp.razorpay_order_id,
          signature: resp.razorpay_signature,
        });
      },
      modal: {
        confirm_close: true,
        ondismiss: () => {
          setPaying(false);
          setError('Payment window was closed. Please try again.');
          onFail('DISMISSED');
        },
      },
    };

    const open = () => {
      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', resp => {
        setPaying(false);
        setError(`Payment failed: ${resp.error.description}`);
        onFail(resp.error.description);
      });
      rzp.open();
    };

    if (window.Razorpay) {
      open();
    } else {
      const s = document.createElement('script');
      s.src = 'https://checkout.razorpay.com/v1/checkout.js';
      s.onload  = open;
      s.onerror = () => { setPaying(false); setError('Could not load payment gateway. Check internet connection.'); };
      document.body.appendChild(s);
    }
  };

  const methods = [
    { id: 'upi',    label: 'UPI',          icon: '⚡', sub: 'GPay · PhonePe · Paytm · BHIM' },
    { id: 'card',   label: 'Debit / Credit Card', icon: '💳', sub: 'Visa · Mastercard · Amex · RuPay' },
    { id: 'nb',     label: 'Net Banking',  icon: '🏦', sub: 'SBI · HDFC · ICICI · Axis & more' },
    { id: 'wallet', label: 'Wallets',      icon: '👜', sub: 'Paytm · Amazon Pay · Mobikwik' },
    { id: 'emi',    label: 'EMI',          icon: '📅', sub: 'No-cost EMI on select cards' },
  ];

  return (
    <div className="flex flex-col gap-4">
      <OrderSummary items={CART} collapsed />

      {/* Delivery address chip */}
      <div className="bg-white border border-[#f0e8ee] rounded-2xl p-3.5 flex gap-3 items-start">
        <div className="w-8 h-8 rounded-xl bg-[#fff0f5] flex items-center justify-center shrink-0">
          <MapPin size={15} className="text-[#c23d6a]" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-[12px] text-gray-900">{deliveryData.firstName} {deliveryData.lastName} · +91 {deliveryData.phone}</p>
          <p className="text-[11px] text-gray-400 mt-0.5 leading-relaxed">
            {deliveryData.address}{deliveryData.apartment ? `, ${deliveryData.apartment}` : ''}, {deliveryData.city}, {deliveryData.state} – {deliveryData.pincode}
          </p>
        </div>
        <button onClick={onBack} className="text-[11px] font-bold text-[#c23d6a] hover:underline shrink-0">Edit</button>
      </div>

      {/* Razorpay card */}
      <div className="bg-white border border-[#f0e8ee] rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-br from-[#072654] via-[#1a4a9e] to-[#3395FF] px-5 py-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-white/60 text-[9px] font-bold uppercase tracking-widest">Powered by</p>
              <p className="text-white text-[22px] font-black tracking-tighter leading-none">razorpay</p>
            </div>
            <div className="flex flex-col items-end gap-1">
              <div className="flex items-center gap-1">
                <Lock size={12} className="text-white/70" />
                <span className="text-white/70 text-[10px] font-semibold">256-bit SSL</span>
              </div>
              <div className="flex gap-1">
                {['PCI', 'RBI'].map(b => (
                  <span key={b} className="text-[9px] font-black bg-white/20 text-white px-1.5 py-0.5 rounded">{b}</span>
                ))}
              </div>
            </div>
          </div>
          <div className="bg-white/10 rounded-xl px-4 py-2.5 flex items-center justify-between">
            <span className="text-white/70 text-[11px] font-semibold">Amount to Pay</span>
            <span className="text-white text-2xl font-black">₹{total}</span>
          </div>
        </div>

        {/* Methods */}
        <div className="p-4 space-y-2">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">Select Payment Method</p>
          {methods.map(m => (
            <button
              key={m.id}
              onClick={() => setSelectedMethod(m.id)}
              className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl border-2 transition-all text-left
                ${selectedMethod === m.id ? 'border-[#c23d6a] bg-[#fff0f5]' : 'border-gray-100 bg-gray-50 hover:border-gray-200'}`}
            >
              <span className="text-xl leading-none">{m.icon}</span>
              <div className="flex-1">
                <p className="text-[13px] font-bold text-gray-900">{m.label}</p>
                <p className="text-[10px] text-gray-400 font-medium">{m.sub}</p>
              </div>
              {selectedMethod === m.id
                ? <CheckCircle2 size={16} className="text-[#c23d6a] shrink-0" />
                : <ChevronRight size={14} className="text-gray-300 shrink-0" />}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="flex gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
          <AlertCircle size={15} className="text-red-500 mt-0.5 shrink-0" />
          <p className="text-[12px] text-red-700 font-semibold">{error}</p>
        </div>
      )}

      {/* Trust row */}
      <div className="flex items-center justify-center gap-4 flex-wrap">
        {[
          { icon: Lock, text: '100% Secure' },
          { icon: ShieldCheck, text: 'Bank-grade Encryption' },
          { icon: Star, text: '4.9★ Trusted' },
        ].map(({ icon: I, text }) => (
          <div key={text} className="flex items-center gap-1.5">
            <I size={12} className="text-green-500" />
            <span className="text-[11px] text-gray-400 font-semibold">{text}</span>
          </div>
        ))}
      </div>

      <Btn variant="blue" onClick={launch} loading={paying}>
        <Lock size={16} /> Pay ₹{total} Securely via Razorpay
      </Btn>

      <Btn variant="ghost" onClick={onBack}>
        <ArrowLeft size={14} /> Back
      </Btn>
    </div>
  );
}

// ─── SCREEN 4 — Success ───────────────────────────────────────────────────────
function SuccessScreen({ paymentInfo, form, isCOD }) {
  const total = CART.reduce((a, i) => a + i.price * i.qty, 0) + (CART.reduce((a, i) => a + i.price * i.qty, 0) >= 500 ? 0 : 60);
  const orderId = 'GH' + Date.now().toString().slice(-6);

  return (
    <div className="flex flex-col items-center gap-5 py-6 text-center">
      <div className="relative">
        <div className="w-24 h-24 rounded-full bg-green-50 border-4 border-green-400 flex items-center justify-center">
          <CheckCircle2 size={48} className="text-green-500" />
        </div>
        <div className="absolute -top-1 -right-1 w-8 h-8 rounded-full bg-[#c23d6a] flex items-center justify-center">
          <Tag size={14} className="text-white" />
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-black text-gray-900">
          {isCOD ? 'Order Placed! 🎉' : 'Payment Successful! 🎉'}
        </h2>
        <p className="text-gray-500 text-sm mt-1.5 font-medium">
          {isCOD
            ? 'Your order is confirmed. Pay on delivery.'
            : 'Your payment was received & order is confirmed.'}
        </p>
      </div>

      {/* Order card */}
      <div className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 text-left space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-[11px] font-bold uppercase tracking-widest text-gray-400">Order ID</span>
          <span className="font-black text-sm text-gray-900">#{orderId}</span>
        </div>
        {paymentInfo?.paymentId && (
          <div className="flex justify-between items-center">
            <span className="text-[11px] font-bold uppercase tracking-widest text-gray-400">Payment ID</span>
            <span className="font-mono text-[11px] text-gray-600">{paymentInfo.paymentId}</span>
          </div>
        )}
        <div className="border-t border-gray-200 pt-3 space-y-1">
          <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400">Delivering to</p>
          <p className="text-sm font-bold text-gray-900">{form.firstName} {form.lastName}</p>
          <p className="text-xs text-gray-500">{form.address}{form.apartment ? `, ${form.apartment}` : ''}</p>
          <p className="text-xs text-gray-500">{form.city}, {form.state} – {form.pincode}</p>
          <p className="text-xs text-gray-500">+91 {form.phone}</p>
        </div>
        <div className="border-t border-gray-200 pt-3">
          <div className="flex justify-between">
            <span className="font-black text-sm text-gray-900">Total {isCOD ? '(COD)' : 'Paid'}</span>
            <span className="font-black text-[#c23d6a]">₹{total}</span>
          </div>
        </div>
      </div>

      <div className="w-full bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 text-left">
        <p className="text-[11px] font-bold text-blue-800">📦 Estimated Delivery: 3–5 Business Days</p>
        <p className="text-[10px] text-blue-600 mt-0.5">
          {form.email ? `Order confirmation sent to ${form.email}` : `SMS confirmation sent to +91 ${form.phone}`}
        </p>
      </div>

      <a href="/"
        className="w-full bg-[#c23d6a] text-white font-bold py-4 rounded-2xl text-center hover:bg-[#a8305a] transition-colors block text-[15px]">
        Continue Shopping
      </a>
    </div>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────
export default function CheckoutFlow() {
  // steps: 0=details  1=otp  2=payment  3=success
  const [step, setStep]         = useState(0);
  const [form, setForm]         = useState(null);
  const [total, setTotal]       = useState(0);
  const [isCOD, setIsCOD]       = useState(false);
  const [payInfo, setPayInfo]   = useState(null);
  const [loading, setLoading]   = useState(false);

  const items = CART;

  // Step 0 → next (OTP for Razorpay, COD skips to success)
  const onDetailsNext = async (f, t) => {
    setForm(f);
    setTotal(t);
    setLoading(true);
    if (f.paymentMethod === 'cod') {
      setIsCOD(true);
      await sendTelegram(tgMessage({ form: f, items, total: t, method: 'cod', status: 'PENDING (COD)' }));
      setLoading(false);
      setStep(3);
    } else {
      setIsCOD(false);
      // In production: trigger OTP send to f.phone via your backend
      setLoading(false);
      setStep(1);
    }
  };

  // Step 1 → OTP verified
  const onOTPVerified = () => setStep(2);

  // Step 2 → Razorpay success
  const onPaySuccess = async (info) => {
    setPayInfo(info);
    await sendTelegram(tgMessage({ form, items, total, method: 'razorpay', status: 'PAID', paymentId: info.paymentId, orderId: info.orderId }));
    setStep(3);
  };

  // Step 2 → Razorpay fail
  const onPayFail = async (reason) => {
    await sendTelegram(tgMessage({ form, items, total, method: 'razorpay', status: `FAILED — ${reason}` }));
  };

  return (
    <div className="min-h-screen bg-[#fdf8f9] px-4 py-6 pb-16">
      <div className="max-w-[480px] mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-7">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-full bg-[#c23d6a] flex items-center justify-center shrink-0">
              <span className="text-white font-black">G</span>
            </div>
            <div>
              <p className="font-black text-base text-gray-900 tracking-tight leading-none">GYM HACK</p>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">Secure Checkout</p>
            </div>
          </div>
          {step > 0 && step < 3 && (
            <button onClick={() => setStep(s => s - 1)}
              className="flex items-center gap-1 text-[13px] font-bold text-[#c23d6a] hover:underline">
              <ArrowLeft size={14} /> Back
            </button>
          )}
        </div>

        {step < 3 && <StepBar step={step} />}

        {step === 0 && <DeliveryScreen onNext={onDetailsNext} loading={loading} />}
        {step === 1 && <OTPScreen phone={form?.phone} onVerified={onOTPVerified} onBack={() => setStep(0)} />}
        {step === 2 && <PaymentScreen deliveryData={form} total={total} onSuccess={onPaySuccess} onFail={onPayFail} onBack={() => setStep(0)} />}
        {step === 3 && <SuccessScreen paymentInfo={payInfo} form={form} isCOD={isCOD} />}
      </div>
    </div>
  );
}