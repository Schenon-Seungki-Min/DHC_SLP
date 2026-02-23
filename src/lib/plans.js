/**
 * 방문 계획 (Route Plans) API 클라이언트 함수들
 */

/**
 * 방문 계획 목록 조회
 * @param {object} filters - 필터 옵션
 * @param {string} filters.userId - 사용자 ID
 * @param {string} filters.date - 특정 날짜 (YYYY-MM-DD)
 * @param {string} filters.status - 상태 (planned / confirmed)
 * @param {string} filters.clientId - 거래처 ID
 */
export const getPlans = async (filters = {}) => {
  try {
    const params = new URLSearchParams();
    if (filters.userId) params.append('userId', filters.userId);
    if (filters.date) params.append('date', filters.date);
    if (filters.status) params.append('status', filters.status);
    if (filters.clientId) params.append('clientId', filters.clientId);

    const queryString = params.toString();
    const url = queryString ? `/api/plans?${queryString}` : '/api/plans';

    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || '방문 계획 조회에 실패했습니다.');
    }

    return result.data;
  } catch (error) {
    console.error('방문 계획 조회 실패:', error);
    throw error;
  }
};

/**
 * 방문 계획 생성
 * @param {object} planData - 계획 데이터
 * @param {string} planData.userId - 사용자 ID
 * @param {string} planData.clientId - 거래처 ID
 * @param {string} planData.plannedDate - 계획 날짜 (YYYY-MM-DD)
 * @param {number} planData.sortOrder - 순서
 * @param {string} planData.status - 상태 (planned / confirmed)
 */
export const createPlan = async (planData) => {
  try {
    const response = await fetch('/api/plans', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(planData)
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || '방문 계획 생성에 실패했습니다.');
    }

    return result.data;
  } catch (error) {
    console.error('방문 계획 생성 실패:', error);
    throw error;
  }
};

/**
 * 방문 계획 수정
 * @param {object} updateData - 수정 데이터
 * @param {string} updateData.id - 계획 ID
 * @param {string} updateData.plannedDate - 날짜
 * @param {number} updateData.sortOrder - 순서
 * @param {string} updateData.status - 상태
 */
export const updatePlan = async (updateData) => {
  try {
    const response = await fetch('/api/plans', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateData)
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || '방문 계획 수정에 실패했습니다.');
    }

    return result.data;
  } catch (error) {
    console.error('방문 계획 수정 실패:', error);
    throw error;
  }
};

/**
 * 방문 계획 삭제
 * @param {string} planId - 삭제할 계획 ID
 */
export const deletePlan = async (planId) => {
  try {
    const response = await fetch(`/api/plans?id=${planId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' }
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || '방문 계획 삭제에 실패했습니다.');
    }

    return result;
  } catch (error) {
    console.error('방문 계획 삭제 실패:', error);
    throw error;
  }
};

/**
 * 방문 계획 확정
 * @param {string} planId - 확정할 계획 ID
 */
export const confirmPlan = async (planId) => {
  return updatePlan({ id: planId, status: 'confirmed' });
};
