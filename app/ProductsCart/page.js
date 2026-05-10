"use client";

import React, { useState, useEffect } from 'react';
import { useCartStore } from '../store/useCartStore';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity } = useCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const totalPrice = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  if (!mounted) return <div className="min-h-screen bg-[#f0ece2]" />;

  return (
    <div className="min-h-screen bg-[#f0ece2] pt-14 pb-12 px-6">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="mb-8">

          {/* Back button */}
          <Link
            href="/products"
            className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest hover:text-[#c23d6a] transition-colors mb-4"
          >
            <ArrowLeft size={18} /> Back to Shop
          </Link>

          {/* Title */}
          <div className="flex items-center justify-center gap-3">
            <ShoppingBag className="text-[#c23d6a]" size={32} />
            <h1 className="font-primary text-4xl uppercase font-black">Your Cart</h1>
          </div>

        </div>

        {/* ── Fixed 320px Order Summary column ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">

          {/* Product List */}
          <div className="space-y-4">
            {cart.length === 0 ? (
              <div className="bg-white p-12 rounded-3xl text-center shadow-sm">
                <p className="font-secondary text-gray-500 mb-6">Your fuel tank is empty.</p>
                <Link
                  href="/products"
                  className="bg-[#c23d6a] text-white px-8 py-3 rounded-full hover:bg-black hover:text-white font-bold text-sm"
                >
                  Start Shopping
                </Link>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-wrap sm:flex-nowrap gap-4 bg-white p-5 rounded-3xl shadow-sm items-center transition-all"
                >
                  <div className="w-24 h-24 bg-[#f8f8f8] rounded-2xl flex-shrink-0">
                    <img
                      src={item.image}
                      className="w-full h-full object-contain p-2"
                      alt={item.name}
                    />
                  </div>

                  <div className="flex-1 min-w-[150px]">
                    <h4 className="font-primary text-lg uppercase leading-tight mb-1">{item.name}</h4>
                    <p className="font-secondary font-bold text-[#c23d6a] text-lg">₹ {item.price}</p>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center bg-[#f0ece2] rounded-full px-2 py-1 gap-4">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        updateQuantity(item.id, item.quantity - 1);
                      }}
                      disabled={item.quantity <= 1}
                      className="w-8 h-8 flex items-center justify-center hover:bg-white rounded-full transition-colors disabled:opacity-30"
                    >
                      <Minus size={14} />
                    </button>

                    <span className="font-bold text-sm min-w-[20px] text-center select-none">
                      {item.quantity}
                    </span>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        updateQuantity(item.id, item.quantity + 1);
                      }}
                      className="w-8 h-8 flex items-center justify-center hover:bg-white rounded-full transition-colors"
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      removeFromCart(item.id);
                    }}
                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Order Summary — fixed 320px */}
          <div className="w-full lg:w-[320px]">
            <div className="bg-white p-4 rounded-[1rem] shadow-sm sticky top-28">
              <h3 className="font-primary text-xl uppercase mb-6 border-b pb-4">Order Summary</h3>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-500 font-secondary text-sm font-bold uppercase">
                  <span>Subtotal</span>
                  <span>₹ {totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-500 font-secondary text-sm font-bold uppercase">
                  <span>Shipping</span>
                  <span className="text-green-600">FREE</span>
                </div>
              </div>

              <div className="flex justify-between items-end mb-8 pt-4 border-t border-dashed">
                <span className="font-secondary uppercase text-xs font-black">Total</span>
                <span className="font-primary text-4xl font-black text-[#c23d6a]">
                  ₹ {totalPrice.toFixed(2)}
                </span>
              </div>

              <button className="w-full bg-[#c23d6a] text-white py-5 rounded-xl font-bold uppercase tracking-[0.2em] hover:bg-black transition-all transform active:scale-95 shadow-lg shadow-[#c23d6a]/20">
                Proceed to Checkout
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}