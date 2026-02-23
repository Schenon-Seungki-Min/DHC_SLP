import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Supabase 환경 변수가 설정되지 않았습니다.');
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

/**
 * POST /api/admin/reject-user
 *
 * Body:
 * - registrationId: 거부할 가입 신청 ID
 * - adminUserId: 거부하는 관리자 ID
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

    // 2. user_registrations 상태 업데이트 (거부)
    const { data: updatedRegistration, error: updateError } = await supabaseAdmin
      .from('user_registrations')
      .update({
        status: 'rejected',
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
      message: '회원 가입을 거부했습니다.',
      data: {
        registration: updatedRegistration
      }
    });

  } catch (error) {
    console.error('회원 거부 처리 중 오류:', error);
    return res.status(500).json({
      error: '회원 거부 처리 중 오류가 발생했습니다.',
      details: error.message
    });
  }
}
