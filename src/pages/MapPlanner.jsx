import React, { useState } from 'react';

const hospitals = [
  { id: 1, name: '서울수면클리닉', address: '서울시 강남구', lat: 37.498, lng: 127.028, region: '수도권' },
  { id: 2, name: '강남브레인의원', address: '서울시 강남구', lat: 37.495, lng: 127.038, region: '수도권' },
  { id: 3, name: '분당숙면병원', address: '경기도 성남시', lat: 37.359, lng: 127.105, region: '수도권' },
  { id: 4, name: '인천꿈의원', address: '인천시 연수구', lat: 37.392, lng: 126.640, region: '수도권' },
  { id: 5, name: '수원힐링클리닉', address: '경기도 수원시', lat: 37.263, lng: 127.029, region: '수도권' },
  { id: 6, name: '부산해운대의원', address: '부산시 해운대구', lat: 35.163, lng: 129.160, region: '지방' },
  { id: 7, name: '대구수면센터', address: '대구시 중구', lat: 35.871, lng: 128.602, region: '지방' },
  { id: 8, name: '광주브레인클리닉', address: '광주시 서구', lat: 35.152, lng: 126.890, region: '지방' },
];

export default function MapRoutePlanner() {
  const [filter, setFilter] = useState('전체');
  const [myList, setMyList] = useState([]);
  const [hoveredId, setHoveredId] = useState(null);

  const filtered = filter === '전체' ? hospitals : hospitals.filter(h => h.region === filter);
  const toggleList = (h) => setMyList(prev => prev.find(x => x.id === h.id) ? prev.filter(x => x.id !== h.id) : [...prev, h]);
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
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#f8fafc', margin: 0 }}>동선 계획</h1>
          <p style={{ color: '#64748b', marginTop: '4px', fontSize: '14px' }}>지도에서 병원을 선택하세요</p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {['전체', '수도권', '지방'].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{ padding: '8px 16px', background: filter === f ? '#3b82f6' : 'transparent', border: '1px solid #334155', borderRadius: '8px', color: filter === f ? '#fff' : '#94a3b8', cursor: 'pointer', fontSize: '14px' }}>{f}</button>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '24px' }}>
        {/* Map Area */}
        <div style={{ background: '#1e293b', borderRadius: '16px', border: '1px solid #334155', height: '600px', position: 'relative', overflow: 'hidden' }}>
          {/* 대한민국 간략 배경 */}
          <svg viewBox="0 0 100 100" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.1 }}>
            <path d="M30,20 Q50,15 70,25 L75,50 Q70,80 50,90 Q30,85 25,60 Z" fill="#3b82f6" />
          </svg>
          
          {/* 마커들 */}
          {filtered.map(h => {
            const pos = toPos(h.lat, h.lng);
            const inList = isInList(h.id);
            const isHovered = hoveredId === h.id;
            return (
              <div key={h.id} onClick={() => toggleList(h)} onMouseEnter={() => setHoveredId(h.id)} onMouseLeave={() => setHoveredId(null)}
                style={{ position: 'absolute', left: `${pos.x}%`, top: `${pos.y}%`, transform: 'translate(-50%, -50%)', cursor: 'pointer', zIndex: isHovered ? 10 : 1 }}>
                <div style={{ width: inList ? '20px' : '14px', height: inList ? '20px' : '14px', borderRadius: '50%', background: inList ? '#4ade80' : '#3b82f6', border: '3px solid #0f172a', boxShadow: isHovered ? '0 0 20px rgba(59,130,246,0.8)' : '0 2px 8px rgba(0,0,0,0.5)', transition: 'all 0.2s' }} />
                {isHovered && (
                  <div style={{ position: 'absolute', bottom: '100%', left: '50%', transform: 'translateX(-50%)', marginBottom: '8px', background: '#0f172a', padding: '8px 12px', borderRadius: '8px', whiteSpace: 'nowrap', fontSize: '13px', border: '1px solid #334155' }}>
                    <div style={{ fontWeight: '600', color: '#f8fafc' }}>{h.name}</div>
                    <div style={{ color: '#64748b', fontSize: '11px' }}>{h.address}</div>
                  </div>
                )}
              </div>
            );
          })}

          {/* 범례 */}
          <div style={{ position: 'absolute', bottom: '16px', left: '16px', background: '#0f172a', padding: '12px 16px', borderRadius: '12px', fontSize: '12px', border: '1px solid #334155' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#3b82f6' }} />
              <span style={{ color: '#94a3b8' }}>처방 병원</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#4ade80' }} />
              <span style={{ color: '#94a3b8' }}>내 리스트</span>
            </div>
          </div>
        </div>

        {/* My List Panel */}
        <div style={{ background: '#1e293b', borderRadius: '16px', border: '1px solid #334155', padding: '24px', height: '600px', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ margin: '0 0 4px', color: '#f8fafc', fontSize: '18px' }}>나만의 리스트</h3>
          <p style={{ color: '#64748b', fontSize: '13px', margin: '0 0 20px' }}>{myList.length}개 선택</p>
          
          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {myList.length === 0 ? (
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', fontSize: '14px', textAlign: 'center' }}>
                지도에서 병원을<br/>클릭하여 추가하세요
              </div>
            ) : (
              myList.map((h, i) => (
                <div key={h.id} style={{ background: '#0f172a', borderRadius: '12px', padding: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ background: '#4ade80', color: '#0f172a', width: '20px', height: '20px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: '700' }}>{i + 1}</span>
                      <span style={{ color: '#f1f5f9', fontWeight: '500' }}>{h.name}</span>
                    </div>
                    <div style={{ color: '#64748b', fontSize: '12px', marginTop: '4px', marginLeft: '28px' }}>{h.address}</div>
                  </div>
                  <button onClick={() => toggleList(h)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '18px', padding: '4px' }}>×</button>
                </div>
              ))
            )}
          </div>

          {myList.length > 0 && (
            <button style={{ marginTop: '16px', padding: '14px', background: 'linear-gradient(135deg, #4ade80, #22c55e)', border: 'none', borderRadius: '12px', color: '#0f172a', fontWeight: '600', cursor: 'pointer', fontSize: '15px' }}>
              동선 확정하기
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
