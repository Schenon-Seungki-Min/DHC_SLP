import React, { useState } from 'react';

const clients = [
  { id: 1, name: '서울수면클리닉', staff: '김수면', partners: ['A파트너', 'B파트너', 'C파트너'], lastVisit: '2024-12-22', neca: '2024-06-15', logs: [{partner: 'A파트너', date: '2024-12-22'}, {partner: 'B파트너', date: '2024-12-20'}, {partner: 'C파트너', date: '2024-12-15'}] },
  { id: 2, name: '강남브레인의원', staff: '이두뇌', partners: ['A파트너'], lastVisit: '2024-12-20', neca: '2024-07-20', logs: [{partner: 'A파트너', date: '2024-12-20'}, {partner: 'A파트너', date: '2024-12-10'}] },
  { id: 3, name: '분당숙면병원', staff: '박숙면', partners: ['B파트너', 'C파트너'], lastVisit: '2024-12-18', neca: '2024-08-10', logs: [{partner: 'C파트너', date: '2024-12-18'}, {partner: 'B파트너', date: '2024-12-12'}] },
  { id: 4, name: '인천꿈의원', staff: '정꿈나라', partners: ['A파트너', 'B파트너'], lastVisit: '2024-12-15', neca: null, logs: [{partner: 'B파트너', date: '2024-12-15'}, {partner: 'A파트너', date: '2024-12-08'}] },
  { id: 5, name: '수원힐링클리닉', staff: '최힐링', partners: ['C파트너'], lastVisit: '2024-12-10', neca: '2024-09-01', logs: [{partner: 'C파트너', date: '2024-12-10'}] },
];

export default function AllClientsDashboard() {
  const [logPopup, setLogPopup] = useState(null);

  return (
    <div style={{ padding: '32px' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#111827', margin: 0 }}>전체고객</h1>
        <p style={{ color: '#6b7280', marginTop: '4px', fontSize: '14px' }}>전체 {clients.length}개 거래처</p>
      </div>

      {/* Table */}
      <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #f3f4f6', overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 2fr 1fr 1fr', padding: '16px 24px', background: '#f9fafb', borderBottom: '1px solid #f3f4f6', fontSize: '13px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          <div>거래처명</div>
          <div>대표 담당자</div>
          <div>방문중인 협력사</div>
          <div>최종 방문</div>
          <div>NECA</div>
        </div>

        {clients.map((c, i) => (
          <div key={c.id} style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 2fr 1fr 1fr', padding: '20px 24px', borderBottom: i < clients.length - 1 ? '1px solid #f3f4f6' : 'none', alignItems: 'center', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = '#f3f4f6'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
            <div style={{ fontWeight: '600', color: '#111827' }}>{c.name}</div>
            <div style={{ color: '#6b7280' }}>{c.staff}</div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {c.partners.sort().map((p, j) => (
                <span key={j} style={{ background: '#f9fafb', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', color: '#38bdf8' }}>{p}</span>
              ))}
            </div>
            <div style={{ color: '#fbbf24', cursor: 'pointer' }} onClick={() => setLogPopup(c)}>{c.lastVisit}</div>
            <div style={{ color: c.neca ? '#4ade80' : '#6b7280' }}>{c.neca || '미등록'}</div>
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
    </div>
  );
}
