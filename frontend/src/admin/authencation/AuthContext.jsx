import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('authToken') || '');
  const [admin, setAdmin] = useState(null);
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
          setAdmin(response.data);
          localStorage.setItem('admin', JSON.stringify(response.data));
        } catch (error) {
          console.error('Failed to fetch user profile:', error);
          // Clear the token and admin if there's an error
          setToken('');
          setAdmin(null);
          localStorage.removeItem('authToken');
          localStorage.removeItem('admin');
        }
      }
      setReady(true);
    };

    fetchUserProfile();
  }, [token]);

  const login = async (newToken) => {
    setToken(newToken);
    localStorage.setItem('authToken', newToken);
    await fetchUserProfile();
  };

  const logout = async () => {
    try {
      await axios.post('http://localhost:5000/admin/logout', {}, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      setToken('');
      setAdmin(null);
      localStorage.removeItem('authToken');
      localStorage.removeItem('admin');
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ token, admin, login, logout, ready }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
