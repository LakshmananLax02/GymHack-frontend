'use client';

import React, { useState } from 'react';
import {
  ChevronDown, ChevronRight, MapPin, Phone, User, Building2,
  CreditCard, Truck, ShieldCheck, Lock, CheckCircle2, ArrowLeft,
  Package, Wallet, Banknote, X
} from 'lucide-react';

// ─── Utility ───────────────────────────────────────────────────────────────
const BRAND = '#c23d6a';
const BRAND_DARK = '#a8305a';
const BRAND_LIGHT = '#fff0f5';

const indianStates = [
  'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa',
  'Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala',
  'Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland',
  'Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura',
  'Uttar Pradesh','Uttarakhand','West Bengal',
  'Delhi','Chandigarh','Puducherry','Jammu & Kashmir','Ladakh',
];

function InputField({ label, value, onChange, error, type = 'text', optional = false, icon: Icon, children, ...rest }) {
  return (
    <div className="flex flex-col gap-1">
      <label style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#888' }}>
        {label}{optional && <span style={{ color: '#bbb', fontWeight: 500 }}> (optional)</span>}
      </label>
      <div style={{ position: 'relative' }}>
        {Icon && (
          <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#bbb', pointerEvents: 'none' }}>
            <Icon size={15} />
          </span>
        )}
        {children || (
          <input
            type={type}
            value={value}
            onChange={onChange}
            style={{
              width: '100%',
              padding: Icon ? '11px 14px 11px 36px' : '11px 14px',
              border: `1.5px solid ${error ? '#f87171' : '#e5e7eb'}`,
              borderRadius: 12,
              fontSize: 14,
              fontWeight: 500,
              color: '#111',
              background: '#fff',
              outline: 'none',
              transition: 'border-color 0.15s',
              boxSizing: 'border-box',
            }}
            onFocus={e => e.target.style.borderColor = BRAND}
            onBlur={e => e.target.style.borderColor = error ? '#f87171' : '#e5e7eb'}
            {...rest}
          />
        )}
      </div>
      {error && <span style={{ color: '#ef4444', fontSize: 11, fontWeight: 600 }}>{error}</span>}
    </div>
  );
}

function SelectField({ label, value, onChange, error, options, icon: Icon, optional }) {
  return (
    <div className="flex flex-col gap-1">
      <label style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#888' }}>
        {label}{optional && <span style={{ color: '#bbb', fontWeight: 500 }}> (optional)</span>}
      </label>
      <div style={{ position: 'relative' }}>
        {Icon && (
          <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#bbb', pointerEvents: 'none', zIndex: 1 }}>
            <Icon size={15} />
          </span>
        )}
        <select
          value={value}
          onChange={onChange}
          style={{
            width: '100%',
            padding: Icon ? '11px 36px 11px 36px' : '11px 36px 11px 14px',
            border: `1.5px solid ${error ? '#f87171' : '#e5e7eb'}`,
            borderRadius: 12,
            fontSize: 14,
            fontWeight: 500,
            color: value ? '#111' : '#9ca3af',
            background: '#fff',
            outline: 'none',
            appearance: 'none',
            cursor: 'pointer',
            boxSizing: 'border-box',
          }}
          onFocus={e => e.target.style.borderColor = BRAND}
          onBlur={e => e.target.style.borderColor = error ? '#f87171' : '#e5e7eb'}
        >
          {options.map(o => (
            <option key={o.value} value={o.value} disabled={o.disabled}>{o.label}</option>
          ))}
        </select>
        <ChevronDown size={14} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', pointerEvents: 'none' }} />
      </div>
      {error && <span style={{ color: '#ef4444', fontSize: 11, fontWeight: 600 }}>{error}</span>}
    </div>
  );
}

// ─── Order Summary Mini ─────────────────────────────────────────────────────
function OrderSummary({ items = [], total = 0, collapsed = false }) {
  const [open, setOpen] = useState(!collapsed);
  const mockItems = items.length ? items : [
    { name: 'Premium Rolled Oats', qty: 2, price: 180 },
    { name: 'Dark Chocolate Muesli', qty: 1, price: 290 },
  ];
  const mockTotal = total || mockItems.reduce((a, i) => a + i.price * i.qty, 0);

  return (
    <div style={{ background: '#fafafa', border: '1.5px solid #f0e8ee', borderRadius: 16, overflow: 'hidden' }}>
      <button
        onClick={() => setOpen(v => !v)}
        style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', background: 'none', border: 'none', cursor: 'pointer' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Package size={16} style={{ color: BRAND }} />
          <span style={{ fontWeight: 700, fontSize: 13, color: '#111' }}>Order Summary</span>
          <span style={{ background: BRAND, color: '#fff', fontSize: 10, fontWeight: 800, borderRadius: 999, padding: '1px 7px' }}>
            {mockItems.reduce((a, i) => a + i.qty, 0)}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontWeight: 800, color: BRAND, fontSize: 15 }}>₹{mockTotal}</span>
          <ChevronDown size={14} style={{ color: '#9ca3af', transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
        </div>
      </button>
      {open && (
        <div style={{ borderTop: '1px solid #f0e8ee', padding: '12px 16px 14px' }}>
          {mockItems.map((item, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderBottom: i < mockItems.length - 1 ? '1px dashed #f0e8ee' : 'none' }}>
              <div>
                <p style={{ fontSize: 13, fontWeight: 600, color: '#222' }}>{item.name}</p>
                <p style={{ fontSize: 11, color: '#9ca3af', fontWeight: 500 }}>Qty: {item.qty}</p>
              </div>
              <span style={{ fontWeight: 700, fontSize: 13, color: '#444' }}>₹{item.price * item.qty}</span>
            </div>
          ))}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10, paddingTop: 10, borderTop: '1.5px solid #f0e8ee' }}>
            <span style={{ fontSize: 12, color: '#888', fontWeight: 600 }}>Shipping</span>
            <span style={{ fontSize: 12, color: '#22c55e', fontWeight: 700 }}>FREE</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
            <span style={{ fontSize: 14, fontWeight: 800, color: '#111' }}>Total</span>
            <span style={{ fontSize: 16, fontWeight: 900, color: BRAND }}>₹{mockTotal}</span>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Step Indicator ─────────────────────────────────────────────────────────
function StepBar({ step }) {
  const steps = ['Cart', 'Delivery', 'Payment'];
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0, marginBottom: 28 }}>
      {steps.map((s, i) => (
        <React.Fragment key={s}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <div style={{
              width: 32, height: 32, borderRadius: '50%',
              background: i < step ? BRAND : i === step ? BRAND : '#e5e7eb',
              color: i <= step ? '#fff' : '#9ca3af',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 800, fontSize: 13,
              border: i === step ? `3px solid ${BRAND}` : '3px solid transparent',
              boxShadow: i === step ? `0 0 0 3px #f9d1de` : 'none',
              transition: 'all 0.3s',
            }}>
              {i < step ? <CheckCircle2 size={16} /> : i + 1}
            </div>
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: i <= step ? BRAND : '#9ca3af' }}>{s}</span>
          </div>
          {i < steps.length - 1 && (
            <div style={{ width: 60, height: 2, background: i < step ? BRAND : '#e5e7eb', margin: '0 4px', marginBottom: 18, transition: 'background 0.3s' }} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

// ─── Delivery Screen ────────────────────────────────────────────────────────
function DeliveryScreen({ onNext, onBack }) {
  const [form, setForm] = useState({
    firstName: '', lastName: '', phone: '', email: '',
    address: '', apartment: '', city: '', state: '', pincode: '',
    paymentMethod: 'cod',
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const set = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }));

  const validate = () => {
    const errs = {};
    if (!form.firstName.trim()) errs.firstName = 'First name is required';
    if (!form.lastName.trim()) errs.lastName = 'Last name is required';
    if (!form.phone.trim()) errs.phone = 'Phone number is required';
    else if (!/^[6-9]\d{9}$/.test(form.phone.trim())) errs.phone = 'Enter a valid 10-digit Indian mobile number';
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Enter a valid email address';
    if (!form.address.trim()) errs.address = 'Address is required';
    if (!form.city.trim()) errs.city = 'City is required';
    if (!form.state) errs.state = 'Please select a state';
    if (!form.pincode.trim()) errs.pincode = 'Pincode is required';
    else if (!/^\d{6}$/.test(form.pincode.trim())) errs.pincode = 'Enter a valid 6-digit pincode';
    return errs;
  };

  const handleSubmit = () => {
    setSubmitted(true);
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length === 0) {
      onNext(form);
    }
  };

  const isCOD = form.paymentMethod === 'cod';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <OrderSummary collapsed />

      {/* Contact */}
      <div style={{ background: '#fff', border: '1.5px solid #f0e8ee', borderRadius: 16, padding: '18px 16px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
          <User size={16} style={{ color: BRAND }} />
          <span style={{ fontWeight: 800, fontSize: 14, color: '#111' }}>Contact Information</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <InputField label="First Name" value={form.firstName} onChange={set('firstName')} error={submitted && errors.firstName} />
          <InputField label="Last Name" value={form.lastName} onChange={set('lastName')} error={submitted && errors.lastName} />
        </div>
        <InputField label="Phone" value={form.phone} onChange={set('phone')} error={submitted && errors.phone} type="tel" icon={Phone} placeholder="10-digit mobile number" />
        <InputField label="Email" value={form.email} onChange={set('email')} error={submitted && errors.email} type="email" optional placeholder="For order updates" />
      </div>

      {/* Address */}
      <div style={{ background: '#fff', border: '1.5px solid #f0e8ee', borderRadius: 16, padding: '18px 16px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
          <MapPin size={16} style={{ color: BRAND }} />
          <span style={{ fontWeight: 800, fontSize: 14, color: '#111' }}>Delivery Address</span>
        </div>
        <InputField label="Street Address" value={form.address} onChange={set('address')} error={submitted && errors.address} icon={MapPin} placeholder="House no., Street name" />
        <InputField label="Apartment / Suite" value={form.apartment} onChange={set('apartment')} optional placeholder="Floor, Building, Landmark" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <InputField label="City" value={form.city} onChange={set('city')} error={submitted && errors.city} />
          <SelectField
            label="State"
            value={form.state}
            onChange={set('state')}
            error={submitted && errors.state}
            options={[{ value: '', label: 'Select State', disabled: true }, ...indianStates.map(s => ({ value: s, label: s }))]}
          />
        </div>
        <InputField label="Pincode" value={form.pincode} onChange={set('pincode')} error={submitted && errors.pincode} placeholder="6-digit pincode" maxLength={6} />
      </div>

      {/* Payment Method Selection */}
      <div style={{ background: '#fff', border: '1.5px solid #f0e8ee', borderRadius: 16, padding: '18px 16px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
          <Wallet size={16} style={{ color: BRAND }} />
          <span style={{ fontWeight: 800, fontSize: 14, color: '#111' }}>Payment Method</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[
            { value: 'cod', label: 'Cash on Delivery', desc: 'Pay when your order arrives', icon: Banknote },
            { value: 'razorpay', label: 'Razorpay', desc: 'UPI, Cards, Net Banking & more', icon: CreditCard },
          ].map(opt => (
            <label
              key={opt.value}
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '13px 14px',
                border: `2px solid ${form.paymentMethod === opt.value ? BRAND : '#e5e7eb'}`,
                borderRadius: 12,
                background: form.paymentMethod === opt.value ? BRAND_LIGHT : '#fff',
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
            >
              <input
                type="radio"
                name="paymentMethod"
                value={opt.value}
                checked={form.paymentMethod === opt.value}
                onChange={set('paymentMethod')}
                style={{ accentColor: BRAND, width: 16, height: 16, cursor: 'pointer' }}
              />
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: form.paymentMethod === opt.value ? BRAND : '#f3f4f6',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <opt.icon size={18} style={{ color: form.paymentMethod === opt.value ? '#fff' : '#9ca3af' }} />
              </div>
              <div>
                <p style={{ fontWeight: 700, fontSize: 14, color: '#111', lineHeight: 1.3 }}>{opt.label}</p>
                <p style={{ fontSize: 11, color: '#888', fontWeight: 500 }}>{opt.desc}</p>
              </div>
              {form.paymentMethod === opt.value && (
                <CheckCircle2 size={18} style={{ color: BRAND, marginLeft: 'auto' }} />
              )}
            </label>
          ))}
        </div>
        {isCOD && (
          <div style={{ background: '#f0fdf4', border: '1px solid #86efac', borderRadius: 10, padding: '10px 13px', display: 'flex', gap: 8, alignItems: 'flex-start' }}>
            <Truck size={15} style={{ color: '#16a34a', marginTop: 1, flexShrink: 0 }} />
            <p style={{ fontSize: 12, color: '#166534', fontWeight: 600 }}>
              Pay in cash when your order is delivered. Please keep exact change ready.
            </p>
          </div>
        )}
      </div>

      {/* CTA */}
      <button
        onClick={handleSubmit}
        style={{
          width: '100%',
          background: BRAND,
          color: '#fff',
          border: 'none',
          borderRadius: 16,
          padding: '16px',
          fontSize: 15,
          fontWeight: 800,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          letterSpacing: '0.02em',
          boxShadow: `0 4px 20px ${BRAND}40`,
          transition: 'all 0.2s',
        }}
        onMouseEnter={e => e.target.style.background = BRAND_DARK}
        onMouseLeave={e => e.target.style.background = BRAND}
      >
        {isCOD ? (
          <><CheckCircle2 size={18} /> Place Order</>
        ) : (
          <><CreditCard size={18} /> Proceed to Make Payment</>
        )}
      </button>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
        <ShieldCheck size={13} style={{ color: '#9ca3af' }} />
        <span style={{ fontSize: 11, color: '#9ca3af', fontWeight: 600 }}>Secure & encrypted checkout</span>
      </div>
    </div>
  );
}

// ─── Razorpay Screen ─────────────────────────────────────────────────────────
function RazorpayScreen({ deliveryData, onBack }) {
  const [paying, setPaying] = useState(false);
  const [success, setSuccess] = useState(false);
  const mockTotal = 650;

  const handlePay = () => {
    setPaying(true);
    setTimeout(() => {
      setPaying(false);
      setSuccess(true);
    }, 2200);
  };

  if (success) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 18, padding: '40px 20px', textAlign: 'center' }}>
        <div style={{
          width: 80, height: 80, borderRadius: '50%',
          background: '#f0fdf4', border: '3px solid #22c55e',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          animation: 'popIn 0.4s ease',
        }}>
          <CheckCircle2 size={40} style={{ color: '#22c55e' }} />
        </div>
        <div>
          <h2 style={{ fontWeight: 900, fontSize: 22, color: '#111', marginBottom: 6 }}>Payment Successful!</h2>
          <p style={{ color: '#888', fontSize: 14, fontWeight: 500 }}>Your order has been placed. You'll receive a confirmation soon.</p>
        </div>
        <div style={{ background: '#f8f8f8', borderRadius: 14, padding: '14px 24px', width: '100%', maxWidth: 300 }}>
          <p style={{ fontSize: 12, color: '#888', fontWeight: 600 }}>Amount Paid</p>
          <p style={{ fontSize: 26, fontWeight: 900, color: BRAND }}>₹{mockTotal}</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <OrderSummary collapsed />

      {/* Delivery To */}
      {deliveryData && (
        <div style={{ background: '#fff', border: '1.5px solid #f0e8ee', borderRadius: 16, padding: '14px 16px', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: BRAND_LIGHT, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <MapPin size={16} style={{ color: BRAND }} />
          </div>
          <div>
            <p style={{ fontWeight: 700, fontSize: 13, color: '#111' }}>Delivering to</p>
            <p style={{ fontSize: 12, color: '#666', fontWeight: 500, marginTop: 2 }}>
              {deliveryData.firstName} {deliveryData.lastName} · {deliveryData.phone}
            </p>
            <p style={{ fontSize: 12, color: '#888', fontWeight: 500, marginTop: 1 }}>
              {deliveryData.address}{deliveryData.apartment ? `, ${deliveryData.apartment}` : ''}, {deliveryData.city}, {deliveryData.state} – {deliveryData.pincode}
            </p>
          </div>
          <button onClick={onBack} style={{ marginLeft: 'auto', fontSize: 11, fontWeight: 700, color: BRAND, background: 'none', border: 'none', cursor: 'pointer', flexShrink: 0 }}>Change</button>
        </div>
      )}

      {/* Razorpay Card */}
      <div style={{ background: '#fff', border: '1.5px solid #f0e8ee', borderRadius: 16, overflow: 'hidden' }}>
        {/* Header */}
        <div style={{ background: 'linear-gradient(135deg, #072654 0%, #3395FF 100%)', padding: '18px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 3 }}>Powered by</p>
            <p style={{ color: '#fff', fontSize: 20, fontWeight: 900, letterSpacing: '-0.03em' }}>Razorpay</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Lock size={14} style={{ color: 'rgba(255,255,255,0.7)' }} />
            <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 11, fontWeight: 600 }}>100% Secure</span>
          </div>
        </div>

        <div style={{ padding: '18px 16px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Amount */}
          <div style={{ textAlign: 'center', padding: '12px', background: BRAND_LIGHT, borderRadius: 12 }}>
            <p style={{ fontSize: 11, color: '#888', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Amount to Pay</p>
            <p style={{ fontSize: 32, fontWeight: 900, color: BRAND, lineHeight: 1.2, marginTop: 4 }}>₹{mockTotal}</p>
          </div>

          {/* Payment Options Preview */}
          <div>
            <p style={{ fontSize: 11, color: '#888', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 10 }}>Pay via</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {[
                { label: 'UPI', icon: '⚡', sub: 'GPay, PhonePe, Paytm' },
                { label: 'Cards', icon: '💳', sub: 'Visa, Mastercard, Amex' },
                { label: 'Net Banking', icon: '🏦', sub: 'All major banks' },
                { label: 'Wallets', icon: '👜', sub: 'Paytm, Amazon Pay' },
              ].map(opt => (
                <div key={opt.label} style={{ border: '1.5px solid #f0e8ee', borderRadius: 12, padding: '10px 12px', background: '#fafafa' }}>
                  <p style={{ fontSize: 15 }}>{opt.icon}</p>
                  <p style={{ fontSize: 12, fontWeight: 700, color: '#111', marginTop: 4 }}>{opt.label}</p>
                  <p style={{ fontSize: 10, color: '#9ca3af', fontWeight: 500, marginTop: 1 }}>{opt.sub}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Trust Badges */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {['256-bit SSL', 'PCI DSS', 'RBI Compliant'].map(badge => (
              <div key={badge} style={{ display: 'flex', alignItems: 'center', gap: 4, background: '#f0fdf4', borderRadius: 8, padding: '4px 10px' }}>
                <ShieldCheck size={11} style={{ color: '#22c55e' }} />
                <span style={{ fontSize: 10, fontWeight: 700, color: '#166534' }}>{badge}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pay Button */}
      <button
        onClick={handlePay}
        disabled={paying}
        style={{
          width: '100%',
          background: paying ? '#e5e7eb' : 'linear-gradient(135deg, #072654 0%, #3395FF 100%)',
          color: paying ? '#9ca3af' : '#fff',
          border: 'none',
          borderRadius: 16,
          padding: '16px',
          fontSize: 15,
          fontWeight: 800,
          cursor: paying ? 'not-allowed' : 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          letterSpacing: '0.02em',
          boxShadow: paying ? 'none' : '0 4px 20px rgba(51, 149, 255, 0.4)',
          transition: 'all 0.2s',
        }}
      >
        {paying ? (
          <>
            <span style={{
              width: 18, height: 18, border: '2px solid #9ca3af', borderTopColor: 'transparent',
              borderRadius: '50%', display: 'inline-block', animation: 'spin 0.7s linear infinite'
            }} />
            Processing...
          </>
        ) : (
          <><Lock size={16} /> Pay ₹{mockTotal} Securely</>
        )}
      </button>
    </div>
  );
}

// ─── Main App ────────────────────────────────────────────────────────────────
export default function CheckoutFlow() {
  const [step, setStep] = useState(1); // 1 = delivery, 2 = payment
  const [deliveryData, setDeliveryData] = useState(null);

  const handleDeliveryNext = (data) => {
    setDeliveryData(data);
    if (data.paymentMethod === 'razorpay') {
      setStep(2);
    } else {
      // COD — show success inline (you'd route to /order-success)
      alert('Order placed successfully! You will pay on delivery.');
    }
  };

  return (
    <>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes popIn { 0% { transform: scale(0.5); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Segoe UI', -apple-system, sans-serif; }
      `}</style>

      <div style={{ minHeight: '100vh', background: '#fdf8f9', padding: '24px 16px 40px' }}>
        <div style={{ maxWidth: 480, margin: '0 auto' }}>

          {/* Brand Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: BRAND, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ color: '#fff', fontWeight: 900, fontSize: 16 }}>O</span>
              </div>
              <div>
                <p style={{ fontWeight: 900, fontSize: 16, color: '#111', letterSpacing: '-0.03em' }}>OatStore</p>
                <p style={{ fontSize: 10, color: '#9ca3af', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Checkout</p>
              </div>
            </div>
            {step === 2 && (
              <button onClick={() => setStep(1)} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 13, fontWeight: 700, color: BRAND, background: 'none', border: 'none', cursor: 'pointer' }}>
                <ArrowLeft size={14} /> Back
              </button>
            )}
          </div>

          <StepBar step={step} />

          {step === 1 && (
            <DeliveryScreen
              onNext={handleDeliveryNext}
              onBack={() => {}}
            />
          )}

          {step === 2 && (
            <RazorpayScreen
              deliveryData={deliveryData}
              onBack={() => setStep(1)}
            />
          )}
        </div>
      </div>
    </>
  );
}