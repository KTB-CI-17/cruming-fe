import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../types/auth';
import * as KakaoLogin from '@react-native-seoul/kakao-login';
import type {
    GetProfileResponse,
    NaverLoginResponse,
  } from '@react-native-seoul/naver-login';

import NaverLogin from '@react-native-seoul/naver-login';
import { router } from 'expo-router';
interface AuthContextType {
    isAuthenticated: boolean;
    setIsAuthenticated: (isAuthenticated: boolean) => void;
    user: User | null;
    loading: boolean;
    login: (provider: 'kakao' | 'naver') => Promise<void>;
    logout: () => Promise<void>;
    exchangeSocialToken: (socialToken: string, provider: string) => Promise<void>;
    getValidToken: () => Promise<string | null>;
}
interface TokenData {
    accessToken: string;
    refreshToken: string;
    expiresAt: number;
  }
const AuthContext = createContext<AuthContextType | null>(null);
const TOKEN_REFRESH_THRESHOLD = 5 * 60 * 1000; // 5 minutes in milliseconds

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        // checkLoginStatus();
        checkAuth();
        NaverLogin.initialize({
            appName: 'cruming',
            consumerKey: 'js0fZdXgGDN6cvtbNv87',
            consumerSecret: 'fqsAq578xA',
            serviceUrlSchemeIOS: 'naverlogin',
            disableNaverAppAuthIOS: true,
        });
    }, []);
    const [success, setSuccessResponse] =
    useState<NaverLoginResponse['successResponse']>();

    const [failure, setFailureResponse] =
        useState<NaverLoginResponse['failureResponse']>();
    const checkLoginStatus = async () => {
        try {
            const userString = await AsyncStorage.getItem('user');
            if (userString) {
                setUser(JSON.parse(userString));
            }
        } catch (error) {
            console.error('Error checking login status:', error);
        } finally {
            setLoading(false);
        }
    };

    const login = async (provider: 'kakao' | 'naver') => {
        try {
            // 실제 API 구현 시 여기에 소셜 로그인 로직 구현
            if (provider === 'kakao') {
                const token = await KakaoLogin.login();

                console.log('카카오 로그인 성공:', JSON.stringify(token));
                await exchangeSocialToken(token.accessToken, provider);
            } else if (provider === 'naver') {
                const { failureResponse, successResponse } = await NaverLogin.login();
                setSuccessResponse(successResponse);
                setFailureResponse(failureResponse);
                console.log('네이버 로그인 성공:', JSON.stringify(successResponse));
                if (successResponse?.accessToken) {
                    await exchangeSocialToken(successResponse.accessToken, provider);
                }
            }
            // const dummyUser: User = {
            //     id: '1',
            //     nickname: 'TestUser',
            //     profileImage: 'https://example.com/profile.jpg'
            // };

            // await AsyncStorage.setItem('user', JSON.stringify(dummyUser));
            // setUser(dummyUser);
            // console.log(`${provider} 로그인 시도:`, dummyUser);
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    };

  async function checkAuth() {
    try {
      const token = await getValidToken();
      if (token) {
        setIsAuthenticated(true);
        router.replace('/(tabs)/');
      } else {
        router.replace('/(tabs)');
      }
    } catch (error) {
      console.error('Error checking auth:', error);
      router.replace('/(tabs)');
    }
  }

  async function exchangeSocialToken(socialToken: string, provider: string) {
    try {
      const response = await fetch('http://내컴퓨터공인IP:8080/api/v1/auth/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          socialToken,
          provider,
          // profile,
        }),
      });

      if (!response.ok) throw new Error('Token exchange failed');

      const serverTokens: TokenData = await response.json();
      await AsyncStorage.setItem('tokenData', JSON.stringify(serverTokens));
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Error exchanging token:', error);
      throw error;
    }
  }

  async function getValidToken(): Promise<string | null> {
    try {
      const tokenDataString = await AsyncStorage.getItem('tokenData');
      if (!tokenDataString) return null;

      const tokenData: TokenData = JSON.parse(tokenDataString);
      const now = Date.now();

      if (tokenData.expiresAt - now < TOKEN_REFRESH_THRESHOLD) {
        // 서버에 토큰 갱신 요청
        const response = await fetch('http://내컴퓨터공인IP:8080/api/v1/auth/token/refresh', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            refreshToken: tokenData.refreshToken,
          }),
        });

        if (!response.ok) {
          await logout();
          return null;
        }

        const newTokenData: TokenData = await response.json();
        await AsyncStorage.setItem('tokenData', JSON.stringify(newTokenData));
        return newTokenData.accessToken;
      }

      return tokenData.accessToken;
    } catch (error) {
      console.error('Error getting valid token:', error);
      return null;
    }
  }

  async function logout() {
    try {
      await AsyncStorage.removeItem('tokenData');
      setIsAuthenticated(false);
      router.replace('/(tabs)');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  }

    // const logout = async () => {
    //     try {
    //         await AsyncStorage.removeItem('user');
    //         setUser(null);
    //         console.log('로그아웃 완료');
    //     } catch (error) {
    //         console.error('Logout error:', error);
    //         throw error;
    //     }
    // };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, isAuthenticated, setIsAuthenticated, exchangeSocialToken, getValidToken }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};