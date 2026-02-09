import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { signupRequest, login, logout, getCurrentUser, getRegistrationRequests } from '../lib/auth';

export default function ApiTest() {
  const [log, setLog] = useState([]);
  const [loading, setLoading] = useState(false);

  const addLog = (message, type = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    setLog(prev => [...prev, { time: timestamp, message, type }]);
  };

  // 1. Supabase 연결 테스트
  const testConnection = async () => {
    setLoading(true);
    addLog('Supabase 연결 테스트 시작...', 'info');

    try {
      const { data, error } = await supabase
        .from('partners')
        .select('*')
        .limit(1);

      if (error) {
        addLog('❌ 연결 실패: ' + error.message, 'error');
      } else {
        addLog('✅ Supabase 연결 성공!', 'success');
        addLog('샘플 데이터: ' + JSON.stringify(data), 'success');
      }
    } catch (err) {
      addLog('❌ 에러: ' + err.message, 'error');
    }

    setLoading(false);
  };

  // 2. 회원가입 신청 테스트
  const testSignup = async () => {
    setLoading(true);
    addLog('회원가입 신청 테스트 시작...', 'info');

    const testUser = {
      name: '테스트사용자',
      email: 'test' + Date.now() + '@example.com',
      password: 'test1234!',
      phone: '010-1234-5678',
      company: '테스트회사',
      address: '서울시 강남구'
    };

    try {
      const result = await signupRequest(testUser);
      addLog('✅ 회원가입 신청 성공!', 'success');
      addLog('신청 ID: ' + result.id, 'success');
      addLog('상태: ' + result.status, 'success');
    } catch (err) {
      addLog('❌ 회원가입 실패: ' + err.message, 'error');
    }

    setLoading(false);
  };

  // 3. 가입 신청 목록 조회 (RLS 정책으로 인해 admin만 가능)
  const testGetRequests = async () => {
    setLoading(true);
    addLog('가입 신청 목록 조회 테스트...', 'info');

    try {
      const requests = await getRegistrationRequests('pending');
      addLog('✅ 조회 성공!', 'success');
      addLog('대기 중인 신청: ' + requests.length + '건', 'success');
      if (requests.length > 0) {
        addLog('첫 번째 신청: ' + JSON.stringify(requests[0]), 'info');
      }
    } catch (err) {
      addLog('❌ 조회 실패: ' + err.message, 'error');
      addLog('(Admin 권한이 없으면 조회할 수 없습니다)', 'warning');
    }

    setLoading(false);
  };

  // 4. 현재 사용자 조회
  const testGetCurrentUser = async () => {
    setLoading(true);
    addLog('현재 사용자 조회 테스트...', 'info');

    try {
      const userData = await getCurrentUser();
      if (userData) {
        addLog('✅ 로그인 상태: ' + userData.user.email, 'success');
        addLog('프로필: ' + JSON.stringify(userData.profile), 'info');
      } else {
        addLog('⚠️ 로그인되지 않음', 'warning');
      }
    } catch (err) {
      addLog('❌ 조회 실패: ' + err.message, 'error');
    }

    setLoading(false);
  };

  // 5. 전체 테스트
  const runAllTests = async () => {
    setLog([]);
    await testConnection();
    await new Promise(resolve => setTimeout(resolve, 1000));
    await testGetCurrentUser();
    await new Promise(resolve => setTimeout(resolve, 1000));
    await testSignup();
  };

  const clearLog = () => setLog([]);

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '30px' }}>🧪 API 테스트 페이지</h1>

      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <button
          onClick={testConnection}
          disabled={loading}
          style={{
            padding: '10px 20px',
            background: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.5 : 1
          }}
        >
          1. Supabase 연결 테스트
        </button>

        <button
          onClick={testGetCurrentUser}
          disabled={loading}
          style={{
            padding: '10px 20px',
            background: '#8b5cf6',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.5 : 1
          }}
        >
          2. 현재 사용자 조회
        </button>

        <button
          onClick={testSignup}
          disabled={loading}
          style={{
            padding: '10px 20px',
            background: '#10b981',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.5 : 1
          }}
        >
          3. 회원가입 신청
        </button>

        <button
          onClick={testGetRequests}
          disabled={loading}
          style={{
            padding: '10px 20px',
            background: '#f59e0b',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.5 : 1
          }}
        >
          4. 가입 신청 목록 (Admin)
        </button>

        <button
          onClick={runAllTests}
          disabled={loading}
          style={{
            padding: '10px 20px',
            background: '#ef4444',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.5 : 1
          }}
        >
          🚀 전체 테스트 실행
        </button>

        <button
          onClick={clearLog}
          disabled={loading}
          style={{
            padding: '10px 20px',
            background: '#6b7280',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.5 : 1
          }}
        >
          🗑️ 로그 지우기
        </button>
      </div>

      <div style={{
        background: '#1f2937',
        color: '#f3f4f6',
        padding: '20px',
        borderRadius: '8px',
        fontFamily: 'monospace',
        fontSize: '13px',
        maxHeight: '500px',
        overflowY: 'auto'
      }}>
        <div style={{ marginBottom: '10px', fontWeight: 'bold' }}>
          📋 테스트 로그:
        </div>
        {log.length === 0 ? (
          <div style={{ color: '#9ca3af' }}>테스트를 실행하세요...</div>
        ) : (
          log.map((entry, idx) => (
            <div
              key={idx}
              style={{
                marginBottom: '8px',
                padding: '8px',
                background: '#374151',
                borderRadius: '4px',
                borderLeft: `3px solid ${
                  entry.type === 'success' ? '#10b981' :
                  entry.type === 'error' ? '#ef4444' :
                  entry.type === 'warning' ? '#f59e0b' :
                  '#3b82f6'
                }`
              }}
            >
              <span style={{ color: '#9ca3af', marginRight: '10px' }}>[{entry.time}]</span>
              <span>{entry.message}</span>
            </div>
          ))
        )}
      </div>

      <div style={{ marginTop: '30px', padding: '20px', background: '#f9fafb', borderRadius: '8px' }}>
        <h3 style={{ marginBottom: '15px' }}>💡 사용 안내</h3>
        <ul style={{ lineHeight: '1.8' }}>
          <li><strong>1. Supabase 연결 테스트:</strong> DB 연결이 정상인지 확인합니다.</li>
          <li><strong>2. 현재 사용자 조회:</strong> 로그인 상태를 확인합니다.</li>
          <li><strong>3. 회원가입 신청:</strong> 새로운 테스트 계정을 생성합니다 (Admin 승인 대기).</li>
          <li><strong>4. 가입 신청 목록:</strong> Admin 권한이 있어야 조회 가능합니다.</li>
          <li><strong>전체 테스트:</strong> 모든 테스트를 순차적으로 실행합니다.</li>
        </ul>
      </div>
    </div>
  );
}
