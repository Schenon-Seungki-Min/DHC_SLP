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
 * GET /api/clients?type=hospital&city=서울&partnerId=xxx&search=클리닉&portfolioType=sleepq
 *
 * 거래처 조회 API
 * - 거래처 목록 조회 (병원/약국)
 * - 포트폴리오 정보, 담당자 정보, 담당 협력사 정보 포함
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
    const {
      type,
      city,
      district,
      partnerId,
      search,
      portfolioType,
      isPrescribing,
      necaStatus,
      limit = '50',
      offset = '0'
    } = req.query;

    // 기본 쿼리: 거래처 + 포트폴리오 + 담당자 + 협력사 매핑
    let query = supabaseAdmin
      .from('clients')
      .select(`
        *,
        portfolios:client_portfolio(*),
        staff:staff(*),
        client_partners(
          id,
          partner:partners(id, name)
        ),
        progress:client_progress(*)
      `)
      .order('name', { ascending: true });

    // 거래처 유형 필터 (hospital / pharmacy)
    if (type) {
      query = query.eq('type', type);
    }

    // 지역 필터
    if (city) {
      query = query.eq('address_city', city);
    }
    if (district) {
      query = query.eq('address_district', district);
    }

    // 거래처명 검색
    if (search) {
      query = query.ilike('name', `%${search}%`);
    }

    // 페이징
    const limitNum = parseInt(limit, 10);
    const offsetNum = parseInt(offset, 10);
    query = query.range(offsetNum, offsetNum + limitNum - 1);

    const { data: clients, error: clientsError } = await query;

    if (clientsError) {
      console.error('거래처 조회 실패:', clientsError);
      return res.status(500).json({ error: '거래처 조회 실패: ' + clientsError.message });
    }

    let filteredClients = clients;

    // 협력사 필터 (client_partners를 통한 후처리 필터)
    if (partnerId) {
      filteredClients = filteredClients.filter(client =>
        client.client_partners.some(cp => cp.partner && cp.partner.id === partnerId)
      );
    }

    // 포트폴리오 타입 필터 (후처리)
    if (portfolioType) {
      filteredClients = filteredClients.filter(client =>
        client.portfolios.some(p => p.portfolio_type === portfolioType)
      );
    }

    // 처방 여부 필터 (후처리)
    if (isPrescribing !== undefined) {
      const prescribing = isPrescribing === 'true';
      filteredClients = filteredClients.filter(client =>
        client.portfolios.some(p => p.is_prescribing === prescribing)
      );
    }

    // NECA 상태 필터 (후처리)
    if (necaStatus) {
      filteredClients = filteredClients.filter(client =>
        client.portfolios.some(p => p.neca_status === necaStatus)
      );
    }

    // 응답 데이터 정리
    const responseData = filteredClients.map(client => ({
      ...client,
      // 대표 담당자 추출
      representative: client.staff.find(s => s.is_representative) || null,
      // 협력사 목록 정리
      partners: client.client_partners
        .filter(cp => cp.partner)
        .map(cp => cp.partner)
    }));

    return res.status(200).json({
      success: true,
      data: responseData,
      count: responseData.length,
      limit: limitNum,
      offset: offsetNum
    });

  } catch (error) {
    console.error('거래처 조회 중 오류:', error);
    return res.status(500).json({
      error: '거래처 조회 중 오류가 발생했습니다.',
      details: error.message
    });
  }
}
