import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // 드롭다운 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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
            {user?.role !== 'master' && (
              <>
                <Link to="/dashboard" style={navStyle('/dashboard')}>내고객</Link>
                <Link to="/all-hospitals" style={navStyle('/all-hospitals')}>전체고객</Link>
                <Link to="/map-planner" style={navStyle('/map-planner')}>콜플랜</Link>
              </>
            )}
            {user?.role === 'admin' && (
              <Link to="/admin" style={navStyle('/admin')}>Admin</Link>
            )}
            {user?.role === 'master' && (
              <Link to="/master" style={navStyle('/master')}>Master</Link>
            )}
          </div>
          <div style={{ position: 'relative' }} ref={dropdownRef}>
            <div
              onClick={() => setShowDropdown(!showDropdown)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                padding: '8px 16px',
                borderRadius: '8px',
                transition: 'background 0.2s',
                background: showDropdown ? '#f3f4f6' : 'transparent'
              }}
              onMouseEnter={(e) => { if (!showDropdown) e.currentTarget.style.background = '#f9fafb' }}
              onMouseLeave={(e) => { if (!showDropdown) e.currentTarget.style.background = 'transparent' }}
            >
              <div style={{ color: '#6b7280', fontSize: '14px' }}>
                <span style={{ color: '#3b82f6', fontWeight: '600' }}>{user?.name}</span>
                <span style={{
                  marginLeft: '8px',
                  padding: '3px 10px',
                  background: user?.role === 'master' ? '#ef4444' : user?.role === 'admin' ? '#3b82f6' : '#e5e7eb',
                  borderRadius: '12px',
                  fontSize: '11px',
                  color: (user?.role === 'master' || user?.role === 'admin') ? '#fff' : '#6b7280',
                  fontWeight: '500'
                }}>
                  {user?.role === 'master' ? 'Master' : user?.role === 'admin' ? 'Admin' : 'User'}
                </span>
              </div>
              <span style={{ fontSize: '12px', color: '#6b7280', transition: 'transform 0.2s', transform: showDropdown ? 'rotate(180deg)' : 'rotate(0deg)' }}>▼</span>
            </div>

            {/* 드롭다운 메뉴 */}
            {showDropdown && (
              <div style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                marginTop: '8px',
                background: '#ffffff',
                border: '1px solid #e5e7eb',
                borderRadius: '12px',
                boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                minWidth: '200px',
                zIndex: 1000,
                overflow: 'hidden'
              }}>
                <button
                  onClick={() => {
                    navigate('/account-settings');
                    setShowDropdown(false);
                  }}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    background: 'none',
                    border: 'none',
                    textAlign: 'left',
                    cursor: 'pointer',
                    fontSize: '14px',
                    color: '#111827',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    transition: 'background 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#f9fafb'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
                >
                  <span>⚙️</span>
                  <span>계정 설정</span>
                </button>
                <div style={{ height: '1px', background: '#e5e7eb' }} />
                <button
                  onClick={() => {
                    handleLogout();
                    setShowDropdown(false);
                  }}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    background: 'none',
                    border: 'none',
                    textAlign: 'left',
                    cursor: 'pointer',
                    fontSize: '14px',
                    color: '#ef4444',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    transition: 'background 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#fef2f2'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
                >
                  <span>🚪</span>
                  <span>로그아웃</span>
                </button>
              </div>
            )}
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
