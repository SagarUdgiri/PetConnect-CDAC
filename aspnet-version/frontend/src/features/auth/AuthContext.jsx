import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import * as authService from '../../services/authService';
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (savedUser && token) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);

    // Add interceptor to handle session expiration or deleted users
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          console.warn('Authentication failed (401).');
          // Optional: Only logout on certain conditions or don't logout automatically to prevent loops
          // logout(); 
        }
        if (error.response?.status === 404 && error.config.url.includes('/api/')) {
           console.warn('API Resource not found (404).');
        }
        return Promise.reject(error);
      }
    );

    return () => axios.interceptors.response.eject(interceptor);
  }, []);

  const login = async (email, password) => {
    try {
      const data = await authService.login(email, password);
      return data;
    } catch (error) {
      console.error('Login Error:', error);
      const message = error.response?.data?.message || error.response?.data || error.message;
      if (error.code === 'ERR_NETWORK') {
        throw new Error(`Cannot connect to backend. Is your .NET server running?`);
      }
      throw new Error(message);
    }
  };

  const verifyOtp = async (email, otp) => {
    try {
      const data = await authService.verifyOtp(email, otp);

      const userData = {
        id: data.userId || data.id,
        username: data.username,
        fullName: data.fullName,
        email: data.email,
        role: data.role,
        imageUrl: data.imageUrl,
        bio: data.bio
      };

      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', data.token);
      
      return userData;
    } catch (error) {
      console.error('OTP Error:', error);
      const message = error.response?.data?.message || 'OTP verification failed';
      if (error.code === 'ERR_NETWORK') {
        throw new Error(`Connection failed. Ensure CORS is enabled on your backend.`);
      }
      throw new Error(message);
    }
  };

  const register = async (userData) => {
    try {
      const data = await authService.register(userData);
      return data;
    } catch (error) {
      console.error('Registration Error:', error);
      const message = error.response?.data?.message || 'Registration failed';
      if (error.code === 'ERR_NETWORK') {
        throw new Error(`Failed to reach backend. Check your network and server.`);
      }
      throw new Error(message);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, login, verifyOtp, register, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
