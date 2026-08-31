// AuthContext — holds user state, access token (in memory), and auth methods.
import { createContext, useState, useEffect, useCallback } from 'react';
import authService from '../services/authService';
import axiosInstance from '../api/axiosInstance';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // true while checking existing session

  // Set the access token on the axios instance (in-memory, not localStorage)
  const setAccessToken = useCallback((token) => {
    axiosInstance.accessToken = token;
  }, []);

  // Attempt silent refresh on app load to restore session from httpOnly cookie
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const data = await authService.refresh();
        setAccessToken(data.accessToken);
        setUser(data.user);
      } catch {
        // No valid refresh cookie — user stays logged out
        setUser(null);
        setAccessToken(null);
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, [setAccessToken]);

  // Listen for forced logout from axios interceptor
  useEffect(() => {
    const handleForcedLogout = () => {
      setUser(null);
      setAccessToken(null);
    };

    window.addEventListener('auth:logout', handleForcedLogout);
    return () => window.removeEventListener('auth:logout', handleForcedLogout);
  }, [setAccessToken]);

  const login = async (email, password) => {
    const data = await authService.login(email, password);
    setAccessToken(data.accessToken);
    setUser(data.user);
    return data;
  };

  const register = async (name, email, password) => {
    const data = await authService.register(name, email, password);
    setAccessToken(data.accessToken);
    setUser(data.user);
    return data;
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch {
      // Ignore errors — clear local state anyway
    } finally {
      setUser(null);
      setAccessToken(null);
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
