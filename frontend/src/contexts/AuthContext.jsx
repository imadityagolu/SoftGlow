import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userType, setUserType] = useState(null); // 'admin' or 'customer'
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  // Check if user is authenticated on app load
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    const storedUserType = localStorage.getItem('userType');

    if (storedToken && storedUser && storedUserType) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      setUserType(storedUserType);
    }
    setLoading(false);
  }, []);

  const login = (userData, authToken, type) => {
    setUser(userData);
    setToken(authToken);
    setUserType(type);
    
    // Store in localStorage
    localStorage.setItem('token', authToken);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('userType', type);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setUserType(null);
    
    // Remove from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userType');
  };

  const isAuthenticated = () => {
    return !!token && !!user;
  };

  const isAdmin = () => {
    return userType === 'admin' && isAuthenticated();
  };

  const isCustomer = () => {
    return userType === 'customer' && isAuthenticated();
  };

  const value = {
    user,
    token,
    userType,
    loading,
    login,
    logout,
    isAuthenticated,
    isAdmin,
    isCustomer
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;