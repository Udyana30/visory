'use client';

import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import authService from '../services/authService';
import { User, LoginCredentials, RegisterData } from '../types/auth';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials, autoRedirect?: boolean) => Promise<{ success: boolean; message?: string }>;
  register: (data: RegisterData, autoRedirect?: boolean) => Promise<{ success: boolean; message?: string }>;
  googleLogin: (token: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  updateUser: (user: User) => void;
  isAuthenticated: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    try {
      const token = authService.getToken();
      const currentUser = authService.getCurrentUser();

      if (token && currentUser) {
        setUser(currentUser);
      }
    } catch (err) {
      console.error('Auth initialization error:', err);
      setError('Failed to initialize authentication');
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (credentials: LoginCredentials, autoRedirect: boolean = true) => {
    try {
      setLoading(true);
      setError(null);

      const response = await authService.login(credentials);
      if (response.user) {
        setUser(response.user);
        if (autoRedirect) {
          router.push('/home');
        }
        return { success: true };
      }

      return { success: false, message: 'Login failed' };
    } catch (err: any) {
      const message = err.response?.data?.message || 'Login failed. Please try again.';
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: RegisterData, autoRedirect: boolean = true) => {
    try {
      setLoading(true);
      setError(null);

      const response = await authService.register(data);
      if (response.user) {
        setUser(response.user);
        if (autoRedirect) {
          router.push('/login');
        }
        return { success: true };
      }

      return { success: false, message: 'Registration failed' };
    } catch (err: any) {
      const message = err.response?.data?.message || 'Registration failed. Please try again.';
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const googleLogin = async (token: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await authService.googleLogin(token);
      
      if (response.user) {
        setUser(response.user);
        return { success: true };
      }

      return { success: false, message: 'Google login failed' };
    } catch (err: any) {
      const message = err.response?.data?.message || 'Google login failed.';
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    router.push('/login');
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const value: AuthContextType = {
    user,
    loading,
    error,
    login,
    register,
    googleLogin,
    logout,
    updateUser,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};