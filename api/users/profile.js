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
 * GET /api/users/profile?userId=xxx
 * PUT /api/users/profile
 *
 * 사용자 프로필 조회 및 수정
 */
export default async function handler(req, res) {
  // CORS 헤더 설정
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // GET: 프로필 조회
  if (req.method === 'GET') {
    try {
      const { userId } = req.query;

      if (!userId) {
        return res.status(400).json({ error: 'userId가 필요합니다.' });
      }

      // 사용자 프로필 조회 (협력사 정보 포함)
      const { data: profile, error: profileError } = await supabaseAdmin
        .from('user_profiles')
        .select(`
          *,
          partner:partners(id, name)
        `)
        .eq('id', userId)
        .single();

      if (profileError) {
        console.error('프로필 조회 실패:', profileError);
        return res.status(500).json({ error: '프로필 조회 실패: ' + profileError.message });
      }

      if (!profile) {
        return res.status(404).json({ error: '사용자를 찾을 수 없습니다.' });
      }

      return res.status(200).json({
        success: true,
        data: profile
      });

    } catch (error) {
      console.error('프로필 조회 중 오류:', error);
      return res.status(500).json({
        error: '프로필 조회 중 오류가 발생했습니다.',
        details: error.message
      });
    }
  }

  // PUT: 프로필 수정
  if (req.method === 'PUT') {
    try {
      const { userId, name, role, partnerId } = req.body;

      if (!userId) {
        return res.status(400).json({ error: 'userId가 필요합니다.' });
      }

      // 수정할 데이터 준비
      const updateData = {};
      if (name !== undefined) updateData.name = name;
      if (role !== undefined) updateData.role = role;
      if (partnerId !== undefined) updateData.partner_id = partnerId;

      if (Object.keys(updateData).length === 0) {
        return res.status(400).json({ error: '수정할 데이터가 없습니다.' });
      }

      // 프로필 업데이트
      const { data: updatedProfile, error: updateError } = await supabaseAdmin
        .from('user_profiles')
        .update(updateData)
        .eq('id', userId)
        .select(`
          *,
          partner:partners(id, name)
        `)
        .single();

      if (updateError) {
        console.error('프로필 수정 실패:', updateError);
        return res.status(500).json({ error: '프로필 수정 실패: ' + updateError.message });
      }

      return res.status(200).json({
        success: true,
        message: '프로필이 수정되었습니다.',
        data: updatedProfile
      });

    } catch (error) {
      console.error('프로필 수정 중 오류:', error);
      return res.status(500).json({
        error: '프로필 수정 중 오류가 발생했습니다.',
        details: error.message
      });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
