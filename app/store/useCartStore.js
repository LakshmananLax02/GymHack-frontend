import { create } from 'zustand';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// Helper — read JWT from localStorage (only on client)
const getToken = () => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
};

// Helper — authed fetch wrapper
async function callApi(path, options = {}) {
  const token = getToken();
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `API ${res.status}`);
  }
  return res.json();
}

// Postgres NUMERIC comes back as strings — normalize to numbers
const normalizeCart = (cart) =>
  (cart || []).map((item) => ({
    ...item,
    id:       Number(item.id),
    price:    Number(item.price),
    quantity: Number(item.quantity),
  }));

export const useCartStore = create((set, get) => ({
  cart: [],
  loading: false,

  // ─── 1. ADD / INCREMENT ─────────────────────────────────────────────────
  addToCart: async (product) => {
    const previousCart = get().cart;
    const existing = previousCart.find((item) => item.id === product.id);

    // Optimistic update for instant UI feedback
    const optimisticCart = existing
      ? previousCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      : [...previousCart, { ...product, quantity: 1 }];
    set({ cart: optimisticCart });

    // Sync to backend if logged in
    if (!getToken()) return;

    try {
      const data = await callApi('/api/cart/add', {
        method: 'POST',
        body: JSON.stringify({
          productId: product.id,
          name:      product.name,
          price:     product.price,
          image:     product.image,
          quantity:  1,
        }),
      });
      // Server returns the full cart — use it as source of truth
      if (data?.cart) set({ cart: normalizeCart(data.cart) });
    } catch (err) {
      console.error('addToCart sync failed:', err);
      set({ cart: previousCart }); // rollback
    }
  },

  // ─── 2. UPDATE QUANTITY ─────────────────────────────────────────────────
  updateQuantity: async (productId, newQty) => {
    if (newQty < 1) return;

    const previousCart = get().cart;
    set({
      cart: previousCart.map((item) =>
        item.id === productId ? { ...item, quantity: newQty } : item
      ),
    });

    if (!getToken()) return;

    try {
      const data = await callApi('/api/cart/update', {
        method: 'PUT',
        body:   JSON.stringify({ productId, quantity: newQty }),
      });
      if (data?.cart) set({ cart: normalizeCart(data.cart) });
    } catch (err) {
      console.error('updateQuantity sync failed:', err);
      set({ cart: previousCart });
    }
  },

  // ─── 3. REMOVE ITEM ─────────────────────────────────────────────────────
  removeFromCart: async (productId) => {
    const previousCart = get().cart;
    set({ cart: previousCart.filter((item) => item.id !== productId) });

    if (!getToken()) return;

    try {
      const data = await callApi(`/api/cart/remove/${productId}`, {
        method: 'DELETE',
      });
      if (data?.cart) set({ cart: normalizeCart(data.cart) });
    } catch (err) {
      console.error('removeFromCart sync failed:', err);
      set({ cart: previousCart });
    }
  },

  // ─── 4. FETCH CART FROM SERVER (call on login / page load) ──────────────
  fetchUserCart: async () => {
    if (!getToken()) return;
    set({ loading: true });
    try {
      const data = await callApi('/api/cart');
      set({ cart: normalizeCart(data), loading: false });
    } catch (err) {
      console.error('fetchUserCart error:', err);
      set({ loading: false });
    }
  },

  // ─── 5. CLEAR LOCAL CART (used on logout, no API call) ──────────────────
  clearLocalCart: () => set({ cart: [] }),

  // ─── 6. CLEAR CART ON SERVER (used after checkout) ──────────────────────
  clearCart: async () => {
    const previousCart = get().cart;
    set({ cart: [] });
    if (!getToken()) return;
    try {
      await callApi('/api/cart/clear', { method: 'DELETE' });
    } catch (err) {
      console.error('clearCart sync failed:', err);
      set({ cart: previousCart });
    }
  },
}));