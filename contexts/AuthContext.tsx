import React, { createContext, useContext, useEffect, useState } from 'react';
import * as api from '../services/userService';

interface User {
  id: string;
  surname: string;
  name: string;
  email: string;
}

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { surname: string; name: string; email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  updateProfile: (body: { surname: string; name: string; email: string }) => Promise<void>;
  deleteAccount: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // initial load
  useEffect(() => {
    (async () => {
      await api.loadToken();
      try {
        const profile = await api.getProfile();
        setUser(profile);
      } catch (e) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    const u = await api.login(email, password);
    setUser(u);
    setLoading(false);
  };

  const register = async (data: { surname: string; name: string; email: string; password: string }) => {
    setLoading(true);
    const u = await api.register(data);
    setUser(u);
    setLoading(false);
  };

  const logout = async () => {
    setLoading(true);
    await api.clearToken();
    setUser(null);
    setLoading(false);
  };

  const refreshProfile = async () => {
    if (!user) return;
    const fresh = await api.getProfile();
    setUser(fresh);
  };

  const updateProfile = async (body: { surname: string; name: string; email: string }) => {
    await api.updateProfile(body);
    await refreshProfile();
  };

  const deleteAccount = async () => {
    await api.deleteAccount();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout, refreshProfile, updateProfile, deleteAccount }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}; 