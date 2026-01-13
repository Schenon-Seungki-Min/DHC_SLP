import React, { useState } from 'react';

const initialClients = [
  { id: 1, name: '서울수면클리닉', type: 'hospital', portfolio: 'sleepq', address: '서울시 강남구 테헤란로 123', city: '서울시', district: '강남구', dong: '테헤란로', staff: '김수면', otherStaff: ['이진료', '박상담'], phone: '010-1234-5678', email: 'seoul@sleep.kr', lastVisit: '2024-12-20', scheduledVisit: '2025-01-15', visitCount: 12, progress: 4, memo: 'NECA 등록 완료. 처방 안정적', memoIsPublic: true, neca: '2024-06-15', partners: [{name: 'A파트너', date: '2024-12-20'}, {name: 'B파트너', date: '2024-12-18'}] },
  { id: 2, name: '강남브레인의원', type: 'hospital', portfolio: 'sleepq', address: '서울시 강남구 역삼동 456', city: '서울시', district: '강남구', dong: '역삼동', staff: '이두뇌', otherStaff: ['최신경'], phone: '010-2345-6789', email: 'brain@clinic.kr', lastVisit: '2024-12-18', scheduledVisit: null, visitCount: 8, progress: 3, memo: '관심 높음. 다음 방문 시 샘플 제공 예정', memoIsPublic: false, neca: '2024-07-20', partners: [{name: 'A파트너', date: '2024-12-18'}] },
  { id: 3, name: '분당숙면병원', type: 'hospital', portfolio: 'sleepq', address: '경기도 성남시 분당구 정자동 789', city: '경기도', district: '성남시', dong: '분당구', staff: '박숙면', otherStaff: [], phone: '010-3456-7890', email: 'bundang@sleep.kr', lastVisit: '2024-12-15', scheduledVisit: '2025-01-20', visitCount: 5, progress: 2, memo: 'NECA 신청 검토 중', memoIsPublic: true, neca: '2024-08-10', partners: [{name: 'C파트너', date: '2024-12-15'}, {name: 'A파트너', date: '2024-12-10'}] },
  { id: 4, name: '인천꿈의원', type: 'hospital', portfolio: 'sleepq', address: '인천시 연수구 송도동 321', city: '인천시', district: '연수구', dong: '송도동', staff: '정꿈나라', otherStaff: ['한밤잠', '오숙면'], phone: '010-4567-8901', email: 'dream@incheon.kr', lastVisit: '2024-12-22', scheduledVisit: '2025-01-10', visitCount: 15, progress: 5, memo: '계약 체결 완료', memoIsPublic: false, neca: null, partners: [{name: 'B파트너', date: '2024-12-22'}] },
  { id: 5, name: '건강약국', type: 'pharmacy', portfolio: 'coaching', team: 'south_east', address: '서울시 송파구 잠실동 100', city: '서울시', district: '송파구', dong: '잠실동', staff: '박약사', otherStaff: [], phone: '010-5555-6666', email: 'health@pharm.kr', lastVisit: '2024-12-19', scheduledVisit: '2025-01-18', visitCount: 6, progress: 3, memo: 'GLP 비만 관리 서비스 관심', memoIsPublic: true, neca: null, partners: [{name: 'D파트너', date: '2024-12-19'}] },
];

export default function ClientDashboard() {
  const [clients, setClients] = useState(initialClients);
  const [popup, setPopup] = useState({ type: null, data: null });
  const [smsPopup, setSmsPopup] = useState(null);
  const [schedulePopup, setSchedulePopup] = useState(null);
  const [newDate, setNewDate] = useState('');
  const [filterPortfolio, setFilterPortfolio] = useState('전체');
  const [filterType, setFilterType] = useState('전체');
  const [filterCity, setFilterCity] = useState('전체');
  const [filterDistrict, setFilterDistrict] = useState('전체');
  const [filterDong, setFilterDong] = useState('전체');
  const [editingProgress, setEditingProgress] = useState(null);

  const closePopup = () => { setPopup({ type: null, data: null }); setSmsPopup(null); setSchedulePopup(null); setEditingProgress(null); };

  const updateProgress = (clientId, newProgress) => {
    setClients(prev => prev.map(c => c.id === clientId ? { ...c, progress: newProgress } : c));
    setEditingProgress(null);
  };

  const toggleMemoVisibility = (clientId) => {
    setClients(prev => prev.map(c => c.id === clientId ? { ...c, memoIsPublic: !c.memoIsPublic } : c));
  };

  const today = new Date().toISOString().split('T')[0];

  // 주소 필터 옵션 생성 (cascading)
  const uniqueCities = ['전체', ...new Set(clients.map(c => c.city))];
  const uniqueDistricts = ['전체', ...new Set(
    clients.filter(c => filterCity === '전체' || c.city === filterCity).map(c => c.district)
  )];
  const uniqueDongs = ['전체', ...new Set(
    clients.filter(c => {
      if (filterCity !== '전체' && c.city !== filterCity) return false;
      if (filterDistrict !== '전체' && c.district !== filterDistrict) return false;
      return true;
    }).map(c => c.dong)
  )];

  // 필터링 로직
  const filteredClients = clients.filter(c => {
    if (filterPortfolio !== '전체' && c.portfolio !== filterPortfolio) return false;
    if (filterType !== '전체' && c.type !== filterType) return false;
    if (filterCity !== '전체' && c.city !== filterCity) return false;
    if (filterDistrict !== '전체' && c.district !== filterDistrict) return false;
    if (filterDong !== '전체' && c.dong !== filterDong) return false;
    return true;
  });

  // 주소 필터 변경 핸들러 (cascading reset)
  const handleCityChange = (city) => {
    setFilterCity(city);
    setFilterDistrict('전체');
    setFilterDong('전체');
  };

  const handleDistrictChange = (district) => {
    setFilterDistrict(district);
    setFilterDong('전체');
  };

  return (
    <div style={{ padding: '32px' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#111827', margin: 0 }}>내고객</h1>
        <p style={{ color: '#6b7280', marginTop: '4px', fontSize: '14px' }}>{filteredClients.length}개 거래처</p>
      </div>

      {/* Filters */}
      <div style={{ marginBottom: '24px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        <div>
          <label style={{ color: '#6b7280', fontSize: '12px', marginBottom: '6px', display: 'block' }}>포트폴리오</label>
          <select value={filterPortfolio} onChange={e => setFilterPortfolio(e.target.value)} style={{ padding: '8px 12px', background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '8px', color: '#111827', fontSize: '14px', cursor: 'pointer' }}>
            <option value="전체">전체</option>
            <option value="sleepq">SleepQ</option>
            <option value="coaching">코칭서비스</option>
          </select>
        </div>
        <div>
          <label style={{ color: '#6b7280', fontSize: '12px', marginBottom: '6px', display: 'block' }}>거래처 유형</label>
          <select value={filterType} onChange={e => setFilterType(e.target.value)} style={{ padding: '8px 12px', background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '8px', color: '#111827', fontSize: '14px', cursor: 'pointer' }}>
            <option value="전체">전체</option>
            <option value="hospital">병원</option>
            <option value="pharmacy">약국</option>
          </select>
        </div>
        <div>
          <label style={{ color: '#6b7280', fontSize: '12px', marginBottom: '6px', display: 'block' }}>시/도</label>
          <select value={filterCity} onChange={e => handleCityChange(e.target.value)} style={{ padding: '8px 12px', background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '8px', color: '#111827', fontSize: '14px', cursor: 'pointer' }}>
            {uniqueCities.map((city, i) => <option key={i} value={city}>{city}</option>)}
          </select>
        </div>
        <div>
          <label style={{ color: '#6b7280', fontSize: '12px', marginBottom: '6px', display: 'block' }}>시/군/구</label>
          <select value={filterDistrict} onChange={e => handleDistrictChange(e.target.value)} style={{ padding: '8px 12px', background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '8px', color: '#111827', fontSize: '14px', cursor: 'pointer' }}>
            {uniqueDistricts.map((district, i) => <option key={i} value={district}>{district}</option>)}
          </select>
        </div>
        <div>
          <label style={{ color: '#6b7280', fontSize: '12px', marginBottom: '6px', display: 'block' }}>읍/면/동</label>
          <select value={filterDong} onChange={e => setFilterDong(e.target.value)} style={{ padding: '8px 12px', background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '8px', color: '#111827', fontSize: '14px', cursor: 'pointer' }}>
            {uniqueDongs.map((dong, i) => <option key={i} value={dong}>{dong}</option>)}
          </select>
        </div>
      </div>

      {/* Table */}
      <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e5e7eb', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        {/* Header Row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr 1fr 1fr 0.8fr 0.8fr 1fr', padding: '16px 24px', background: '#f9fafb', borderBottom: '1px solid #e5e7eb', fontSize: '13px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          <div>거래처명</div>
          <div>담당자</div>
          <div>최종방문</div>
          <div>방문예정일</div>
          <div>방문횟수</div>
          <div>진척도</div>
          <div>메모</div>
        </div>

        {/* Data Rows */}
        {filteredClients.map((c, i) => (
          <div key={c.id} style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr 1fr 1fr 0.8fr 0.8fr 1fr', padding: '20px 24px', borderBottom: i < filteredClients.length - 1 ? '1px solid #f3f4f6' : 'none', alignItems: 'center', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = '#f3f4f6'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
            {/* 거래처명 + 유형 뱃지 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontWeight: '600', color: '#111827', cursor: 'pointer' }} onClick={() => setPopup({ type: 'neca', data: c })}>{c.name}</span>
              <span style={{ background: c.type === 'hospital' ? '#dbeafe' : '#fef3c7', color: c.type === 'hospital' ? '#1e40af' : '#92400e', padding: '2px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: '600' }}>{c.type === 'hospital' ? '병원' : '약국'}</span>
            </div>
            {/* 담당자 */}
            <div style={{ color: '#38bdf8', cursor: 'pointer' }} onClick={() => setPopup({ type: 'staff', data: c })}>{c.staff}</div>
            {/* 최종방문 */}
            <div style={{ color: '#6b7280', fontSize: '14px' }}>{c.lastVisit}</div>
            {/* 방문예정일 */}
            <div style={{ color: c.scheduledVisit ? '#fbbf24' : '#9ca3af', fontSize: '14px', cursor: 'pointer', fontWeight: c.scheduledVisit ? '600' : 'normal' }} onClick={() => setSchedulePopup(c)}>{c.scheduledVisit || '-'}</div>
            {/* 방문횟수 */}
            <div style={{ color: '#111827', textAlign: 'center' }}>{c.visitCount}</div>
            {/* 진척도 */}
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <div style={{ background: `linear-gradient(135deg, ${c.progress >= 4 ? '#4ade80' : c.progress >= 3 ? '#fbbf24' : '#94a3b8'}, ${c.progress >= 4 ? '#22c55e' : c.progress >= 3 ? '#f59e0b' : '#64748b'})`, color: '#ffffff', padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }} onClick={() => setEditingProgress(c)}>{c.progress}</div>
            </div>
            {/* 메모 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }} onClick={() => setPopup({ type: 'memo', data: c })}>
              <span style={{ color: '#6b7280', fontSize: '13px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>{c.memo}</span>
              <span style={{ fontSize: '14px', flexShrink: 0 }}>{c.memoIsPublic ? '🌐' : '🔒'}</span>
            </div>
          </div>
        ))}
      </div>

      {/* NECA Popup */}
      {popup.type === 'neca' && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ background: '#ffffff', borderRadius: '16px', padding: '32px', width: '400px', border: '1px solid #f3f4f6', position: 'relative' }}>
            <button onClick={closePopup} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', color: '#6b7280', fontSize: '24px', cursor: 'pointer' }}>×</button>
            <h3 style={{ margin: '0 0 24px', color: '#111827' }}>{popup.data.name}</h3>
            <div style={{ background: '#f9fafb', borderRadius: '12px', padding: '20px' }}>
              <p style={{ color: '#6b7280', fontSize: '13px', margin: '0 0 8px' }}>NECA 등록일</p>
              <p style={{ color: popup.data.neca ? '#4ade80' : '#ef4444', fontSize: '20px', fontWeight: '600', margin: 0 }}>{popup.data.neca || '미등록'}</p>
            </div>
          </div>
        </div>
      )}

      {/* Staff Popup */}
      {popup.type === 'staff' && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ background: '#ffffff', borderRadius: '16px', padding: '32px', width: '400px', border: '1px solid #f3f4f6', position: 'relative', maxHeight: '80vh', overflowY: 'auto' }}>
            <button onClick={closePopup} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', color: '#6b7280', fontSize: '24px', cursor: 'pointer' }}>×</button>
            <h3 style={{ margin: '0 0 24px', color: '#111827' }}>소속 담당자</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ background: '#f9fafb', borderRadius: '12px', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#111827' }}>{popup.data.staff}</span>
                <span style={{ background: '#38bdf8', color: '#f9fafb', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' }}>대표</span>
              </div>
              {popup.data.otherStaff.map((s, i) => (
                <div key={i} style={{ background: '#f9fafb', borderRadius: '12px', padding: '16px' }}>
                  <span style={{ color: '#6b7280' }}>{s}</span>
                </div>
              ))}
              {popup.data.otherStaff.length === 0 && <p style={{ color: '#6b7280', textAlign: 'center', padding: '20px' }}>소속 담당자 없음</p>}
            </div>
          </div>
        </div>
      )}

      {/* Memo Popup */}
      {popup.type === 'memo' && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ background: '#ffffff', borderRadius: '16px', padding: '32px', width: '450px', border: '1px solid #f3f4f6', position: 'relative' }}>
            <button onClick={closePopup} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', color: '#6b7280', fontSize: '24px', cursor: 'pointer' }}>×</button>
            <h3 style={{ margin: '0 0 8px', color: '#111827' }}>{popup.data.name}</h3>
            <p style={{ color: '#6b7280', margin: '0 0 16px', fontSize: '14px' }}>메모</p>

            {/* Visibility Toggle */}
            <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#f9fafb', padding: '12px 16px', borderRadius: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '16px' }}>{popup.data.memoIsPublic ? '🌐' : '🔒'}</span>
                <span style={{ color: '#6b7280', fontSize: '13px', fontWeight: '500' }}>
                  {popup.data.memoIsPublic ? '공개 메모' : '비공개 메모'}
                </span>
              </div>
              <button
                onClick={() => toggleMemoVisibility(popup.data.id)}
                style={{
                  padding: '6px 16px',
                  background: popup.data.memoIsPublic ? 'linear-gradient(135deg, #4ade80, #22c55e)' : 'linear-gradient(135deg, #94a3b8, #64748b)',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#ffffff',
                  fontSize: '12px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                {popup.data.memoIsPublic ? '비공개로 전환' : '공개로 전환'}
              </button>
            </div>

            <div style={{ background: '#f9fafb', borderRadius: '12px', padding: '16px', minHeight: '100px' }}>
              <p style={{ color: '#111827', margin: 0, lineHeight: '1.6' }}>{popup.data.memo}</p>
            </div>
          </div>
        </div>
      )}

      {/* SMS Popup */}
      {smsPopup && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ background: '#ffffff', borderRadius: '16px', padding: '32px', width: '450px', border: '1px solid #f3f4f6', position: 'relative' }}>
            <button onClick={closePopup} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', color: '#6b7280', fontSize: '24px', cursor: 'pointer' }}>×</button>
            <h3 style={{ margin: '0 0 8px', color: '#111827' }}>문자 발송</h3>
            <p style={{ color: '#6b7280', margin: '0 0 24px', fontSize: '14px' }}>{smsPopup.name} · {smsPopup.phone}</p>
            <textarea placeholder="메시지를 입력하세요..." style={{ width: '100%', height: '120px', background: '#f9fafb', border: '1px solid #f3f4f6', borderRadius: '12px', padding: '16px', color: '#111827', fontSize: '14px', resize: 'none', boxSizing: 'border-box' }} />
            <button style={{ width: '100%', marginTop: '16px', padding: '14px', background: 'linear-gradient(135deg, #4ade80, #22c55e)', border: 'none', borderRadius: '12px', color: '#f9fafb', fontWeight: '600', cursor: 'pointer', fontSize: '15px' }}>발송하기</button>
          </div>
        </div>
      )}

      {/* Schedule Popup */}
      {schedulePopup && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ background: '#ffffff', borderRadius: '16px', padding: '32px', width: '500px', border: '1px solid #f3f4f6', position: 'relative', maxHeight: '80vh', overflowY: 'auto' }}>
            <button onClick={closePopup} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', color: '#6b7280', fontSize: '24px', cursor: 'pointer' }}>×</button>
            <h3 style={{ margin: '0 0 24px', color: '#111827' }}>방문 히스토리</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
              {schedulePopup.partners.map((p, i) => (
                <div key={i} style={{ background: '#f9fafb', borderRadius: '12px', padding: '16px', display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#6b7280' }}>{p.name}</span>
                  <span style={{ color: '#fbbf24' }}>{p.date}</span>
                </div>
              ))}
            </div>
            <div style={{ borderTop: '1px solid #f3f4f6', paddingTop: '24px' }}>
              <p style={{ color: '#6b7280', fontSize: '13px', margin: '0 0 12px' }}>내 일정 입력하기</p>
              <div style={{ display: 'flex', gap: '12px' }}>
                <input type="date" value={newDate} onChange={e => setNewDate(e.target.value)} style={{ flex: 1, background: '#f9fafb', border: '1px solid #f3f4f6', borderRadius: '8px', padding: '12px', color: '#111827' }} />
                <button style={{ padding: '12px 24px', background: newDate > today ? 'linear-gradient(135deg, #fbbf24, #f59e0b)' : '#f3f4f6', border: 'none', borderRadius: '8px', color: newDate > today ? '#f9fafb' : '#6b7280', fontWeight: '600', cursor: 'pointer' }}>
                  {newDate > today ? '방문 예정' : '저장'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Progress Edit Popup */}
      {editingProgress && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ background: '#ffffff', borderRadius: '16px', padding: '32px', width: '450px', border: '1px solid #f3f4f6', position: 'relative' }}>
            <button onClick={closePopup} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', color: '#6b7280', fontSize: '24px', cursor: 'pointer' }}>×</button>
            <h3 style={{ margin: '0 0 8px', color: '#111827' }}>{editingProgress.name}</h3>
            <p style={{ color: '#6b7280', margin: '0 0 24px', fontSize: '14px' }}>진척도 수정</p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px' }}>
              {[1, 2, 3, 4, 5].map(level => {
                const isSelected = editingProgress.progress === level;
                const bgColor = level >= 4 ? '#4ade80' : level >= 3 ? '#fbbf24' : '#94a3b8';
                return (
                  <button
                    key={level}
                    onClick={() => updateProgress(editingProgress.id, level)}
                    style={{
                      background: isSelected ? `linear-gradient(135deg, ${bgColor}, ${level >= 4 ? '#22c55e' : level >= 3 ? '#f59e0b' : '#64748b'})` : '#f9fafb',
                      border: isSelected ? 'none' : '2px solid #e5e7eb',
                      borderRadius: '12px',
                      padding: '20px',
                      color: isSelected ? '#ffffff' : '#6b7280',
                      fontSize: '24px',
                      fontWeight: '700',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    onMouseEnter={e => {
                      if (!isSelected) {
                        e.currentTarget.style.background = '#f3f4f6';
                        e.currentTarget.style.borderColor = '#d1d5db';
                      }
                    }}
                    onMouseLeave={e => {
                      if (!isSelected) {
                        e.currentTarget.style.background = '#f9fafb';
                        e.currentTarget.style.borderColor = '#e5e7eb';
                      }
                    }}
                  >
                    {level}
                  </button>
                );
              })}
            </div>

            <div style={{ marginTop: '24px', padding: '16px', background: '#f9fafb', borderRadius: '12px' }}>
              <p style={{ color: '#6b7280', fontSize: '13px', margin: 0 }}>
                <strong>현재 진척도:</strong> {editingProgress.progress}단계
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
