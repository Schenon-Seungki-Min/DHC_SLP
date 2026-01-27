import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPendingModal, setShowPendingModal] = useState(false);
  const [showRejectedModal, setShowRejectedModal] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    const result = login(username, password);
    
    if (result.success) {
      navigate('/');
    } else if (result.reason === 'pending') {
      setShowPendingModal(true);
    } else if (result.reason === 'rejected') {
      setShowRejectedModal(true);
    } else {
      alert('아이디 또는 비밀번호가 올바르지 않습니다.');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px'
    }}>
      <div style={{
        background: '#ffffff',
        borderRadius: '20px',
        padding: '48px',
        width: '100%',
        maxWidth: '420px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ 
            fontSize: '36px', 
            fontWeight: '700', 
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            margin: '0 0 8px' 
          }}>
            DHC SLP
          </h1>
          <p style={{ color: '#6b7280', fontSize: '14px', margin: 0 }}>영업 관리 시스템</p>
        </div>

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              color: '#6b7280', 
              fontSize: '13px', 
              marginBottom: '8px', 
              display: 'block',
              fontWeight: '500'
            }}>아이디</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="아이디를 입력하세요"
              style={{
                width: '100%',
                background: '#f9fafb',
                border: '1px solid #f3f4f6',
                borderRadius: '10px',
                padding: '14px 16px',
                color: '#111827',
                fontSize: '14px',
                boxSizing: 'border-box',
                transition: 'border-color 0.2s'
              }}
              onFocus={(e) => e.target.style.borderColor = '#667eea'}
              onBlur={(e) => e.target.style.borderColor = '#f3f4f6'}
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ 
              color: '#6b7280', 
              fontSize: '13px', 
              marginBottom: '8px', 
              display: 'block',
              fontWeight: '500'
            }}>비밀번호</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호를 입력하세요"
              style={{
                width: '100%',
                background: '#f9fafb',
                border: '1px solid #f3f4f6',
                borderRadius: '10px',
                padding: '14px 16px',
                color: '#111827',
                fontSize: '14px',
                boxSizing: 'border-box',
                transition: 'border-color 0.2s'
              }}
              onFocus={(e) => e.target.style.borderColor = '#667eea'}
              onBlur={(e) => e.target.style.borderColor = '#f3f4f6'}
            />
          </div>

          <button
            type="submit"
            style={{
              width: '100%',
              padding: '14px',
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              border: 'none',
              borderRadius: '10px',
              color: '#ffffff',
              fontSize: '15px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'transform 0.2s, box-shadow 0.2s',
              marginBottom: '20px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 10px 30px rgba(102, 126, 234, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            로그인
          </button>

          <div style={{ textAlign: 'center' }}>
            <span style={{ color: '#6b7280', fontSize: '14px' }}>계정이 없으신가요?</span>
            {' '}
            <button
              type="button"
              onClick={() => navigate('/signup')}
              style={{
                background: 'none',
                border: 'none',
                color: '#667eea',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                textDecoration: 'underline'
              }}
            >
              회원가입
            </button>
          </div>
        </form>

        {/* 테스트 계정 안내 */}
        <div style={{
          marginTop: '32px',
          padding: '16px',
          background: '#f9fafb',
          borderRadius: '10px',
          fontSize: '12px',
          color: '#6b7280'
        }}>
          <p style={{ margin: '0 0 8px', fontWeight: '600', color: '#111827' }}>테스트 계정</p>
          <p style={{ margin: '0 0 4px' }}>• Master: master / master123</p>
          <p style={{ margin: '0 0 4px' }}>• Admin: admin / admin123</p>
          <p style={{ margin: '0' }}>• User: user / user123</p>
        </div>
      </div>

      {/* 승인 대기 모달 */}
      {showPendingModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: '16px',
            padding: '32px',
            width: '400px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>⏳</div>
            <h3 style={{ margin: '0 0 12px', color: '#111827', fontSize: '20px' }}>
              승인 대기 중
            </h3>
            <p style={{ color: '#6b7280', margin: '0 0 24px', fontSize: '14px', lineHeight: '1.6' }}>
              회원가입 신청이 아직 승인되지 않았습니다.<br/>
              소속 기업 관리자의 승인을 기다려주세요.
            </p>
            <button
              onClick={() => setShowPendingModal(false)}
              style={{
                width: '100%',
                padding: '12px',
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                border: 'none',
                borderRadius: '10px',
                color: '#ffffff',
                fontWeight: '600',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              확인
            </button>
          </div>
        </div>
      )}

      {/* 거절 모달 */}
      {showRejectedModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: '16px',
            padding: '32px',
            width: '400px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>❌</div>
            <h3 style={{ margin: '0 0 12px', color: '#111827', fontSize: '20px' }}>
              가입 신청이 거절되었습니다
            </h3>
            <p style={{ color: '#6b7280', margin: '0 0 24px', fontSize: '14px', lineHeight: '1.6' }}>
              회원가입 신청이 거절되었습니다.<br/>
              자세한 사항은 관리자에게 문의해주세요.
            </p>
            <button
              onClick={() => setShowRejectedModal(false)}
              style={{
                width: '100%',
                padding: '12px',
                background: '#ef4444',
                border: 'none',
                borderRadius: '10px',
                color: '#ffffff',
                fontWeight: '600',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              확인
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
