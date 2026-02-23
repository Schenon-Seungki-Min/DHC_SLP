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
 * GET /api/plans?userId=xxx&date=2024-01-01&status=planned
 * POST /api/plans
 * PUT /api/plans (update existing plan)
 * DELETE /api/plans?id=xxx
 *
 * 방문 계획 (Route Plans) API
 */
export default async function handler(req, res) {
  // CORS 헤더 설정
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST,PUT,DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // GET: 방문 계획 목록 조회
  if (req.method === 'GET') {
    try {
      const { userId, date, status, clientId } = req.query;

      let query = supabaseAdmin
        .from('route_plans')
        .select(`
          *,
          client:clients(id, name, type, address, phone, latitude, longitude),
          user:user_profiles!route_plans_user_profile_fkey(id, name, partner_id)
        `)
        .order('planned_date', { ascending: true })
        .order('sort_order', { ascending: true });

      // 사용자 필터
      if (userId) {
        query = query.eq('user_id', userId);
      }

      // 날짜 필터
      if (date) {
        query = query.eq('planned_date', date);
      }

      // 상태 필터 (planned / confirmed)
      if (status) {
        query = query.eq('status', status);
      }

      // 거래처 필터
      if (clientId) {
        query = query.eq('client_id', clientId);
      }

      const { data: plans, error: plansError } = await query;

      if (plansError) {
        console.error('방문 계획 조회 실패:', plansError);
        return res.status(500).json({ error: '방문 계획 조회 실패: ' + plansError.message });
      }

      return res.status(200).json({
        success: true,
        data: plans,
        count: plans.length
      });

    } catch (error) {
      console.error('방문 계획 조회 중 오류:', error);
      return res.status(500).json({
        error: '방문 계획 조회 중 오류가 발생했습니다.',
        details: error.message
      });
    }
  }

  // POST: 방문 계획 생성
  if (req.method === 'POST') {
    try {
      const { userId, clientId, plannedDate, sortOrder, status = 'planned' } = req.body;

      if (!userId || !clientId) {
        return res.status(400).json({ error: 'userId와 clientId가 필요합니다.' });
      }

      // 중복 확인 (같은 사용자, 같은 거래처, 같은 날짜)
      if (plannedDate) {
        const { data: existing } = await supabaseAdmin
          .from('route_plans')
          .select('id')
          .eq('user_id', userId)
          .eq('client_id', clientId)
          .eq('planned_date', plannedDate)
          .maybeSingle();

        if (existing) {
          return res.status(409).json({ error: '동일한 날짜에 이미 해당 거래처 방문 계획이 있습니다.' });
        }
      }

      const insertData = {
        user_id: userId,
        client_id: clientId,
        planned_date: plannedDate || null,
        sort_order: sortOrder || 0,
        status
      };

      const { data: plan, error: insertError } = await supabaseAdmin
        .from('route_plans')
        .insert([insertData])
        .select(`
          *,
          client:clients(id, name, type, address, phone, latitude, longitude)
        `)
        .single();

      if (insertError) {
        console.error('방문 계획 생성 실패:', insertError);
        return res.status(500).json({ error: '방문 계획 생성 실패: ' + insertError.message });
      }

      return res.status(201).json({
        success: true,
        message: '방문 계획이 생성되었습니다.',
        data: plan
      });

    } catch (error) {
      console.error('방문 계획 생성 중 오류:', error);
      return res.status(500).json({
        error: '방문 계획 생성 중 오류가 발생했습니다.',
        details: error.message
      });
    }
  }

  // PUT: 방문 계획 수정
  if (req.method === 'PUT') {
    try {
      const { id, plannedDate, sortOrder, status } = req.body;

      if (!id) {
        return res.status(400).json({ error: '수정할 계획의 id가 필요합니다.' });
      }

      // 확정된 계획은 수정 불가
      const { data: existingPlan } = await supabaseAdmin
        .from('route_plans')
        .select('status')
        .eq('id', id)
        .single();

      if (existingPlan && existingPlan.status === 'confirmed' && status !== 'confirmed') {
        return res.status(400).json({ error: '확정된 계획은 수정할 수 없습니다.' });
      }

      const updateData = {};
      if (plannedDate !== undefined) updateData.planned_date = plannedDate;
      if (sortOrder !== undefined) updateData.sort_order = sortOrder;
      if (status !== undefined) updateData.status = status;

      if (Object.keys(updateData).length === 0) {
        return res.status(400).json({ error: '수정할 데이터가 없습니다.' });
      }

      const { data: updatedPlan, error: updateError } = await supabaseAdmin
        .from('route_plans')
        .update(updateData)
        .eq('id', id)
        .select(`
          *,
          client:clients(id, name, type, address, phone, latitude, longitude)
        `)
        .single();

      if (updateError) {
        console.error('방문 계획 수정 실패:', updateError);
        return res.status(500).json({ error: '방문 계획 수정 실패: ' + updateError.message });
      }

      return res.status(200).json({
        success: true,
        message: '방문 계획이 수정되었습니다.',
        data: updatedPlan
      });

    } catch (error) {
      console.error('방문 계획 수정 중 오류:', error);
      return res.status(500).json({
        error: '방문 계획 수정 중 오류가 발생했습니다.',
        details: error.message
      });
    }
  }

  // DELETE: 방문 계획 삭제
  if (req.method === 'DELETE') {
    try {
      const { id } = req.query;

      if (!id) {
        return res.status(400).json({ error: '삭제할 계획의 id가 필요합니다.' });
      }

      // 확정된 계획은 삭제 불가
      const { data: existingPlan } = await supabaseAdmin
        .from('route_plans')
        .select('status')
        .eq('id', id)
        .single();

      if (existingPlan && existingPlan.status === 'confirmed') {
        return res.status(400).json({ error: '확정된 계획은 삭제할 수 없습니다.' });
      }

      const { error: deleteError } = await supabaseAdmin
        .from('route_plans')
        .delete()
        .eq('id', id);

      if (deleteError) {
        console.error('방문 계획 삭제 실패:', deleteError);
        return res.status(500).json({ error: '방문 계획 삭제 실패: ' + deleteError.message });
      }

      return res.status(200).json({
        success: true,
        message: '방문 계획이 삭제되었습니다.'
      });

    } catch (error) {
      console.error('방문 계획 삭제 중 오류:', error);
      return res.status(500).json({
        error: '방문 계획 삭제 중 오류가 발생했습니다.',
        details: error.message
      });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
