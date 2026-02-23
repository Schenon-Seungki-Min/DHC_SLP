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
 * GET /api/visits?userId=xxx&clientId=xxx&startDate=2024-01-01&endDate=2024-12-31&status=completed
 * POST /api/visits
 * PUT /api/visits (update existing visit)
 *
 * 방문 기록 (Visit Logs) API
 */
export default async function handler(req, res) {
  // CORS 헤더 설정
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // GET: 방문 기록 목록 조회
  if (req.method === 'GET') {
    try {
      const { userId, clientId, partnerId, startDate, endDate, status, isScheduled, limit = '50', offset = '0' } = req.query;

      let query = supabaseAdmin
        .from('visit_logs')
        .select(`
          *,
          client:clients(id, name, type, address, phone),
          user:user_profiles!visit_logs_user_id_fkey(id, name),
          partner:partners(id, name)
        `)
        .order('visit_date', { ascending: false });

      // 사용자 필터
      if (userId) {
        query = query.eq('user_id', userId);
      }

      // 거래처 필터
      if (clientId) {
        query = query.eq('client_id', clientId);
      }

      // 협력사 필터
      if (partnerId) {
        query = query.eq('partner_id', partnerId);
      }

      // 날짜 범위 필터
      if (startDate) {
        query = query.gte('visit_date', startDate);
      }
      if (endDate) {
        query = query.lte('visit_date', endDate);
      }

      // 상태 필터 (completed / cancelled)
      if (status) {
        query = query.eq('status', status);
      }

      // 예정 여부 필터
      if (isScheduled !== undefined) {
        query = query.eq('is_scheduled', isScheduled === 'true');
      }

      // 페이징
      const limitNum = parseInt(limit, 10);
      const offsetNum = parseInt(offset, 10);
      query = query.range(offsetNum, offsetNum + limitNum - 1);

      const { data: visits, error: visitsError, count } = await query;

      if (visitsError) {
        console.error('방문 기록 조회 실패:', visitsError);
        return res.status(500).json({ error: '방문 기록 조회 실패: ' + visitsError.message });
      }

      return res.status(200).json({
        success: true,
        data: visits,
        count: visits.length,
        limit: limitNum,
        offset: offsetNum
      });

    } catch (error) {
      console.error('방문 기록 조회 중 오류:', error);
      return res.status(500).json({
        error: '방문 기록 조회 중 오류가 발생했습니다.',
        details: error.message
      });
    }
  }

  // POST: 방문 기록 생성
  if (req.method === 'POST') {
    try {
      const {
        userId,
        clientId,
        partnerId,
        visitDate,
        isScheduled = false,
        memo,
        isMemoPublic = false,
        products,
        visitType,
        status = 'completed'
      } = req.body;

      if (!userId || !clientId || !visitDate) {
        return res.status(400).json({ error: 'userId, clientId, visitDate가 필요합니다.' });
      }

      // partnerId가 없으면 사용자의 소속 협력사 조회
      let resolvedPartnerId = partnerId;
      if (!resolvedPartnerId) {
        const { data: userProfile } = await supabaseAdmin
          .from('user_profiles')
          .select('partner_id')
          .eq('id', userId)
          .single();

        if (userProfile) {
          resolvedPartnerId = userProfile.partner_id;
        }
      }

      const insertData = {
        user_id: userId,
        client_id: clientId,
        partner_id: resolvedPartnerId,
        visit_date: visitDate,
        is_scheduled: isScheduled,
        memo: memo || null,
        is_memo_public: isMemoPublic,
        products: products || [],
        visit_type: visitType || null,
        status
      };

      const { data: visit, error: insertError } = await supabaseAdmin
        .from('visit_logs')
        .insert([insertData])
        .select(`
          *,
          client:clients(id, name, type, address, phone),
          user:user_profiles!visit_logs_user_id_fkey(id, name),
          partner:partners(id, name)
        `)
        .single();

      if (insertError) {
        console.error('방문 기록 생성 실패:', insertError);
        return res.status(500).json({ error: '방문 기록 생성 실패: ' + insertError.message });
      }

      return res.status(201).json({
        success: true,
        message: '방문 기록이 생성되었습니다.',
        data: visit
      });

    } catch (error) {
      console.error('방문 기록 생성 중 오류:', error);
      return res.status(500).json({
        error: '방문 기록 생성 중 오류가 발생했습니다.',
        details: error.message
      });
    }
  }

  // PUT: 방문 기록 수정
  if (req.method === 'PUT') {
    try {
      const {
        id,
        visitDate,
        memo,
        isMemoPublic,
        products,
        visitType,
        status,
        cancelReason,
        rescheduleDate
      } = req.body;

      if (!id) {
        return res.status(400).json({ error: '수정할 방문 기록의 id가 필요합니다.' });
      }

      const updateData = {};
      if (visitDate !== undefined) updateData.visit_date = visitDate;
      if (memo !== undefined) updateData.memo = memo;
      if (isMemoPublic !== undefined) updateData.is_memo_public = isMemoPublic;
      if (products !== undefined) updateData.products = products;
      if (visitType !== undefined) updateData.visit_type = visitType;
      if (status !== undefined) updateData.status = status;
      if (cancelReason !== undefined) updateData.cancel_reason = cancelReason;
      if (rescheduleDate !== undefined) updateData.reschedule_date = rescheduleDate;

      if (Object.keys(updateData).length === 0) {
        return res.status(400).json({ error: '수정할 데이터가 없습니다.' });
      }

      const { data: updatedVisit, error: updateError } = await supabaseAdmin
        .from('visit_logs')
        .update(updateData)
        .eq('id', id)
        .select(`
          *,
          client:clients(id, name, type, address, phone),
          user:user_profiles!visit_logs_user_id_fkey(id, name),
          partner:partners(id, name)
        `)
        .single();

      if (updateError) {
        console.error('방문 기록 수정 실패:', updateError);
        return res.status(500).json({ error: '방문 기록 수정 실패: ' + updateError.message });
      }

      return res.status(200).json({
        success: true,
        message: '방문 기록이 수정되었습니다.',
        data: updatedVisit
      });

    } catch (error) {
      console.error('방문 기록 수정 중 오류:', error);
      return res.status(500).json({
        error: '방문 기록 수정 중 오류가 발생했습니다.',
        details: error.message
      });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
