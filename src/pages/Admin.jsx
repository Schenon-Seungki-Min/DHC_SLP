import React, { useState } from 'react';

const initialClients = [
  { id: 1, name: '서울수면클리닉', type: 'hospital', portfolio: 'sleepq', address: '서울시 강남구 테헤란로 123', phone: '02-1234-5678', email: 'seoul@sleep.kr', neca: '2024-06-15', isPrescribing: true, staff: [{name: '김수면', isRep: true, phone: '010-1111-1111', email: 'kim@sleep.kr'}, {name: '이진료', isRep: false, phone: '010-2222-2222', email: 'lee@sleep.kr'}], partners: ['A파트너', 'B파트너'], grade: 'A', products: ['SleepQ'] },
  { id: 2, name: '강남브레인의원', type: 'hospital', portfolio: 'sleepq', address: '서울시 강남구 역삼동 456', phone: '02-2345-6789', email: 'brain@clinic.kr', neca: '2024-07-20', isPrescribing: true, staff: [{name: '이두뇌', isRep: true, phone: '010-3333-3333', email: 'brain@clinic.kr'}], partners: ['A파트너'], grade: 'B', products: ['SleepQ'] },
  { id: 3, name: '인천꿈의원', type: 'hospital', portfolio: 'sleepq', address: '인천시 연수구 송도동 321', phone: '032-456-7890', email: 'dream@incheon.kr', neca: null, isPrescribing: false, staff: [{name: '정꿈나라', isRep: true, phone: '010-4444-4444', email: 'dream@incheon.kr'}], partners: ['B파트너', 'C파트너'], grade: 'C', products: ['SleepQ'] },
];

const allPartners = ['A파트너', 'B파트너', 'C파트너', 'D파트너'];

export default function AdminDashboard() {
  const [clients, setClients] = useState(initialClients);
  const [editPopup, setEditPopup] = useState(null);
  const [addPopup, setAddPopup] = useState(false);
  const [confirmPopup, setConfirmPopup] = useState(null);
  const [newClient, setNewClient] = useState({ name: '', type: 'hospital', portfolio: 'sleepq', address: '', phone: '', email: '', neca: '', isPrescribing: false, staff: [{name: '', isRep: true, phone: '', email: ''}], partners: [], grade: 'C', products: [] });

  const closeAll = () => { setEditPopup(null); setAddPopup(false); setConfirmPopup(null); };

  const togglePartner = (client, partner, isEdit = false) => {
    if (isEdit) {
      setEditPopup(prev => ({
        ...prev,
        partners: prev.partners.includes(partner) ? prev.partners.filter(p => p !== partner) : [...prev.partners, partner]
      }));
    } else {
      setNewClient(prev => ({
        ...prev,
        partners: prev.partners.includes(partner) ? prev.partners.filter(p => p !== partner) : [...prev.partners, partner]
      }));
    }
  };

  const toggleProduct = (client, product, isEdit = false) => {
    if (isEdit) {
      setEditPopup(prev => ({
        ...prev,
        products: prev.products.includes(product) ? prev.products.filter(p => p !== product) : [...prev.products, product]
      }));
    } else {
      setNewClient(prev => ({
        ...prev,
        products: prev.products.includes(product) ? prev.products.filter(p => p !== product) : [...prev.products, product]
      }));
    }
  };

  const addStaff = (isEdit = false) => {
    const newStaffMember = {name: '', isRep: false, phone: '', email: ''};
    if (isEdit) {
      setEditPopup(prev => ({...prev, staff: [...prev.staff, newStaffMember]}));
    } else {
      setNewClient(prev => ({...prev, staff: [...prev.staff, newStaffMember]}));
    }
  };

  const updateStaff = (index, field, value, isEdit = false) => {
    if (isEdit) {
      setEditPopup(prev => {
        const staffList = [...prev.staff];
        staffList[index] = {...staffList[index], [field]: value};
        return {...prev, staff: staffList};
      });
    } else {
      setNewClient(prev => {
        const staffList = [...prev.staff];
        staffList[index] = {...staffList[index], [field]: value};
        return {...prev, staff: staffList};
      });
    }
  };

  const saveNew = () => {
    setClients(prev => [...prev, {...newClient, id: Date.now()}]);
    setNewClient({ name: '', type: 'hospital', portfolio: 'sleepq', address: '', phone: '', email: '', neca: '', isPrescribing: false, staff: [{name: '', isRep: true, phone: '', email: ''}], partners: [], grade: 'C', products: [] });
    setAddPopup(false);
    setConfirmPopup(null);
  };

  const saveEdit = () => {
    setClients(prev => prev.map(c => c.id === editPopup.id ? editPopup : c));
    setEditPopup(null);
    setConfirmPopup(null);
  };

  const handleDownloadExcel = () => {
    // Mock Excel 다운로드
    alert('Excel 파일 다운로드 기능 (실제 구현 시 라이브러리 사용 필요)');
  };

  const handleUploadExcel = (e) => {
    // Mock Excel 업로드
    const file = e.target.files[0];
    if (file) {
      alert(`Excel 파일 업로드: ${file.name} (실제 구현 시 파싱 로직 필요)`);
    }
  };

  const inputStyle = { width: '100%', background: '#f9fafb', border: '1px solid #f3f4f6', borderRadius: '8px', padding: '10px 12px', color: '#111827', fontSize: '14px', boxSizing: 'border-box' };
  const labelStyle = { color: '#6b7280', fontSize: '12px', marginBottom: '6px', display: 'block' };

  const ClientForm = ({ data, setData, isEdit }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: '60vh', overflowY: 'auto', paddingRight: '8px' }}>
      {/* 기본 정보 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <div><label style={labelStyle}>거래처명 *</label><input style={inputStyle} value={data.name} onChange={e => setData(prev => ({...prev, name: e.target.value}))} /></div>
        <div><label style={labelStyle}>대표 전화번호</label><input style={inputStyle} value={data.phone} onChange={e => setData(prev => ({...prev, phone: e.target.value}))} /></div>
      </div>

      {/* 거래처 유형 + 포트폴리오 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <div>
          <label style={labelStyle}>거래처 유형 *</label>
          <select style={inputStyle} value={data.type || 'hospital'} onChange={e => setData(prev => ({...prev, type: e.target.value}))}>
            <option value="hospital">병원</option>
            <option value="pharmacy">약국</option>
          </select>
        </div>
        <div>
          <label style={labelStyle}>포트폴리오 *</label>
          <select style={inputStyle} value={data.portfolio || 'sleepq'} onChange={e => setData(prev => ({...prev, portfolio: e.target.value}))}>
            <option value="sleepq">SleepQ</option>
            <option value="coaching">코칭서비스</option>
          </select>
        </div>
      </div>

      <div><label style={labelStyle}>거래처 주소</label><input style={inputStyle} value={data.address} onChange={e => setData(prev => ({...prev, address: e.target.value}))} /></div>
      <div><label style={labelStyle}>대표 이메일</label><input style={inputStyle} value={data.email} onChange={e => setData(prev => ({...prev, email: e.target.value}))} /></div>

      {/* 그레이드 */}
      <div>
        <label style={labelStyle}>그레이드 *</label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
          {['A', 'B', 'C', 'D'].map(grade => (
            <button
              key={grade}
              onClick={() => setData(prev => ({...prev, grade}))}
              style={{
                padding: '12px',
                background: data.grade === grade ? '#111827' : '#f9fafb',
                border: data.grade === grade ? '2px solid #111827' : '1px solid #e5e7eb',
                borderRadius: '8px',
                color: data.grade === grade ? '#ffffff' : '#6b7280',
                cursor: 'pointer',
                fontSize: '18px',
                fontWeight: '700',
                transition: 'all 0.2s'
              }}
            >
              {grade}
            </button>
          ))}
        </div>
        <p style={{ color: '#9ca3af', fontSize: '11px', marginTop: '6px' }}>A: 월 3회 이상 | B: 월 2회 | C: 월 1회 | D: 필요시</p>
      </div>

      {/* 제품 선택 */}
      <div>
        <label style={labelStyle}>제공 제품 *</label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {data.portfolio === 'sleepq' && (
            <>
              <button onClick={() => toggleProduct(data, 'SleepQ', isEdit)} style={{ padding: '8px 16px', background: data.products?.includes('SleepQ') ? '#4338ca' : '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '20px', color: data.products?.includes('SleepQ') ? '#ffffff' : '#6b7280', cursor: 'pointer', fontSize: '13px' }}>SleepQ</button>
            </>
          )}
          {data.portfolio === 'coaching' && (
            <>
              <button onClick={() => toggleProduct(data, 'GLP-OP', isEdit)} style={{ padding: '8px 16px', background: data.products?.includes('GLP-OP') ? '#059669' : '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '20px', color: data.products?.includes('GLP-OP') ? '#ffffff' : '#6b7280', cursor: 'pointer', fontSize: '13px' }}>GLP-OP</button>
              <button onClick={() => toggleProduct(data, 'CGM', isEdit)} style={{ padding: '8px 16px', background: data.products?.includes('CGM') ? '#059669' : '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '20px', color: data.products?.includes('CGM') ? '#ffffff' : '#6b7280', cursor: 'pointer', fontSize: '13px' }}>CGM</button>
            </>
          )}
        </div>
      </div>

      {/* SleepQ 전용 필드 */}
      {data.portfolio === 'sleepq' && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div><label style={labelStyle}>NECA 등록일</label><input type="date" style={inputStyle} value={data.neca || ''} onChange={e => setData(prev => ({...prev, neca: e.target.value}))} /></div>
            <div style={{ display: 'flex', alignItems: 'flex-end' }}>
              <button onClick={() => setData(prev => ({...prev, isPrescribing: !prev.isPrescribing}))} style={{ padding: '10px 16px', background: data.isPrescribing ? '#4ade80' : '#f3f4f6', border: 'none', borderRadius: '8px', color: data.isPrescribing ? '#f9fafb' : '#6b7280', cursor: 'pointer', fontSize: '13px', fontWeight: '600', width: '100%' }}>
                {data.isPrescribing ? '처방중' : '미처방'}
              </button>
            </div>
          </div>
        </>
      )}

      {/* 코칭서비스 전용 필드 */}
      {data.portfolio === 'coaching' && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={labelStyle}>전문분야</label>
              <select style={inputStyle} value={data.specialty || 'obesity'} onChange={e => setData(prev => ({...prev, specialty: e.target.value}))}>
                <option value="obesity">비만</option>
                <option value="diabetes">당뇨</option>
                <option value="both">비만+당뇨</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>담당팀</label>
              <select style={inputStyle} value={data.team || 'south_east'} onChange={e => setData(prev => ({...prev, team: e.target.value}))}>
                <option value="south_east">남동팀</option>
                <option value="north">북부팀</option>
              </select>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={labelStyle}>서비스 유형</label>
              <select style={inputStyle} value={data.serviceType || 'glpop'} onChange={e => setData(prev => ({...prev, serviceType: e.target.value}))}>
                <option value="glpop">GLP-OP</option>
                <option value="cgm">CGM</option>
              </select>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end' }}>
              <button onClick={() => setData(prev => ({...prev, cgmBarozen: !prev.cgmBarozen}))} style={{ padding: '10px 16px', background: data.cgmBarozen ? '#4ade80' : '#f3f4f6', border: 'none', borderRadius: '8px', color: data.cgmBarozen ? '#f9fafb' : '#6b7280', cursor: 'pointer', fontSize: '13px', fontWeight: '600', width: '100%' }}>
                CGM 바로젠 구매 {data.cgmBarozen ? 'O' : 'X'}
              </button>
            </div>
          </div>
        </>
      )}

      <div style={{ borderTop: '1px solid #f3f4f6', paddingTop: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <label style={{...labelStyle, margin: 0}}>소속 담당자</label>
          <button onClick={() => addStaff(isEdit)} style={{ background: 'none', border: '1px solid #3b82f6', color: '#3b82f6', padding: '4px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}>+ 추가</button>
        </div>
        {data.staff.map((member, i) => (
          <div key={i} style={{ background: '#f9fafb', borderRadius: '10px', padding: '12px', marginBottom: '8px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '8px', marginBottom: '8px' }}>
              <input placeholder="이름" style={{...inputStyle, background: '#ffffff'}} value={member.name} onChange={e => updateStaff(i, 'name', e.target.value, isEdit)} />
              <input placeholder="연락처" style={{...inputStyle, background: '#ffffff'}} value={member.phone} onChange={e => updateStaff(i, 'phone', e.target.value, isEdit)} />
              <button onClick={() => updateStaff(i, 'isRep', !member.isRep, isEdit)} style={{ padding: '8px 12px', background: member.isRep ? '#38bdf8' : '#f3f4f6', border: 'none', borderRadius: '6px', color: member.isRep ? '#f9fafb' : '#6b7280', cursor: 'pointer', fontSize: '11px', whiteSpace: 'nowrap' }}>
                {member.isRep ? '대표' : '일반'}
              </button>
            </div>
            <input placeholder="이메일" style={{...inputStyle, background: '#ffffff'}} value={member.email} onChange={e => updateStaff(i, 'email', e.target.value, isEdit)} />
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
          <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#111827', margin: 0 }}>거래처 정보 관리</h1>
          <p style={{ color: '#6b7280', marginTop: '4px', fontSize: '14px' }}>{clients.length}개 거래처</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={handleDownloadExcel} style={{ padding: '12px 20px', background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '10px', color: '#111827', fontWeight: '600', cursor: 'pointer', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            📥 Excel 다운로드
          </button>
          <label style={{ padding: '12px 20px', background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '10px', color: '#111827', fontWeight: '600', cursor: 'pointer', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            📤 Excel 업로드
            <input type="file" accept=".xlsx,.xls" onChange={handleUploadExcel} style={{ display: 'none' }} />
          </label>
          <button onClick={() => setAddPopup(true)} style={{ padding: '12px 24px', background: 'linear-gradient(135deg, #3b82f6, #2563eb)', border: 'none', borderRadius: '10px', color: '#fff', fontWeight: '600', cursor: 'pointer', fontSize: '14px' }}>+ 거래처 등록</button>
        </div>
      </div>

      {/* Table */}
      <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #f3f4f6', overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 2fr 1fr 1fr 1.5fr 80px', padding: '16px 24px', background: '#f9fafb', borderBottom: '1px solid #f3f4f6', fontSize: '13px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          <div>거래처명</div><div>주소</div><div>대표 담당자</div><div>NECA</div><div>담당 협력사</div><div></div>
        </div>
        {clients.map((c, i) => (
          <div key={c.id} style={{ display: 'grid', gridTemplateColumns: '1.5fr 2fr 1fr 1fr 1.5fr 80px', padding: '18px 24px', borderBottom: i < clients.length - 1 ? '1px solid #f3f4f6' : 'none', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: c.isPrescribing ? '#4ade80' : '#6b7280' }} />
              <span style={{ fontWeight: '600', color: '#111827' }}>{c.name}</span>
            </div>
            <div style={{ color: '#6b7280', fontSize: '14px' }}>{c.address}</div>
            <div style={{ color: '#38bdf8' }}>{c.staff.find(s => s.isRep)?.name || '-'}</div>
            <div style={{ color: c.neca ? '#4ade80' : '#6b7280', fontSize: '14px' }}>{c.neca || '미등록'}</div>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {c.partners.map(p => <span key={p} style={{ background: '#f9fafb', padding: '3px 10px', borderRadius: '12px', fontSize: '11px', color: '#6b7280' }}>{p}</span>)}
            </div>
            <button onClick={() => setEditPopup({...c})} style={{ background: 'none', border: '1px solid #f3f4f6', borderRadius: '6px', color: '#6b7280', padding: '6px 12px', cursor: 'pointer', fontSize: '12px' }}>수정</button>
          </div>
        ))}
      </div>

      {/* Add Popup */}
      {addPopup && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ background: '#ffffff', borderRadius: '16px', padding: '32px', width: '560px', border: '1px solid #f3f4f6', position: 'relative' }}>
            <button onClick={closeAll} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', color: '#6b7280', fontSize: '24px', cursor: 'pointer' }}>×</button>
            <h3 style={{ margin: '0 0 24px', color: '#111827' }}>거래처 등록</h3>
            <ClientForm data={newClient} setData={setNewClient} isEdit={false} />
            <button onClick={() => setConfirmPopup({ type: 'add', action: saveNew })} style={{ width: '100%', marginTop: '20px', padding: '14px', background: 'linear-gradient(135deg, #3b82f6, #2563eb)', border: 'none', borderRadius: '10px', color: '#fff', fontWeight: '600', cursor: 'pointer' }}>등록하기</button>
          </div>
        </div>
      )}

      {/* Edit Popup */}
      {editPopup && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ background: '#ffffff', borderRadius: '16px', padding: '32px', width: '560px', border: '1px solid #f3f4f6', position: 'relative' }}>
            <button onClick={closeAll} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', color: '#6b7280', fontSize: '24px', cursor: 'pointer' }}>×</button>
            <h3 style={{ margin: '0 0 24px', color: '#111827' }}>거래처 수정</h3>
            <ClientForm data={editPopup} setData={setEditPopup} isEdit={true} />
            <button onClick={() => setConfirmPopup({ type: 'edit', action: saveEdit })} style={{ width: '100%', marginTop: '20px', padding: '14px', background: 'linear-gradient(135deg, #4ade80, #22c55e)', border: 'none', borderRadius: '10px', color: '#f9fafb', fontWeight: '600', cursor: 'pointer' }}>저장하기</button>
          </div>
        </div>
      )}

      {/* Confirmation Popup */}
      {confirmPopup && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200 }}>
          <div style={{ background: '#ffffff', borderRadius: '16px', padding: '32px', width: '400px', border: '1px solid #f3f4f6', textAlign: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
            <h3 style={{ margin: '0 0 12px', color: '#111827', fontSize: '20px' }}>
              {confirmPopup.type === 'add' ? '거래처를 등록하시겠습니까?' : '변경사항을 저장하시겠습니까?'}
            </h3>
            <p style={{ color: '#6b7280', margin: '0 0 24px', fontSize: '14px' }}>
              {confirmPopup.type === 'add' ? '입력한 정보로 새로운 거래처가 등록됩니다.' : '수정한 내용이 저장되며 이전 정보는 덮어씌워집니다.'}
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => setConfirmPopup(null)} style={{ flex: 1, padding: '12px', background: '#f3f4f6', border: 'none', borderRadius: '10px', color: '#6b7280', fontWeight: '600', cursor: 'pointer', fontSize: '14px' }}>
                취소
              </button>
              <button onClick={confirmPopup.action} style={{ flex: 1, padding: '12px', background: confirmPopup.type === 'add' ? 'linear-gradient(135deg, #3b82f6, #2563eb)' : 'linear-gradient(135deg, #4ade80, #22c55e)', border: 'none', borderRadius: '10px', color: '#ffffff', fontWeight: '600', cursor: 'pointer', fontSize: '14px' }}>
                {confirmPopup.type === 'add' ? '등록' : '저장'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
