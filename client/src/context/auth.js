import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// Create the auth context
const AuthContext = createContext();

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    user: null,
    token: localStorage.getItem('token') || null,
    loading: true,
  });

  // Load user on initial render if token exists
  useEffect(() => {
    if (auth.token) {
      loadUser();
    } else {
      setAuth({ ...auth, loading: false });
    }
  }, []);

  // Load user data
  const loadUser = async () => {
    try {
      const { data } = await axios.get('http://localhost:8080/api/v1/auth/user-profile', {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });
      setAuth({
        ...auth,
        user: data.user,
        loading: false,
      });
    } catch (error) {
      console.log('Error loading user:', error);
      localStorage.removeItem('token');
      setAuth({
        user: null,
        token: null,
        loading: false,
      });
    }
  };

  // Login user
  const login = async (userData) => {
    try {
      const { data } = await axios.post('http://localhost:8080/api/v1/auth/login', userData);
      localStorage.setItem('token', data.token);
      setAuth({
        ...auth,
        user: data.user,
        token: data.token,
        loading: false,
      });
      return data;
    } catch (error) {
      console.log('Login error:', error);
      throw error;
    }
  };

  // Logout user
  const logout = () => {
    localStorage.removeItem('token');
    setAuth({
      user: null,
      token: null,
      loading: false,
    });
  };

  // Register user
  const register = async (userData) => {
    try {
      const { data } = await axios.post('http://localhost:8080/api/v1/auth/register', userData);
      return data;
    } catch (error) {
      console.log('Register error:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={[auth, login, logout, register]}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => useContext(AuthContext);

export default AuthContext; 