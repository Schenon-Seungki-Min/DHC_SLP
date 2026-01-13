import React, { useState } from 'react';

const clients = [
  { id: 1, name: '서울수면클리닉', type: 'hospital', portfolio: 'sleepq', address: '서울시 강남구', lat: 37.498, lng: 127.028, region: '수도권', isMyClient: true, hasScheduledVisit: true },
  { id: 2, name: '강남브레인의원', type: 'hospital', portfolio: 'sleepq', address: '서울시 강남구', lat: 37.495, lng: 127.038, region: '수도권', isMyClient: true, hasScheduledVisit: false },
  { id: 3, name: '분당숙면병원', type: 'hospital', portfolio: 'sleepq', address: '경기도 성남시', lat: 37.359, lng: 127.105, region: '수도권', isMyClient: false, hasScheduledVisit: false },
  { id: 4, name: '인천꿈의원', type: 'hospital', portfolio: 'sleepq', address: '인천시 연수구', lat: 37.392, lng: 126.640, region: '수도권', isMyClient: true, hasScheduledVisit: true },
  { id: 5, name: '수원힐링클리닉', type: 'hospital', portfolio: 'sleepq', address: '경기도 수원시', lat: 37.263, lng: 127.029, region: '수도권', isMyClient: false, hasScheduledVisit: false },
  { id: 6, name: '건강약국', type: 'pharmacy', portfolio: 'coaching', address: '서울시 송파구', lat: 37.513, lng: 127.100, region: '수도권', isMyClient: true, hasScheduledVisit: true },
  { id: 7, name: '부산해운대의원', type: 'hospital', portfolio: 'sleepq', address: '부산시 해운대구', lat: 35.163, lng: 129.160, region: '지방', isMyClient: false, hasScheduledVisit: false },
  { id: 8, name: '대구수면센터', type: 'hospital', portfolio: 'sleepq', address: '대구시 중구', lat: 35.871, lng: 128.602, region: '지방', isMyClient: false, hasScheduledVisit: false },
  { id: 9, name: '광주브레인클리닉', type: 'hospital', portfolio: 'sleepq', address: '광주시 서구', lat: 35.152, lng: 126.890, region: '지방', isMyClient: false, hasScheduledVisit: false },
];

export default function MapRoutePlanner() {
  const [filterRegion, setFilterRegion] = useState('전체');
  const [filterPortfolio, setFilterPortfolio] = useState('전체');
  const [filterType, setFilterType] = useState('전체');
  const [myList, setMyList] = useState([]);
  const [hoveredId, setHoveredId] = useState(null);

  const filtered = clients.filter(c => {
    if (filterRegion !== '전체' && c.region !== filterRegion) return false;
    if (filterPortfolio !== '전체' && c.portfolio !== filterPortfolio) return false;
    if (filterType !== '전체' && c.type !== filterType) return false;
    return true;
  });
  const toggleList = (c) => setMyList(prev => prev.find(x => x.id === c.id) ? prev.filter(x => x.id !== c.id) : [...prev, c]);
  const isInList = (id) => myList.some(x => x.id === id);

  // 지도 영역 계산
  const mapBounds = { minLat: 34.5, maxLat: 38.5, minLng: 125.5, maxLng: 130 };
  const toPos = (lat, lng) => ({
    x: ((lng - mapBounds.minLng) / (mapBounds.maxLng - mapBounds.minLng)) * 100,
    y: ((mapBounds.maxLat - lat) / (mapBounds.maxLat - mapBounds.minLat)) * 100
  });

  return (
    <div style={{ padding: '32px' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#111827', margin: 0 }}>콜플랜</h1>
            <p style={{ color: '#6b7280', marginTop: '4px', fontSize: '14px' }}>방문 계획을 세우세요</p>
          </div>
        </div>
        {/* Filters */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <div>
            <label style={{ color: '#6b7280', fontSize: '12px', marginBottom: '6px', display: 'block' }}>지역</label>
            <select value={filterRegion} onChange={e => setFilterRegion(e.target.value)} style={{ padding: '8px 12px', background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '8px', color: '#111827', fontSize: '14px', cursor: 'pointer' }}>
              <option value="전체">전체</option>
              <option value="수도권">수도권</option>
              <option value="지방">지방</option>
            </select>
          </div>
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
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '24px' }}>
        {/* Map Area */}
        <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #f3f4f6', height: '600px', position: 'relative', overflow: 'hidden' }}>
          {/* 대한민국 간략 배경 */}
          <svg viewBox="0 0 100 100" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.1 }}>
            <path d="M30,20 Q50,15 70,25 L75,50 Q70,80 50,90 Q30,85 25,60 Z" fill="#3b82f6" />
          </svg>
          
          {/* 마커들 */}
          {filtered.map(c => {
            const pos = toPos(c.lat, c.lng);
            const inList = isInList(c.id);
            const isHovered = hoveredId === c.id;
            // 마커 색상 분기: 빨강(방문예정) > 초록(내담당) > 파랑(기타)
            const markerColor = c.hasScheduledVisit ? '#ef4444' : (c.isMyClient ? '#4ade80' : '#3b82f6');
            return (
              <div key={c.id} onClick={() => toggleList(c)} onMouseEnter={() => setHoveredId(c.id)} onMouseLeave={() => setHoveredId(null)}
                style={{ position: 'absolute', left: `${pos.x}%`, top: `${pos.y}%`, transform: 'translate(-50%, -50%)', cursor: 'pointer', zIndex: isHovered ? 10 : 1 }}>
                <div style={{ width: inList ? '20px' : '14px', height: inList ? '20px' : '14px', borderRadius: '50%', background: markerColor, border: '3px solid #f9fafb', boxShadow: isHovered ? '0 0 20px rgba(59,130,246,0.8)' : '0 2px 8px rgba(0,0,0,0.5)', transition: 'all 0.2s' }} />
                {isHovered && (
                  <div style={{ position: 'absolute', bottom: '100%', left: '50%', transform: 'translateX(-50%)', marginBottom: '8px', background: '#f9fafb', padding: '8px 12px', borderRadius: '8px', whiteSpace: 'nowrap', fontSize: '13px', border: '1px solid #f3f4f6' }}>
                    <div style={{ fontWeight: '600', color: '#111827' }}>{c.name}</div>
                    <div style={{ color: '#6b7280', fontSize: '11px' }}>{c.address}</div>
                  </div>
                )}
              </div>
            );
          })}

          {/* 범례 */}
          <div style={{ position: 'absolute', bottom: '16px', left: '16px', background: '#f9fafb', padding: '12px 16px', borderRadius: '12px', fontSize: '12px', border: '1px solid #f3f4f6' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ef4444' }} />
              <span style={{ color: '#6b7280' }}>방문예정</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#4ade80' }} />
              <span style={{ color: '#6b7280' }}>내 담당</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#3b82f6' }} />
              <span style={{ color: '#6b7280' }}>기타</span>
            </div>
          </div>
        </div>

        {/* My List Panel */}
        <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #f3f4f6', padding: '24px', height: '600px', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ margin: '0 0 4px', color: '#111827', fontSize: '18px' }}>나만의 리스트</h3>
          <p style={{ color: '#6b7280', fontSize: '13px', margin: '0 0 20px' }}>{myList.length}개 선택</p>
          
          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {myList.length === 0 ? (
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6b7280', fontSize: '14px', textAlign: 'center' }}>
                지도에서 거래처를<br/>클릭하여 추가하세요
              </div>
            ) : (
              myList.map((c, i) => (
                <div key={c.id} style={{ background: '#f9fafb', borderRadius: '12px', padding: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ background: '#4ade80', color: '#f9fafb', width: '20px', height: '20px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: '700' }}>{i + 1}</span>
                      <span style={{ color: '#111827', fontWeight: '500' }}>{c.name}</span>
                    </div>
                    <div style={{ color: '#6b7280', fontSize: '12px', marginTop: '4px', marginLeft: '28px' }}>{c.address}</div>
                  </div>
                  <button onClick={() => toggleList(c)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '18px', padding: '4px' }}>×</button>
                </div>
              ))
            )}
          </div>

          {myList.length > 0 && (
            <button style={{ marginTop: '16px', padding: '14px', background: 'linear-gradient(135deg, #4ade80, #22c55e)', border: 'none', borderRadius: '12px', color: '#f9fafb', fontWeight: '600', cursor: 'pointer', fontSize: '15px' }}>
              동선 확정하기
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
