'use client';
import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useCartStore } from '../store/useCartStore';   // ← add this import

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast]     = useState(null);

  const toastTimerRef = useRef(null);

  // ── Hydrate user + cart on mount (page refresh) ──────────────────────
  useEffect(() => {
    const token     = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
      useCartStore.getState().fetchUserCart();   // ✅ load cart from DB
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
  }, []);

  const showToast = useCallback((message, type = 'success', duration = 3000) => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToast({ message, type });
    toastTimerRef.current = setTimeout(() => {
      setToast(null);
      toastTimerRef.current = null;
    }, duration);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    useCartStore.getState().clearLocalCart();    // ✅ empty cart on logout
    showToast(`You've been logged out. See you soon! 👋`, 'info');
  }, [showToast]);

  const loginUser = useCallback((userData, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    useCartStore.getState().fetchUserCart();     // ✅ pull saved cart from DB
    showToast(`Welcome back, ${userData.name || 'there'}! 🎉`, 'success');
  }, [showToast]);

  const signupUser = useCallback((userData, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    useCartStore.getState().fetchUserCart();     // ✅ (new users will get [])
    showToast(`Account created! Welcome, ${userData.name || 'there'}! 🌟`, 'success');
  }, [showToast]);

  return (
    <AuthContext.Provider
      value={{ user, setUser, logout, loginUser, signupUser, loading, toast, showToast }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);