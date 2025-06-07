// authContext.js
import { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

// Helper function to decode JWT (simple base64 decode)
const decodeJWT = (token) => {
  try {
    if (!token) return null;
    const payload = token.split('.')[1];
    const decoded = JSON.parse(atob(payload));
    return decoded;
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
};

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

  // Decode user information from token
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem('accessToken');
    return decodeJWT(token);
  });

  // Custom setter that updates both state and localStorage
  const setAccessToken = (token) => {
    try {
      if (token) {
        localStorage.setItem('accessToken', token);
        setAccessTokenState(token);
        setUser(decodeJWT(token));
      } else {
        localStorage.removeItem('accessToken');
        setAccessTokenState(null);
        setUser(null);
      }
    } catch (error) {
      console.error('Error writing to localStorage:', error);
      setAccessTokenState(token);
      setUser(decodeJWT(token));
    }
  };

  // Clear token on storage events (logout from another tab)
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'accessToken') {
        setAccessTokenState(e.newValue);
        setUser(decodeJWT(e.newValue));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <AuthContext.Provider value={{ accessToken, setAccessToken, user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
