import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';
import { useNavigate, useLocation } from 'react-router-dom';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const logout = () => {
    // Clear user data
    setUser(null);
    // Remove token from localStorage
    localStorage.removeItem('token');
    // Navigate to login page
    navigate('/login');
  };

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      api.get('/auth/me')
        .then(response => {
          setUser(response.data);
          setLoading(false);
        })
        .catch(error => {
          localStorage.removeItem('token');
          setUser(null);
          setLoading(false);
          if (!['/login', '/register'].includes(location.pathname)) {
            navigate('/login');
          }
        });
    } else {
      setLoading(false);
      if (!['/login', '/register'].includes(location.pathname)) {
        navigate('/register');
      }
    }
  }, [navigate, location.pathname]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;