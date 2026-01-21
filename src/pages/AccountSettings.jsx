import React, { useState, useEffect } from 'react';

export default function AccountSettings() {
  const [userData, setUserData] = useState(() => {
    const saved = localStorage.getItem('userAccount');
    return saved ? JSON.parse(saved) : {
      name: '홍길동',
      company: '(주)DHC',
      phone: '010-1234-5678',
      email: 'hong@example.com',
      address: '서울시 강남구'
    };
  });

  // localStorage에 사용자 정보 저장
  useEffect(() => {
    localStorage.setItem('userAccount', JSON.stringify(userData));
  }, [userData]);

  const [editMode, setEditMode] = useState({
    phone: false,
    email: false
  });

  const [tempData, setTempData] = useState({
    phone: '',
    email: ''
  });

  const [emailVerification, setEmailVerification] = useState({
    sent: false,
    verified: false,
    code: '',
    inputCode: ''
  });

  const [changeType, setChangeType] = useState(null);

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

  const handleStartEdit = (type) => {
    setChangeType(type);
    setEditMode({ ...editMode, [type]: true });
    setTempData({ ...tempData, [type]: userData[type] });
    setEmailVerification({
      sent: false,
      verified: false,
      code: '',
      inputCode: ''
    });
  };

  const handleCancelEdit = (type) => {
    setEditMode({ ...editMode, [type]: false });
    setTempData({ ...tempData, [type]: '' });
    setEmailVerification({
      sent: false,
      verified: false,
      code: '',
      inputCode: ''
    });
    setChangeType(null);
  };

  const handleSendVerification = () => {
    if (!changeType) return;

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

  const handleSaveChange = (type) => {
    if (!emailVerification.verified) {
      alert('이메일 인증을 완료해주세요.');
      return;
    }

    setUserData({ ...userData, [type]: tempData[type] });
    setEditMode({ ...editMode, [type]: false });
    setEmailVerification({
      sent: false,
      verified: false,
      code: '',
      inputCode: ''
    });
    setChangeType(null);
    alert((type === 'phone' ? '핸드폰 번호' : '이메일 주소') + '가 변경되었습니다.');
  };

  return (
    <div style={{ padding: '32px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#111827', margin: '0 0 8px' }}>계정 설정</h1>
          <p style={{ color: '#6b7280', fontSize: '14px', margin: 0 }}>회원 정보를 관리하세요</p>
        </div>

        <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #f3f4f6', padding: '32px', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', margin: '0 0 24px' }}>기본 정보</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
            <div>
              <label style={labelStyle}>이름</label>
              <div style={{ ...inputStyle, background: '#f3f4f6', cursor: 'not-allowed' }}>{userData.name}</div>
            </div>
            <div>
              <label style={labelStyle}>소속 기업</label>
              <div style={{ ...inputStyle, background: '#f3f4f6', cursor: 'not-allowed' }}>{userData.company}</div>
            </div>
          </div>
          <div>
            <label style={labelStyle}>직장 주소</label>
            <div style={{ ...inputStyle, background: '#f3f4f6', cursor: 'not-allowed' }}>{userData.address}</div>
          </div>
        </div>

        <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #f3f4f6', padding: '32px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', margin: 0 }}>핸드폰 번호</h2>
            {!editMode.phone && (
              <button onClick={() => handleStartEdit('phone')} style={{ padding: '8px 16px', background: '#3b82f6', border: 'none', borderRadius: '8px', color: '#ffffff', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>변경</button>
            )}
          </div>
          {!editMode.phone ? (
            <div style={{ ...inputStyle, background: '#f3f4f6' }}>{userData.phone}</div>
          ) : (
            <div>
              <div style={{ marginBottom: '16px' }}>
                <label style={labelStyle}>새 핸드폰 번호</label>
                <input type="tel" value={tempData.phone} onChange={(e) => setTempData({ ...tempData, phone: e.target.value })} placeholder="010-1234-5678" style={inputStyle} />
              </div>
              {!emailVerification.sent && (
                <button onClick={handleSendVerification} style={{ width: '100%', padding: '12px', background: '#667eea', border: 'none', borderRadius: '8px', color: '#ffffff', fontSize: '14px', fontWeight: '600', cursor: 'pointer', marginBottom: '12px' }}>이메일로 인증 코드 발송</button>
              )}
              {emailVerification.sent && !emailVerification.verified && (
                <div style={{ marginBottom: '16px' }}>
                  <label style={labelStyle}>인증 코드</label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input type="text" value={emailVerification.inputCode} onChange={(e) => setEmailVerification({ ...emailVerification, inputCode: e.target.value })} placeholder="6자리 인증 코드" style={{ ...inputStyle, flex: 1 }} maxLength={6} />
                    <button onClick={handleVerifyCode} style={{ padding: '12px 20px', background: '#667eea', border: 'none', borderRadius: '8px', color: '#ffffff', fontSize: '13px', fontWeight: '600', cursor: 'pointer', whiteSpace: 'nowrap' }}>인증 확인</button>
                  </div>
                </div>
              )}
              {emailVerification.verified && (
                <div style={{ padding: '12px', background: '#d1fae5', borderRadius: '8px', marginBottom: '16px', color: '#065f46', fontSize: '13px', textAlign: 'center' }}>✓ 이메일 인증이 완료되었습니다</div>
              )}
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={() => handleCancelEdit('phone')} style={{ flex: 1, padding: '12px', background: '#f3f4f6', border: 'none', borderRadius: '8px', color: '#6b7280', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>취소</button>
                <button onClick={() => handleSaveChange('phone')} style={{ flex: 1, padding: '12px', background: emailVerification.verified ? '#10b981' : '#d1d5db', border: 'none', borderRadius: '8px', color: '#ffffff', fontSize: '14px', fontWeight: '600', cursor: emailVerification.verified ? 'pointer' : 'not-allowed' }} disabled={!emailVerification.verified}>저장</button>
              </div>
            </div>
          )}
        </div>

        <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #f3f4f6', padding: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', margin: 0 }}>이메일 주소</h2>
            {!editMode.email && (
              <button onClick={() => handleStartEdit('email')} style={{ padding: '8px 16px', background: '#3b82f6', border: 'none', borderRadius: '8px', color: '#ffffff', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>변경</button>
            )}
          </div>
          {!editMode.email ? (
            <div style={{ ...inputStyle, background: '#f3f4f6' }}>{userData.email}</div>
          ) : (
            <div>
              <div style={{ marginBottom: '16px' }}>
                <label style={labelStyle}>새 이메일 주소</label>
                <input type="email" value={tempData.email} onChange={(e) => setTempData({ ...tempData, email: e.target.value })} placeholder="example@domain.com" style={inputStyle} />
              </div>
              {!emailVerification.sent && (
                <button onClick={handleSendVerification} style={{ width: '100%', padding: '12px', background: '#667eea', border: 'none', borderRadius: '8px', color: '#ffffff', fontSize: '14px', fontWeight: '600', cursor: 'pointer', marginBottom: '12px' }}>현재 이메일로 인증 코드 발송</button>
              )}
              {emailVerification.sent && !emailVerification.verified && (
                <div style={{ marginBottom: '16px' }}>
                  <label style={labelStyle}>인증 코드</label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input type="text" value={emailVerification.inputCode} onChange={(e) => setEmailVerification({ ...emailVerification, inputCode: e.target.value })} placeholder="6자리 인증 코드" style={{ ...inputStyle, flex: 1 }} maxLength={6} />
                    <button onClick={handleVerifyCode} style={{ padding: '12px 20px', background: '#667eea', border: 'none', borderRadius: '8px', color: '#ffffff', fontSize: '13px', fontWeight: '600', cursor: 'pointer', whiteSpace: 'nowrap' }}>인증 확인</button>
                  </div>
                </div>
              )}
              {emailVerification.verified && (
                <div style={{ padding: '12px', background: '#d1fae5', borderRadius: '8px', marginBottom: '16px', color: '#065f46', fontSize: '13px', textAlign: 'center' }}>✓ 이메일 인증이 완료되었습니다</div>
              )}
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={() => handleCancelEdit('email')} style={{ flex: 1, padding: '12px', background: '#f3f4f6', border: 'none', borderRadius: '8px', color: '#6b7280', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>취소</button>
                <button onClick={() => handleSaveChange('email')} style={{ flex: 1, padding: '12px', background: emailVerification.verified ? '#10b981' : '#d1d5db', border: 'none', borderRadius: '8px', color: '#ffffff', fontSize: '14px', fontWeight: '600', cursor: emailVerification.verified ? 'pointer' : 'not-allowed' }} disabled={!emailVerification.verified}>저장</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
