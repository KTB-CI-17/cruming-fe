import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '@/api/config/index';
import { router } from 'expo-router';

interface FetchOptions extends RequestInit {
  requireAuth?: boolean;
}

interface TokenData {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

export function useAuthenticatedFetch() {
  const refreshAccessToken = async () => {
    try {
      const tokenDataString = await AsyncStorage.getItem('tokenData');
      if (!tokenDataString) throw new Error('No refresh token available');

      const { refreshToken } = JSON.parse(tokenDataString) as TokenData;

      const response = await fetch(`${API_URL}/api/v1/auth/token/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        throw new Error('Token refresh failed');
      }

      const newTokenData = await response.json();
      await AsyncStorage.setItem('tokenData', JSON.stringify(newTokenData));
      return newTokenData.accessToken;
    } catch (error) {
      console.error('Error refreshing token:', error);
      await AsyncStorage.removeItem('tokenData');
      router.replace('/login');
      throw error;
    }
  };

  const authFetch = async (url: string, options: FetchOptions = {}) => {
    const { requireAuth = true, ...fetchOptions } = options;

    try {
      if (requireAuth) {
        const tokenDataString = await AsyncStorage.getItem('tokenData');
        if (!tokenDataString) {
          throw new Error('No token available');
        }

        const tokenData = JSON.parse(tokenDataString) as TokenData;

        // Check if token needs refresh
        if (Date.now() >= tokenData.expiresAt - 5 * 60 * 1000) { // 5 minutes buffer
          const newAccessToken = await refreshAccessToken();
          tokenData.accessToken = newAccessToken;
        }

        fetchOptions.headers = {
          ...fetchOptions.headers,
          'Authorization': `Bearer ${tokenData.accessToken}`,
        };
      }

      // Ensure content-type is set for requests with body
      if (fetchOptions.body) {
        fetchOptions.headers = {
          ...fetchOptions.headers,
          'Content-Type': 'application/json',
        };
      }

      const response = await fetch(url, fetchOptions);

      // Handle 401 errors
      if (response.status === 401 && requireAuth) {
        const newAccessToken = await refreshAccessToken();
        fetchOptions.headers = {
          ...fetchOptions.headers,
          'Authorization': `Bearer ${newAccessToken}`,
        };
        return fetch(url, fetchOptions);
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response;
    } catch (error) {
      if (error instanceof Error && error.message.includes('token')) {
        router.replace('/login');
      }
      throw error;
    }
  };

  return { authFetch };
}