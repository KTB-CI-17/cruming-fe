import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/api/context/AuthContext';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LoginScreen() {
    const router = useRouter();
    const { login } = useAuth();

    const handleSocialLogin = async (provider: 'kakao' | 'naver') => {
        try {
            await login(provider);
            router.replace('/(tabs)');
        } catch (error) {
            console.error(`${provider} login failed:`, error);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>나 만 의 클 라 이 밍{'\n'}커 뮤 니 티</Text>

                <View style={styles.logoContainer}>
                    <Image
                        source={require('../assets/images/logo.png')}
                        style={styles.logo}
                        resizeMode="contain"
                    />
                </View>

                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={[styles.button, styles.kakaoButton]}
                        onPress={() => handleSocialLogin('kakao')}
                    >
                        <Image
                            source={require('../assets/images/kakao.png')}
                            style={styles.buttonIcon}
                        />
                        <Text style={[styles.buttonText, styles.kakaoText]}>카카오 로그인</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.button, styles.naverButton]}
                        onPress={() => handleSocialLogin('naver')}
                    >
                        <Image
                            source={require('../assets/images/naver.png')}
                            style={styles.buttonIcon}
                        />
                        <Text style={[styles.buttonText, styles.naverText]}>네이버 로그인</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 60,
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 24,
        color: '#6B4EFF',
        textAlign: 'center',
        fontWeight: '500',
        lineHeight: 36,
    },
    logoContainer: {
        alignItems: 'center',
        marginVertical: 0,
    },
    logo: {
        width: 250,
        height: 250,
        marginBottom: 10,
    },
    logoText: {
        fontSize: 28,
        color: '#6B4EFF',
        fontWeight: '600',
    },
    buttonContainer: {
        width: '100%',
        gap: 12,
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: 48,
        borderRadius: 8,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
            },
            android: {
                elevation: 3,
            },
        }),
    },
    kakaoButton: {
        backgroundColor: '#FEE500',
    },
    naverButton: {
        backgroundColor: '#03C75A',
    },
    buttonIcon: {
        width: 20,
        height: 20,
        marginRight: 8,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '500',
    },
    kakaoText: {
        color: '#000000',
    },
    naverText: {
        color: '#FFFFFF',
    },
});