import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (login(username, password)) {
      navigate('/dashboard');
    } else {
      setError('아이디 또는 비밀번호가 올바르지 않습니다.');
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '14px 16px',
    background: '#0f172a',
    border: '1px solid #334155',
    borderRadius: '10px',
    color: '#e2e8f0',
    fontSize: '15px',
    boxSizing: 'border-box',
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Pretendard', -apple-system, sans-serif" }}>
      <div style={{ background: '#1e293b', padding: '48px', borderRadius: '20px', border: '1px solid #334155', width: '400px', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#f8fafc', margin: '0 0 8px' }}>병원 영업 관리</h1>
          <p style={{ color: '#64748b', fontSize: '14px', margin: 0 }}>시스템에 로그인하세요</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', color: '#94a3b8', fontSize: '13px', marginBottom: '8px', fontWeight: '500' }}>아이디</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="아이디를 입력하세요"
              style={inputStyle}
              required
            />
          </div>

          <div>
            <label style={{ display: 'block', color: '#94a3b8', fontSize: '13px', marginBottom: '8px', fontWeight: '500' }}>비밀번호</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호를 입력하세요"
              style={inputStyle}
              required
            />
          </div>

          {error && (
            <div style={{ background: '#7f1d1d', border: '1px solid #ef4444', borderRadius: '8px', padding: '12px', color: '#fca5a5', fontSize: '13px' }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            style={{ width: '100%', padding: '16px', background: 'linear-gradient(135deg, #3b82f6, #2563eb)', border: 'none', borderRadius: '10px', color: '#fff', fontSize: '16px', fontWeight: '600', cursor: 'pointer', marginTop: '8px' }}
          >
            로그인
          </button>
        </form>

        <div style={{ marginTop: '32px', padding: '16px', background: '#0f172a', borderRadius: '12px', fontSize: '13px' }}>
          <p style={{ color: '#64748b', margin: '0 0 12px', fontWeight: '500' }}>데모 계정:</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', color: '#94a3b8' }}>
            <div>
              <span style={{ color: '#38bdf8' }}>Admin:</span> admin / admin123
            </div>
            <div>
              <span style={{ color: '#4ade80' }}>User:</span> user / user123
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
