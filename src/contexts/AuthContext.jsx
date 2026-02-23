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
    // Demo credentials (master, admin)
    const demoUsers = {
      'master': { username: 'master', password: 'master123', role: 'master', name: 'Master' },
      'admin': { username: 'admin', password: 'admin123', role: 'admin', name: '관리자' },
    };

    // 데모 계정 체크
    const demoUser = demoUsers[username];
    if (demoUser && demoUser.password === password) {
      const userData = { username: demoUser.username, role: demoUser.role, name: demoUser.name };
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      return true;
    }

    // 등록된 회원 체크
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    const registeredUser = registeredUsers.find(u => u.email === username && u.password === password);

    if (registeredUser) {
      // 승인 상태 체크
      if (registeredUser.status === 'pending') {
        alert('관리자 승인 대기 중입니다. 승인 후 로그인이 가능합니다.');
        return false;
      }
      if (registeredUser.status === 'rejected') {
        alert('회원가입이 거부되었습니다. 관리자에게 문의하세요.');
        return false;
      }
      if (registeredUser.status === 'approved') {
        const userData = {
          username: registeredUser.email,
          role: registeredUser.role,
          name: registeredUser.name,
          company: registeredUser.company
        };
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        return true;
      }
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
