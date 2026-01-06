import React, { useState } from 'react';

const hospitals = [
  { id: 1, name: '서울수면클리닉', address: '서울시 강남구 테헤란로 123', doctor: '김수면', otherDoctors: ['이진료', '박상담'], phone: '010-1234-5678', email: 'seoul@sleep.kr', lastVisit: '2024-12-20', neca: '2024-06-15', partners: [{name: 'A파트너', date: '2024-12-20'}, {name: 'B파트너', date: '2024-12-18'}] },
  { id: 2, name: '강남브레인의원', address: '서울시 강남구 역삼동 456', doctor: '이두뇌', otherDoctors: ['최신경'], phone: '010-2345-6789', email: 'brain@clinic.kr', lastVisit: '2024-12-18', neca: '2024-07-20', partners: [{name: 'A파트너', date: '2024-12-18'}] },
  { id: 3, name: '분당숙면병원', address: '경기도 성남시 분당구 정자동 789', doctor: '박숙면', otherDoctors: [], phone: '010-3456-7890', email: 'bundang@sleep.kr', lastVisit: '2024-12-15', neca: '2024-08-10', partners: [{name: 'C파트너', date: '2024-12-15'}, {name: 'A파트너', date: '2024-12-10'}] },
  { id: 4, name: '인천꿈의원', address: '인천시 연수구 송도동 321', doctor: '정꿈나라', otherDoctors: ['한밤잠', '오숙면'], phone: '010-4567-8901', email: 'dream@incheon.kr', lastVisit: '2024-12-22', neca: null, partners: [{name: 'B파트너', date: '2024-12-22'}] },
];

export default function HospitalDashboard() {
  const [popup, setPopup] = useState({ type: null, data: null });
  const [smsPopup, setSmsPopup] = useState(null);
  const [schedulePopup, setSchedulePopup] = useState(null);
  const [newDate, setNewDate] = useState('');

  const closePopup = () => { setPopup({ type: null, data: null }); setSmsPopup(null); setSchedulePopup(null); };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div style={{ padding: '32px' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#111827', margin: 0 }}>내고객</h1>
        <p style={{ color: '#6b7280', marginTop: '4px', fontSize: '14px' }}>{hospitals.length}개 병원</p>
      </div>

      {/* Table */}
      <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e5e7eb', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        {/* Header Row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 2fr 1fr 1.2fr 1.5fr 1fr', padding: '16px 24px', background: '#f9fafb', borderBottom: '1px solid #e5e7eb', fontSize: '13px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          <div>병원명</div>
          <div>주소</div>
          <div>처방의사</div>
          <div>연락처</div>
          <div>이메일</div>
          <div>최종방문</div>
        </div>

        {/* Data Rows */}
        {hospitals.map((h, i) => (
          <div key={h.id} style={{ display: 'grid', gridTemplateColumns: '1.5fr 2fr 1fr 1.2fr 1.5fr 1fr', padding: '20px 24px', borderBottom: i < hospitals.length - 1 ? '1px solid #f3f4f6' : 'none', alignItems: 'center', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = '#f3f4f6'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
            <div style={{ fontWeight: '600', color: '#111827', cursor: 'pointer' }} onClick={() => setPopup({ type: 'neca', data: h })}>{h.name}</div>
            <div style={{ color: '#6b7280', fontSize: '14px', cursor: 'pointer' }} onClick={() => window.open(`https://map.kakao.com/link/search/${encodeURIComponent(h.address)}`)}>{h.address}</div>
            <div style={{ color: '#38bdf8', cursor: 'pointer' }} onClick={() => setPopup({ type: 'doctors', data: h })}>{h.doctor}</div>
            <div style={{ color: '#4ade80', cursor: 'pointer', fontFamily: 'monospace' }} onClick={() => setSmsPopup(h)}>{h.phone}</div>
            <div style={{ color: '#a78bfa', cursor: 'pointer', fontSize: '14px' }} onClick={() => window.location.href = `mailto:${h.email}`}>{h.email}</div>
            <div style={{ color: '#fbbf24', cursor: 'pointer' }} onClick={() => setSchedulePopup(h)}>{h.lastVisit}</div>
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

      {/* Doctors Popup */}
      {popup.type === 'doctors' && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ background: '#ffffff', borderRadius: '16px', padding: '32px', width: '400px', border: '1px solid #f3f4f6', position: 'relative', maxHeight: '80vh', overflowY: 'auto' }}>
            <button onClick={closePopup} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', color: '#6b7280', fontSize: '24px', cursor: 'pointer' }}>×</button>
            <h3 style={{ margin: '0 0 24px', color: '#111827' }}>소속 의사</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ background: '#f9fafb', borderRadius: '12px', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#111827' }}>{popup.data.doctor}</span>
                <span style={{ background: '#38bdf8', color: '#f9fafb', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' }}>대표원장</span>
              </div>
              {popup.data.otherDoctors.map((d, i) => (
                <div key={i} style={{ background: '#f9fafb', borderRadius: '12px', padding: '16px' }}>
                  <span style={{ color: '#6b7280' }}>{d}</span>
                </div>
              ))}
              {popup.data.otherDoctors.length === 0 && <p style={{ color: '#6b7280', textAlign: 'center', padding: '20px' }}>소속 의사 없음</p>}
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
    </div>
  );
}
