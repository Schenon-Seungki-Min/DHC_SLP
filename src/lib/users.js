/**
 * 사용자 관리 API 클라이언트 함수들
 */

/**
 * 사용자 프로필 조회
 * @param {string} userId - 조회할 사용자 ID
 */
export const getUserProfile = async (userId) => {
  try {
    const response = await fetch(`/api/users/profile?userId=${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || '프로필 조회에 실패했습니다.');
    }

    return result.data;
  } catch (error) {
    console.error('프로필 조회 실패:', error);
    throw error;
  }
};

/**
 * 사용자 프로필 수정
 * @param {string} userId - 수정할 사용자 ID
 * @param {object} updates - 수정할 데이터 { name, role, partnerId }
 */
export const updateUserProfile = async (userId, updates) => {
  try {
    const response = await fetch('/api/users/profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        ...updates
      })
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || '프로필 수정에 실패했습니다.');
    }

    return result.data;
  } catch (error) {
    console.error('프로필 수정 실패:', error);
    throw error;
  }
};

/**
 * 전체 사용자 목록 조회
 * @param {object} filters - 필터 옵션 { role, partnerId }
 */
export const getAllUsers = async (filters = {}) => {
  try {
    const params = new URLSearchParams();
    if (filters.role) params.append('role', filters.role);
    if (filters.partnerId) params.append('partnerId', filters.partnerId);

    const queryString = params.toString();
    const url = queryString ? `/api/users?${queryString}` : '/api/users';

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || '사용자 목록 조회에 실패했습니다.');
    }

    return result.data;
  } catch (error) {
    console.error('사용자 목록 조회 실패:', error);
    throw error;
  }
};

/**
 * 협력사 목록 조회
 */
export const getPartners = async () => {
  try {
    const response = await fetch('/api/partners', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || '협력사 목록 조회에 실패했습니다.');
    }

    return result.data;
  } catch (error) {
    console.error('협력사 목록 조회 실패:', error);
    throw error;
  }
};

/**
 * 사용자에게 협력사 할당
 * @param {string} userId - 사용자 ID
 * @param {string|null} partnerId - 협력사 ID (null이면 할당 해제)
 * @param {string} adminUserId - 관리자 ID
 */
export const assignPartnerToUser = async (userId, partnerId, adminUserId) => {
  try {
    const response = await fetch('/api/users/assign-partner', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        partnerId,
        adminUserId
      })
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || '협력사 할당에 실패했습니다.');
    }

    return result.data;
  } catch (error) {
    console.error('협력사 할당 실패:', error);
    throw error;
  }
};
