import { create } from 'zustand';

export const useCartStore = create((set, get) => ({
  cart: [],

  // 1. ADD / INCREASE QUANTITY
  addToCart: async (product, user) => {
    const currentCart = get().cart;
    const existing = currentCart.find((item) => item.id === product.id);
    
    let newCart;
    if (existing) {
      newCart = currentCart.map((item) =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      );
    } else {
      newCart = [...currentCart, { ...product, quantity: 1 }];
    }

    set({ cart: newCart });

    if (user) {
      await syncWithDatabase(product.id, 1); // Sync increment
    }
  },

  // 2. UPDATE QUANTITY (Minus or Plus buttons)
  updateQuantity: async (productId, newQty, user) => {
    if (newQty < 1) return;

    const currentCart = get().cart;
    set({
      cart: currentCart.map((item) =>
        item.id === productId ? { ...item, quantity: newQty } : item
      ),
    });

    if (user) {
      // Send the absolute new quantity to the backend
      const token = localStorage.getItem('token');
      await fetch('http://localhost:5000/api/cart/update', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ productId, quantity: newQty }),
      });
    }
  },

  // 3. REMOVE FROM CART
  removeFromCart: async (productId, user) => {
    set({ cart: get().cart.filter((item) => item.id !== productId) });

    if (user) {
      const token = localStorage.getItem('token');
      await fetch(`http://localhost:5000/api/cart/remove/${productId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
    }
  },

  // 4. FETCH CART ON LOGIN
  fetchUserCart: async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const res = await fetch('http://localhost:5000/api/cart', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      // Map DB fields (product_id) to frontend fields (id) if they differ
      const formattedData = data.map(item => ({
        ...item,
        id: item.product_id || item.id 
      }));
      set({ cart: formattedData });
    } catch (err) {
      console.error("Fetch cart error:", err);
    }
  },

  // 5. CLEAR LOCAL CART (On Logout)
  clearCart: () => set({ cart: [] })
}));

// Helper function to keep the code clean
async function syncWithDatabase(productId, change) {
  const token = localStorage.getItem('token');
  if (!token) return;

  await fetch('http://localhost:5000/api/cart/add', {
    method: 'POST',
    headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
    },
    body: JSON.stringify({ productId, quantity: change }),
  });
}