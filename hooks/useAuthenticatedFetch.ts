import { useAuth } from '@/api/context/AuthContext';

interface FetchOptions extends RequestInit {
  requireAuth?: boolean;
}

export function useAuthenticatedFetch() {
  const { getValidToken, logout } = useAuth();

  async function authFetch(url: string, options: FetchOptions = {}) {
    const { requireAuth = true, ...fetchOptions } = options;

    async function executeRequest(token: string) {
      return fetch(url, {
        ...fetchOptions,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          ...fetchOptions.headers,
        },
      });
    }

    try {
      if (!requireAuth) {
        return await fetch(url, {
          ...fetchOptions,
          headers: {
            'Content-Type': 'application/json',
            ...fetchOptions.headers,
          },
        });
      }

      // 첫 번째 시도
      const token = await getValidToken();
      if (!token) {
        throw new Error('Authentication required');
      }

      let response = await executeRequest(token);

      // 401 에러 발생 시 토큰 갱신 후 재시도
      if (response.status === 401) {
        // 토큰 강제 갱신 시도
        const newToken = await getValidToken();
        if (!newToken) {
          throw new Error('Failed to refresh authentication');
        }

        // 새 토큰으로 요청 재시도
        response = await executeRequest(newToken);
        
        // 두 번째 시도도 실패하면 최종적으로 로그아웃
        if (response.status === 401) {
          await logout();
          throw new Error('Authentication failed. Please login again.');
        }
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response;
    } catch (error) {
      console.error('Fetch error:', error);
      throw error;
    }
  }

  return { authFetch };
} 