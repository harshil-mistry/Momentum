import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Configure axios defaults
const API_URL = 'http://localhost:3000/api';
axios.defaults.baseURL = API_URL;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(() => {
    return localStorage.getItem('momentum-token');
  });

  // Set up axios interceptor for authorization header
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['x-auth-token'] = token;
    } else {
      delete axios.defaults.headers.common['x-auth-token'];
    }
  }, [token]);

  // Check if user is authenticated on app load
  useEffect(() => {
    const checkAuth = async () => {
      const savedToken = localStorage.getItem('momentum-token');
      if (savedToken) {
        try {
          setToken(savedToken);
          const response = await axios.get('/users/profile');
          setUser(response.data);
        } catch (error) {
          console.error('Auth check failed:', error);
          localStorage.removeItem('momentum-token');
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post('/users/signin', {
        email,
        password
      });

      if (response.data.status === 'success') {
        const { token } = response.data;
        localStorage.setItem('momentum-token', token);
        setToken(token);
        
        // Fetch user profile
        const profileResponse = await axios.get('/users/profile', {
          headers: { 'x-auth-token': token }
        });
        setUser(profileResponse.data);
        
        return { success: true };
      }
    } catch (error) {
      console.error('Login error:', error);
      if (error.response?.data?.errors) {
        return { success: false, errors: error.response.data.errors };
      }
      return { success: false, errors: [{ msg: 'Network error occurred' }] };
    }
  };

  const signup = async (name, email, password) => {
    try {
      const response = await axios.post('/users/signup', {
        name,
        email,
        password
      });

      if (response.data.status === 'success') {
        const { token } = response.data;
        localStorage.setItem('momentum-token', token);
        setToken(token);
        
        // Fetch user profile
        const profileResponse = await axios.get('/users/profile', {
          headers: { 'x-auth-token': token }
        });
        setUser(profileResponse.data);
        
        return { success: true };
      }
    } catch (error) {
      console.error('Signup error:', error);
      if (error.response?.data?.errors) {
        return { success: false, errors: error.response.data.errors };
      }
      return { success: false, errors: [{ msg: 'Network error occurred' }] };
    }
  };

  const logout = () => {
    localStorage.removeItem('momentum-token');
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common['x-auth-token'];
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      isAuthenticated: !!token && !!user,
      login,
      logout,
      signup
    }}>
      {children}
    </AuthContext.Provider>
  );
};
