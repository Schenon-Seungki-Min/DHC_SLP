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
 * GET /api/partners
 *
 * 협력사 목록 조회
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
    // 협력사 목록 조회
    const { data: partners, error: partnersError } = await supabaseAdmin
      .from('partners')
      .select('*')
      .order('name', { ascending: true });

    if (partnersError) {
      console.error('협력사 목록 조회 실패:', partnersError);
      return res.status(500).json({ error: '협력사 목록 조회 실패: ' + partnersError.message });
    }

    return res.status(200).json({
      success: true,
      data: partners,
      count: partners.length
    });

  } catch (error) {
    console.error('협력사 목록 조회 중 오류:', error);
    return res.status(500).json({
      error: '협력사 목록 조회 중 오류가 발생했습니다.',
      details: error.message
    });
  }
}
