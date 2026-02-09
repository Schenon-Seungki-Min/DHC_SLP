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
 * PUT /api/users/assign-partner
 *
 * Body:
 * - userId: 할당할 사용자 ID
 * - partnerId: 할당할 협력사 ID (null이면 할당 해제)
 * - adminUserId: 할당하는 관리자 ID
 */
export default async function handler(req, res) {
  // CORS 헤더 설정
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'PUT,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userId, partnerId, adminUserId } = req.body;

    if (!userId || !adminUserId) {
      return res.status(400).json({ error: 'userId와 adminUserId가 필요합니다.' });
    }

    // partnerId가 제공된 경우, 협력사 존재 확인
    if (partnerId) {
      const { data: partner, error: partnerError } = await supabaseAdmin
        .from('partners')
        .select('id, name')
        .eq('id', partnerId)
        .single();

      if (partnerError || !partner) {
        return res.status(404).json({ error: '협력사를 찾을 수 없습니다.' });
      }
    }

    // 사용자 프로필 업데이트
    const { data: updatedProfile, error: updateError } = await supabaseAdmin
      .from('user_profiles')
      .update({
        partner_id: partnerId || null
      })
      .eq('id', userId)
      .select(`
        *,
        partner:partners(id, name)
      `)
      .single();

    if (updateError) {
      console.error('협력사 할당 실패:', updateError);
      return res.status(500).json({ error: '협력사 할당 실패: ' + updateError.message });
    }

    if (!updatedProfile) {
      return res.status(404).json({ error: '사용자를 찾을 수 없습니다.' });
    }

    return res.status(200).json({
      success: true,
      message: partnerId ? '협력사가 할당되었습니다.' : '협력사 할당이 해제되었습니다.',
      data: updatedProfile
    });

  } catch (error) {
    console.error('협력사 할당 중 오류:', error);
    return res.status(500).json({
      error: '협력사 할당 중 오류가 발생했습니다.',
      details: error.message
    });
  }
}
