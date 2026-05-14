'use client';

/**
 * ════════════════════════════════════════════════════════════════════════════
 *  GYM HACK — Checkout Page  (app/checkout/page.jsx)
 *  Production-ready · Razorpay v1 · Next.js 14+
 * ════════════════════════════════════════════════════════════════════════════
 *
 *  .env.local  →  NEXT_PUBLIC_API_BASE_URL=http://localhost:5000
 *                 NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxxxxx
 *
 *  .env.production → NEXT_PUBLIC_API_BASE_URL=https://api.gymhack.in
 *                    NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxxxxxx
 *
 *  Backend routes (from paymentController.js):
 *    POST /api/payment/create-order  ← { cartItems:[{id,qty}], customerPhone, customerEmail, idempotencyKey }
 *    POST /api/payment/verify        ← { razorpay_payment_id, razorpay_order_id, razorpay_signature, deliveryAddress, cartItems }
 *    POST /api/orders/cod            ← { cartItems:[{id,qty}], deliveryAddress }
 *    POST /api/auth/send-otp         ← { phone }
 *    POST /api/auth/verify-otp       ← { phone, otp }
 *
 *  Cart integration:
 *    Replace MOCK_CART with: const cart = useCartStore(s => s.cart);
 * ════════════════════════════════════════════════════════════════════════════
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Script from 'next/script';
import {
  ChevronDown, MapPin, Phone, User, CreditCard, Truck,
  ShieldCheck, Lock, CheckCircle2, ArrowLeft, Package,
  Wallet, Banknote, AlertCircle, RefreshCw, Smartphone,
  Star, Tag, Copy, XCircle, RotateCcw, Info,
} from 'lucide-react';

// ─── ENV CONFIG ───────────────────────────────────────────────────────────────
const API     = process.env.NEXT_PUBLIC_API_BASE_URL    || 'http://localhost:5000';
const RZP_KEY = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '';

// ─── CONSTANTS ────────────────────────────────────────────────────────────────
const STATES = [
  'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa',
  'Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala',
  'Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland',
  'Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura',
  'Uttar Pradesh','Uttarakhand','West Bengal',
  'Delhi','Chandigarh','Puducherry','Jammu & Kashmir','Ladakh',
];

// Replace with: const cart = useCartStore(s => s.cart);
const MOCK_CART = [
  { id: 1, name: 'Premium Rolled Oats',   qty: 2, price: 180, image: '/images/oatsimg.jpg' },
  { id: 3, name: 'Dark Chocolate Muesli', qty: 1, price: 290, image: '/images/meusliimg.png' },
];

const RZP_ERROR_MESSAGES = {
  'BAD_REQUEST_ERROR':   'Your bank declined the payment. Please try a different card or UPI.',
  'GATEWAY_ERROR':       'Payment gateway error. Please try again in a moment.',
  'SERVER_ERROR':        'Our server had an issue. Your money is safe — try again.',
  'USER_DISMISSED':      'Payment was cancelled. Your cart is saved.',
  'VERIFICATION_FAILED': 'Payment verification failed. Please contact support with your Payment ID.',
  'NETWORK_ERROR':       'Network error. Check your connection and retry.',
  'SDK_NOT_LOADED':      'Razorpay could not load. Check your internet and try again.',
  'DEFAULT':             'Something went wrong. Please try again.',
};

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const calcTotals = (items = []) => {
  const subtotal = items.reduce((a, i) => a + i.price * i.qty, 0);
  const shipping  = subtotal >= 500 ? 0 : 60;
  return { subtotal, shipping, total: subtotal + shipping };
};

// NOTE: This total is for display ONLY.
// The authoritative total comes from the backend (resolveCartFromDB).
// If they differ, the backend total wins.

const makeIdempotencyKey = () =>
  `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

const friendlyRzpError = code =>
  RZP_ERROR_MESSAGES[code] || RZP_ERROR_MESSAGES.DEFAULT;

// ─── API LAYER ────────────────────────────────────────────────────────────────
const api = {
  /**
   * Creates a Razorpay order on the backend.
   * Sends only IDs + quantities — backend resolves prices from DB.
   * Returns: { success, key, amount (paise), order_id, currency }
   */
  createOrder: async (cart, form, idempotencyKey) => {
    const res = await fetch(`${API}/api/payment/create-order`, {
      method:  'POST',
      headers: {
        'Content-Type':    'application/json',
        'Idempotency-Key': idempotencyKey,
      },
      body: JSON.stringify({
        cartItems:      cart.map(i => ({ id: i.id, qty: i.qty })),
        customerEmail:  form.email || null,
        customerPhone:  form.phone,
        idempotencyKey,
      }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.message || `Order creation failed (HTTP ${res.status})`);
    return data; // { success, key, amount, order_id, currency }
  },

  /**
   * Verifies Razorpay HMAC signature on backend.
   * Returns: { status: 'success'|'failed', db_order_id, message? }
   */
  verifyPayment: async ({ razorpay_payment_id, razorpay_order_id, razorpay_signature, form, cart }) => {
    const res = await fetch(`${API}/api/payment/verify`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        razorpay_payment_id,
        razorpay_order_id,
        razorpay_signature,
        deliveryAddress: form,               // full address now sent at verify time
        cartItems: cart.map(i => ({ id: i.id, qty: i.qty })),
      }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.message || `Verification failed (HTTP ${res.status})`);
    return data; // { status, db_order_id }
  },

  /** Place a COD order. Returns: { success, order_id } */
  placeCOD: async (cart, form) => {
    const res = await fetch(`${API}/api/orders/cod`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        cartItems:       cart.map(i => ({ id: i.id, qty: i.qty })),
        deliveryAddress: form,
      }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.message || `COD order failed (HTTP ${res.status})`);
    return data;
  },

  sendOTP: async (phone) => {
    // Uncomment for production:
    // const res = await fetch(`${API}/api/auth/send-otp`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ phone }),
    // });
    // if (!res.ok) throw new Error('Failed to send OTP');
    // return res.json();
    return { success: true }; // DEMO stub
  },

  verifyOTP: async (phone, otp) => {
    // Uncomment for production:
    // const res = await fetch(`${API}/api/auth/verify-otp`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ phone, otp }),
    // });
    // if (!res.ok) { const d = await res.json().catch(()=>{}); throw new Error(d?.message||'Wrong OTP'); }
    // return res.json();
    await new Promise(r => setTimeout(r, 1000));
    return { success: true }; // DEMO stub
  },
};

// ─── UI PRIMITIVES ────────────────────────────────────────────────────────────
function Field({ label, optional, error, hint, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[10.5px] font-bold uppercase tracking-widest text-gray-400 flex items-center gap-1.5">
        {label}
        {optional && <span className="normal-case tracking-normal font-normal text-gray-300">(optional)</span>}
        {hint && (
          <span title={hint} className="cursor-help">
            <Info size={10} className="text-gray-300" />
          </span>
        )}
      </label>
      {children}
      {error && (
        <span className="flex items-center gap-1 text-[11px] text-red-500 font-semibold">
          <AlertCircle size={10} /> {error}
        </span>
      )}
    </div>
  );
}

function TextInput({ error, icon: Icon, className = '', ...props }) {
  return (
    <div className="relative">
      {Icon && (
        <Icon size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none" />
      )}
      <input
        {...props}
        className={[
          'w-full py-3 rounded-xl border text-sm font-medium text-gray-900 bg-white outline-none transition-all',
          'placeholder:text-gray-300',
          'focus:ring-2 focus:ring-[#c23d6a]/15 focus:border-[#c23d6a]',
          Icon ? 'pl-9 pr-4' : 'px-4',
          error ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300',
          className,
        ].join(' ')}
      />
    </div>
  );
}

function StateSelect({ value, onChange, error }) {
  return (
    <div className="relative">
      <select
        value={value} onChange={onChange}
        className={[
          'w-full px-4 py-3 pr-8 rounded-xl border text-sm font-medium bg-white outline-none appearance-none cursor-pointer transition-all',
          'focus:ring-2 focus:ring-[#c23d6a]/15 focus:border-[#c23d6a]',
          error ? 'border-red-300 bg-red-50 text-gray-900' : 'border-gray-200 hover:border-gray-300',
          value ? 'text-gray-900' : 'text-gray-300',
        ].join(' ')}
      >
        <option value="" disabled>Select state</option>
        {STATES.map(s => <option key={s} value={s}>{s}</option>)}
      </select>
      <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
    </div>
  );
}

function Btn({ children, loading, disabled, onClick, variant = 'brand', small = false, className = '' }) {
  const base = [
    'w-full font-black rounded-2xl flex items-center justify-center gap-2 tracking-wide',
    'transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100',
    small ? 'py-3 text-[13.5px]' : 'py-4 text-[14.5px]',
  ].join(' ');
  const variants = {
    brand: 'bg-[#c23d6a] hover:bg-[#a8305a] text-white shadow-[0_4px_20px_rgba(194,61,106,0.25)]',
    blue:  'bg-gradient-to-r from-[#072654] to-[#3395FF] text-white shadow-[0_4px_20px_rgba(51,149,255,0.28)] hover:opacity-90',
    ghost: 'bg-transparent text-gray-400 hover:text-gray-600 shadow-none py-2 text-[13px]',
    danger:'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 shadow-none',
  };
  return (
    <button onClick={onClick} disabled={disabled || loading}
      className={`${base} ${variants[variant]} ${className}`}>
      {loading
        ? <><span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" /> Processing…</>
        : children}
    </button>
  );
}

function Card({ title, icon: Icon, children, badge }) {
  return (
    <div className="bg-white border border-[#f0e4eb] rounded-2xl p-4 space-y-3.5">
      <div className="flex items-center justify-between pb-0.5">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#fff0f5] flex items-center justify-center shrink-0">
            <Icon size={14} className="text-[#c23d6a]" />
          </div>
          <span className="font-black text-[13.5px] text-gray-900">{title}</span>
        </div>
        {badge && (
          <span className="text-[9px] font-black bg-green-100 text-green-700 px-2 py-0.5 rounded-full uppercase tracking-wider">
            {badge}
          </span>
        )}
      </div>
      {children}
    </div>
  );
}

// ─── ORDER SUMMARY ────────────────────────────────────────────────────────────
function OrderSummary({ items, startOpen = false }) {
  const [open, setOpen] = useState(startOpen);
  const { subtotal, shipping, total } = calcTotals(items);
  return (
    <div className="bg-[#fafafa] border border-[#f0e4eb] rounded-2xl overflow-hidden">
      <button onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between px-4 py-3.5 cursor-pointer">
        <div className="flex items-center gap-2">
          <Package size={15} className="text-[#c23d6a]" />
          <span className="font-bold text-[13px] text-gray-900">Order Summary</span>
          <span className="bg-[#c23d6a] text-white text-[9.5px] font-black rounded-full px-2 py-0.5 leading-none">
            {items.reduce((a, i) => a + i.qty, 0)}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-black text-[#c23d6a] text-[15px]">₹{total}</span>
          <ChevronDown size={13} className={`text-gray-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
        </div>
      </button>
      {open && (
        <div className="border-t border-[#f0e4eb] px-4 pb-4 pt-3">
          {items.map((item, i) => (
            <div key={item.id}
              className={`flex justify-between items-center py-2.5 ${i < items.length - 1 ? 'border-b border-dashed border-[#f5e8ef]' : ''}`}>
              <div>
                <p className="text-[12.5px] font-semibold text-gray-800 leading-snug">{item.name}</p>
                <p className="text-[11px] text-gray-400 mt-0.5">Qty: {item.qty} × ₹{item.price}</p>
              </div>
              <span className="font-bold text-[13px] text-gray-600 shrink-0 ml-4">₹{item.price * item.qty}</span>
            </div>
          ))}
          <div className="pt-3 mt-1 border-t border-[#f0e4eb] space-y-1.5">
            <div className="flex justify-between text-xs text-gray-400">
              <span>Subtotal</span><span className="font-semibold text-gray-700">₹{subtotal}</span>
            </div>
            <div className="flex justify-between text-xs text-gray-400">
              <span>Shipping</span>
              <span className={`font-semibold ${shipping === 0 ? 'text-green-500' : 'text-gray-700'}`}>
                {shipping === 0 ? 'FREE 🎉' : `₹${shipping}`}
              </span>
            </div>
            {shipping > 0 && (
              <p className="text-[10px] text-gray-300">Add ₹{500 - subtotal} more to unlock free shipping</p>
            )}
            <div className="flex justify-between pt-2 border-t border-gray-100">
              <span className="text-sm font-black text-gray-900">Total</span>
              <span className="font-black text-[#c23d6a] text-[15px]">₹{total}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── STEP BAR ─────────────────────────────────────────────────────────────────
function StepBar({ step }) {
  const steps = [
    { label: 'Details',  Icon: User },
    { label: 'Verify',   Icon: Smartphone },
    { label: 'Payment',  Icon: CreditCard },
    { label: 'Done',     Icon: CheckCircle2 },
  ];
  return (
    <div className="flex items-center justify-center mb-7">
      {steps.map(({ label, Icon }, i) => (
        <React.Fragment key={label}>
          <div className="flex flex-col items-center gap-1.5">
            <div className={[
              'w-8 h-8 rounded-full flex items-center justify-center border-[2.5px] transition-all',
              i < step   ? 'bg-[#c23d6a] border-[#c23d6a] text-white'
              : i === step ? 'bg-white border-[#c23d6a] text-[#c23d6a] ring-4 ring-pink-100'
              :              'bg-white border-gray-200 text-gray-300',
            ].join(' ')}>
              {i < step ? <CheckCircle2 size={14} /> : <Icon size={13} />}
            </div>
            <span className={`text-[9px] font-bold uppercase tracking-wider whitespace-nowrap
              ${i <= step ? 'text-[#c23d6a]' : 'text-gray-300'}`}>
              {label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div className={`w-10 h-0.5 mb-5 mx-0.5 transition-colors duration-300
              ${i < step ? 'bg-[#c23d6a]' : 'bg-gray-200'}`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

// ─── SCREEN 0: DELIVERY DETAILS ───────────────────────────────────────────────
function DeliveryScreen({ cart, onNext, submitting }) {
  const [f, setF] = useState({
    firstName: '', lastName: '', phone: '', email: '',
    address: '', apartment: '', city: '', state: '', pincode: '',
    paymentMethod: 'razorpay',
  });
  const [errs, setErrs]       = useState({});
  const [touched, setTouched] = useState(false);
  const { total }             = calcTotals(cart);
  const set = k => e => setF(p => ({ ...p, [k]: e.target.value }));

  const validate = () => {
    const e = {};
    if (!f.firstName.trim())                                        e.firstName = 'Required';
    if (!f.lastName.trim())                                         e.lastName  = 'Required';
    if (!/^[6-9]\d{9}$/.test(f.phone.trim()))                      e.phone     = 'Valid 10-digit Indian mobile';
    if (f.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email))   e.email     = 'Invalid email';
    if (!f.address.trim())                                          e.address   = 'Required';
    if (!f.city.trim())                                             e.city      = 'Required';
    if (!f.state)                                                   e.state     = 'Select a state';
    if (!/^\d{6}$/.test(f.pincode.trim()))                         e.pincode   = 'Valid 6-digit pincode';
    return e;
  };

  const submit = () => {
    setTouched(true);
    const e = validate();
    setErrs(e);
    if (!Object.keys(e).length) onNext(f, total);
  };

  const E     = k => touched && errs[k];
  const isCOD = f.paymentMethod === 'cod';

  return (
    <div className="flex flex-col gap-4">
      <OrderSummary items={cart} />

      <Card title="Contact Information" icon={User}>
        <div className="grid grid-cols-2 gap-3">
          <Field label="First Name" error={E('firstName')}>
            <TextInput value={f.firstName} onChange={set('firstName')} error={E('firstName')} placeholder="First name" />
          </Field>
          <Field label="Last Name" error={E('lastName')}>
            <TextInput value={f.lastName} onChange={set('lastName')} error={E('lastName')} placeholder="Last name" />
          </Field>
        </div>
        <Field label="Mobile Number" error={E('phone')} hint="Used for OTP verification and delivery updates">
          <div className="flex gap-2">
            <div className="flex items-center px-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold text-gray-500 shrink-0 select-none">
              🇮🇳 +91
            </div>
            <TextInput value={f.phone} onChange={set('phone')} error={E('phone')}
              placeholder="10-digit number" type="tel" maxLength={10} className="flex-1" />
          </div>
        </Field>
        <Field label="Email" optional error={E('email')} hint="Order confirmation will be sent here">
          <TextInput value={f.email} onChange={set('email')} error={E('email')}
            placeholder="you@example.com" type="email" />
        </Field>
      </Card>

      <Card title="Delivery Address" icon={MapPin}>
        <Field label="Street Address" error={E('address')}>
          <TextInput value={f.address} onChange={set('address')} error={E('address')}
            icon={MapPin} placeholder="House no., Street, Area" />
        </Field>
        <Field label="Apartment / Landmark" optional>
          <TextInput value={f.apartment} onChange={set('apartment')} placeholder="Floor, Building, Landmark" />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="City" error={E('city')}>
            <TextInput value={f.city} onChange={set('city')} error={E('city')} placeholder="City" />
          </Field>
          <Field label="State" error={E('state')}>
            <StateSelect value={f.state} onChange={set('state')} error={E('state')} />
          </Field>
        </div>
        <Field label="Pincode" error={E('pincode')}>
          <TextInput value={f.pincode} onChange={set('pincode')} error={E('pincode')}
            placeholder="6-digit pincode" maxLength={6} />
        </Field>
      </Card>

      <Card title="Payment Method" icon={Wallet}>
        <div className="space-y-2.5">
          {[
            { v: 'razorpay', label: 'Pay Online',          sub: 'UPI · Cards · Net Banking · Wallets', Icon: CreditCard, badge: 'Recommended' },
            { v: 'cod',      label: 'Cash on Delivery',     sub: 'Pay when your order arrives',          Icon: Banknote,   badge: null },
          ].map(opt => (
            <label key={opt.v}
              className={[
                'flex items-center gap-3 px-3.5 py-3 rounded-xl border-2 cursor-pointer transition-all select-none',
                f.paymentMethod === opt.v ? 'border-[#c23d6a] bg-[#fff0f5]' : 'border-gray-200 hover:border-gray-300 bg-gray-50',
              ].join(' ')}>
              <input type="radio" name="pm" value={opt.v}
                checked={f.paymentMethod === opt.v} onChange={set('paymentMethod')}
                className="accent-[#c23d6a] w-4 h-4 shrink-0" />
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors
                ${f.paymentMethod === opt.v ? 'bg-[#c23d6a]' : 'bg-gray-200'}`}>
                <opt.Icon size={17} className={f.paymentMethod === opt.v ? 'text-white' : 'text-gray-400'} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-bold text-[13.5px] text-gray-900">{opt.label}</p>
                  {opt.badge && (
                    <span className="text-[9px] font-black bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                      {opt.badge}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-gray-400 mt-0.5">{opt.sub}</p>
              </div>
              {f.paymentMethod === opt.v && <CheckCircle2 size={17} className="text-[#c23d6a] shrink-0" />}
            </label>
          ))}
        </div>
        {isCOD && (
          <div className="flex gap-2.5 bg-amber-50 border border-amber-200 rounded-xl px-3.5 py-2.5 mt-1">
            <Truck size={14} className="text-amber-600 mt-0.5 shrink-0" />
            <p className="text-[11.5px] text-amber-800 font-semibold leading-relaxed">
              ₹{total} payable on delivery. Please keep exact change ready.
            </p>
          </div>
        )}
      </Card>

      <Btn onClick={submit} loading={submitting}>
        {isCOD
          ? <><CheckCircle2 size={17} /> Place Order (Cash on Delivery)</>
          : <><Smartphone size={17} /> Verify Mobile &amp; Continue</>}
      </Btn>

      <div className="flex justify-center items-center gap-1.5 pb-2">
        <ShieldCheck size={12} className="text-gray-300" />
        <span className="text-[11px] text-gray-400 font-medium">Secure &amp; encrypted checkout</span>
      </div>
    </div>
  );
}

// ─── SCREEN 1: OTP VERIFICATION ───────────────────────────────────────────────
function OTPScreen({ phone, onVerified, onBack }) {
  const [digits, setDigits]    = useState(Array(6).fill(''));
  const [timer, setTimer]      = useState(30);
  const [verifying, setVerify] = useState(false);
  const [resending, setResend] = useState(false);
  const [error, setError]      = useState('');
  const inputs                 = useRef([]);

  useEffect(() => {
    if (timer <= 0) return;
    const id = setInterval(() => setTimer(t => t - 1), 1000);
    return () => clearInterval(id);
  }, [timer]);

  useEffect(() => { inputs.current[0]?.focus(); }, []);

  const handleChange = (val, idx) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...digits];
    next[idx] = val;
    setDigits(next);
    setError('');
    if (val && idx < 5) inputs.current[idx + 1]?.focus();
  };

  const handleKeyDown = (e, idx) => {
    if (e.key === 'Backspace' && !digits[idx] && idx > 0) inputs.current[idx - 1]?.focus();
  };

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length === 6) { setDigits(pasted.split('')); inputs.current[5]?.focus(); }
    e.preventDefault();
  };

  const resend = async () => {
    setResend(true);
    setDigits(Array(6).fill(''));
    setError('');
    try {
      await api.sendOTP(phone);
      setTimer(30);
      inputs.current[0]?.focus();
    } catch (err) {
      setError(err.message || 'Failed to resend OTP');
    } finally {
      setResend(false);
    }
  };

  const verify = async () => {
    const code = digits.join('');
    if (code.length < 6) { setError('Please enter the complete 6-digit OTP'); return; }
    setVerify(true);
    setError('');
    try {
      const data = await api.verifyOTP(phone, code);
      if (!data.success) throw new Error(data.message || 'Incorrect OTP');
      onVerified();
    } catch (err) {
      setError(err.message || 'Verification failed. Try again.');
      setDigits(Array(6).fill(''));
      inputs.current[0]?.focus();
    } finally {
      setVerify(false);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col items-center gap-3 py-5">
        <div className="w-16 h-16 rounded-2xl bg-[#fff0f5] flex items-center justify-center">
          <Smartphone size={30} className="text-[#c23d6a]" />
        </div>
        <div className="text-center">
          <h2 className="font-black text-[18px] text-gray-900">Verify Your Number</h2>
          <p className="text-sm text-gray-500 mt-1">
            OTP sent to <span className="font-black text-gray-800">+91 {phone}</span>
          </p>
        </div>
      </div>

      <div className="flex gap-2.5 justify-center" onPaste={handlePaste}>
        {digits.map((d, i) => (
          <input key={i} ref={el => inputs.current[i] = el}
            type="tel" inputMode="numeric" maxLength={1} value={d}
            onChange={e => handleChange(e.target.value, i)}
            onKeyDown={e => handleKeyDown(e, i)}
            className={[
              'w-11 h-14 text-center text-xl font-black rounded-xl border-2 outline-none transition-all',
              d ? 'border-[#c23d6a] bg-[#fff0f5] text-[#c23d6a]' : 'border-gray-200 bg-white text-gray-900',
              'focus:border-[#c23d6a] focus:ring-4 focus:ring-pink-100',
              error ? 'border-red-400 bg-red-50' : '',
            ].join(' ')}
          />
        ))}
      </div>

      {error && (
        <div className="flex items-center justify-center gap-1.5">
          <AlertCircle size={13} className="text-red-500" />
          <p className="text-sm text-red-500 font-semibold">{error}</p>
        </div>
      )}

      <div className="flex justify-center">
        {timer > 0 ? (
          <p className="text-sm text-gray-400">
            Resend in <span className="font-black text-[#c23d6a]">{timer}s</span>
          </p>
        ) : (
          <button onClick={resend} disabled={resending}
            className="flex items-center gap-1.5 text-sm font-bold text-[#c23d6a] hover:underline disabled:opacity-50">
            <RefreshCw size={13} className={resending ? 'animate-spin' : ''} />
            {resending ? 'Sending…' : 'Resend OTP'}
          </button>
        )}
      </div>

      <Btn onClick={verify} loading={verifying}>
        <CheckCircle2 size={17} /> Verify &amp; Proceed to Payment
      </Btn>
      <Btn variant="ghost" onClick={onBack}>
        <ArrowLeft size={14} /> Change Number
      </Btn>
    </div>
  );
}

// ─── PAYMENT FAILURE PANEL ────────────────────────────────────────────────────
function PaymentFailureBanner({ errorCode, message, onRetry, onBack }) {
  const msg      = message || friendlyRzpError(errorCode);
  const isCancel = errorCode === 'USER_DISMISSED';
  return (
    <div className={`rounded-2xl border p-4 space-y-3 ${isCancel ? 'bg-amber-50 border-amber-200' : 'bg-red-50 border-red-200'}`}>
      <div className="flex gap-3 items-start">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${isCancel ? 'bg-amber-100' : 'bg-red-100'}`}>
          {isCancel ? <AlertCircle size={18} className="text-amber-500" /> : <XCircle size={18} className="text-red-500" />}
        </div>
        <div>
          <p className={`font-black text-[13.5px] ${isCancel ? 'text-amber-800' : 'text-red-800'}`}>
            {isCancel ? 'Payment Cancelled' : 'Payment Failed'}
          </p>
          <p className={`text-[12px] mt-0.5 leading-relaxed font-medium ${isCancel ? 'text-amber-700' : 'text-red-700'}`}>
            {msg}
          </p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 pt-1">
        <Btn variant="ghost" onClick={onBack} small><ArrowLeft size={13} /> Change Details</Btn>
        <button onClick={onRetry}
          className={`flex items-center justify-center gap-1.5 font-bold text-[13px] py-2.5 rounded-xl border-2 transition-all
            ${isCancel
              ? 'border-amber-400 text-amber-700 bg-amber-50 hover:bg-amber-100'
              : 'border-red-400 text-red-700 bg-red-50 hover:bg-red-100'}`}>
          <RotateCcw size={13} /> Retry Payment
        </button>
      </div>
    </div>
  );
}

// ─── SCREEN 2: RAZORPAY PAYMENT ───────────────────────────────────────────────
function PaymentScreen({ cart, form, total, onSuccess, onFail, onBack }) {
  const [paying,       setPaying]     = useState(false);
  const [failureState, setFailure]    = useState(null);
  const [retryCount,   setRetryCount] = useState(0);
  const idempotencyKey                = useRef(makeIdempotencyKey());

  const launchRazorpay = useCallback(async () => {
    setPaying(true);
    setFailure(null);

    try {
      // ── 1. Check Razorpay SDK is loaded ────────────────────────────────────
      if (typeof window.Razorpay === 'undefined') {
        throw { code: 'SDK_NOT_LOADED' };
      }

      // ── 2. Create order on backend (price resolved server-side) ────────────
      const orderData = await api.createOrder(cart, form, idempotencyKey.current);
      if (!orderData.success) throw new Error(orderData.message || 'Order creation failed');

      // ── 3. Build Razorpay options ──────────────────────────────────────────
      const options = {
        // key comes from backend response (test vs live is server's responsibility)
        key:         orderData.key || RZP_KEY,
        amount:      orderData.amount,         // paise, authoritative from backend
        currency:    orderData.currency || 'INR',
        name:        'GYM HACK',
        description: 'Premium Nutrition',
        image:       '/images/logoimg.png',
        order_id:    orderData.order_id,       // ← This is the REQUIRED Razorpay field
        prefill: {
          name:    `${form.firstName} ${form.lastName}`,
          email:   form.email   || '',
          contact: `+91${form.phone}`,
        },
        notes: {
          delivery_address: `${form.address}${form.apartment ? ', ' + form.apartment : ''}, ${form.city}, ${form.state} – ${form.pincode}`,
          customer_name:    `${form.firstName} ${form.lastName}`,
        },
        theme:             { color: '#c23d6a' },
        remember_customer: true,

        // ── 4. Payment success ─────────────────────────────────────────────
        handler: async function (response) {
          // response = { razorpay_payment_id, razorpay_order_id, razorpay_signature }
          try {
            const result = await api.verifyPayment({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id:   response.razorpay_order_id,
              razorpay_signature:  response.razorpay_signature,
              form,                // full address sent now (not at order creation)
              cart,
            });

            if (result.status === 'success') {
              onSuccess({
                paymentId: response.razorpay_payment_id,
                orderId:   response.razorpay_order_id,
                dbOrderId: result.db_order_id,
              });
            } else {
              setFailure({
                code:    'VERIFICATION_FAILED',
                message: `Payment received but verification failed. Ref: ${response.razorpay_payment_id}. Please contact support.`,
              });
              onFail('VERIFICATION_FAILED');
            }
          } catch (err) {
            setFailure({ code: 'SERVER_ERROR', message: err.message });
            onFail('SERVER_ERROR');
          } finally {
            setPaying(false);
          }
        },

        // ── 5. User dismissed the modal ───────────────────────────────────
        modal: {
          ondismiss: () => {
            setPaying(false);
            setFailure({ code: 'USER_DISMISSED' });
            onFail('USER_DISMISSED');
          },
          escape:    true,
          animation: true,
        },
      };

      const rzp = new window.Razorpay(options);

      // ── 6. Payment failures (card declined, wrong pin, etc.) ──────────────
      rzp.on('payment.failed', function (resp) {
        const code = resp.error?.code || 'DEFAULT';
        const desc = resp.error?.description || '';
        setFailure({ code, message: desc || friendlyRzpError(code) });
        onFail(code);
        setPaying(false);
      });

      rzp.open();

    } catch (err) {
      const code = err.code || 'DEFAULT';
      setFailure({ code, message: err.message || friendlyRzpError(code) });
      setPaying(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cart, form, total, onSuccess, onFail, retryCount]);

  const handleRetry = () => {
    // Fresh idempotency key on every retry → backend creates a new order
    idempotencyKey.current = makeIdempotencyKey();
    setRetryCount(c => c + 1);
    setFailure(null);
  };

  // Auto-launch on mount (only on first render, not on retries — user clicks Retry button)
  useEffect(() => {
    launchRazorpay();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [retryCount]);

  return (
    <div className="flex flex-col gap-4">
      <OrderSummary items={cart} />

      {/* Delivery recap */}
      <div className="bg-white border border-[#f0e4eb] rounded-2xl p-3.5 flex gap-3 items-start">
        <div className="w-8 h-8 rounded-xl bg-[#fff0f5] flex items-center justify-center shrink-0 mt-0.5">
          <MapPin size={14} className="text-[#c23d6a]" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-[12.5px] text-gray-900">
            {form.firstName} {form.lastName} · +91 {form.phone}
          </p>
          <p className="text-[11.5px] text-gray-400 mt-0.5 leading-relaxed">
            {form.address}{form.apartment ? `, ${form.apartment}` : ''},{' '}
            {form.city}, {form.state} – {form.pincode}
          </p>
        </div>
        <button onClick={onBack}
          className="text-[11.5px] font-bold text-[#c23d6a] hover:underline shrink-0 pt-0.5">
          Edit
        </button>
      </div>

      {/* Razorpay branded card */}
      <div className="bg-white border border-[#f0e4eb] rounded-2xl overflow-hidden">
        <div className="bg-gradient-to-br from-[#072654] via-[#1a4a9e] to-[#3395FF] px-5 py-4">
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-white/50 text-[9px] font-bold uppercase tracking-widest mb-1">Powered by</p>
              <p className="text-white text-[21px] font-black tracking-tighter leading-none">razorpay</p>
            </div>
            <div className="flex flex-col items-end gap-1.5">
              <div className="flex items-center gap-1">
                <Lock size={11} className="text-white/60" />
                <span className="text-white/60 text-[10px] font-semibold">256-bit SSL</span>
              </div>
              <div className="flex gap-1">
                {['PCI DSS', 'RBI'].map(b => (
                  <span key={b} className="text-[9px] font-black bg-white/20 text-white px-1.5 py-0.5 rounded">
                    {b}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className="bg-white/10 rounded-xl px-4 py-2.5 flex items-center justify-between">
            <span className="text-white/60 text-[11px] font-semibold">Amount to Pay</span>
            <span className="text-white text-2xl font-black">₹{total}</span>
          </div>
        </div>
        <div className="p-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">Available Methods</p>
          <div className="grid grid-cols-2 gap-2">
            {[
              { icon: '⚡', label: 'UPI',           sub: 'GPay · PhonePe · Paytm · BHIM' },
              { icon: '💳', label: 'Cards',          sub: 'Visa · Mastercard · Amex · RuPay' },
              { icon: '🏦', label: 'Net Banking',    sub: 'SBI · HDFC · ICICI · Axis' },
              { icon: '👜', label: 'Wallets & EMI',  sub: 'Paytm · Amazon Pay · No-cost EMI' },
            ].map(m => (
              <div key={m.label} className="border border-[#f0e4eb] rounded-xl p-3 bg-[#fafafa]">
                <p className="text-base leading-none">{m.icon}</p>
                <p className="text-[12px] font-bold text-gray-900 mt-2">{m.label}</p>
                <p className="text-[10px] text-gray-400 font-medium mt-0.5 leading-snug">{m.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Trust badges */}
      <div className="flex items-center justify-center gap-4 flex-wrap">
        {[
          { Icon: Lock,        text: '100% Secure' },
          { Icon: ShieldCheck, text: 'Bank-grade Encryption' },
          { Icon: Star,        text: '4.9★ Trusted' },
        ].map(({ Icon, text }) => (
          <div key={text} className="flex items-center gap-1.5">
            <Icon size={12} className="text-green-500" />
            <span className="text-[11px] text-gray-400 font-semibold">{text}</span>
          </div>
        ))}
      </div>

      {/* Loading state (while Razorpay modal is opening) */}
      {paying && !failureState && (
        <div className="flex items-center justify-center gap-2 py-3 text-gray-400">
          <span className="w-4 h-4 border-2 border-[#c23d6a] border-t-transparent rounded-full animate-spin" />
          <span className="text-[12.5px] font-semibold">Opening secure payment…</span>
        </div>
      )}

      {/* Failure banner */}
      {failureState && (
        <PaymentFailureBanner
          errorCode={failureState.code}
          message={failureState.message}
          onRetry={handleRetry}
          onBack={onBack}
        />
      )}

      {/* Manual launch button — shown after modal closes (not on first open) */}
      {!paying && !failureState && (
        <Btn variant="blue" onClick={launchRazorpay} loading={paying}>
          <Lock size={15} /> Pay ₹{total} Securely via Razorpay
        </Btn>
      )}

      {!paying && !failureState && (
        <Btn variant="ghost" onClick={onBack}>
          <ArrowLeft size={14} /> Back to Delivery
        </Btn>
      )}
    </div>
  );
}

// ─── SCREEN 3: SUCCESS ────────────────────────────────────────────────────────
function SuccessScreen({ cart, form, payInfo, isCOD }) {
  const { total }         = calcTotals(cart);
  const [copied, setCopy] = useState(false);
  const orderId           = payInfo?.dbOrderId || ('GH' + Date.now().toString().slice(-7));

  const copy = async (text) => {
    try { await navigator.clipboard.writeText(text); setCopy(true); setTimeout(() => setCopy(false), 2000); }
    catch { /* ignore */ }
  };

  return (
    <div className="flex flex-col items-center gap-5 py-4 text-center">
      <div className="relative mt-2">
        <div className="w-24 h-24 rounded-full bg-green-50 border-4 border-green-400 flex items-center justify-center">
          <CheckCircle2 size={46} className="text-green-500" strokeWidth={1.8} />
        </div>
        <div className="absolute -top-1 -right-1 w-8 h-8 rounded-full bg-[#c23d6a] flex items-center justify-center shadow-md">
          <Tag size={14} className="text-white" />
        </div>
      </div>
      <div>
        <h2 className="text-[22px] font-black text-gray-900">
          {isCOD ? 'Order Placed! 🎉' : 'Payment Successful! 🎉'}
        </h2>
        <p className="text-gray-400 text-sm mt-1.5 font-medium max-w-xs mx-auto leading-relaxed">
          {isCOD
            ? `Your order is confirmed. Keep ₹${total} ready to pay on delivery.`
            : 'Payment received. Your order is confirmed and being prepared.'}
        </p>
      </div>
      <div className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 text-left space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-[10.5px] font-bold uppercase tracking-widest text-gray-400">Order ID</span>
          <div className="flex items-center gap-2">
            <span className="font-black text-[13px] text-gray-900">#{orderId}</span>
            <button onClick={() => copy(orderId)} className="text-gray-300 hover:text-gray-500 transition-colors" title="Copy">
              {copied ? <CheckCircle2 size={13} className="text-green-500" /> : <Copy size={13} />}
            </button>
          </div>
        </div>
        {payInfo?.paymentId && (
          <div className="flex justify-between items-center">
            <span className="text-[10.5px] font-bold uppercase tracking-widest text-gray-400">Payment ID</span>
            <span className="font-mono text-[11px] text-gray-600 truncate max-w-[160px]">{payInfo.paymentId}</span>
          </div>
        )}
        <div className="border-t border-gray-200 pt-3 space-y-1">
          <p className="text-[10.5px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">Delivering to</p>
          <p className="text-[13px] font-bold text-gray-900">{form.firstName} {form.lastName}</p>
          <p className="text-[12px] text-gray-500">{form.address}{form.apartment ? `, ${form.apartment}` : ''}</p>
          <p className="text-[12px] text-gray-500">{form.city}, {form.state} – {form.pincode}</p>
          <p className="text-[12px] text-gray-500">+91 {form.phone}</p>
        </div>
        <div className="border-t border-gray-200 pt-3 flex justify-between items-center">
          <span className="font-black text-[13.5px] text-gray-900">{isCOD ? 'Total (Pay on Delivery)' : 'Total Paid'}</span>
          <span className="font-black text-[#c23d6a] text-[15px]">₹{total}</span>
        </div>
      </div>
      <div className="w-full bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 text-left">
        <p className="text-[12px] font-bold text-blue-800">📦 Estimated Delivery: 3–5 Business Days</p>
        <p className="text-[11px] text-blue-500 mt-1 font-medium">
          {form.email
            ? `Confirmation email sent to ${form.email}`
            : `SMS confirmation sent to +91 ${form.phone}`}
        </p>
      </div>
      <a href="/"
        className="w-full bg-[#c23d6a] text-white font-black py-4 rounded-2xl text-center hover:bg-[#a8305a] transition-colors block text-[14.5px] tracking-wide">
        Continue Shopping
      </a>
    </div>
  );
}

// ─── ROOT PAGE ────────────────────────────────────────────────────────────────
export default function CheckoutPage() {
  // ── Swap MOCK_CART with your real store: ──
  //    const cart = useCartStore(s => s.cart);
  const cart = MOCK_CART;

  const [step,       setStep]   = useState(0);
  const [form,       setForm]   = useState(null);
  const [total,      setTotal]  = useState(0);
  const [isCOD,      setIsCOD]  = useState(false);
  const [payInfo,    setPayInfo] = useState(null);
  const [submitting, setSub]    = useState(false);
  const [globalErr,  setGlobalErr] = useState('');

  const onDetailsNext = async (f, t) => {
    setSub(true);
    setGlobalErr('');
    setForm(f);
    setTotal(t);
    try {
      if (f.paymentMethod === 'cod') {
        setIsCOD(true);
        const res = await api.placeCOD(cart, f);
        if (!res.success) throw new Error(res.message || 'COD order failed');
        setPayInfo({ dbOrderId: res.order_id });
        setStep(3);
      } else {
        setIsCOD(false);
        await api.sendOTP(f.phone);
        setStep(1);
      }
    } catch (err) {
      setGlobalErr(err.message || 'Something went wrong. Please try again.');
    } finally {
      setSub(false);
    }
  };

  return (
    <>
      {/* Load Razorpay SDK lazily — only on this page, non-blocking */}
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />

      <style>{`
        .co-wrap *, .co-wrap *::before, .co-wrap *::after { box-sizing: border-box; }
        @keyframes coFadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .co-step { animation: coFadeUp 0.28s ease both; }
      `}</style>

      <div
        className="co-wrap"
        style={{
          width:         '100%',
          overflowX:     'hidden',
          background:    '#fdf8f9',
          minHeight:     'calc(100vh - 80px)',
          paddingBottom: 88,
        }}
      >
        <div style={{ maxWidth: 520, width: '100%', margin: '0 auto', padding: '28px 16px 0' }}>

          {step > 0 && step < 3 && (
            <button
              onClick={() => setStep(s => Math.max(0, s - 1))}
              className="flex items-center gap-1.5 text-[13px] font-bold text-[#c23d6a] mb-5 hover:underline"
            >
              <ArrowLeft size={14} /> Back
            </button>
          )}

          {step < 3 && <StepBar step={step} />}

          {/* Global error banner (COD / OTP send failures) */}
          {globalErr && (
            <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-4">
              <AlertCircle size={15} className="text-red-500 shrink-0 mt-0.5" />
              <p className="text-[12.5px] text-red-700 font-semibold leading-relaxed">{globalErr}</p>
            </div>
          )}

          <div className="co-step" key={step}>
            {step === 0 && (
              <DeliveryScreen cart={cart} onNext={onDetailsNext} submitting={submitting} />
            )}
            {step === 1 && (
              <OTPScreen
                phone={form?.phone}
                onVerified={() => setStep(2)}
                onBack={() => setStep(0)}
              />
            )}
            {step === 2 && (
              <PaymentScreen
                cart={cart}
                form={form}
                total={total}
                onSuccess={info => { setPayInfo(info); setStep(3); }}
                onFail={code => console.warn('[Checkout] Payment failed:', code)}
                onBack={() => setStep(0)}
              />
            )}
            {step === 3 && (
              <SuccessScreen cart={cart} form={form} payInfo={payInfo} isCOD={isCOD} />
            )}
          </div>
        </div>
      </div>
    </>
  );
}