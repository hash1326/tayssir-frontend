import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import * as authApi from '../api/auth';

const AuthContext = createContext(null);

const _save = (access, refresh, user) => {
  localStorage.setItem('access_token', access);
  localStorage.setItem('refresh_token', refresh);
  localStorage.setItem('user', JSON.stringify(user));
};

const _clear = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('user');
};

const _navigate = (user) => {
  const { role, teacher_profile } = user;
  if (role === 'admin') return '/admin';
  if (role === 'teacher') {
    const approved = teacher_profile?.is_approved;
    return approved ? '/teacher-dashboard' : '/waiting-page';
  }
  return '/student-dashboard';
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore session from localStorage on page load
  useEffect(() => {
    const stored = localStorage.getItem('user');
    const token = localStorage.getItem('access_token');
    if (stored && token) {
      setUser(JSON.parse(stored));
    }
    setLoading(false);
  }, []);

  const _setSession = (access, refresh, userData) => {
    _save(access, refresh, userData);
    setUser(userData);
  };

  // Email/password login
  const login = async (email, password) => {
    try {
      const { data } = await authApi.login(email, password);
      _setSession(data.access, data.refresh, data.user);
      return { success: true, redirect: _navigate(data.user) };
    } catch (err) {
      const msg = err.response?.data?.detail || 'Login failed. Please try again.';
      return { success: false, message: msg };
    }
  };

  // Google Sign-In
  const loginWithGoogle = async (idToken, role = 'student') => {
    try {
      const { data } = await authApi.googleLogin(idToken, role);
      _setSession(data.access, data.refresh, data.user);
      return { success: true, redirect: _navigate(data.user) };
    } catch (err) {
      const msg = err.response?.data?.detail || 'Google login failed.';
      return { success: false, message: msg };
    }
  };

  // Register
  const register = async (userData) => {
    try {
      const { data } = await authApi.register(userData);
      return { success: true, message: data.message };
    } catch (err) {
      const errors = err.response?.data;
      const msg = typeof errors === 'object'
        ? Object.values(errors).flat().join(' ')
        : 'Registration failed.';
      return { success: false, message: msg };
    }
  };

  // Logout
  const logout = useCallback(async () => {
    const refresh = localStorage.getItem('refresh_token');
    try {
      if (refresh) await authApi.logout(refresh);
    } catch (_) {}
    _clear();
    setUser(null);
  }, []);

  // Refresh user data from backend
  const refreshUser = useCallback(async () => {
    try {
      const { data } = await authApi.getMe();
      const stored = { ...JSON.parse(localStorage.getItem('user') || '{}'), ...data };
      localStorage.setItem('user', JSON.stringify(stored));
      setUser(stored);
    } catch (_) {}
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      isAuthenticated: !!user,
      login,
      loginWithGoogle,
      register,
      logout,
      refreshUser,
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
