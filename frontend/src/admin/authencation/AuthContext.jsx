import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('authToken') || '');
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (token) {
        try {
          const response = await axios.get('http://localhost:5000/api/admin/profile', {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
          setUser(response.data);
          localStorage.setItem('user', JSON.stringify(response.data));
        } catch (error) {
          console.error('Failed to fetch user profile:', error);
        }
      }
      setReady(true);
    };

    fetchUserProfile();
  }, [token]);

  const login = (newToken) => {
    setToken(newToken);
    localStorage.setItem('authToken', newToken);
    fetchUserProfile();
  };

  const logout = async () => {
    try {
      await axios.post('http://localhost:5000/admin/logout');
      setToken('');
      setUser(null);
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  const fetchUserProfile = async () => {
    if (token) {
      try {
        const response = await axios.get('http://localhost:5000/api/admin/profile', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        setUser(response.data);
        localStorage.setItem('user', JSON.stringify(response.data));
      } catch (error) {
        console.error('Failed to fetch user profile:', error);
      }
    }
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout, ready }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
