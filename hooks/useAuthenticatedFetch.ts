import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '@/api/config/index';
import { router } from 'expo-router';

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

  const getValidToken = async () => {
    try {
      const tokenDataString = await AsyncStorage.getItem('tokenData');
      if (!tokenDataString) {
        throw new Error('No token available');
      }

      const tokenData = JSON.parse(tokenDataString) as TokenData;
      console.log('Current token expiry:', new Date(tokenData.expiresAt));

      if (Date.now() >= tokenData.expiresAt - 5 * 60 * 1000) {
        console.log('Token expired or near expiry, refreshing...');
        const newAccessToken = await refreshAccessToken();
        return newAccessToken;
      }

      return tokenData.accessToken;
    } catch (error) {
      console.error('Error getting valid token:', error);
      throw error;
    }
  };

  const authMultipartFetch = {
    getToken: getValidToken
  };

  const authFetch = async (url: string, options: RequestInit = {}) => {
    const accessToken = await getValidToken();

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
      ...options.headers,
    };

    let response = await fetch(url, { ...options, headers });

    if (response.status === 401) {
      const newAccessToken = await refreshAccessToken();
      headers.Authorization = `Bearer ${newAccessToken}`;
      response = await fetch(url, { ...options, headers });
    }

    return response;
  };

  return { authFetch, authMultipartFetch };
}