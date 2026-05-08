import React, { createContext, useContext, useState, useEffect } from 'react';
import { api, setToken, clearAuth, USER_KEY } from '../services/api';

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export default function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(USER_KEY);
    if (stored) {
      try { setUser(JSON.parse(stored)); } catch { clearAuth(); }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const data = await api('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    if (data.user?.role !== 'admin') {
      throw new Error('Access denied. This portal is for admins only.');
    }
    setToken(data.token);
    localStorage.setItem(USER_KEY, JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    api('/auth/logout', { method: 'POST' }).catch(() => {});
    clearAuth();
    setUser(null);
  };

  const value = {
    user,
    loading,
    isAdmin: user?.role === 'admin',
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
