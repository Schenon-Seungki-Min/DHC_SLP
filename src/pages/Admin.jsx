import React, { useState } from 'react';

const initialHospitals = [
  { id: 1, name: '서울수면클리닉', address: '서울시 강남구 테헤란로 123', phone: '02-1234-5678', email: 'seoul@sleep.kr', neca: '2024-06-15', isPrescribing: true, doctors: [{name: '김수면', isRep: true, phone: '010-1111-1111', email: 'kim@sleep.kr'}, {name: '이진료', isRep: false, phone: '010-2222-2222', email: 'lee@sleep.kr'}], partners: ['A파트너', 'B파트너'] },
  { id: 2, name: '강남브레인의원', address: '서울시 강남구 역삼동 456', phone: '02-2345-6789', email: 'brain@clinic.kr', neca: '2024-07-20', isPrescribing: true, doctors: [{name: '이두뇌', isRep: true, phone: '010-3333-3333', email: 'brain@clinic.kr'}], partners: ['A파트너'] },
  { id: 3, name: '인천꿈의원', address: '인천시 연수구 송도동 321', phone: '032-456-7890', email: 'dream@incheon.kr', neca: null, isPrescribing: false, doctors: [{name: '정꿈나라', isRep: true, phone: '010-4444-4444', email: 'dream@incheon.kr'}], partners: ['B파트너', 'C파트너'] },
];

const allPartners = ['A파트너', 'B파트너', 'C파트너', 'D파트너'];

export default function AdminDashboard() {
  const [hospitals, setHospitals] = useState(initialHospitals);
  const [editPopup, setEditPopup] = useState(null);
  const [addPopup, setAddPopup] = useState(false);
  const [newHospital, setNewHospital] = useState({ name: '', address: '', phone: '', email: '', neca: '', isPrescribing: false, doctors: [{name: '', isRep: true, phone: '', email: ''}], partners: [] });

  const closeAll = () => { setEditPopup(null); setAddPopup(false); };

  const togglePartner = (hospital, partner, isEdit = false) => {
    if (isEdit) {
      setEditPopup(prev => ({
        ...prev,
        partners: prev.partners.includes(partner) ? prev.partners.filter(p => p !== partner) : [...prev.partners, partner]
      }));
    } else {
      setNewHospital(prev => ({
        ...prev,
        partners: prev.partners.includes(partner) ? prev.partners.filter(p => p !== partner) : [...prev.partners, partner]
      }));
    }
  };

  const addDoctor = (isEdit = false) => {
    const newDoc = {name: '', isRep: false, phone: '', email: ''};
    if (isEdit) {
      setEditPopup(prev => ({...prev, doctors: [...prev.doctors, newDoc]}));
    } else {
      setNewHospital(prev => ({...prev, doctors: [...prev.doctors, newDoc]}));
    }
  };

  const updateDoctor = (index, field, value, isEdit = false) => {
    if (isEdit) {
      setEditPopup(prev => {
        const docs = [...prev.doctors];
        docs[index] = {...docs[index], [field]: value};
        return {...prev, doctors: docs};
      });
    } else {
      setNewHospital(prev => {
        const docs = [...prev.doctors];
        docs[index] = {...docs[index], [field]: value};
        return {...prev, doctors: docs};
      });
    }
  };

  const saveNew = () => {
    setHospitals(prev => [...prev, {...newHospital, id: Date.now()}]);
    setNewHospital({ name: '', address: '', phone: '', email: '', neca: '', isPrescribing: false, doctors: [{name: '', isRep: true, phone: '', email: ''}], partners: [] });
    setAddPopup(false);
  };

  const saveEdit = () => {
    setHospitals(prev => prev.map(h => h.id === editPopup.id ? editPopup : h));
    setEditPopup(null);
  };

  const inputStyle = { width: '100%', background: '#f9fafb', border: '1px solid #f3f4f6', borderRadius: '8px', padding: '10px 12px', color: '#111827', fontSize: '14px', boxSizing: 'border-box' };
  const labelStyle = { color: '#6b7280', fontSize: '12px', marginBottom: '6px', display: 'block' };

  const HospitalForm = ({ data, setData, isEdit }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: '60vh', overflowY: 'auto', paddingRight: '8px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <div><label style={labelStyle}>병원명 *</label><input style={inputStyle} value={data.name} onChange={e => setData(prev => ({...prev, name: e.target.value}))} /></div>
        <div><label style={labelStyle}>대표 전화번호</label><input style={inputStyle} value={data.phone} onChange={e => setData(prev => ({...prev, phone: e.target.value}))} /></div>
      </div>
      <div><label style={labelStyle}>병원 주소</label><input style={inputStyle} value={data.address} onChange={e => setData(prev => ({...prev, address: e.target.value}))} /></div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <div><label style={labelStyle}>대표 이메일</label><input style={inputStyle} value={data.email} onChange={e => setData(prev => ({...prev, email: e.target.value}))} /></div>
        <div><label style={labelStyle}>NECA 등록일</label><input type="date" style={inputStyle} value={data.neca || ''} onChange={e => setData(prev => ({...prev, neca: e.target.value}))} /></div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <label style={{...labelStyle, margin: 0}}>처방 여부</label>
        <button onClick={() => setData(prev => ({...prev, isPrescribing: !prev.isPrescribing}))} style={{ padding: '6px 16px', background: data.isPrescribing ? '#4ade80' : '#f3f4f6', border: 'none', borderRadius: '20px', color: data.isPrescribing ? '#f9fafb' : '#6b7280', cursor: 'pointer', fontSize: '13px' }}>
          {data.isPrescribing ? '처방중' : '미처방'}
        </button>
      </div>

      <div style={{ borderTop: '1px solid #f3f4f6', paddingTop: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <label style={{...labelStyle, margin: 0}}>소속 의사</label>
          <button onClick={() => addDoctor(isEdit)} style={{ background: 'none', border: '1px solid #3b82f6', color: '#3b82f6', padding: '4px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}>+ 추가</button>
        </div>
        {data.doctors.map((doc, i) => (
          <div key={i} style={{ background: '#f9fafb', borderRadius: '10px', padding: '12px', marginBottom: '8px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '8px', marginBottom: '8px' }}>
              <input placeholder="이름" style={{...inputStyle, background: '#ffffff'}} value={doc.name} onChange={e => updateDoctor(i, 'name', e.target.value, isEdit)} />
              <input placeholder="연락처" style={{...inputStyle, background: '#ffffff'}} value={doc.phone} onChange={e => updateDoctor(i, 'phone', e.target.value, isEdit)} />
              <button onClick={() => updateDoctor(i, 'isRep', !doc.isRep, isEdit)} style={{ padding: '8px 12px', background: doc.isRep ? '#38bdf8' : '#f3f4f6', border: 'none', borderRadius: '6px', color: doc.isRep ? '#f9fafb' : '#6b7280', cursor: 'pointer', fontSize: '11px', whiteSpace: 'nowrap' }}>
                {doc.isRep ? '대표' : '일반'}
              </button>
            </div>
            <input placeholder="이메일" style={{...inputStyle, background: '#ffffff'}} value={doc.email} onChange={e => updateDoctor(i, 'email', e.target.value, isEdit)} />
          </div>
        ))}
      </div>

      <div style={{ borderTop: '1px solid #f3f4f6', paddingTop: '16px' }}>
        <label style={labelStyle}>담당 협력사</label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {allPartners.map(p => (
            <button key={p} onClick={() => togglePartner(data, p, isEdit)} style={{ padding: '8px 16px', background: data.partners.includes(p) ? '#3b82f6' : '#f9fafb', border: '1px solid #f3f4f6', borderRadius: '20px', color: data.partners.includes(p) ? '#fff' : '#6b7280', cursor: 'pointer', fontSize: '13px' }}>{p}</button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ padding: '32px' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#111827', margin: 0 }}>병원 정보 관리</h1>
          <p style={{ color: '#6b7280', marginTop: '4px', fontSize: '14px' }}>{hospitals.length}개 병원</p>
        </div>
        <button onClick={() => setAddPopup(true)} style={{ padding: '12px 24px', background: 'linear-gradient(135deg, #3b82f6, #2563eb)', border: 'none', borderRadius: '10px', color: '#fff', fontWeight: '600', cursor: 'pointer', fontSize: '14px' }}>+ 병원 등록</button>
      </div>

      {/* Table */}
      <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #f3f4f6', overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 2fr 1fr 1fr 1.5fr 80px', padding: '16px 24px', background: '#f9fafb', borderBottom: '1px solid #f3f4f6', fontSize: '13px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          <div>병원명</div><div>주소</div><div>대표원장</div><div>NECA</div><div>담당 협력사</div><div></div>
        </div>
        {hospitals.map((h, i) => (
          <div key={h.id} style={{ display: 'grid', gridTemplateColumns: '1.5fr 2fr 1fr 1fr 1.5fr 80px', padding: '18px 24px', borderBottom: i < hospitals.length - 1 ? '1px solid #f3f4f6' : 'none', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: h.isPrescribing ? '#4ade80' : '#6b7280' }} />
              <span style={{ fontWeight: '600', color: '#111827' }}>{h.name}</span>
            </div>
            <div style={{ color: '#6b7280', fontSize: '14px' }}>{h.address}</div>
            <div style={{ color: '#38bdf8' }}>{h.doctors.find(d => d.isRep)?.name || '-'}</div>
            <div style={{ color: h.neca ? '#4ade80' : '#6b7280', fontSize: '14px' }}>{h.neca || '미등록'}</div>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {h.partners.map(p => <span key={p} style={{ background: '#f9fafb', padding: '3px 10px', borderRadius: '12px', fontSize: '11px', color: '#6b7280' }}>{p}</span>)}
            </div>
            <button onClick={() => setEditPopup({...h})} style={{ background: 'none', border: '1px solid #f3f4f6', borderRadius: '6px', color: '#6b7280', padding: '6px 12px', cursor: 'pointer', fontSize: '12px' }}>수정</button>
          </div>
        ))}
      </div>

      {/* Add Popup */}
      {addPopup && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ background: '#ffffff', borderRadius: '16px', padding: '32px', width: '560px', border: '1px solid #f3f4f6', position: 'relative' }}>
            <button onClick={closeAll} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', color: '#6b7280', fontSize: '24px', cursor: 'pointer' }}>×</button>
            <h3 style={{ margin: '0 0 24px', color: '#111827' }}>병원 등록</h3>
            <HospitalForm data={newHospital} setData={setNewHospital} isEdit={false} />
            <button onClick={saveNew} style={{ width: '100%', marginTop: '20px', padding: '14px', background: 'linear-gradient(135deg, #3b82f6, #2563eb)', border: 'none', borderRadius: '10px', color: '#fff', fontWeight: '600', cursor: 'pointer' }}>등록하기</button>
          </div>
        </div>
      )}

      {/* Edit Popup */}
      {editPopup && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ background: '#ffffff', borderRadius: '16px', padding: '32px', width: '560px', border: '1px solid #f3f4f6', position: 'relative' }}>
            <button onClick={closeAll} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', color: '#6b7280', fontSize: '24px', cursor: 'pointer' }}>×</button>
            <h3 style={{ margin: '0 0 24px', color: '#111827' }}>병원 수정</h3>
            <HospitalForm data={editPopup} setData={setEditPopup} isEdit={true} />
            <button onClick={saveEdit} style={{ width: '100%', marginTop: '20px', padding: '14px', background: 'linear-gradient(135deg, #4ade80, #22c55e)', border: 'none', borderRadius: '10px', color: '#f9fafb', fontWeight: '600', cursor: 'pointer' }}>저장하기</button>
          </div>
        </div>
      )}
    </div>
  );
}
