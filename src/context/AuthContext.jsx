import React, { createContext, useState, useEffect, useContext } from 'react';
import axiosClient from '../api/axiosClient';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user credentials exist in local storage on app bootstrap
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await axiosClient.post('/auth/login', { email, password });
      const { token, id, name, role } = response.data;
      
      const userData = { id, name, email, role };
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      return response.data;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password) => {
    setLoading(true);
    try {
      const response = await axiosClient.post('/auth/register', { name, email, password });
      return response.data;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await axiosClient.post('/auth/logout');
    } catch (e) {
      console.error("Logout request error", e);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
    }
  };

  const forgotPassword = async (email) => {
    const response = await axiosClient.post('/auth/forgot-password', { email });
    return response.data;
  };

  const resetPassword = async (email, token, newPassword) => {
    const response = await axiosClient.post('/auth/reset-password', { email, token, newPassword });
    return response.data;
  };

  const changePassword = async (oldPassword, newPassword) => {
    const response = await axiosClient.post('/auth/change-password', { oldPassword, newPassword });
    return response.data;
  };

  const getProfile = async () => {
    const response = await axiosClient.get('/auth/profile');
    return response.data;
  };

  const isAuthenticated = () => !!user;

  return (
    <ThemeContextWrapper>
      <AuthContext.Provider
        value={{
          user,
          loading,
          login,
          register,
          logout,
          forgotPassword,
          resetPassword,
          changePassword,
          getProfile,
          isAuthenticated,
        }}
      >
        {children}
      </AuthContext.Provider>
    </ThemeContextWrapper>
  );
};

// Help helper wrapper to prevent import dependencies circular referencing
const ThemeContextWrapper = ({ children }) => <>{children}</>;

export const useAuth = () => useContext(AuthContext);
