import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  const navStyle = (path) => ({
    padding: '10px 20px',
    background: isActive(path) ? '#3b82f6' : 'transparent',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    color: isActive(path) ? '#fff' : '#6b7280',
    textDecoration: 'none',
    fontSize: '14px',
    transition: 'all 0.2s',
  });

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb', fontFamily: "'Pretendard', -apple-system, sans-serif", color: '#111827' }}>
      {/* Top Navigation */}
      <nav style={{ background: '#ffffff', borderBottom: '1px solid #e5e7eb', padding: '16px 32px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '700', color: '#111827', marginRight: '24px' }}>병원 영업 관리 시스템</h2>
            <Link to="/dashboard" style={navStyle('/dashboard')}>캔버스 1</Link>
            <Link to="/all-hospitals" style={navStyle('/all-hospitals')}>캔버스 2</Link>
            <Link to="/map-planner" style={navStyle('/map-planner')}>캔버스 3</Link>
            {user?.role === 'admin' && (
              <Link to="/admin" style={navStyle('/admin')}>Admin</Link>
            )}
          </div>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <div style={{ color: '#6b7280', fontSize: '14px' }}>
              <span style={{ color: '#3b82f6', fontWeight: '600' }}>{user?.name}</span>
              <span style={{ marginLeft: '8px', padding: '3px 10px', background: user?.role === 'admin' ? '#3b82f6' : '#e5e7eb', borderRadius: '12px', fontSize: '11px', color: user?.role === 'admin' ? '#fff' : '#6b7280', fontWeight: '500' }}>
                {user?.role === 'admin' ? 'Admin' : 'User'}
              </span>
            </div>
            <button onClick={handleLogout} style={{ padding: '8px 16px', background: 'transparent', border: '1px solid #ef4444', borderRadius: '8px', color: '#ef4444', cursor: 'pointer', fontSize: '14px', fontWeight: '500' }}>
              로그아웃
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main>
        {children}
      </main>
    </div>
  );
}
