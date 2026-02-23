import { createClient } from '@supabase/supabase-js';

// Serverless Function에서는 process.env 사용
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Supabase 환경 변수가 설정되지 않았습니다.');
}

// Service Role 키로 Supabase Admin 클라이언트 생성
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

/**
 * POST /api/admin/approve-user
 *
 * Body:
 * - registrationId: 승인할 가입 신청 ID
 * - adminUserId: 승인하는 관리자 ID
 */
export default async function handler(req, res) {
  // CORS 헤더 설정
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { registrationId, adminUserId } = req.body;

    if (!registrationId || !adminUserId) {
      return res.status(400).json({ error: 'registrationId와 adminUserId가 필요합니다.' });
    }

    // 1. 가입 신청 정보 조회
    const { data: registration, error: fetchError } = await supabaseAdmin
      .from('user_registrations')
      .select('*')
      .eq('id', registrationId)
      .single();

    if (fetchError || !registration) {
      return res.status(404).json({ error: '가입 신청을 찾을 수 없습니다.' });
    }

    if (registration.status !== 'pending') {
      return res.status(400).json({ error: '이미 처리된 신청입니다.' });
    }

    // 2. Supabase Auth에 사용자 생성 (Admin API)
    const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: registration.email,
      password: registration.password,
      email_confirm: true, // 이메일 인증 스킵
      user_metadata: {
        name: registration.name,
        phone: registration.phone,
        company: registration.company
      }
    });

    if (authError) {
      console.error('Auth 사용자 생성 실패:', authError);
      return res.status(500).json({ error: 'Auth 사용자 생성 실패: ' + authError.message });
    }

    // 3. user_profiles 테이블에 프로필 생성
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('user_profiles')
      .insert([{
        id: authUser.user.id,
        partner_id: null, // 나중에 Admin이 할당
        name: registration.name,
        role: registration.role,
        created_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (profileError) {
      console.error('프로필 생성 실패:', profileError);
      // Auth 사용자는 생성되었지만 프로필 실패 - 롤백 필요할 수도 있음
      return res.status(500).json({ error: '프로필 생성 실패: ' + profileError.message });
    }

    // 4. user_registrations 상태 업데이트
    const { data: updatedRegistration, error: updateError } = await supabaseAdmin
      .from('user_registrations')
      .update({
        status: 'approved',
        approved_by: adminUserId,
        approved_at: new Date().toISOString()
      })
      .eq('id', registrationId)
      .select()
      .single();

    if (updateError) {
      console.error('신청 상태 업데이트 실패:', updateError);
      return res.status(500).json({ error: '신청 상태 업데이트 실패: ' + updateError.message });
    }

    return res.status(200).json({
      success: true,
      message: '회원 승인이 완료되었습니다.',
      data: {
        registration: updatedRegistration,
        user: authUser.user,
        profile: profile
      }
    });

  } catch (error) {
    console.error('회원 승인 처리 중 오류:', error);
    return res.status(500).json({
      error: '회원 승인 처리 중 오류가 발생했습니다.',
      details: error.message
    });
  }
}
