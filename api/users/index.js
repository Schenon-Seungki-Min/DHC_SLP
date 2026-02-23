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
 * GET /api/users?role=admin&partnerId=xxx
 *
 * 전체 사용자 목록 조회 (Admin용)
 * Query parameters:
 * - role: 특정 역할 필터링 (optional)
 * - partnerId: 특정 협력사 필터링 (optional)
 */
export default async function handler(req, res) {
  // CORS 헤더 설정
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { role, partnerId } = req.query;

    // 쿼리 빌드
    let query = supabaseAdmin
      .from('user_profiles')
      .select(`
        *,
        partner:partners(id, name)
      `)
      .order('created_at', { ascending: false });

    // 필터 적용
    if (role) {
      query = query.eq('role', role);
    }

    if (partnerId) {
      query = query.eq('partner_id', partnerId);
    }

    const { data: users, error: usersError } = await query;

    if (usersError) {
      console.error('사용자 목록 조회 실패:', usersError);
      return res.status(500).json({ error: '사용자 목록 조회 실패: ' + usersError.message });
    }

    return res.status(200).json({
      success: true,
      data: users,
      count: users.length
    });

  } catch (error) {
    console.error('사용자 목록 조회 중 오류:', error);
    return res.status(500).json({
      error: '사용자 목록 조회 중 오류가 발생했습니다.',
      details: error.message
    });
  }
}
