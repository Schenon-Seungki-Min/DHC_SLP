import React, { useState } from 'react';

const initialClients = [
  { id: 1, name: '서울수면클리닉', type: 'hospital', portfolio: 'sleepq', address: '서울시 강남구 테헤란로 123', phone: '02-1234-5678', email: 'seoul@sleep.kr', notes: 'NECA 등록일: 2024-06-15', isPrescribing: true, staff: [{name: '김수면', isRep: true, phone: '010-1111-1111', email: 'kim@sleep.kr'}, {name: '이진료', isRep: false, phone: '010-2222-2222', email: 'lee@sleep.kr'}], partners: ['A파트너', 'B파트너'], grade: 'A', products: ['SleepQ'] },
  { id: 2, name: '강남브레인의원', type: 'hospital', portfolio: 'sleepq', address: '서울시 강남구 역삼동 456', phone: '02-2345-6789', email: 'brain@clinic.kr', notes: 'NECA 등록일: 2024-07-20, 처방중', isPrescribing: true, staff: [{name: '이두뇌', isRep: true, phone: '010-3333-3333', email: 'brain@clinic.kr'}], partners: ['A파트너'], grade: 'B', products: ['SleepQ'] },
  { id: 3, name: '인천꿈의원', type: 'hospital', portfolio: 'sleepq', address: '인천시 연수구 송도동 321', phone: '032-456-7890', email: 'dream@incheon.kr', notes: '미등록', isPrescribing: false, staff: [{name: '정꿈나라', isRep: true, phone: '010-4444-4444', email: 'dream@incheon.kr'}], partners: ['B파트너', 'C파트너'], grade: 'C', products: ['SleepQ'] },
];

export default function AdminDashboard() {
  const [clients, setClients] = useState(initialClients);
  const [editPopup, setEditPopup] = useState(null);
  const [addPopup, setAddPopup] = useState(false);
  const [confirmPopup, setConfirmPopup] = useState(null);
  const [portfolioManagePopup, setPortfolioManagePopup] = useState(false);
  const [partnerManagePopup, setPartnerManagePopup] = useState(false);
  const [newClient, setNewClient] = useState({ name: '', type: 'hospital', portfolio: 'sleepq', address: '', phone: '', email: '', notes: '', staff: [{name: '', isRep: true, phone: '', email: ''}], partners: [], grade: 'C', products: [] });

  // 포트폴리오 및 제품 관리
  const [portfolios, setPortfolios] = useState([
    { id: 'sleepq', name: 'SleepQ', products: ['SleepQ'] },
    { id: 'coaching', name: '코칭서비스', products: ['GLP-OP', 'CGM'] }
  ]);
  const [newPortfolioName, setNewPortfolioName] = useState('');
  const [editingPortfolio, setEditingPortfolio] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null); // { portfolioId, oldName, newName }
  const [editingPortfolioName, setEditingPortfolioName] = useState(null); // { portfolioId, name }

  // 협력사 관리
  const [partners, setPartners] = useState([
    { id: 'a', name: 'A파트너', company: '(주)에이컴퍼니', phone: '02-1234-5678', email: 'partner.a@example.com', address: '서울시 강남구' },
    { id: 'b', name: 'B파트너', company: '(주)비컴퍼니', phone: '02-2345-6789', email: 'partner.b@example.com', address: '서울시 서초구' },
    { id: 'c', name: 'C파트너', company: '(주)씨컴퍼니', phone: '02-3456-7890', email: 'partner.c@example.com', address: '서울시 송파구' },
    { id: 'd', name: 'D파트너', company: '(주)디컴퍼니', phone: '02-4567-8901', email: 'partner.d@example.com', address: '서울시 강동구' }
  ]);
  const [editingPartner, setEditingPartner] = useState(null);

  const closeAll = () => { setEditPopup(null); setAddPopup(false); setConfirmPopup(null); setPortfolioManagePopup(false); setPartnerManagePopup(false); };

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

  // 포트폴리오 관리 함수들
  const addPortfolio = () => {
    if (!newPortfolioName.trim()) return;
    const id = newPortfolioName.toLowerCase().replace(/\s+/g, '_');
    setPortfolios(prev => [...prev, { id, name: newPortfolioName, products: [] }]);
    setNewPortfolioName('');
  };

  const deletePortfolio = (id) => {
    setPortfolios(prev => prev.filter(p => p.id !== id));
  };

  const addProductToPortfolio = (portfolioId, productName) => {
    setPortfolios(prev => prev.map(p =>
      p.id === portfolioId ? { ...p, products: [...p.products, productName] } : p
    ));
  };

  const removeProductFromPortfolio = (portfolioId, productName) => {
    setPortfolios(prev => prev.map(p =>
      p.id === portfolioId ? { ...p, products: p.products.filter(prod => prod !== productName) } : p
    ));
  };

  const updateProductName = (portfolioId, oldName, newName) => {
    if (!newName.trim()) return;
    setPortfolios(prev => prev.map(p =>
      p.id === portfolioId ? {
        ...p,
        products: p.products.map(prod => prod === oldName ? newName.trim() : prod)
      } : p
    ));
    setEditingProduct(null);
  };

  const updatePortfolioName = (portfolioId, newName) => {
    if (!newName.trim()) return;
    setPortfolios(prev => prev.map(p =>
      p.id === portfolioId ? { ...p, name: newName.trim() } : p
    ));
    setEditingPortfolioName(null);
  };

  // 협력사 관리 함수들
  const addPartner = (partnerData) => {
    const id = Date.now().toString();
    setPartners(prev => [...prev, { ...partnerData, id }]);
  };

  const updatePartner = (id, partnerData) => {
    setPartners(prev => prev.map(p => p.id === id ? { ...p, ...partnerData } : p));
  };

  const deletePartner = (id) => {
    setPartners(prev => prev.filter(p => p.id !== id));
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
    setNewClient({ name: '', type: 'hospital', portfolio: 'sleepq', address: '', phone: '', email: '', notes: '', staff: [{name: '', isRep: true, phone: '', email: ''}], partners: [], grade: 'C', products: [] });
    setAddPopup(false);
    setConfirmPopup(null);
  };

  const saveEdit = () => {
    setClients(prev => prev.map(c => c.id === editPopup.id ? editPopup : c));
    setEditPopup(null);
    setConfirmPopup(null);
  };

  const handleDownloadExcel = () => {
    // Mock 콜 플랜 다운로드
    alert('콜 플랜 Excel 다운로드 기능 (실제 구현 시 라이브러리 사용 필요)');
  };

  const inputStyle = { width: '100%', background: '#f9fafb', border: '1px solid #f3f4f6', borderRadius: '8px', padding: '10px 12px', color: '#111827', fontSize: '14px', boxSizing: 'border-box' };
  const labelStyle = { color: '#6b7280', fontSize: '12px', marginBottom: '6px', display: 'block' };

  const ClientForm = ({ data, setData, isEdit, portfolios, setPortfolioManagePopup, toggleProduct, partners, setPartnerManagePopup, togglePartner }) => (
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
          <div style={{ display: 'flex', gap: '8px' }}>
            <select style={{...inputStyle, flex: 1}} value={data.portfolio || 'sleepq'} onChange={e => setData(prev => ({...prev, portfolio: e.target.value}))}>
              {portfolios.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
            <button
              onClick={() => setPortfolioManagePopup(true)}
              type="button"
              style={{
                padding: '10px 16px',
                background: '#f9fafb',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                color: '#6b7280',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: '600',
                whiteSpace: 'nowrap'
              }}
            >
              관리
            </button>
          </div>
        </div>
      </div>

      {/* 제공 제품 */}
      <div>
        <label style={labelStyle}>제공 제품 *</label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {portfolios.find(p => p.id === data.portfolio)?.products.map(product => (
            <button
              key={product}
              type="button"
              onClick={() => toggleProduct(data, product, isEdit)}
              style={{
                padding: '8px 16px',
                background: data.products?.includes(product) ? '#4338ca' : '#f9fafb',
                border: '1px solid #e5e7eb',
                borderRadius: '20px',
                color: data.products?.includes(product) ? '#ffffff' : '#6b7280',
                cursor: 'pointer',
                fontSize: '13px'
              }}
            >
              {product}
            </button>
          ))}
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
              type="button"
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

      {/* 비고 */}
      <div>
        <label style={labelStyle}>비고</label>
        <textarea
          style={{...inputStyle, minHeight: '100px', resize: 'vertical', fontFamily: 'inherit'}}
          value={data.notes || ''}
          onChange={e => setData(prev => ({...prev, notes: e.target.value}))}
          placeholder="NECA 등록일, 서비스 유형, 기타 메모 등을 입력하세요"
        />
      </div>

      <div style={{ borderTop: '1px solid #f3f4f6', paddingTop: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <label style={{...labelStyle, margin: 0}}>HCP</label>
          <button type="button" onClick={() => addStaff(isEdit)} style={{ background: 'none', border: '1px solid #3b82f6', color: '#3b82f6', padding: '4px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}>+ 추가</button>
        </div>
        {data.staff.map((member, i) => (
          <div key={i} style={{ background: '#f9fafb', borderRadius: '10px', padding: '12px', marginBottom: '8px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '8px', marginBottom: '8px' }}>
              <input placeholder="이름" style={{...inputStyle, background: '#ffffff'}} value={member.name} onChange={e => updateStaff(i, 'name', e.target.value, isEdit)} />
              <input placeholder="연락처" style={{...inputStyle, background: '#ffffff'}} value={member.phone} onChange={e => updateStaff(i, 'phone', e.target.value, isEdit)} />
              <button type="button" onClick={() => updateStaff(i, 'isRep', !member.isRep, isEdit)} style={{ padding: '8px 12px', background: member.isRep ? '#38bdf8' : '#f3f4f6', border: 'none', borderRadius: '6px', color: member.isRep ? '#f9fafb' : '#6b7280', cursor: 'pointer', fontSize: '11px', whiteSpace: 'nowrap' }}>
                {member.isRep ? '대표' : '일반'}
              </button>
            </div>
            <input placeholder="이메일" style={{...inputStyle, background: '#ffffff'}} value={member.email} onChange={e => updateStaff(i, 'email', e.target.value, isEdit)} />
          </div>
        ))}
      </div>

      <div style={{ borderTop: '1px solid #f3f4f6', paddingTop: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <label style={{...labelStyle, margin: 0}}>담당 협력사</label>
          <button
            type="button"
            onClick={() => setPartnerManagePopup(true)}
            style={{
              padding: '6px 12px',
              background: '#f9fafb',
              border: '1px solid #e5e7eb',
              borderRadius: '6px',
              color: '#6b7280',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: '600'
            }}
          >
            관리
          </button>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {partners.map(p => (
            <button key={p.id} type="button" onClick={() => togglePartner(data, p.name, isEdit)} style={{ padding: '8px 16px', background: data.partners.includes(p.name) ? '#3b82f6' : '#f9fafb', border: '1px solid #f3f4f6', borderRadius: '20px', color: data.partners.includes(p.name) ? '#fff' : '#6b7280', cursor: 'pointer', fontSize: '13px' }}>{p.name}</button>
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
            📥 콜 플랜 다운로드
          </button>
          <button onClick={() => setAddPopup(true)} style={{ padding: '12px 24px', background: 'linear-gradient(135deg, #3b82f6, #2563eb)', border: 'none', borderRadius: '10px', color: '#fff', fontWeight: '600', cursor: 'pointer', fontSize: '14px' }}>+ 거래처 등록</button>
        </div>
      </div>

      {/* Table */}
      <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #f3f4f6', overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 2fr 1fr 1fr 1.5fr 80px', padding: '16px 24px', background: '#f9fafb', borderBottom: '1px solid #f3f4f6', fontSize: '13px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          <div>거래처명</div><div>주소</div><div>의료진</div><div>비고</div><div>담당 협력사</div><div></div>
        </div>
        {clients.map((c, i) => (
          <div key={c.id} style={{ display: 'grid', gridTemplateColumns: '1.5fr 2fr 1fr 1fr 1.5fr 80px', padding: '18px 24px', borderBottom: i < clients.length - 1 ? '1px solid #f3f4f6' : 'none', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: c.isPrescribing ? '#4ade80' : '#6b7280' }} />
              <span style={{ fontWeight: '600', color: '#111827' }}>{c.name}</span>
            </div>
            <div style={{ color: '#6b7280', fontSize: '14px' }}>{c.address}</div>
            <div style={{ color: '#38bdf8' }}>{c.staff.find(s => s.isRep)?.name || '-'}</div>
            <div style={{ color: '#6b7280', fontSize: '14px' }}>{c.notes || '-'}</div>
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
            <ClientForm data={newClient} setData={setNewClient} isEdit={false} portfolios={portfolios} setPortfolioManagePopup={setPortfolioManagePopup} toggleProduct={toggleProduct} partners={partners} setPartnerManagePopup={setPartnerManagePopup} togglePartner={togglePartner} />
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
            <ClientForm data={editPopup} setData={setEditPopup} isEdit={true} portfolios={portfolios} setPortfolioManagePopup={setPortfolioManagePopup} toggleProduct={toggleProduct} partners={partners} setPartnerManagePopup={setPartnerManagePopup} togglePartner={togglePartner} />
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

      {/* Portfolio Management Popup */}
      {portfolioManagePopup && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 150 }}>
          <div style={{ background: '#ffffff', borderRadius: '16px', padding: '32px', width: '600px', maxHeight: '80vh', overflowY: 'auto', border: '1px solid #f3f4f6', position: 'relative' }}>
            <button onClick={() => setPortfolioManagePopup(false)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', color: '#6b7280', fontSize: '24px', cursor: 'pointer' }}>×</button>
            <h3 style={{ margin: '0 0 24px', color: '#111827' }}>포트폴리오 관리</h3>

            {/* 포트폴리오 목록 */}
            <div style={{ marginBottom: '24px' }}>
              {portfolios.map(portfolio => (
                <div key={portfolio.id} style={{ background: '#f9fafb', borderRadius: '12px', padding: '20px', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    {editingPortfolioName?.portfolioId === portfolio.id ? (
                      // 포트폴리오명 수정 모드
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
                        <input
                          type="text"
                          value={editingPortfolioName.name}
                          onChange={(e) => setEditingPortfolioName({...editingPortfolioName, name: e.target.value})}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              updatePortfolioName(portfolio.id, editingPortfolioName.name);
                            }
                          }}
                          style={{
                            ...inputStyle,
                            fontSize: '16px',
                            fontWeight: '600',
                            flex: 1
                          }}
                          autoFocus
                        />
                        <button
                          onClick={() => updatePortfolioName(portfolio.id, editingPortfolioName.name)}
                          style={{
                            background: '#10b981',
                            border: 'none',
                            borderRadius: '6px',
                            color: '#ffffff',
                            padding: '6px 12px',
                            cursor: 'pointer',
                            fontSize: '12px',
                            fontWeight: '600'
                          }}
                        >
                          ✓
                        </button>
                        <button
                          onClick={() => setEditingPortfolioName(null)}
                          style={{
                            background: '#f3f4f6',
                            border: 'none',
                            borderRadius: '6px',
                            color: '#6b7280',
                            padding: '6px 12px',
                            cursor: 'pointer',
                            fontSize: '12px',
                            fontWeight: '600'
                          }}
                        >
                          취소
                        </button>
                      </div>
                    ) : (
                      // 일반 모드
                      <>
                        <h4 style={{ margin: 0, color: '#111827', fontSize: '16px', fontWeight: '600' }}>{portfolio.name}</h4>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            onClick={() => setEditingPortfolioName({ portfolioId: portfolio.id, name: portfolio.name })}
                            style={{
                              background: '#dbeafe',
                              border: 'none',
                              borderRadius: '6px',
                              color: '#3b82f6',
                              padding: '6px 12px',
                              cursor: 'pointer',
                              fontSize: '12px',
                              fontWeight: '600'
                            }}
                          >
                            수정
                          </button>
                          <button
                            onClick={() => deletePortfolio(portfolio.id)}
                            style={{
                              background: '#fee2e2',
                              border: 'none',
                              borderRadius: '6px',
                              color: '#ef4444',
                              padding: '6px 12px',
                              cursor: 'pointer',
                              fontSize: '12px',
                              fontWeight: '600'
                            }}
                          >
                            삭제
                          </button>
                        </div>
                      </>
                    )}
                  </div>

                  {/* 포트폴리오별 제품 목록 */}
                  <div style={{ marginBottom: '12px' }}>
                    <label style={{...labelStyle, marginBottom: '8px'}}>제공 제품</label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '8px' }}>
                      {portfolio.products.map(product => (
                        editingProduct?.portfolioId === portfolio.id && editingProduct?.oldName === product ? (
                          // 수정 모드
                          <div key={product} style={{ background: '#ffffff', padding: '6px 8px', borderRadius: '20px', border: '1px solid #3b82f6', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <input
                              type="text"
                              value={editingProduct.newName}
                              onChange={(e) => setEditingProduct({...editingProduct, newName: e.target.value})}
                              onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                  updateProductName(portfolio.id, product, editingProduct.newName);
                                }
                              }}
                              style={{
                                border: 'none',
                                background: 'transparent',
                                color: '#111827',
                                fontSize: '13px',
                                width: '100px',
                                padding: '0',
                                outline: 'none'
                              }}
                              autoFocus
                            />
                            <button
                              onClick={() => updateProductName(portfolio.id, product, editingProduct.newName)}
                              style={{
                                background: 'none',
                                border: 'none',
                                color: '#10b981',
                                cursor: 'pointer',
                                padding: '0',
                                fontSize: '12px',
                                fontWeight: '600'
                              }}
                            >
                              ✓
                            </button>
                            <button
                              onClick={() => setEditingProduct(null)}
                              style={{
                                background: 'none',
                                border: 'none',
                                color: '#6b7280',
                                cursor: 'pointer',
                                padding: '0',
                                fontSize: '14px',
                                lineHeight: '1'
                              }}
                            >
                              ×
                            </button>
                          </div>
                        ) : (
                          // 일반 모드
                          <div key={product} style={{ background: '#ffffff', padding: '6px 12px', borderRadius: '20px', border: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <span style={{ color: '#111827', fontSize: '13px' }}>{product}</span>
                            <button
                              onClick={() => setEditingProduct({ portfolioId: portfolio.id, oldName: product, newName: product })}
                              style={{
                                background: 'none',
                                border: 'none',
                                color: '#6b7280',
                                cursor: 'pointer',
                                padding: '0 2px',
                                fontSize: '12px',
                                lineHeight: '1'
                              }}
                              title="제품명 수정"
                            >
                              ✏️
                            </button>
                            <button
                              onClick={() => removeProductFromPortfolio(portfolio.id, product)}
                              style={{
                                background: 'none',
                                border: 'none',
                                color: '#ef4444',
                                cursor: 'pointer',
                                padding: '0',
                                fontSize: '14px',
                                lineHeight: '1'
                              }}
                            >
                              ×
                            </button>
                          </div>
                        )
                      ))}
                    </div>

                    {/* 제품 추가 */}
                    {editingPortfolio === portfolio.id ? (
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <input
                          placeholder="제품명 입력"
                          style={{...inputStyle, flex: 1}}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter' && e.target.value.trim()) {
                              addProductToPortfolio(portfolio.id, e.target.value.trim());
                              e.target.value = '';
                              setEditingPortfolio(null);
                            }
                          }}
                        />
                        <button
                          onClick={() => setEditingPortfolio(null)}
                          style={{
                            padding: '10px 16px',
                            background: '#f3f4f6',
                            border: 'none',
                            borderRadius: '8px',
                            color: '#6b7280',
                            cursor: 'pointer',
                            fontSize: '13px'
                          }}
                        >
                          취소
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setEditingPortfolio(portfolio.id)}
                        style={{
                          background: 'none',
                          border: '1px dashed #d1d5db',
                          borderRadius: '8px',
                          color: '#6b7280',
                          padding: '8px 12px',
                          cursor: 'pointer',
                          fontSize: '12px',
                          width: '100%'
                        }}
                      >
                        + 제품 추가
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* 새 포트폴리오 추가 */}
            <div style={{ borderTop: '1px solid #f3f4f6', paddingTop: '20px' }}>
              <label style={{...labelStyle, marginBottom: '8px'}}>새 포트폴리오 추가</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  placeholder="포트폴리오명 입력"
                  value={newPortfolioName}
                  onChange={e => setNewPortfolioName(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') addPortfolio();
                  }}
                  style={{...inputStyle, flex: 1}}
                />
                <button
                  onClick={addPortfolio}
                  style={{
                    padding: '10px 20px',
                    background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#ffffff',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: '600',
                    whiteSpace: 'nowrap'
                  }}
                >
                  추가
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Partner Management Popup */}
      {partnerManagePopup && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 150 }}>
          <div style={{ background: '#ffffff', borderRadius: '16px', padding: '32px', width: '700px', maxHeight: '80vh', overflowY: 'auto', border: '1px solid #f3f4f6', position: 'relative' }}>
            <button onClick={() => setPartnerManagePopup(false)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', color: '#6b7280', fontSize: '24px', cursor: 'pointer' }}>×</button>
            <h3 style={{ margin: '0 0 24px', color: '#111827' }}>협력사 관리</h3>

            {/* 협력사 목록 */}
            <div style={{ marginBottom: '24px' }}>
              {partners.map(partner => (
                <div key={partner.id} style={{ background: '#f9fafb', borderRadius: '12px', padding: '20px', marginBottom: '16px' }}>
                  {editingPartner === partner.id ? (
                    // 편집 모드
                    <div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                        <div>
                          <label style={labelStyle}>협력사명 *</label>
                          <input
                            style={inputStyle}
                            value={partner.name}
                            onChange={e => updatePartner(partner.id, { name: e.target.value })}
                          />
                        </div>
                        <div>
                          <label style={labelStyle}>소속 기업 *</label>
                          <input
                            style={inputStyle}
                            value={partner.company}
                            onChange={e => updatePartner(partner.id, { company: e.target.value })}
                          />
                        </div>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                        <div>
                          <label style={labelStyle}>핸드폰 번호 *</label>
                          <input
                            style={inputStyle}
                            value={partner.phone}
                            onChange={e => updatePartner(partner.id, { phone: e.target.value })}
                          />
                        </div>
                        <div>
                          <label style={labelStyle}>이메일 주소 *</label>
                          <input
                            style={inputStyle}
                            type="email"
                            value={partner.email}
                            onChange={e => updatePartner(partner.id, { email: e.target.value })}
                          />
                        </div>
                      </div>
                      <div style={{ marginBottom: '12px' }}>
                        <label style={labelStyle}>직장 주소</label>
                        <input
                          style={inputStyle}
                          value={partner.address}
                          onChange={e => updatePartner(partner.id, { address: e.target.value })}
                        />
                      </div>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                        <button
                          onClick={() => setEditingPartner(null)}
                          style={{
                            padding: '8px 16px',
                            background: '#10b981',
                            border: 'none',
                            borderRadius: '8px',
                            color: '#ffffff',
                            cursor: 'pointer',
                            fontSize: '13px',
                            fontWeight: '600'
                          }}
                        >
                          완료
                        </button>
                      </div>
                    </div>
                  ) : (
                    // 보기 모드
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                        <div>
                          <h4 style={{ margin: '0 0 4px', color: '#111827', fontSize: '16px', fontWeight: '600' }}>{partner.name}</h4>
                          <p style={{ margin: 0, color: '#6b7280', fontSize: '13px' }}>{partner.company}</p>
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            onClick={() => setEditingPartner(partner.id)}
                            style={{
                              background: '#dbeafe',
                              border: 'none',
                              borderRadius: '6px',
                              color: '#3b82f6',
                              padding: '6px 12px',
                              cursor: 'pointer',
                              fontSize: '12px',
                              fontWeight: '600'
                            }}
                          >
                            수정
                          </button>
                          <button
                            onClick={() => deletePartner(partner.id)}
                            style={{
                              background: '#fee2e2',
                              border: 'none',
                              borderRadius: '6px',
                              color: '#ef4444',
                              padding: '6px 12px',
                              cursor: 'pointer',
                              fontSize: '12px',
                              fontWeight: '600'
                            }}
                          >
                            삭제
                          </button>
                        </div>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '13px' }}>
                        <div>
                          <span style={{ color: '#6b7280' }}>📞 </span>
                          <span style={{ color: '#111827' }}>{partner.phone}</span>
                        </div>
                        <div>
                          <span style={{ color: '#6b7280' }}>✉️ </span>
                          <span style={{ color: '#111827' }}>{partner.email}</span>
                        </div>
                      </div>
                      {partner.address && (
                        <div style={{ marginTop: '8px', fontSize: '13px' }}>
                          <span style={{ color: '#6b7280' }}>📍 </span>
                          <span style={{ color: '#111827' }}>{partner.address}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* 새 협력사 추가 */}
            <div style={{ borderTop: '1px solid #f3f4f6', paddingTop: '20px' }}>
              <label style={{...labelStyle, marginBottom: '12px'}}>새 협력사 추가</label>
              <div style={{ background: '#f9fafb', borderRadius: '12px', padding: '16px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                  <div>
                    <label style={labelStyle}>협력사명 *</label>
                    <input
                      id="new-partner-name"
                      placeholder="예: A파트너"
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>소속 기업 *</label>
                    <input
                      id="new-partner-company"
                      placeholder="예: (주)에이컴퍼니"
                      style={inputStyle}
                    />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                  <div>
                    <label style={labelStyle}>핸드폰 번호 *</label>
                    <input
                      id="new-partner-phone"
                      placeholder="예: 010-1234-5678"
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>이메일 주소 *</label>
                    <input
                      id="new-partner-email"
                      type="email"
                      placeholder="예: partner@example.com"
                      style={inputStyle}
                    />
                  </div>
                </div>
                <div style={{ marginBottom: '12px' }}>
                  <label style={labelStyle}>직장 주소</label>
                  <input
                    id="new-partner-address"
                    placeholder="예: 서울시 강남구"
                    style={inputStyle}
                  />
                </div>
                <button
                  onClick={() => {
                    const name = document.getElementById('new-partner-name').value.trim();
                    const company = document.getElementById('new-partner-company').value.trim();
                    const phone = document.getElementById('new-partner-phone').value.trim();
                    const email = document.getElementById('new-partner-email').value.trim();
                    const address = document.getElementById('new-partner-address').value.trim();

                    if (!name || !company || !phone || !email) {
                      alert('필수 항목을 모두 입력해주세요.');
                      return;
                    }

                    addPartner({ name, company, phone, email, address });

                    // 입력 필드 초기화
                    document.getElementById('new-partner-name').value = '';
                    document.getElementById('new-partner-company').value = '';
                    document.getElementById('new-partner-phone').value = '';
                    document.getElementById('new-partner-email').value = '';
                    document.getElementById('new-partner-address').value = '';
                  }}
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#ffffff',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '600'
                  }}
                >
                  추가
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
