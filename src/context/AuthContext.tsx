"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../lib/api';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  email: string;
  role: string;
  isVerified: boolean;
  profile?: {
    name: string;
    photo?: string;
  };
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (data: any) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => {},
  register: async () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if user exists in localStorage on initial load
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('accessToken');
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (credentials: any) => {
    const res = await api.post('/auth/login', credentials);
    const { accessToken, user } = res.data.data;
    
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('user', JSON.stringify(user));
    setUser(user);
    router.push('/');
  };

  const register = async (userData: any) => {
    const res = await api.post('/auth/register', userData);
    const { accessToken, user } = res.data.data;
    
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('user', JSON.stringify(user));
    setUser(user);
    router.push('/onboarding');
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    setUser(null);
    router.push('/');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
