import { supabase } from './supabase';

/**
 * 회원가입 신청 (Admin 승인 대기)
 * - Supabase Auth에 직접 등록하지 않음
 * - user_registrations 테이블에 신청 정보 저장
 * - Admin이 승인하면 그때 Supabase Auth에 계정 생성
 */
export const signupRequest = async (userData) => {
  const { name, email, password, phone, company, address, role = 'user' } = userData;

  // 유효성 검사
  if (!name || !email || !password) {
    throw new Error('이름, 이메일, 비밀번호는 필수입니다.');
  }

  // 이메일 중복 확인
  const { data: existingUser, error: checkError } = await supabase
    .from('user_registrations')
    .select('email')
    .eq('email', email)
    .single();

  if (existingUser) {
    throw new Error('이미 가입 신청된 이메일입니다.');
  }

  // 회원가입 신청 저장
  const { data, error } = await supabase
    .from('user_registrations')
    .insert([{
      name,
      email,
      password, // 주의: 실제 운영에서는 암호화 필요
      phone,
      company,
      address,
      role,
      status: 'pending'
    }])
    .select()
    .single();

  if (error) {
    console.error('회원가입 신청 실패:', error);
    throw new Error('회원가입 신청에 실패했습니다: ' + error.message);
  }

  return data;
};

/**
 * 로그인
 * - Supabase Auth를 사용한 이메일/비밀번호 로그인
 */
export const login = async (email, password) => {
  if (!email || !password) {
    throw new Error('이메일과 비밀번호를 입력해주세요.');
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    console.error('로그인 실패:', error);
    throw new Error('로그인에 실패했습니다: ' + error.message);
  }

  // 사용자 프로필 정보도 함께 가져오기
  const { data: profile, error: profileError } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', data.user.id)
    .single();

  if (profileError) {
    console.error('프로필 조회 실패:', profileError);
  }

  return {
    user: data.user,
    session: data.session,
    profile: profile
  };
};

/**
 * 로그아웃
 */
export const logout = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error('로그아웃 실패:', error);
    throw new Error('로그아웃에 실패했습니다: ' + error.message);
  }
};

/**
 * Admin: 회원가입 신청 목록 조회
 * - 대기 중인 신청만 조회하거나 전체 조회 가능
 */
export const getRegistrationRequests = async (status = null) => {
  let query = supabase
    .from('user_registrations')
    .select('*')
    .order('created_at', { ascending: false });

  if (status) {
    query = query.eq('status', status);
  }

  const { data, error } = await query;

  if (error) {
    console.error('가입 신청 목록 조회 실패:', error);
    throw new Error('가입 신청 목록 조회에 실패했습니다: ' + error.message);
  }

  return data;
};

/**
 * Admin: 회원가입 승인
 * - 백엔드 API를 호출하여 처리
 * - Supabase Auth에 실제 계정 생성
 * - user_profiles 테이블에 프로필 생성
 * - user_registrations 상태 업데이트
 */
export const approveRegistration = async (registrationId, adminUserId) => {
  try {
    const response = await fetch('/api/admin/approve-user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        registrationId,
        adminUserId
      })
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || '승인 처리에 실패했습니다.');
    }

    return result.data;
  } catch (error) {
    console.error('승인 처리 실패:', error);
    throw error;
  }
};

/**
 * Admin: 회원가입 거부
 * - 백엔드 API를 호출하여 처리
 */
export const rejectRegistration = async (registrationId, adminUserId) => {
  try {
    const response = await fetch('/api/admin/reject-user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        registrationId,
        adminUserId
      })
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || '거부 처리에 실패했습니다.');
    }

    return result.data;
  } catch (error) {
    console.error('거부 처리 실패:', error);
    throw error;
  }
};

/**
 * 현재 로그인한 사용자 정보 조회
 */
export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error) {
    console.error('사용자 정보 조회 실패:', error);
    return null;
  }

  if (!user) {
    return null;
  }

  // 프로필 정보도 함께 조회
  const { data: profile, error: profileError } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (profileError) {
    console.error('프로필 조회 실패:', profileError);
  }

  return {
    user,
    profile
  };
};
