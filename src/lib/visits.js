/**
 * 방문 기록 (Visit Logs) API 클라이언트 함수들
 */

/**
 * 방문 기록 목록 조회
 * @param {object} filters - 필터 옵션
 * @param {string} filters.userId - 사용자 ID
 * @param {string} filters.clientId - 거래처 ID
 * @param {string} filters.partnerId - 협력사 ID
 * @param {string} filters.startDate - 시작 날짜 (YYYY-MM-DD)
 * @param {string} filters.endDate - 종료 날짜 (YYYY-MM-DD)
 * @param {string} filters.status - 상태 (completed / cancelled)
 * @param {boolean} filters.isScheduled - 예정 여부
 * @param {number} filters.limit - 조회 개수
 * @param {number} filters.offset - 오프셋
 */
export const getVisits = async (filters = {}) => {
  try {
    const params = new URLSearchParams();
    if (filters.userId) params.append('userId', filters.userId);
    if (filters.clientId) params.append('clientId', filters.clientId);
    if (filters.partnerId) params.append('partnerId', filters.partnerId);
    if (filters.startDate) params.append('startDate', filters.startDate);
    if (filters.endDate) params.append('endDate', filters.endDate);
    if (filters.status) params.append('status', filters.status);
    if (filters.isScheduled !== undefined) params.append('isScheduled', String(filters.isScheduled));
    if (filters.limit) params.append('limit', String(filters.limit));
    if (filters.offset) params.append('offset', String(filters.offset));

    const queryString = params.toString();
    const url = queryString ? `/api/visits?${queryString}` : '/api/visits';

    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || '방문 기록 조회에 실패했습니다.');
    }

    return result.data;
  } catch (error) {
    console.error('방문 기록 조회 실패:', error);
    throw error;
  }
};

/**
 * 방문 기록 생성
 * @param {object} visitData - 방문 기록 데이터
 * @param {string} visitData.userId - 사용자 ID
 * @param {string} visitData.clientId - 거래처 ID
 * @param {string} visitData.partnerId - 협력사 ID (optional, 자동 조회)
 * @param {string} visitData.visitDate - 방문 날짜 (YYYY-MM-DD)
 * @param {boolean} visitData.isScheduled - 예정 여부
 * @param {string} visitData.memo - 메모
 * @param {boolean} visitData.isMemoPublic - 메모 공개 여부
 * @param {Array} visitData.products - 제품 정보
 * @param {string} visitData.visitType - 방문 유형
 * @param {string} visitData.status - 상태 (completed / cancelled)
 */
export const createVisit = async (visitData) => {
  try {
    const response = await fetch('/api/visits', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(visitData)
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || '방문 기록 생성에 실패했습니다.');
    }

    return result.data;
  } catch (error) {
    console.error('방문 기록 생성 실패:', error);
    throw error;
  }
};

/**
 * 방문 기록 수정
 * @param {object} updateData - 수정 데이터
 * @param {string} updateData.id - 방문 기록 ID
 * @param {string} updateData.visitDate - 방문 날짜
 * @param {string} updateData.memo - 메모
 * @param {boolean} updateData.isMemoPublic - 메모 공개 여부
 * @param {Array} updateData.products - 제품 정보
 * @param {string} updateData.visitType - 방문 유형
 * @param {string} updateData.status - 상태
 * @param {string} updateData.cancelReason - 취소 사유
 * @param {string} updateData.rescheduleDate - 재일정 날짜
 */
export const updateVisit = async (updateData) => {
  try {
    const response = await fetch('/api/visits', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateData)
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || '방문 기록 수정에 실패했습니다.');
    }

    return result.data;
  } catch (error) {
    console.error('방문 기록 수정 실패:', error);
    throw error;
  }
};

/**
 * 방문 기록 취소
 * @param {string} visitId - 취소할 방문 기록 ID
 * @param {string} cancelReason - 취소 사유
 * @param {string} rescheduleDate - 재일정 날짜 (optional)
 */
export const cancelVisit = async (visitId, cancelReason, rescheduleDate) => {
  return updateVisit({
    id: visitId,
    status: 'cancelled',
    cancelReason,
    rescheduleDate: rescheduleDate || null
  });
};

/**
 * 특정 거래처의 방문 이력 조회
 * @param {string} clientId - 거래처 ID
 * @param {number} limit - 조회 개수
 */
export const getClientVisitHistory = async (clientId, limit = 20) => {
  return getVisits({ clientId, limit, status: 'completed' });
};

/**
 * 사용자의 예정된 방문 조회
 * @param {string} userId - 사용자 ID
 */
export const getScheduledVisits = async (userId) => {
  return getVisits({ userId, isScheduled: true });
};
