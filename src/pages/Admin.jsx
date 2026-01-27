import React, { useState } from 'react';
import { useAuth, companies } from '../contexts/AuthContext';

const initialClients = [
  { id: 1, name: '서울수면클리닉', type: 'hospital', portfolio: 'sleepq', address: '서울시 강남구 테헤란로 123', phone: '02-1234-5678', email: 'seoul@sleep.kr', notes: 'NECA 등록일: 2024-06-15', isPrescribing: true, staff: [{name: '김수면', isRep: true, phone: '010-1111-1111', email: 'kim@sleep.kr'}, {name: '이진료', isRep: false, phone: '010-2222-2222', email: 'lee@sleep.kr'}], partners: ['A파트너', 'B파트너'], grade: 'A', products: ['SleepQ'] },
  { id: 2, name: '강남브레인의원', type: 'hospital', portfolio: 'sleepq', address: '서울시 강남구 역삼동 456', phone: '02-2345-6789', email: 'brain@clinic.kr', notes: 'NECA 등록일: 2024-07-20, 처방중', isPrescribing: true, staff: [{name: '이두뇌', isRep: true, phone: '010-3333-3333', email: 'brain@clinic.kr'}], partners: ['A파트너'], grade: 'B', products: ['SleepQ'] },
  { id: 3, name: '인천꿈의원', type: 'hospital', portfolio: 'sleepq', address: '인천시 연수구 송도동 321', phone: '032-456-7890', email: 'dream@incheon.kr', notes: '미등록', isPrescribing: false, staff: [{name: '정꿈나라', isRep: true, phone: '010-4444-4444', email: 'dream@incheon.kr'}], partners: ['B파트너', 'C파트너'], grade: 'C', products: ['SleepQ'] },
];

export default function AdminDashboard() {
  const { user, getPendingUsers, approveUser, rejectUser } = useAuth();
  const [activeTab, setActiveTab] = useState('clients');
  const [clients, setClients] = useState(initialClients);
  const [editPopup, setEditPopup] = useState(null);
  const [addPopup, setAddPopup] = useState(false);
  const [confirmPopup, setConfirmPopup] = useState(null);
  const [newClient, setNewClient] = useState({ name: '', type: 'hospital', portfolio: 'sleepq', address: '', phone: '', email: '', notes: '', staff: [{name: '', isRep: true, phone: '', email: ''}], partners: [], grade: 'C', products: [] });
  const [portfolios] = useState([{ id: 'sleepq', name: 'SleepQ', products: ['SleepQ'] }, { id: 'coaching', name: '코칭서비스', products: ['GLP-OP', 'CGM'] }]);
  const [partners] = useState([{ id: 'a', name: 'A파트너' }, { id: 'b', name: 'B파트너' }, { id: 'c', name: 'C파트너' }, { id: 'd', name: 'D파트너' }]);

  const pendingUsers = getPendingUsers(user?.company);
  const closeAll = () => { setEditPopup(null); setAddPopup(false); setConfirmPopup(null); };

  const handleApprove = (pendingId) => { if (approveUser(pendingId)) alert('회원이 승인되었습니다.'); };
  const handleReject = (pendingId) => { if (window.confirm('정말 거절하시겠습니까?') && rejectUser(pendingId)) alert('거절되었습니다.'); };

  const inputStyle = { width: '100%', background: '#f9fafb', border: '1px solid #f3f4f6', borderRadius: '8px', padding: '10px 12px', color: '#111827', fontSize: '14px', boxSizing: 'border-box' };
  const labelStyle = { color: '#6b7280', fontSize: '12px', marginBottom: '6px', display: 'block' };

  return (
    <div style={{ padding: '32px' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#111827', margin: 0 }}>Admin 관리</h1>
        <p style={{ color: '#6b7280', marginTop: '4px', fontSize: '14px' }}>{user?.company ? companies.find(c => c.id === user.company)?.name : '전체'} 관리자</p>
      </div>

      {/* Tab Navigation */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', borderBottom: '1px solid #e5e7eb' }}>
        <button onClick={() => setActiveTab('clients')} style={{ padding: '12px 24px', background: 'none', border: 'none', borderBottom: activeTab === 'clients' ? '3px solid #3b82f6' : '3px solid transparent', color: activeTab === 'clients' ? '#3b82f6' : '#6b7280', fontWeight: '600', cursor: 'pointer', fontSize: '15px', marginBottom: '-1px' }}>거래처 관리</button>
        <button onClick={() => setActiveTab('members')} style={{ padding: '12px 24px', background: 'none', border: 'none', borderBottom: activeTab === 'members' ? '3px solid #3b82f6' : '3px solid transparent', color: activeTab === 'members' ? '#3b82f6' : '#6b7280', fontWeight: '600', cursor: 'pointer', fontSize: '15px', marginBottom: '-1px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          회원 승인
          {pendingUsers.length > 0 && <span style={{ background: '#ef4444', color: '#fff', borderRadius: '10px', padding: '2px 8px', fontSize: '12px', fontWeight: '700' }}>{pendingUsers.length}</span>}
        </button>
      </div>

      {/* 거래처 관리 탭 */}
      {activeTab === 'clients' && (
        <>
          <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
            <button onClick={() => alert('콜 플랜 다운로드')} style={{ padding: '12px 20px', background: '#fff', border: '1px solid #e5e7eb', borderRadius: '10px', color: '#111827', fontWeight: '600', cursor: 'pointer', fontSize: '14px' }}>📥 콜 플랜 다운로드</button>
            <button onClick={() => setAddPopup(true)} style={{ padding: '12px 24px', background: 'linear-gradient(135deg, #3b82f6, #2563eb)', border: 'none', borderRadius: '10px', color: '#fff', fontWeight: '600', cursor: 'pointer', fontSize: '14px' }}>+ 거래처 등록</button>
          </div>
          <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #f3f4f6', overflow: 'hidden' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 2fr 1fr 1fr 1.5fr 80px', padding: '16px 24px', background: '#f9fafb', borderBottom: '1px solid #f3f4f6', fontSize: '13px', fontWeight: '600', color: '#6b7280' }}>
              <div>거래처명</div><div>주소</div><div>의료진</div><div>비고</div><div>담당 협력사</div><div></div>
            </div>
            {clients.map((c, i) => (
              <div key={c.id} style={{ display: 'grid', gridTemplateColumns: '1.5fr 2fr 1fr 1fr 1.5fr 80px', padding: '18px 24px', borderBottom: i < clients.length - 1 ? '1px solid #f3f4f6' : 'none', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><span style={{ width: '8px', height: '8px', borderRadius: '50%', background: c.isPrescribing ? '#4ade80' : '#6b7280' }} /><span style={{ fontWeight: '600', color: '#111827' }}>{c.name}</span></div>
                <div style={{ color: '#6b7280', fontSize: '14px' }}>{c.address}</div>
                <div style={{ color: '#38bdf8' }}>{c.staff.find(s => s.isRep)?.name || '-'}</div>
                <div style={{ color: '#6b7280', fontSize: '14px' }}>{c.notes || '-'}</div>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>{c.partners.map(p => <span key={p} style={{ background: '#f9fafb', padding: '3px 10px', borderRadius: '12px', fontSize: '11px', color: '#6b7280' }}>{p}</span>)}</div>
                <button onClick={() => setEditPopup({...c})} style={{ background: 'none', border: '1px solid #f3f4f6', borderRadius: '6px', color: '#6b7280', padding: '6px 12px', cursor: 'pointer', fontSize: '12px' }}>수정</button>
              </div>
            ))}
          </div>
        </>
      )}

      {/* 회원 승인 탭 */}
      {activeTab === 'members' && (
        <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #f3f4f6', overflow: 'hidden' }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid #f3f4f6' }}>
            <h3 style={{ margin: 0, fontSize: '16px', color: '#111827' }}>회원가입 승인 대기 ({pendingUsers.length}명)</h3>
          </div>
          {pendingUsers.length === 0 ? (
            <div style={{ padding: '60px 24px', textAlign: 'center' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>✅</div>
              <p style={{ color: '#6b7280', margin: 0 }}>승인 대기 중인 회원이 없습니다.</p>
            </div>
          ) : (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr 1fr 1fr 1fr 150px', padding: '16px 24px', background: '#f9fafb', borderBottom: '1px solid #f3f4f6', fontSize: '13px', fontWeight: '600', color: '#6b7280' }}>
                <div>이름</div><div>이메일</div><div>연락처</div><div>소속 기업</div><div>신청일</div><div></div>
              </div>
              {pendingUsers.map((p, i) => (
                <div key={p.id} style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr 1fr 1fr 1fr 150px', padding: '18px 24px', borderBottom: i < pendingUsers.length - 1 ? '1px solid #f3f4f6' : 'none', alignItems: 'center' }}>
                  <div style={{ fontWeight: '600', color: '#111827' }}>{p.name}</div>
                  <div style={{ color: '#6b7280', fontSize: '14px' }}>{p.email}</div>
                  <div style={{ color: '#6b7280', fontSize: '14px' }}>{p.phone}</div>
                  <div style={{ color: '#6b7280', fontSize: '14px' }}>{companies.find(c => c.id === p.company)?.name || '-'}</div>
                  <div style={{ color: '#6b7280', fontSize: '14px' }}>{p.createdAt}</div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => handleApprove(p.id)} style={{ padding: '6px 14px', background: '#10b981', border: 'none', borderRadius: '6px', color: '#fff', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}>승인</button>
                    <button onClick={() => handleReject(p.id)} style={{ padding: '6px 14px', background: '#ef4444', border: 'none', borderRadius: '6px', color: '#fff', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}>거절</button>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      )}

      {/* Add/Edit Popup (간소화) */}
      {(addPopup || editPopup) && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ background: '#fff', borderRadius: '16px', padding: '32px', width: '500px', position: 'relative', maxHeight: '80vh', overflowY: 'auto' }}>
            <button onClick={closeAll} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', color: '#6b7280', fontSize: '24px', cursor: 'pointer' }}>×</button>
            <h3 style={{ margin: '0 0 24px', color: '#111827' }}>{editPopup ? '거래처 수정' : '거래처 등록'}</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div><label style={labelStyle}>거래처명 *</label><input style={inputStyle} value={editPopup?.name || newClient.name} onChange={e => editPopup ? setEditPopup({...editPopup, name: e.target.value}) : setNewClient({...newClient, name: e.target.value})} /></div>
              <div><label style={labelStyle}>주소</label><input style={inputStyle} value={editPopup?.address || newClient.address} onChange={e => editPopup ? setEditPopup({...editPopup, address: e.target.value}) : setNewClient({...newClient, address: e.target.value})} /></div>
              <div><label style={labelStyle}>전화번호</label><input style={inputStyle} value={editPopup?.phone || newClient.phone} onChange={e => editPopup ? setEditPopup({...editPopup, phone: e.target.value}) : setNewClient({...newClient, phone: e.target.value})} /></div>
              <div><label style={labelStyle}>비고</label><textarea style={{...inputStyle, minHeight: '80px'}} value={editPopup?.notes || newClient.notes} onChange={e => editPopup ? setEditPopup({...editPopup, notes: e.target.value}) : setNewClient({...newClient, notes: e.target.value})} /></div>
            </div>
            <button onClick={() => {
              if (editPopup) { setClients(prev => prev.map(c => c.id === editPopup.id ? editPopup : c)); }
              else { setClients(prev => [...prev, {...newClient, id: Date.now(), staff: [{name: '', isRep: true, phone: '', email: ''}], isPrescribing: false}]); setNewClient({ name: '', type: 'hospital', portfolio: 'sleepq', address: '', phone: '', email: '', notes: '', staff: [], partners: [], grade: 'C', products: [] }); }
              closeAll();
            }} style={{ width: '100%', marginTop: '24px', padding: '14px', background: editPopup ? 'linear-gradient(135deg, #4ade80, #22c55e)' : 'linear-gradient(135deg, #3b82f6, #2563eb)', border: 'none', borderRadius: '10px', color: '#fff', fontWeight: '600', cursor: 'pointer' }}>{editPopup ? '저장하기' : '등록하기'}</button>
          </div>
        </div>
      )}
    </div>
  );
}
