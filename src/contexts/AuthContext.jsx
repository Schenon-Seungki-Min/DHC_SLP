import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  const login = (username, password) => {
    // Demo credentials
    const users = {
      'admin': { username: 'admin', password: 'admin123', role: 'admin', name: '관리자' },
      'user': { username: 'user', password: 'user123', role: 'user', name: 'A파트너' },
    };

    const foundUser = users[username];
    if (foundUser && foundUser.password === password) {
      const userData = { username: foundUser.username, role: foundUser.role, name: foundUser.name };
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
