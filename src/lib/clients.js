/**
 * 거래처 (Clients) API 클라이언트 함수들
 */

/**
 * 거래처 목록 조회
 * @param {object} filters - 필터 옵션
 * @param {string} filters.type - 거래처 유형 (hospital / pharmacy)
 * @param {string} filters.city - 시/도
 * @param {string} filters.district - 구/군
 * @param {string} filters.partnerId - 담당 협력사 ID
 * @param {string} filters.search - 거래처명 검색
 * @param {string} filters.portfolioType - 포트폴리오 타입 (sleepq / coaching)
 * @param {boolean} filters.isPrescribing - 처방 여부
 * @param {string} filters.necaStatus - NECA 상태 (none / pending / completed)
 * @param {number} filters.limit - 조회 개수
 * @param {number} filters.offset - 오프셋
 */
export const getClients = async (filters = {}) => {
  try {
    const params = new URLSearchParams();
    if (filters.type) params.append('type', filters.type);
    if (filters.city) params.append('city', filters.city);
    if (filters.district) params.append('district', filters.district);
    if (filters.partnerId) params.append('partnerId', filters.partnerId);
    if (filters.search) params.append('search', filters.search);
    if (filters.portfolioType) params.append('portfolioType', filters.portfolioType);
    if (filters.isPrescribing !== undefined) params.append('isPrescribing', String(filters.isPrescribing));
    if (filters.necaStatus) params.append('necaStatus', filters.necaStatus);
    if (filters.limit) params.append('limit', String(filters.limit));
    if (filters.offset) params.append('offset', String(filters.offset));

    const queryString = params.toString();
    const url = queryString ? `/api/clients?${queryString}` : '/api/clients';

    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || '거래처 조회에 실패했습니다.');
    }

    return result.data;
  } catch (error) {
    console.error('거래처 조회 실패:', error);
    throw error;
  }
};

/**
 * 병원 목록 조회 (type=hospital 단축 함수)
 * @param {object} filters - 추가 필터 옵션
 */
export const getHospitals = async (filters = {}) => {
  return getClients({ ...filters, type: 'hospital' });
};

/**
 * 약국 목록 조회 (type=pharmacy 단축 함수)
 * @param {object} filters - 추가 필터 옵션
 */
export const getPharmacies = async (filters = {}) => {
  return getClients({ ...filters, type: 'pharmacy' });
};

/**
 * 거래처명으로 검색
 * @param {string} searchTerm - 검색어
 * @param {string} type - 거래처 유형 (optional)
 */
export const searchClients = async (searchTerm, type) => {
  const filters = { search: searchTerm };
  if (type) filters.type = type;
  return getClients(filters);
};

/**
 * 특정 협력사가 담당하는 거래처 목록 조회
 * @param {string} partnerId - 협력사 ID
 */
export const getClientsByPartner = async (partnerId) => {
  return getClients({ partnerId });
};

/**
 * 처방 중인 병원 목록 조회 (지도 표시용)
 */
export const getPrescribingHospitals = async () => {
  return getClients({ type: 'hospital', isPrescribing: true });
};

/**
 * 지역별 거래처 목록 조회
 * @param {string} city - 시/도
 * @param {string} district - 구/군 (optional)
 */
export const getClientsByRegion = async (city, district) => {
  const filters = { city };
  if (district) filters.district = district;
  return getClients(filters);
};
