import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/api/context/AuthContext';

export default function SettingsPage() {
    const router = useRouter();
    const { logout } = useAuth();

    const handleLogout = () => {
        Alert.alert(
            "로그아웃",
            "정말 로그아웃 하시겠습니까?",
            [
                {
                    text: "취소",
                    style: "cancel"
                },
                {
                    text: "로그아웃",
                    onPress: async () => {
                        try {
                            await logout();
                            // 로그아웃 후 로그인 페이지로 이동
                            // AuthContext의 useEffect에서 자동으로 처리되지만,
                            // UX를 위해 즉시 이동하도록 추가
                            router.replace('/login');
                        } catch (error) {
                            console.error('Logout failed:', error);
                            Alert.alert(
                                "오류",
                                "로그아웃 중 문제가 발생했습니다. 다시 시도해주세요."
                            );
                        }
                    }
                }
            ]
        );
    };

    const handleDeleteAccount = () => {
        Alert.alert(
            "회원 탈퇴",
            "정말 탈퇴하시겠습니까?\n탈퇴 시 모든 데이터가 삭제되며 복구할 수 없습니다.",
            [
                {
                    text: "취소",
                    style: "cancel"
                },
                {
                    text: "탈퇴",
                    style: 'destructive',
                    onPress: () => {
                        // 회원 탈퇴 처리
                        console.log("회원 탈퇴 처리");
                        // router.replace('/login');
                    }
                }
            ]
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.menuSection}>
                {/* 로그아웃 메뉴 */}
                <TouchableOpacity
                    style={styles.menuItem}
                    onPress={handleLogout}
                >
                    <Text style={styles.menuText}>로그아웃</Text>
                </TouchableOpacity>

                {/* 구분선 */}
                <View style={styles.divider} />

                {/* 회원 탈퇴 메뉴 */}
                <TouchableOpacity
                    style={styles.menuItem}
                    onPress={handleDeleteAccount}
                >
                    <Text style={styles.menuText}>회원 탈퇴</Text>
                </TouchableOpacity>

                <View style={styles.divider} />
            </View>
        </View>
    );
}

// styles는 동일함
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    menuSection: {
        backgroundColor: '#fff',
    },
    menuItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 0,
        backgroundColor: '#fff',
    },
    menuText: {
        fontSize: 18,
        color: '#333',
        padding: 20
    },
    divider: {
        height: 1,
        backgroundColor: '#F0F0F0',
    },
});