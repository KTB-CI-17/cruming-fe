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
    user?: User;
}

const AuthContext = createContext<AuthContextType | null>(null);
const TOKEN_REFRESH_THRESHOLD = 5 * 60 * 1000; // 5 minutes in milliseconds

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [success, setSuccessResponse] =
        useState<NaverLoginResponse['successResponse']>();
    const [failure, setFailureResponse] =
        useState<NaverLoginResponse['failureResponse']>();

    useEffect(() => {
        checkAuth();
        NaverLogin.initialize({
            appName: 'cruming',
            consumerKey: 'js0fZdXgGDN6cvtbNv87',
            consumerSecret: 'fqsAq578xA',
            serviceUrlSchemeIOS: 'naverlogin',
            disableNaverAppAuthIOS: true,
        });
    }, []);

    async function checkAuth() {
        try {
            const tokenDataString = await AsyncStorage.getItem('tokenData');
            if (!tokenDataString) {
                setLoading(false);
                router.replace('/login');
                return;
            }

            const tokenData: TokenData = JSON.parse(tokenDataString);
            const token = await getValidToken();

            if (token) {
                console.log('토큰 유효성 검사 성공:', token);
                setIsAuthenticated(true);
                if (tokenData.user) {
                    setUser(tokenData.user);
                } else {
                    await fetchUserInfo(token);
                }
                router.replace('/(tabs)/');
            } else {
                console.log('토큰 유효성 검사 실패');
                router.replace('/login');
            }
        } catch (error) {
            console.error('Error checking auth:', error);
            router.replace('/login');
        } finally {
            setLoading(false);
        }
    }

    const fetchUserInfo = async (token: string) => {
        try {
            const response = await fetch('http://localhost:8080/api/v1/users/me', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const userData = await response.json();
                setUser(userData);

                const tokenDataString = await AsyncStorage.getItem('tokenData');
                if (tokenDataString) {
                    const tokenData = JSON.parse(tokenDataString);
                    tokenData.user = userData;
                    await AsyncStorage.setItem('tokenData', JSON.stringify(tokenData));
                }
            }
        } catch (error) {
            console.error('Error fetching user info:', error);
        }
    };

    const login = async (provider: 'kakao' | 'naver') => {
        try {
            if (provider === 'kakao') {
                const token = await KakaoLogin.login();
                console.log('카카오 로그인 성공:', JSON.stringify(token));
                await exchangeSocialToken(token.accessToken, provider.toUpperCase());
            } else if (provider === 'naver') {
                const { failureResponse, successResponse } = await NaverLogin.login();
                setSuccessResponse(successResponse);
                setFailureResponse(failureResponse);
                console.log('네이버 로그인 성공:', JSON.stringify(successResponse));
                if (successResponse?.accessToken) {
                    await exchangeSocialToken(successResponse.accessToken, provider.toUpperCase());
                }
            }
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    };

    async function exchangeSocialToken(socialToken: string, provider: string) {
        try {
            const response = await fetch('http://localhost:8080/api/v1/auth/token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    socialToken,
                    provider,
                }),
            });

            if (!response.ok) throw new Error('Token exchange failed');

            const serverTokens: TokenData = await response.json();
            await AsyncStorage.setItem('tokenData', JSON.stringify(serverTokens));
            setIsAuthenticated(true);

            if (serverTokens.user) {
                setUser(serverTokens.user);
            } else {
                await fetchUserInfo(serverTokens.accessToken);
            }
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
                const response = await fetch('http://localhost:8080/api/v1/auth/token/refresh', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        refreshToken: tokenData.refreshToken,
                    }),
                });

                if (response.status === 401 || response.status === 403) {
                    console.log('Token is invalid or expired');
                    await logout();
                    router.replace('/login');
                    return null;
                }

                if (!response.ok) {
                    throw new Error(`Token refresh failed: ${response.status}`);
                }

                const newTokenData: TokenData = await response.json();
                await AsyncStorage.setItem('tokenData', JSON.stringify(newTokenData));
                return newTokenData.accessToken;
            }

            return tokenData.accessToken;
        } catch (error) {
            console.error('Error getting valid token:', error);
            await logout();
            router.replace('/login');
            return null;
        }
    }

    async function logout() {
        try {
            await AsyncStorage.removeItem('tokenData');
            setIsAuthenticated(false);
            setUser(null);
            router.replace('/login');
        } catch (error) {
            console.error('Error logging out:', error);
        }
    }

    return (
        <AuthContext.Provider value={{
            user,
            loading,
            login,
            logout,
            isAuthenticated,
            setIsAuthenticated,
            exchangeSocialToken,
            getValidToken
        }}>
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