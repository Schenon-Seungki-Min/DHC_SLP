import React, { useState } from 'react';

const hospitals = [
  { id: 1, name: '서울수면클리닉', doctor: '김수면', partners: ['A파트너', 'B파트너', 'C파트너'], lastVisit: '2024-12-22', neca: '2024-06-15', logs: [{partner: 'A파트너', date: '2024-12-22'}, {partner: 'B파트너', date: '2024-12-20'}, {partner: 'C파트너', date: '2024-12-15'}] },
  { id: 2, name: '강남브레인의원', doctor: '이두뇌', partners: ['A파트너'], lastVisit: '2024-12-20', neca: '2024-07-20', logs: [{partner: 'A파트너', date: '2024-12-20'}, {partner: 'A파트너', date: '2024-12-10'}] },
  { id: 3, name: '분당숙면병원', doctor: '박숙면', partners: ['B파트너', 'C파트너'], lastVisit: '2024-12-18', neca: '2024-08-10', logs: [{partner: 'C파트너', date: '2024-12-18'}, {partner: 'B파트너', date: '2024-12-12'}] },
  { id: 4, name: '인천꿈의원', doctor: '정꿈나라', partners: ['A파트너', 'B파트너'], lastVisit: '2024-12-15', neca: null, logs: [{partner: 'B파트너', date: '2024-12-15'}, {partner: 'A파트너', date: '2024-12-08'}] },
  { id: 5, name: '수원힐링클리닉', doctor: '최힐링', partners: ['C파트너'], lastVisit: '2024-12-10', neca: '2024-09-01', logs: [{partner: 'C파트너', date: '2024-12-10'}] },
];

export default function AllHospitalsDashboard() {
  const [logPopup, setLogPopup] = useState(null);

  return (
    <div style={{ padding: '32px' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#f8fafc', margin: 0 }}>전체 병원 방문 현황</h1>
        <p style={{ color: '#64748b', marginTop: '4px', fontSize: '14px' }}>전체 {hospitals.length}개 병원</p>
      </div>

      {/* Table */}
      <div style={{ background: '#1e293b', borderRadius: '16px', border: '1px solid #334155', overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 2fr 1fr 1fr', padding: '16px 24px', background: '#0f172a', borderBottom: '1px solid #334155', fontSize: '13px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          <div>병원명</div>
          <div>대표원장</div>
          <div>방문중인 협력사</div>
          <div>최종 방문</div>
          <div>NECA</div>
        </div>

        {hospitals.map((h, i) => (
          <div key={h.id} style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 2fr 1fr 1fr', padding: '20px 24px', borderBottom: i < hospitals.length - 1 ? '1px solid #334155' : 'none', alignItems: 'center', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = '#334155'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
            <div style={{ fontWeight: '600', color: '#f1f5f9' }}>{h.name}</div>
            <div style={{ color: '#94a3b8' }}>{h.doctor}</div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {h.partners.sort().map((p, j) => (
                <span key={j} style={{ background: '#0f172a', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', color: '#38bdf8' }}>{p}</span>
              ))}
            </div>
            <div style={{ color: '#fbbf24', cursor: 'pointer' }} onClick={() => setLogPopup(h)}>{h.lastVisit}</div>
            <div style={{ color: h.neca ? '#4ade80' : '#64748b' }}>{h.neca || '미등록'}</div>
          </div>
        ))}
      </div>

      {/* Log Popup */}
      {logPopup && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ background: '#1e293b', borderRadius: '16px', padding: '32px', width: '450px', border: '1px solid #334155', position: 'relative', maxHeight: '70vh', overflowY: 'auto' }}>
            <button onClick={() => setLogPopup(null)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', color: '#64748b', fontSize: '24px', cursor: 'pointer' }}>×</button>
            <h3 style={{ margin: '0 0 8px', color: '#f8fafc' }}>{logPopup.name}</h3>
            <p style={{ color: '#64748b', margin: '0 0 24px', fontSize: '14px' }}>협력사별 방문 기록</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {logPopup.logs.map((l, i) => (
                <div key={i} style={{ background: '#0f172a', borderRadius: '12px', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
