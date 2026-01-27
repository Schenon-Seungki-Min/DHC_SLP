import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showSignupPopup, setShowSignupPopup] = useState(false);
  const navigate = useNavigate();
  const { user, login } = useAuth();

  // Signup form state
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    companySelect: '', // 드롭다운 선택값
    phone: '',
    email: '',
    password: '',
    passwordConfirm: '',
    address: ''
  });
  const [companies, setCompanies] = useState([]);

  // Load companies from localStorage
  React.useEffect(() => {
    const saved = localStorage.getItem('companies');
    if (saved) {
      setCompanies(JSON.parse(saved));
    }
  }, [showSignupPopup]);
  const [emailVerification, setEmailVerification] = useState({
    sent: false,
    verified: false,
    code: '',
    inputCode: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (login(username, password)) {
      // Check role after login to redirect appropriately
      const savedUser = JSON.parse(localStorage.getItem('user'));
      if (savedUser?.role === 'master') {
        navigate('/master');
      } else {
        navigate('/dashboard');
      }
    } else {
      setError('아이디 또는 비밀번호가 올바르지 않습니다.');
    }
  };

  const handleSendVerification = () => {
    if (!formData.email) {
      alert('이메일 주소를 입력해주세요.');
      return;
    }

    const mockCode = Math.floor(100000 + Math.random() * 900000).toString();
    setEmailVerification({
      ...emailVerification,
      sent: true,
      code: mockCode
    });
    alert('인증 코드가 이메일로 발송되었습니다. (데모용 코드: ' + mockCode + ')');
  };

  const handleVerifyCode = () => {
    if (emailVerification.inputCode === emailVerification.code) {
      setEmailVerification({
        ...emailVerification,
        verified: true
      });
      alert('이메일 인증이 완료되었습니다.');
    } else {
      alert('인증 코드가 올바르지 않습니다.');
    }
  };

  const handleSignup = (e) => {
    e.preventDefault();

    if (!emailVerification.verified) {
      alert('이메일 인증을 완료해주세요.');
      return;
    }

    if (formData.password !== formData.passwordConfirm) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    // 회원 정보를 localStorage에 저장 (승인 대기 상태)
    const finalCompany = formData.companySelect === 'other' ? formData.company : formData.companySelect;
    const newUser = {
      id: Date.now().toString(),
      name: formData.name,
      company: finalCompany,
      phone: formData.phone,
      email: formData.email,
      password: formData.password,
      address: formData.address,
      role: 'user',
      status: 'pending', // 승인 대기
      createdAt: new Date().toISOString()
    };

    // 기존 회원 목록 가져오기
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');

    // 이메일 중복 체크
    if (registeredUsers.some(u => u.email === formData.email)) {
      alert('이미 등록된 이메일입니다.');
      return;
    }

    // 새 회원 추가
    registeredUsers.push(newUser);
    localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));

    alert('회원가입이 완료되었습니다!\n관리자 승인 후 로그인이 가능합니다.');
    setShowSignupPopup(false);
    // Reset form
    setFormData({
      name: '',
      company: '',
      companySelect: '',
      phone: '',
      email: '',
      password: '',
      passwordConfirm: '',
      address: ''
    });
    setEmailVerification({
      sent: false,
      verified: false,
      code: '',
      inputCode: ''
    });
  };

  const inputStyle = {
    width: '100%',
    padding: '14px 16px',
    background: '#f9fafb',
    border: '1px solid #e5e7eb',
    borderRadius: '10px',
    color: '#111827',
    fontSize: '15px',
    boxSizing: 'border-box',
  };

  const signupInputStyle = {
    width: '100%',
    background: '#f9fafb',
    border: '1px solid #f3f4f6',
    borderRadius: '8px',
    padding: '12px 16px',
    color: '#111827',
    fontSize: '14px',
    boxSizing: 'border-box'
  };

  const labelStyle = {
    color: '#6b7280',
    fontSize: '13px',
    marginBottom: '8px',
    display: 'block',
    fontWeight: '500'
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Pretendard', -apple-system, sans-serif" }}>
      <div style={{ background: '#ffffff', padding: '48px', borderRadius: '20px', border: '1px solid #e5e7eb', width: '400px', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#111827', margin: '0 0 8px' }}>병원 영업 관리</h1>
          <p style={{ color: '#6b7280', fontSize: '14px', margin: 0 }}>시스템에 로그인하세요</p>
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

          <button
            type="button"
            onClick={() => setShowSignupPopup(true)}
            style={{ width: '100%', padding: '16px', background: '#ffffff', border: '2px solid #3b82f6', borderRadius: '10px', color: '#3b82f6', fontSize: '16px', fontWeight: '600', cursor: 'pointer', marginTop: '12px' }}
          >
            회원가입
          </button>
        </form>

        <div style={{ marginTop: '32px', padding: '16px', background: '#f9fafb', borderRadius: '12px', fontSize: '13px' }}>
          <p style={{ color: '#6b7280', margin: '0 0 12px', fontWeight: '500' }}>데모 계정:</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', color: '#94a3b8' }}>
            <div>
              <span style={{ color: '#ef4444' }}>Master:</span> master / master123
            </div>
            <div>
              <span style={{ color: '#38bdf8' }}>Admin:</span> admin / admin123
            </div>
            <div>
              <span style={{ color: '#4ade80' }}>User:</span> user / user123
            </div>
          </div>
        </div>
      </div>

      {/* Signup Popup */}
      {showSignupPopup && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#ffffff', borderRadius: '20px', padding: '40px', width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto', position: 'relative', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
            <button onClick={() => setShowSignupPopup(false)} style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', color: '#6b7280', fontSize: '28px', cursor: 'pointer', lineHeight: '1' }}>×</button>

            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <h2 style={{ fontSize: '28px', fontWeight: '700', color: '#111827', margin: '0 0 8px' }}>회원가입</h2>
              <p style={{ color: '#6b7280', fontSize: '14px', margin: 0 }}>DHC SLP 계정을 만드세요</p>
            </div>

            <form onSubmit={handleSignup}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={labelStyle}>이름 *</label>
                  <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="홍길동" style={signupInputStyle} required />
                </div>
                <div>
                  <label style={labelStyle}>소속 기업 *</label>
                  <select
                    value={formData.companySelect}
                    onChange={(e) => setFormData({ ...formData, companySelect: e.target.value, company: '' })}
                    style={signupInputStyle}
                    required
                  >
                    <option value="">선택해주세요</option>
                    {companies.map(c => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                    <option value="other">기타 (직접 입력)</option>
                  </select>
                </div>
              </div>

              {formData.companySelect === 'other' && (
                <div style={{ marginBottom: '16px' }}>
                  <label style={labelStyle}>기업명 입력 *</label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="기업명을 입력하세요"
                    style={signupInputStyle}
                    required
                  />
                </div>
              )}

              <div style={{ marginBottom: '16px' }}>
                <label style={labelStyle}>핸드폰 번호 *</label>
                <input type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder="010-1234-5678" style={signupInputStyle} required />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={labelStyle}>이메일 주소 *</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="example@domain.com" style={{ ...signupInputStyle, flex: 1 }} disabled={emailVerification.verified} required />
                  <button type="button" onClick={handleSendVerification} disabled={emailVerification.verified} style={{ padding: '12px 20px', background: emailVerification.verified ? '#10b981' : '#667eea', border: 'none', borderRadius: '8px', color: '#ffffff', fontSize: '13px', fontWeight: '600', cursor: emailVerification.verified ? 'not-allowed' : 'pointer', whiteSpace: 'nowrap' }}>
                    {emailVerification.verified ? '✓ 인증완료' : '인증코드 발송'}
                  </button>
                </div>
              </div>

              {emailVerification.sent && !emailVerification.verified && (
                <div style={{ marginBottom: '16px' }}>
                  <label style={labelStyle}>인증 코드</label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input type="text" value={emailVerification.inputCode} onChange={(e) => setEmailVerification({ ...emailVerification, inputCode: e.target.value })} placeholder="6자리 인증 코드" style={{ ...signupInputStyle, flex: 1 }} maxLength={6} />
                    <button type="button" onClick={handleVerifyCode} style={{ padding: '12px 20px', background: '#667eea', border: 'none', borderRadius: '8px', color: '#ffffff', fontSize: '13px', fontWeight: '600', cursor: 'pointer', whiteSpace: 'nowrap' }}>인증 확인</button>
                  </div>
                </div>
              )}

              <div style={{ marginBottom: '16px' }}>
                <label style={labelStyle}>직장 주소</label>
                <input type="text" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} placeholder="서울시 강남구" style={signupInputStyle} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                <div>
                  <label style={labelStyle}>비밀번호 *</label>
                  <input type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} placeholder="8자 이상" style={signupInputStyle} required />
                </div>
                <div>
                  <label style={labelStyle}>비밀번호 확인 *</label>
                  <input type="password" value={formData.passwordConfirm} onChange={(e) => setFormData({ ...formData, passwordConfirm: e.target.value })} placeholder="8자 이상" style={signupInputStyle} required />
                </div>
              </div>

              <button type="submit" style={{ width: '100%', padding: '14px', background: 'linear-gradient(135deg, #667eea, #764ba2)', border: 'none', borderRadius: '10px', color: '#ffffff', fontSize: '15px', fontWeight: '600', cursor: 'pointer', transition: 'transform 0.2s' }}>
                회원가입
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
