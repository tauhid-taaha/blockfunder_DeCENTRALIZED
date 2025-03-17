import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      // Check if the user is already logged in
      const auth = localStorage.getItem('auth');
      if (auth) {
        const parsedAuth = JSON.parse(auth);
        setUser(parsedAuth.user);
        setToken(parsedAuth.token);
      }
    } catch (err) {
      console.error('Error checking auth state:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    setAuthLoading(true);
    setError(null);
    try {
      const response = await axios.post('http://localhost:8080/api/v1/auth/login', {
        email,
        password
      });
      
      if (response.data.success) {
        const { token: newToken, user: newUser } = response.data;
        localStorage.setItem('auth', JSON.stringify({ user: newUser, token: newToken }));
        setUser(newUser);
        setToken(newToken);
        return newUser;
      } else {
        throw new Error(response.data.message || 'Login failed');
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Login failed');
      throw error.response?.data?.message || 'Login failed';
    } finally {
      setAuthLoading(false);
    }
  };

  const register = async (name, email, password, phone, address, answer) => {
    setAuthLoading(true);
    setError(null);
    try {
      const response = await axios.post('http://localhost:8080/api/v1/auth/register', {
        name,
        email,
        password,
        phone,
        address,
        answer
      });
      
      if (response.data.success) {
        return { success: true, message: response.data.message };
      } else {
        throw new Error(response.data.message || 'Registration failed');
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Registration failed');
      throw error.response?.data?.message || 'Registration failed';
    } finally {
      setAuthLoading(false);
    }
  };

  const logout = () => {
    setAuthLoading(true);
    try {
      localStorage.removeItem('auth');
      setUser(null);
      setToken(null);
    } catch (err) {
      console.error('Error during logout:', err);
      setError(err.message);
    } finally {
      setAuthLoading(false);
    }
  };

  const value = {
    user,
    token,
    loading,
    authLoading,
    error,
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 