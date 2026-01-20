import React, { useState } from 'react';

const clients = [
  { id: 1, name: '서울수면클리닉', type: 'hospital', portfolio: 'sleepq', address: '서울시 강남구 테헤란로 123', lat: 37.498, lng: 127.028, region: '수도권', isMyClient: true, grade: 'A', scheduledVisit: '2025-01-20', lastVisit: '2024-12-20' },
  { id: 2, name: '강남브레인의원', type: 'hospital', portfolio: 'sleepq', address: '서울시 강남구 역삼동 456', lat: 37.495, lng: 127.038, region: '수도권', isMyClient: true, grade: 'B', scheduledVisit: null, lastVisit: '2024-12-18' },
  { id: 3, name: '분당숙면병원', type: 'hospital', portfolio: 'sleepq', address: '경기도 성남시 분당구', lat: 37.359, lng: 127.105, region: '수도권', isMyClient: false, grade: 'C', scheduledVisit: '2025-01-20', lastVisit: '2024-12-15' },
  { id: 4, name: '인천꿈의원', type: 'hospital', portfolio: 'sleepq', address: '인천시 연수구 송도동', lat: 37.392, lng: 126.640, region: '수도권', isMyClient: true, grade: 'A', scheduledVisit: '2025-01-22', lastVisit: '2024-12-22' },
  { id: 5, name: '수원힐링클리닉', type: 'hospital', portfolio: 'sleepq', address: '경기도 수원시 영통구', lat: 37.263, lng: 127.029, region: '수도권', isMyClient: false, grade: 'C', scheduledVisit: '2025-01-25', lastVisit: '2024-12-10' },
  { id: 6, name: '건강약국', type: 'pharmacy', portfolio: 'coaching', address: '서울시 송파구 잠실동', lat: 37.513, lng: 127.100, region: '수도권', isMyClient: true, grade: 'B', scheduledVisit: '2025-01-20', lastVisit: '2024-12-19' },
  { id: 7, name: '부산해운대의원', type: 'hospital', portfolio: 'sleepq', address: '부산시 해운대구', lat: 35.163, lng: 129.160, region: '지방', isMyClient: false, grade: 'D', scheduledVisit: '2025-01-28', lastVisit: '2024-12-05' },
  { id: 8, name: '대구수면센터', type: 'hospital', portfolio: 'sleepq', address: '대구시 중구', lat: 35.871, lng: 128.602, region: '지방', isMyClient: false, grade: 'C', scheduledVisit: null, lastVisit: '2024-12-08' },
  { id: 9, name: '광주브레인클리닉', type: 'hospital', portfolio: 'sleepq', address: '광주시 서구', lat: 35.152, lng: 126.890, region: '지방', isMyClient: false, grade: 'D', scheduledVisit: '2025-01-30', lastVisit: '2024-12-01' },
];

// 간단한 Calendar 컴포넌트
function Calendar({ selectedDate, onDateClick, visitDates }) {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

  const monthNames = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const formatDate = (year, month, day) => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  const hasVisit = (dateStr) => visitDates.has(dateStr);

  const isToday = (day) => {
    return today.getDate() === day && today.getMonth() === currentMonth && today.getFullYear() === currentYear;
  };

  const isSelected = (day) => {
    const dateStr = formatDate(currentYear, currentMonth, day);
    return selectedDate === dateStr;
  };

  const days = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(<div key={`empty-${i}`} />);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = formatDate(currentYear, currentMonth, day);
    const todayFlag = isToday(day);
    const selectedFlag = isSelected(day);
    const hasVisitFlag = hasVisit(dateStr);

    days.push(
      <div
        key={day}
        onClick={() => onDateClick(dateStr)}
        style={{
          padding: '8px',
          textAlign: 'center',
          cursor: 'pointer',
          borderRadius: '8px',
          background: selectedFlag ? '#3b82f6' : todayFlag ? '#f3f4f6' : 'transparent',
          color: selectedFlag ? '#ffffff' : todayFlag ? '#111827' : '#111827',
          fontWeight: todayFlag || selectedFlag ? '600' : 'normal',
          fontSize: '14px',
          position: 'relative',
          transition: 'all 0.2s'
        }}
        onMouseEnter={e => {
          if (!selectedFlag) e.currentTarget.style.background = '#f9fafb';
        }}
        onMouseLeave={e => {
          if (!selectedFlag) e.currentTarget.style.background = todayFlag ? '#f3f4f6' : 'transparent';
        }}
      >
        {day}
        {hasVisitFlag && (
          <div style={{
            position: 'absolute',
            bottom: '2px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '4px',
            height: '4px',
            borderRadius: '50%',
            background: selectedFlag ? '#ffffff' : '#3b82f6'
          }} />
        )}
      </div>
    );
  }

  return (
    <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #f3f4f6', padding: '20px', height: '600px', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <button onClick={prevMonth} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', color: '#6b7280' }}>‹</button>
        <div style={{ fontWeight: '600', color: '#111827' }}>{currentYear}년 {monthNames[currentMonth]}</div>
        <button onClick={nextMonth} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', color: '#6b7280' }}>›</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', marginBottom: '8px' }}>
        {['일', '월', '화', '수', '목', '금', '토'].map((d, i) => (
          <div key={d} style={{ textAlign: 'center', fontSize: '12px', color: '#6b7280', fontWeight: '500' }}>{d}</div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', flex: 1 }}>
        {days}
      </div>
    </div>
  );
}

export default function MapRoutePlanner() {
  const [filterRegion, setFilterRegion] = useState('전체');
  const [filterPortfolio, setFilterPortfolio] = useState('전체');
  const [filterType, setFilterType] = useState('전체');
  const [myList, setMyList] = useState([]);
  const [hoveredId, setHoveredId] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]); // 오늘 날짜

  const filtered = clients.filter(c => {
    if (filterRegion !== '전체' && c.region !== filterRegion) return false;
    if (filterPortfolio !== '전체' && c.portfolio !== filterPortfolio) return false;
    if (filterType !== '전체' && c.type !== filterType) return false;
    return true;
  });

  const toggleList = (c) => setMyList(prev => prev.find(x => x.id === c.id) ? prev.filter(x => x.id !== c.id) : [...prev, c]);
  const isInList = (id) => myList.some(x => x.id === id);

  // 선택된 날짜의 방문 예정 거래처
  const todayClients = clients.filter(c => c.scheduledVisit === selectedDate);

  // 달력에 표시할 날짜들 (방문 예정일이 있는 날짜)
  const visitDates = new Set(clients.filter(c => c.scheduledVisit).map(c => c.scheduledVisit));

  // 지도 영역 계산
  const mapBounds = { minLat: 34.5, maxLat: 38.5, minLng: 125.5, maxLng: 130 };
  const toPos = (lat, lng) => ({
    x: ((lng - mapBounds.minLng) / (mapBounds.maxLng - mapBounds.minLng)) * 100,
    y: ((mapBounds.maxLat - lat) / (mapBounds.maxLat - mapBounds.minLat)) * 100
  });

  const formatDateKorean = (dateStr) => {
    const date = new Date(dateStr);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
    const weekday = weekdays[date.getDay()];
    return `${month}월 ${day}일 (${weekday})`;
  };

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

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 320px 320px', gap: '24px' }}>
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
            return (
              <div key={c.id} onClick={() => toggleList(c)} onMouseEnter={() => setHoveredId(c.id)} onMouseLeave={() => setHoveredId(null)}
                style={{ position: 'absolute', left: `${pos.x}%`, top: `${pos.y}%`, transform: 'translate(-50%, -50%)', cursor: 'pointer', zIndex: isHovered ? 10 : 1 }}>
                <div style={{
                  width: inList ? '28px' : '22px',
                  height: inList ? '28px' : '22px',
                  borderRadius: '50%',
                  background: '#ffffff',
                  border: c.isMyClient ? '3px solid #111827' : '2px solid #9ca3af',
                  boxShadow: isHovered ? '0 0 20px rgba(59,130,246,0.8)' : '0 2px 8px rgba(0,0,0,0.3)',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: inList ? '14px' : '11px',
                  fontWeight: '700',
                  color: '#111827'
                }}>
                  {c.grade}
                </div>
                {isHovered && (
                  <div style={{ position: 'absolute', bottom: '100%', left: '50%', transform: 'translateX(-50%)', marginBottom: '8px', background: '#f9fafb', padding: '8px 12px', borderRadius: '8px', whiteSpace: 'nowrap', fontSize: '13px', border: '1px solid #f3f4f6' }}>
                    <div style={{ fontWeight: '600', color: '#111827' }}>{c.name}</div>
                    <div style={{ color: '#6b7280', fontSize: '11px' }}>{c.address}</div>
                    <div style={{ color: '#6b7280', fontSize: '11px', marginTop: '4px' }}>그레이드: {c.grade}</div>
                  </div>
                )}
              </div>
            );
          })}

          {/* 범례 */}
          <div style={{ position: 'absolute', bottom: '16px', left: '16px', background: '#f9fafb', padding: '12px 16px', borderRadius: '12px', fontSize: '12px', border: '1px solid #f3f4f6' }}>
            <div style={{ fontWeight: '600', color: '#111827', marginBottom: '8px' }}>그레이드</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: '#ffffff', border: '2px solid #111827', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: '700' }}>A</div>
              <span style={{ color: '#6b7280' }}>월 3회 이상</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: '#ffffff', border: '2px solid #9ca3af', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: '700' }}>B</div>
              <span style={{ color: '#6b7280' }}>월 2회</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: '#ffffff', border: '2px solid #9ca3af', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: '700' }}>C</div>
              <span style={{ color: '#6b7280' }}>월 1회</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: '#ffffff', border: '2px solid #9ca3af', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: '700' }}>D</div>
              <span style={{ color: '#6b7280' }}>필요시</span>
            </div>
          </div>
        </div>

        {/* Today's List Panel */}
        <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #f3f4f6', padding: '24px', height: '600px', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ margin: '0 0 4px', color: '#111827', fontSize: '18px' }}>{formatDateKorean(selectedDate)}</h3>
          <p style={{ color: '#6b7280', fontSize: '13px', margin: '0 0 20px' }}>{todayClients.length}개 방문 예정</p>

          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {todayClients.length === 0 ? (
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6b7280', fontSize: '14px', textAlign: 'center' }}>
                이 날짜에<br/>방문 예정인 거래처가<br/>없습니다
              </div>
            ) : (
              todayClients.map((c, i) => (
                <div key={c.id} style={{ background: '#f9fafb', borderRadius: '12px', padding: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <span style={{ background: '#4ade80', color: '#f9fafb', width: '20px', height: '20px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: '700' }}>{i + 1}</span>
                    <span style={{ color: '#111827', fontWeight: '600', fontSize: '14px' }}>{c.name}</span>
                  </div>
                  <div style={{ color: '#6b7280', fontSize: '12px', marginLeft: '28px', marginBottom: '6px' }}>{c.address}</div>
                  <div style={{ marginLeft: '28px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px' }}>
                      <span style={{ color: '#6b7280' }}>방문 예정일</span>
                      <span style={{ color: '#fbbf24', fontWeight: '600' }}>{c.scheduledVisit || '-'}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px' }}>
                      <span style={{ color: '#6b7280' }}>마지막 방문일</span>
                      <span style={{ color: '#38bdf8', fontWeight: '600' }}>{c.lastVisit}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Calendar Panel */}
        <Calendar selectedDate={selectedDate} onDateClick={setSelectedDate} visitDates={visitDates} />
      </div>
    </div>
  );
}
