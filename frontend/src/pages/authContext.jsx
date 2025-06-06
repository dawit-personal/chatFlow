// authContext.js
import { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  // Initialize with token from localStorage if available
  const [accessToken, setAccessTokenState] = useState(() => {
    try {
      return localStorage.getItem('accessToken');
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return null;
    }
  });

  // Custom setter that updates both state and localStorage
  const setAccessToken = (token) => {
    try {
      if (token) {
        localStorage.setItem('accessToken', token);
        setAccessTokenState(token);
      } else {
        localStorage.removeItem('accessToken');
        setAccessTokenState(null);
      }
    } catch (error) {
      console.error('Error writing to localStorage:', error);
      setAccessTokenState(token);
    }
  };

  // Clear token on storage events (logout from another tab)
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'accessToken') {
        setAccessTokenState(e.newValue);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <AuthContext.Provider value={{ accessToken, setAccessToken }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
