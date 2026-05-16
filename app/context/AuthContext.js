'use client';
import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast]     = useState(null); // { message, type: 'success'|'error'|'info' }

  useEffect(() => {
    const token     = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  /** Show a toast for `duration` ms then auto-dismiss */
  const showToast = useCallback((message, type = 'success', duration = 3000) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), duration);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    showToast(`You've been logged out. See you soon! 👋`, 'info');
  }, [showToast]);

  /**
   * Call this after a successful login from your login page:
   *   const { loginUser } = useAuth();
   *   loginUser(userData, token);
   */
  const loginUser = useCallback((userData, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    showToast(`Welcome back, ${userData.name || 'there'}! 🎉`, 'success');
  }, [showToast]);

  /**
   * Call this after a successful signup from your signup page:
   *   const { signupUser } = useAuth();
   *   signupUser(userData, token);
   */
  const signupUser = useCallback((userData, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    showToast(`Account created! Welcome, ${userData.name || 'there'}! 🌟`, 'success');
  }, [showToast]);

  return (
    <AuthContext.Provider value={{ user, setUser, logout, loginUser, signupUser, loading, toast, showToast }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);