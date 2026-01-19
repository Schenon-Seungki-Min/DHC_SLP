import React, { useState } from 'react';

const clients = [
  { id: 1, name: '서울수면클리닉', type: 'hospital', portfolio: 'sleepq', address: '서울시 강남구 테헤란로 123, 5층 501호', city: '서울시', district: '강남구', dong: '테헤란로', phone: '010-1111-2222', staff: '김수면', partners: ['A파트너', 'B파트너', 'C파트너'], lastVisit: '2024-12-22', neca: '2024-06-15', logs: [{partner: 'A파트너', date: '2024-12-22'}, {partner: 'B파트너', date: '2024-12-20'}, {partner: 'C파트너', date: '2024-12-15'}] },
  { id: 2, name: '강남브레인의원', type: 'hospital', portfolio: 'sleepq', address: '서울시 강남구 역삼동 456, 메디컬타워 3층', city: '서울시', district: '강남구', dong: '역삼동', phone: '010-2222-3333', staff: '이두뇌', partners: ['A파트너'], lastVisit: '2024-12-20', neca: '2024-07-20', logs: [{partner: 'A파트너', date: '2024-12-20'}, {partner: 'A파트너', date: '2024-12-10'}] },
  { id: 3, name: '분당숙면병원', type: 'hospital', portfolio: 'sleepq', address: '경기도 성남시 분당구 정자동 789, 힐링빌딩 2층', city: '경기도', district: '성남시', dong: '분당구', phone: '010-3333-4444', staff: '박숙면', partners: ['B파트너', 'C파트너'], lastVisit: '2024-12-18', neca: '2024-08-10', logs: [{partner: 'C파트너', date: '2024-12-18'}, {partner: 'B파트너', date: '2024-12-12'}] },
  { id: 4, name: '인천꿈의원', type: 'hospital', portfolio: 'sleepq', address: '인천시 연수구 송도동 321, 드림타워 10층 1001호', city: '인천시', district: '연수구', dong: '송도동', phone: '010-4444-5555', staff: '정꿈나라', partners: ['A파트너', 'B파트너'], lastVisit: '2024-12-15', neca: null, logs: [{partner: 'B파트너', date: '2024-12-15'}, {partner: 'A파트너', date: '2024-12-08'}] },
  { id: 5, name: '수원힐링클리닉', type: 'hospital', portfolio: 'sleepq', address: '경기도 수원시 영통구 광교동 555, 광교메디컬센터 4층', city: '경기도', district: '수원시', dong: '영통구', phone: '010-5555-6666', staff: '최힐링', partners: ['C파트너'], lastVisit: '2024-12-10', neca: '2024-09-01', logs: [{partner: 'C파트너', date: '2024-12-10'}] },
  { id: 6, name: '건강약국', type: 'pharmacy', portfolio: 'coaching', address: '서울시 송파구 잠실동 100, 롯데타워 지하 1층', city: '서울시', district: '송파구', dong: '잠실동', phone: '010-6666-7777', staff: '박약사', partners: ['D파트너'], lastVisit: '2024-12-19', neca: null, logs: [{partner: 'D파트너', date: '2024-12-19'}] },
];

export default function AllClientsDashboard() {
  const [logPopup, setLogPopup] = useState(null);
  const [smsPopup, setSmsPopup] = useState(null);
  const [filterPortfolio, setFilterPortfolio] = useState('전체');
  const [filterType, setFilterType] = useState('전체');
  const [filterCity, setFilterCity] = useState('전체');
  const [filterDistrict, setFilterDistrict] = useState('전체');
  const [filterDong, setFilterDong] = useState('전체');

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

  // 필터링 로직
  const filteredClients = clients.filter(c => {
    if (filterPortfolio !== '전체' && c.portfolio !== filterPortfolio) return false;
    if (filterType !== '전체' && c.type !== filterType) return false;
    if (filterCity !== '전체' && c.city !== filterCity) return false;
    if (filterDistrict !== '전체' && c.district !== filterDistrict) return false;
    if (filterDong !== '전체' && c.dong !== filterDong) return false;
    return true;
  });

  return (
    <div style={{ padding: '32px' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#111827', margin: 0 }}>전체고객</h1>
        <p style={{ color: '#6b7280', marginTop: '4px', fontSize: '14px' }}>전체 {filteredClients.length}개 거래처</p>
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
      <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #f3f4f6', overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.8fr 1fr 0.9fr 1.5fr 0.8fr 0.8fr', padding: '16px 24px', background: '#f9fafb', borderBottom: '1px solid #f3f4f6', fontSize: '13px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          <div>거래처명</div>
          <div>주소</div>
          <div>전화번호</div>
          <div>의료진</div>
          <div>방문중인 협력사</div>
          <div>최종 방문</div>
          <div>비고</div>
        </div>

        {filteredClients.map((c, i) => (
          <div key={c.id} style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.8fr 1fr 0.9fr 1.5fr 0.8fr 0.8fr', padding: '20px 24px', borderBottom: i < filteredClients.length - 1 ? '1px solid #f3f4f6' : 'none', alignItems: 'center', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = '#f3f4f6'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
            <div style={{ fontWeight: '600', color: '#111827' }}>{c.name}</div>
            <div style={{ color: '#6b7280', fontSize: '14px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={c.address}>{c.address}</div>
            <div
              style={{ color: '#3b82f6', fontSize: '14px', cursor: 'pointer', textDecoration: 'underline' }}
              onClick={() => setSmsPopup(c)}
            >
              {c.phone}
            </div>
            <div style={{ color: '#6b7280' }}>{c.staff}</div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {c.partners.sort().map((p, j) => (
                <span key={j} style={{ background: '#f9fafb', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', color: '#38bdf8' }}>{p}</span>
              ))}
            </div>
            <div style={{ color: '#fbbf24', cursor: 'pointer' }} onClick={() => setLogPopup(c)}>{c.lastVisit}</div>
            <div style={{ color: c.neca ? '#4ade80' : '#6b7280', fontSize: '13px' }}>{c.neca || '미등록'}</div>
          </div>
        ))}
      </div>

      {/* Log Popup */}
      {logPopup && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ background: '#ffffff', borderRadius: '16px', padding: '32px', width: '450px', border: '1px solid #f3f4f6', position: 'relative', maxHeight: '70vh', overflowY: 'auto' }}>
            <button onClick={() => setLogPopup(null)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', color: '#6b7280', fontSize: '24px', cursor: 'pointer' }}>×</button>
            <h3 style={{ margin: '0 0 8px', color: '#111827' }}>{logPopup.name}</h3>
            <p style={{ color: '#6b7280', margin: '0 0 24px', fontSize: '14px' }}>협력사별 방문 기록</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {logPopup.logs.map((l, i) => (
                <div key={i} style={{ background: '#f9fafb', borderRadius: '12px', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#38bdf8' }}>{l.partner}</span>
                  <span style={{ color: '#fbbf24', fontFamily: 'monospace' }}>{l.date}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SMS Popup */}
      {smsPopup && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ background: '#ffffff', borderRadius: '16px', padding: '32px', width: '450px', border: '1px solid #f3f4f6', position: 'relative' }}>
            <button onClick={() => setSmsPopup(null)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', color: '#6b7280', fontSize: '24px', cursor: 'pointer' }}>×</button>
            <h3 style={{ margin: '0 0 8px', color: '#111827' }}>문자 발송</h3>
            <p style={{ color: '#6b7280', margin: '0 0 24px', fontSize: '14px' }}>{smsPopup.name} · {smsPopup.phone}</p>
            <textarea placeholder="메시지를 입력하세요..." style={{ width: '100%', height: '120px', background: '#f9fafb', border: '1px solid #f3f4f6', borderRadius: '12px', padding: '16px', color: '#111827', fontSize: '14px', resize: 'none', boxSizing: 'border-box' }} />
            <button style={{ width: '100%', marginTop: '16px', padding: '14px', background: 'linear-gradient(135deg, #4ade80, #22c55e)', border: 'none', borderRadius: '12px', color: '#f9fafb', fontWeight: '600', cursor: 'pointer', fontSize: '15px' }}>발송하기</button>
          </div>
        </div>
      )}
    </div>
  );
}
