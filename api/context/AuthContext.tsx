import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../types/auth';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (provider: 'kakao' | 'naver') => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkLoginStatus();
    }, []);

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
            const dummyUser: User = {
                id: '1',
                nickname: 'TestUser',
                profileImage: 'https://example.com/profile.jpg'
            };

            await AsyncStorage.setItem('user', JSON.stringify(dummyUser));
            setUser(dummyUser);
            console.log(`${provider} 로그인 시도:`, dummyUser);
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    };

    const logout = async () => {
        try {
            await AsyncStorage.removeItem('user');
            setUser(null);
            console.log('로그아웃 완료');
        } catch (error) {
            console.error('Logout error:', error);
            throw error;
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
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