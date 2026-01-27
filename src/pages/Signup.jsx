import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, companies } from '../contexts/AuthContext';

export default function Signup() {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    phone: '',
    email: '',
    password: '',
    passwordConfirm: '',
    address: ''
  });
  const [emailVerification, setEmailVerification] = useState({
    sent: false,
    verified: false,
    code: '',
    inputCode: ''
  });
  const [signupComplete, setSignupComplete] = useState(false);

  const inputStyle = {
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

    if (!formData.company) {
      alert('소속 기업을 선택해주세요.');
      return;
    }

    if (formData.password !== formData.passwordConfirm) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    if (formData.password.length < 6) {
      alert('비밀번호는 6자 이상이어야 합니다.');
      return;
    }

    // 회원가입 신청
    const result = signup({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      company: formData.company,
      password: formData.password,
      address: formData.address
    });

    if (result.success) {
      setSignupComplete(true);
    }
  };

  // 회원가입 완료 화면 (승인 대기)
  if (signupComplete) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '40px 20px'
      }}>
        <div style={{
          background: '#ffffff',
          borderRadius: '20px',
          padding: '48px',
          width: '100%',
          maxWidth: '500px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '64px', marginBottom: '24px' }}>⏳</div>
          <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#111827', margin: '0 0 16px' }}>
            회원가입 신청 완료
          </h1>
          <p style={{ color: '#6b7280', fontSize: '15px', lineHeight: '1.6', margin: '0 0 32px' }}>
            회원가입 신청이 완료되었습니다.<br/>
            소속 기업 관리자의 <strong style={{ color: '#667eea' }}>승인 후</strong> 로그인이 가능합니다.<br/>
            승인까지 1~2 영업일 소요될 수 있습니다.
          </p>
          <div style={{
            background: '#f3f4f6',
            borderRadius: '12px',
            padding: '20px',
            marginBottom: '32px'
          }}>
            <p style={{ margin: '0 0 8px', color: '#6b7280', fontSize: '13px' }}>신청 정보</p>
            <p style={{ margin: '0', color: '#111827', fontWeight: '600' }}>
              {formData.name} ({formData.email})
            </p>
            <p style={{ margin: '4px 0 0', color: '#6b7280', fontSize: '14px' }}>
              {companies.find(c => c.id === formData.company)?.name}
            </p>
          </div>
          <button
            onClick={() => navigate('/login')}
            style={{
              width: '100%',
              padding: '14px',
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              border: 'none',
              borderRadius: '10px',
              color: '#ffffff',
              fontSize: '15px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            로그인 페이지로 이동
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '40px 20px'
    }}>
      <div style={{
        background: '#ffffff',
        borderRadius: '20px',
        padding: '48px',
        width: '100%',
        maxWidth: '600px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: '700', color: '#111827', margin: '0 0 8px' }}>회원가입</h1>
          <p style={{ color: '#6b7280', fontSize: '14px', margin: 0 }}>DHC SLP 계정을 만드세요</p>
        </div>

        {/* 승인 안내 배너 */}
        <div style={{
          background: '#fef3c7',
          border: '1px solid #f59e0b',
          borderRadius: '12px',
          padding: '16px',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '12px'
        }}>
          <span style={{ fontSize: '20px' }}>⚠️</span>
          <div>
            <p style={{ margin: '0 0 4px', fontWeight: '600', color: '#92400e', fontSize: '14px' }}>
              관리자 승인 필요
            </p>
            <p style={{ margin: 0, color: '#a16207', fontSize: '13px' }}>
              회원가입 후 소속 기업 관리자의 승인을 받아야 로그인할 수 있습니다.
            </p>
          </div>
        </div>

        <form onSubmit={handleSignup}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label style={labelStyle}>이름 *</label>
              <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="홍길동" style={inputStyle} required />
            </div>
            <div>
              <label style={labelStyle}>소속 기업 *</label>
              <select 
                value={formData.company} 
                onChange={(e) => setFormData({ ...formData, company: e.target.value })} 
                style={{...inputStyle, cursor: 'pointer'}}
                required
              >
                <option value="">선택하세요</option>
                {companies.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={labelStyle}>핸드폰 번호 *</label>
            <input type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder="010-1234-5678" style={inputStyle} required />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={labelStyle}>이메일 주소 *</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="example@domain.com" style={{ ...inputStyle, flex: 1 }} disabled={emailVerification.verified} required />
              <button type="button" onClick={handleSendVerification} disabled={emailVerification.verified} style={{ padding: '12px 20px', background: emailVerification.verified ? '#10b981' : '#667eea', border: 'none', borderRadius: '8px', color: '#ffffff', fontSize: '13px', fontWeight: '600', cursor: emailVerification.verified ? 'not-allowed' : 'pointer', whiteSpace: 'nowrap' }}>
                {emailVerification.verified ? '✓ 인증완료' : '인증코드 발송'}
              </button>
            </div>
          </div>

          {emailVerification.sent && !emailVerification.verified && (
            <div style={{ marginBottom: '16px' }}>
              <label style={labelStyle}>인증 코드</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input type="text" value={emailVerification.inputCode} onChange={(e) => setEmailVerification({ ...emailVerification, inputCode: e.target.value })} placeholder="6자리 인증 코드" style={{ ...inputStyle, flex: 1 }} maxLength={6} />
                <button type="button" onClick={handleVerifyCode} style={{ padding: '12px 20px', background: '#667eea', border: 'none', borderRadius: '8px', color: '#ffffff', fontSize: '13px', fontWeight: '600', cursor: 'pointer', whiteSpace: 'nowrap' }}>인증 확인</button>
              </div>
            </div>
          )}

          <div style={{ marginBottom: '16px' }}>
            <label style={labelStyle}>직장 주소</label>
            <input type="text" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} placeholder="서울시 강남구" style={inputStyle} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
            <div>
              <label style={labelStyle}>비밀번호 *</label>
              <input type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} placeholder="6자 이상" style={inputStyle} required />
            </div>
            <div>
              <label style={labelStyle}>비밀번호 확인 *</label>
              <input type="password" value={formData.passwordConfirm} onChange={(e) => setFormData({ ...formData, passwordConfirm: e.target.value })} placeholder="6자 이상" style={inputStyle} required />
            </div>
          </div>

          <button type="submit" style={{ width: '100%', padding: '14px', background: 'linear-gradient(135deg, #667eea, #764ba2)', border: 'none', borderRadius: '10px', color: '#ffffff', fontSize: '15px', fontWeight: '600', cursor: 'pointer', marginBottom: '16px', transition: 'transform 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>회원가입 신청</button>

          <div style={{ textAlign: 'center' }}>
            <span style={{ color: '#6b7280', fontSize: '14px' }}>이미 계정이 있으신가요?</span>
            {' '}
            <button type="button" onClick={() => navigate('/login')} style={{ background: 'none', border: 'none', color: '#667eea', fontSize: '14px', fontWeight: '600', cursor: 'pointer', textDecoration: 'underline' }}>로그인</button>
          </div>
        </form>
      </div>
    </div>
  );
}
