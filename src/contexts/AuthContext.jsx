import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

// Mock 기업 목록
export const companies = [
  { id: 'dhc', name: '(주)DHC', adminId: 'admin' },
  { id: 'sleepq', name: 'Sleepq', adminId: 'admin2' },
  { id: 'pharma', name: '파마코리아', adminId: 'admin3' },
];

export const AuthProvider = ({ children }) => {
  // 기존 유저 (approved)
  const [users, setUsers] = useState({
    'master': { username: 'master', password: 'master123', role: 'master', name: 'Master', status: 'approved', company: null },
    'admin': { username: 'admin', password: 'admin123', role: 'admin', name: '관리자', status: 'approved', company: 'dhc' },
    'admin2': { username: 'admin2', password: 'admin123', role: 'admin', name: 'Sleepq관리자', status: 'approved', company: 'sleepq' },
    'user': { username: 'user', password: 'user123', role: 'user', name: 'A파트너', status: 'approved', company: 'dhc' },
  });

  // 회원가입 신청 목록 (pending)
  const [pendingUsers, setPendingUsers] = useState([
    { id: 1, email: 'kim@dhc.kr', name: '김영업', phone: '010-1111-2222', company: 'dhc', password: 'test123', status: 'pending', createdAt: '2025-01-25' },
    { id: 2, email: 'lee@dhc.kr', name: '이판매', phone: '010-3333-4444', company: 'dhc', password: 'test123', status: 'pending', createdAt: '2025-01-26' },
    { id: 3, email: 'park@sleepq.kr', name: '박신입', phone: '010-5555-6666', company: 'sleepq', password: 'test123', status: 'pending', createdAt: '2025-01-27' },
  ]);

  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  const login = (username, password) => {
    const foundUser = users[username];
    
    if (foundUser && foundUser.password === password) {
      if (foundUser.status === 'pending') {
        return { success: false, reason: 'pending' };
      }
      if (foundUser.status === 'rejected') {
        return { success: false, reason: 'rejected' };
      }
      const userData = { 
        username: foundUser.username, 
        role: foundUser.role, 
        name: foundUser.name,
        company: foundUser.company
      };
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      return { success: true };
    }
    return { success: false, reason: 'invalid' };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  // 회원가입 신청
  const signup = (userData) => {
    const newPending = {
      id: Date.now(),
      ...userData,
      status: 'pending',
      createdAt: new Date().toISOString().split('T')[0]
    };
    setPendingUsers(prev => [...prev, newPending]);
    return { success: true };
  };

  // Admin: 자기 회사의 pending 유저 목록 가져오기
  const getPendingUsers = (companyId) => {
    if (!companyId) return pendingUsers; // master는 전체
    return pendingUsers.filter(u => u.company === companyId);
  };

  // Admin: 승인
  const approveUser = (pendingId) => {
    const pending = pendingUsers.find(u => u.id === pendingId);
    if (!pending) return false;

    // users에 추가
    const newUsername = pending.email.split('@')[0];
    setUsers(prev => ({
      ...prev,
      [newUsername]: {
        username: newUsername,
        password: pending.password,
        role: 'user',
        name: pending.name,
        status: 'approved',
        company: pending.company
      }
    }));

    // pendingUsers에서 제거
    setPendingUsers(prev => prev.filter(u => u.id !== pendingId));
    return true;
  };

  // Admin: 거절
  const rejectUser = (pendingId) => {
    setPendingUsers(prev => prev.filter(u => u.id !== pendingId));
    return true;
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      users,
      login, 
      logout, 
      signup,
      pendingUsers,
      getPendingUsers,
      approveUser,
      rejectUser,
      companies
    }}>
      {children}
    </AuthContext.Provider>
  );
};
