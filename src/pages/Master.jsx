import React, { useState } from 'react';

// Mock data for users
const initialUsers = [
  { id: 1, username: 'admin', name: '김관리', role: 'admin', email: 'admin@dhc.com', phone: '010-1111-2222', company: '(주)DHC', createdAt: '2024-01-01' },
  { id: 2, username: 'user', name: '이영업', role: 'user', email: 'user1@dhc.com', phone: '010-2222-3333', company: '(주)DHC', createdAt: '2024-02-01' },
  { id: 3, username: 'user2', name: '박사원', role: 'user', email: 'user2@dhc.com', phone: '010-3333-4444', company: '(주)DHC', createdAt: '2024-03-01' },
];

// Mock data for sales call logs
const mockCallLogs = [
  { id: 1, userId: 2, userName: '이영업', date: '2025-01-20', client: '서울수면클리닉', visitType: 'scheduled', products: ['SleepQ'], memo: '제품 설명 완료' },
  { id: 2, userId: 2, userName: '이영업', date: '2025-01-20', client: '강남브레인의원', visitType: 'walkin', products: ['SleepQ'], memo: '샘플 전달' },
  { id: 3, userId: 3, userName: '박사원', date: '2025-01-20', client: '분당숙면병원', visitType: 'scheduled', products: ['SleepQ'], memo: 'NECA 신청 안내' },
  { id: 4, userId: 2, userName: '이영업', date: '2025-01-19', client: '인천꿈의원', visitType: 'scheduled', products: ['SleepQ'], memo: '계약 완료' },
  { id: 5, userId: 3, userName: '박사원', date: '2025-01-19', client: '건강약국', visitType: 'walkin', products: ['GLP-OP'], memo: 'GLP 설명' },
];

export default function Master() {
  const [activeTab, setActiveTab] = useState('accounts'); // 'accounts', 'callLogs', or 'companies'
  const [users, setUsers] = useState(initialUsers);
  const [callLogs] = useState(mockCallLogs);
  const [selectedDate, setSelectedDate] = useState('2025-01-20');

  // Company management state
  const [companies, setCompanies] = useState(() => {
    const saved = localStorage.getItem('companies');
    return saved ? JSON.parse(saved) : [
      { id: 'dhc', name: '(주)DHC' },
      { id: 'samsung', name: '삼성제약' },
      { id: 'lg', name: 'LG생명과학' }
    ];
  });
  const [companyPopup, setCompanyPopup] = useState(false);
  const [editingCompany, setEditingCompany] = useState(null);
  const [newCompanyName, setNewCompanyName] = useState('');

  // Save companies to localStorage
  React.useEffect(() => {
    localStorage.setItem('companies', JSON.stringify(companies));
  }, [companies]);

  // Account management state
  const [editPopup, setEditPopup] = useState(null);
  const [addPopup, setAddPopup] = useState(false);
  const [confirmPopup, setConfirmPopup] = useState(null);
  const [newUser, setNewUser] = useState({
    username: '',
    name: '',
    role: 'user',
    email: '',
    phone: '',
    company: '(주)DHC',
    password: ''
  });

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

  const closeAll = () => {
    setEditPopup(null);
    setAddPopup(false);
    setConfirmPopup(null);
    setCompanyPopup(false);
    setEditingCompany(null);
    setNewCompanyName('');
  };

  // Company management functions
  const addCompany = () => {
    if (!newCompanyName.trim()) {
      alert('기업명을 입력해주세요.');
      return;
    }
    const newCompany = {
      id: Date.now().toString(),
      name: newCompanyName.trim()
    };
    setCompanies(prev => [...prev, newCompany]);
    setNewCompanyName('');
    alert('기업이 추가되었습니다.');
  };

  const updateCompany = (id, newName) => {
    if (!newName.trim()) return;
    setCompanies(prev => prev.map(c => c.id === id ? { ...c, name: newName.trim() } : c));
    setEditingCompany(null);
    alert('기업명이 수정되었습니다.');
  };

  const deleteCompany = (id) => {
    if (window.confirm('이 기업을 삭제하시겠습니까?\n해당 기업 소속 직원들의 정보는 유지됩니다.')) {
      setCompanies(prev => prev.filter(c => c.id !== id));
    }
  };

  const saveNewUser = () => {
    setUsers(prev => [...prev, {
      ...newUser,
      id: Date.now(),
      createdAt: new Date().toISOString().split('T')[0]
    }]);
    setNewUser({
      username: '',
      name: '',
      role: 'user',
      email: '',
      phone: '',
      company: '(주)DHC',
      password: ''
    });
    setAddPopup(false);
    setConfirmPopup(null);
  };

  const saveEditUser = () => {
    setUsers(prev => prev.map(u => u.id === editPopup.id ? editPopup : u));
    setEditPopup(null);
    setConfirmPopup(null);
  };

  const deleteUser = (userId) => {
    if (window.confirm('정말 이 계정을 삭제하시겠습니까?')) {
      setUsers(prev => prev.filter(u => u.id !== userId));
    }
  };

  // Filter call logs by date and exclude admin users
  const filteredCallLogs = callLogs.filter(log => {
    const user = users.find(u => u.id === log.userId);
    return log.date === selectedDate && user && user.role !== 'admin';
  });

  // Get unique dates from call logs
  const uniqueDates = [...new Set(callLogs.map(log => log.date))].sort((a, b) => b.localeCompare(a));

  return (
    <div style={{ padding: '32px' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#111827', margin: '0 0 8px' }}>Master 관리</h1>
        <p style={{ color: '#6b7280', fontSize: '14px', margin: 0 }}>전체 계정 및 영업 활동을 관리하세요</p>
      </div>

      {/* Tabs */}
      <div style={{ marginBottom: '24px', borderBottom: '2px solid #f3f4f6' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setActiveTab('accounts')}
            style={{
              padding: '12px 24px',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'accounts' ? '3px solid #3b82f6' : '3px solid transparent',
              color: activeTab === 'accounts' ? '#3b82f6' : '#6b7280',
              fontSize: '15px',
              fontWeight: '600',
              cursor: 'pointer',
              marginBottom: '-2px'
            }}
          >
            계정 관리
          </button>
          <button
            onClick={() => setActiveTab('companies')}
            style={{
              padding: '12px 24px',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'companies' ? '3px solid #3b82f6' : '3px solid transparent',
              color: activeTab === 'companies' ? '#3b82f6' : '#6b7280',
              fontSize: '15px',
              fontWeight: '600',
              cursor: 'pointer',
              marginBottom: '-2px'
            }}
          >
            기업 관리
          </button>
          <button
            onClick={() => setActiveTab('callLogs')}
            style={{
              padding: '12px 24px',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'callLogs' ? '3px solid #3b82f6' : '3px solid transparent',
              color: activeTab === 'callLogs' ? '#3b82f6' : '#6b7280',
              fontSize: '15px',
              fontWeight: '600',
              cursor: 'pointer',
              marginBottom: '-2px'
            }}
          >
            영업 활동 기록
          </button>
        </div>
      </div>

      {/* Accounts Tab */}
      {activeTab === 'accounts' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <p style={{ color: '#6b7280', fontSize: '14px', margin: 0 }}>{users.length}개 계정</p>
            <button
              onClick={() => setAddPopup(true)}
              style={{
                padding: '12px 24px',
                background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                border: 'none',
                borderRadius: '10px',
                color: '#fff',
                fontWeight: '600',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              + 계정 생성
            </button>
          </div>

          {/* Users Table */}
          <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #f3f4f6', overflow: 'hidden' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr 1fr 1.5fr 1.5fr 1fr 180px', padding: '16px 24px', background: '#f9fafb', borderBottom: '1px solid #f3f4f6', fontSize: '13px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              <div>계정</div>
              <div>이름</div>
              <div>역할</div>
              <div>이메일</div>
              <div>전화번호</div>
              <div>가입일</div>
              <div></div>
            </div>

            {users.map((user, i) => (
              <div key={user.id} style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr 1fr 1.5fr 1.5fr 1fr 180px', padding: '18px 24px', borderBottom: i < users.length - 1 ? '1px solid #f3f4f6' : 'none', alignItems: 'center' }}>
                <div style={{ fontWeight: '600', color: '#111827' }}>{user.username}</div>
                <div style={{ color: '#111827' }}>{user.name}</div>
                <div>
                  <span style={{
                    padding: '4px 12px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: '600',
                    background: user.role === 'admin' ? '#dbeafe' : '#d1fae5',
                    color: user.role === 'admin' ? '#1e40af' : '#065f46'
                  }}>
                    {user.role === 'admin' ? 'Admin' : 'User'}
                  </span>
                </div>
                <div style={{ color: '#6b7280', fontSize: '14px' }}>{user.email}</div>
                <div style={{ color: '#6b7280', fontSize: '14px' }}>{user.phone}</div>
                <div style={{ color: '#9ca3af', fontSize: '13px' }}>{user.createdAt}</div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => setEditPopup({...user})}
                    style={{
                      padding: '6px 12px',
                      background: '#dbeafe',
                      border: 'none',
                      borderRadius: '6px',
                      color: '#1e40af',
                      fontSize: '12px',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    수정
                  </button>
                  <button
                    onClick={() => deleteUser(user.id)}
                    style={{
                      padding: '6px 12px',
                      background: '#fee2e2',
                      border: 'none',
                      borderRadius: '6px',
                      color: '#991b1b',
                      fontSize: '12px',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    삭제
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Call Logs Tab */}
      {activeTab === 'callLogs' && (
        <div>
          <div style={{ marginBottom: '24px', display: 'flex', gap: '16px', alignItems: 'center' }}>
            <div>
              <label style={{ color: '#6b7280', fontSize: '12px', marginBottom: '6px', display: 'block' }}>날짜 선택</label>
              <select
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                style={{
                  padding: '10px 16px',
                  background: '#ffffff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  color: '#111827',
                  fontSize: '14px',
                  cursor: 'pointer',
                  fontWeight: '500'
                }}
              >
                {uniqueDates.map(date => (
                  <option key={date} value={date}>{date}</option>
                ))}
              </select>
            </div>
            <div style={{ flex: 1, paddingTop: '22px' }}>
              <p style={{ color: '#6b7280', fontSize: '14px', margin: 0 }}>
                총 <span style={{ color: '#3b82f6', fontWeight: '600' }}>{filteredCallLogs.length}</span>건의 방문 기록
              </p>
            </div>
          </div>

          {/* Call Logs Table */}
          <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #f3f4f6', overflow: 'hidden' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr 1fr 1.5fr 2fr', padding: '16px 24px', background: '#f9fafb', borderBottom: '1px solid #f3f4f6', fontSize: '13px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              <div>영업사원</div>
              <div>거래처</div>
              <div>방문 유형</div>
              <div>제품</div>
              <div>메모</div>
            </div>

            {filteredCallLogs.length === 0 ? (
              <div style={{ padding: '60px 24px', textAlign: 'center', color: '#9ca3af' }}>
                선택한 날짜에 영업 활동 기록이 없습니다.
              </div>
            ) : (
              filteredCallLogs.map((log, i) => (
                <div key={log.id} style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr 1fr 1.5fr 2fr', padding: '18px 24px', borderBottom: i < filteredCallLogs.length - 1 ? '1px solid #f3f4f6' : 'none', alignItems: 'center' }}>
                  <div style={{ fontWeight: '600', color: '#111827' }}>{log.userName}</div>
                  <div style={{ color: '#111827' }}>{log.client}</div>
                  <div>
                    <span style={{
                      padding: '4px 12px',
                      borderRadius: '12px',
                      fontSize: '11px',
                      fontWeight: '600',
                      background: log.visitType === 'scheduled' ? '#fef3c7' : '#dbeafe',
                      color: log.visitType === 'scheduled' ? '#92400e' : '#1e40af'
                    }}>
                      {log.visitType === 'scheduled' ? '예정 방문' : '돌발 방문'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                    {log.products.map((p, idx) => (
                      <span key={idx} style={{ background: '#f3f4f6', color: '#6b7280', padding: '2px 8px', borderRadius: '8px', fontSize: '11px' }}>{p}</span>
                    ))}
                  </div>
                  <div style={{ color: '#6b7280', fontSize: '13px' }}>{log.memo || '-'}</div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Companies Tab */}
      {activeTab === 'companies' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <p style={{ color: '#6b7280', fontSize: '14px', margin: 0 }}>{companies.length}개 기업</p>
          </div>

          {/* Companies Table */}
          <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #f3f4f6', overflow: 'hidden' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '60px 2fr 200px', padding: '16px 24px', background: '#f9fafb', borderBottom: '1px solid #f3f4f6', fontSize: '13px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              <div>No.</div>
              <div>기업명</div>
              <div>관리</div>
            </div>

            {companies.map((company, i) => (
              <div key={company.id} style={{ display: 'grid', gridTemplateColumns: '60px 2fr 200px', padding: '18px 24px', borderBottom: i < companies.length - 1 ? '1px solid #f3f4f6' : 'none', alignItems: 'center' }}>
                <div style={{ color: '#9ca3af', fontSize: '14px' }}>{i + 1}</div>
                <div>
                  {editingCompany === company.id ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <input
                        type="text"
                        defaultValue={company.name}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            updateCompany(company.id, e.target.value);
                          }
                        }}
                        style={{
                          ...inputStyle,
                          flex: 1,
                          padding: '8px 12px'
                        }}
                        autoFocus
                        id={`edit-${company.id}`}
                      />
                      <button
                        onClick={() => {
                          const input = document.getElementById(`edit-${company.id}`);
                          updateCompany(company.id, input.value);
                        }}
                        style={{
                          padding: '6px 12px',
                          background: '#10b981',
                          border: 'none',
                          borderRadius: '6px',
                          color: '#ffffff',
                          fontSize: '12px',
                          fontWeight: '600',
                          cursor: 'pointer'
                        }}
                      >
                        ✓
                      </button>
                      <button
                        onClick={() => setEditingCompany(null)}
                        style={{
                          padding: '6px 12px',
                          background: '#f3f4f6',
                          border: 'none',
                          borderRadius: '6px',
                          color: '#6b7280',
                          fontSize: '12px',
                          fontWeight: '600',
                          cursor: 'pointer'
                        }}
                      >
                        취소
                      </button>
                    </div>
                  ) : (
                    <span style={{ fontWeight: '600', color: '#111827', fontSize: '15px' }}>{company.name}</span>
                  )}
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {editingCompany !== company.id && (
                    <>
                      <button
                        onClick={() => setEditingCompany(company.id)}
                        style={{
                          padding: '6px 12px',
                          background: '#dbeafe',
                          border: 'none',
                          borderRadius: '6px',
                          color: '#1e40af',
                          fontSize: '12px',
                          fontWeight: '600',
                          cursor: 'pointer'
                        }}
                      >
                        수정
                      </button>
                      <button
                        onClick={() => deleteCompany(company.id)}
                        style={{
                          padding: '6px 12px',
                          background: '#fee2e2',
                          border: 'none',
                          borderRadius: '6px',
                          color: '#991b1b',
                          fontSize: '12px',
                          fontWeight: '600',
                          cursor: 'pointer'
                        }}
                      >
                        삭제
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}

            {/* Add Company Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '60px 2fr 200px', padding: '18px 24px', background: '#f9fafb', alignItems: 'center' }}>
              <div></div>
              <div>
                <input
                  type="text"
                  value={newCompanyName}
                  onChange={(e) => setNewCompanyName(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      addCompany();
                    }
                  }}
                  placeholder="새 기업명 입력..."
                  style={{
                    ...inputStyle,
                    padding: '8px 12px'
                  }}
                />
              </div>
              <div>
                <button
                  onClick={addCompany}
                  style={{
                    padding: '8px 16px',
                    background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#ffffff',
                    fontSize: '13px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  + 기업 추가
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add User Popup */}
      {addPopup && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ background: '#ffffff', borderRadius: '16px', padding: '32px', width: '500px', border: '1px solid #f3f4f6', position: 'relative' }}>
            <button onClick={closeAll} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', color: '#6b7280', fontSize: '24px', cursor: 'pointer' }}>×</button>
            <h3 style={{ margin: '0 0 24px', color: '#111827' }}>계정 생성</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={labelStyle}>아이디 *</label>
                  <input style={inputStyle} value={newUser.username} onChange={e => setNewUser({...newUser, username: e.target.value})} placeholder="user_id" />
                </div>
                <div>
                  <label style={labelStyle}>이름 *</label>
                  <input style={inputStyle} value={newUser.name} onChange={e => setNewUser({...newUser, name: e.target.value})} placeholder="홍길동" />
                </div>
              </div>

              <div>
                <label style={labelStyle}>역할 *</label>
                <select style={inputStyle} value={newUser.role} onChange={e => setNewUser({...newUser, role: e.target.value})}>
                  <option value="user">User (영업사원)</option>
                  <option value="admin">Admin (관리자)</option>
                </select>
              </div>

              <div>
                <label style={labelStyle}>이메일 *</label>
                <input type="email" style={inputStyle} value={newUser.email} onChange={e => setNewUser({...newUser, email: e.target.value})} placeholder="email@example.com" />
              </div>

              <div>
                <label style={labelStyle}>전화번호 *</label>
                <input type="tel" style={inputStyle} value={newUser.phone} onChange={e => setNewUser({...newUser, phone: e.target.value})} placeholder="010-1234-5678" />
              </div>

              <div>
                <label style={labelStyle}>소속 기업</label>
                <input style={inputStyle} value={newUser.company} onChange={e => setNewUser({...newUser, company: e.target.value})} />
              </div>

              <div>
                <label style={labelStyle}>비밀번호 *</label>
                <input type="password" style={inputStyle} value={newUser.password} onChange={e => setNewUser({...newUser, password: e.target.value})} placeholder="8자 이상" />
              </div>
            </div>

            <button
              onClick={() => setConfirmPopup({ type: 'add', action: saveNewUser })}
              style={{
                width: '100%',
                marginTop: '20px',
                padding: '14px',
                background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                border: 'none',
                borderRadius: '10px',
                color: '#fff',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              생성하기
            </button>
          </div>
        </div>
      )}

      {/* Edit User Popup */}
      {editPopup && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ background: '#ffffff', borderRadius: '16px', padding: '32px', width: '500px', border: '1px solid #f3f4f6', position: 'relative' }}>
            <button onClick={closeAll} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', color: '#6b7280', fontSize: '24px', cursor: 'pointer' }}>×</button>
            <h3 style={{ margin: '0 0 24px', color: '#111827' }}>계정 수정</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={labelStyle}>아이디</label>
                  <input style={{...inputStyle, background: '#f3f4f6', cursor: 'not-allowed'}} value={editPopup.username} disabled />
                </div>
                <div>
                  <label style={labelStyle}>이름 *</label>
                  <input style={inputStyle} value={editPopup.name} onChange={e => setEditPopup({...editPopup, name: e.target.value})} />
                </div>
              </div>

              <div>
                <label style={labelStyle}>역할 *</label>
                <select style={inputStyle} value={editPopup.role} onChange={e => setEditPopup({...editPopup, role: e.target.value})}>
                  <option value="user">User (영업사원)</option>
                  <option value="admin">Admin (관리자)</option>
                </select>
              </div>

              <div>
                <label style={labelStyle}>이메일 *</label>
                <input type="email" style={inputStyle} value={editPopup.email} onChange={e => setEditPopup({...editPopup, email: e.target.value})} />
              </div>

              <div>
                <label style={labelStyle}>전화번호 *</label>
                <input type="tel" style={inputStyle} value={editPopup.phone} onChange={e => setEditPopup({...editPopup, phone: e.target.value})} />
              </div>

              <div>
                <label style={labelStyle}>소속 기업</label>
                <input style={inputStyle} value={editPopup.company} onChange={e => setEditPopup({...editPopup, company: e.target.value})} />
              </div>
            </div>

            <button
              onClick={() => setConfirmPopup({ type: 'edit', action: saveEditUser })}
              style={{
                width: '100%',
                marginTop: '20px',
                padding: '14px',
                background: 'linear-gradient(135deg, #4ade80, #22c55e)',
                border: 'none',
                borderRadius: '10px',
                color: '#f9fafb',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              저장하기
            </button>
          </div>
        </div>
      )}

      {/* Confirmation Popup */}
      {confirmPopup && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200 }}>
          <div style={{ background: '#ffffff', borderRadius: '16px', padding: '32px', width: '400px', border: '1px solid #f3f4f6', textAlign: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
            <h3 style={{ margin: '0 0 12px', color: '#111827', fontSize: '20px' }}>
              {confirmPopup.type === 'add' ? '계정을 생성하시겠습니까?' : '변경사항을 저장하시겠습니까?'}
            </h3>
            <p style={{ color: '#6b7280', margin: '0 0 24px', fontSize: '14px' }}>
              {confirmPopup.type === 'add' ? '새로운 계정이 생성됩니다.' : '수정한 내용이 저장됩니다.'}
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => setConfirmPopup(null)}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: '#f3f4f6',
                  border: 'none',
                  borderRadius: '10px',
                  color: '#6b7280',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                취소
              </button>
              <button
                onClick={confirmPopup.action}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: confirmPopup.type === 'add' ? 'linear-gradient(135deg, #3b82f6, #2563eb)' : 'linear-gradient(135deg, #4ade80, #22c55e)',
                  border: 'none',
                  borderRadius: '10px',
                  color: '#ffffff',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                {confirmPopup.type === 'add' ? '생성' : '저장'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
