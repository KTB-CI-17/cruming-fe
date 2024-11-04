import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';

export default function SettingsPage() {
    const router = useRouter();

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
                    onPress: () => {
                        // 로그아웃 처리
                        console.log("로그아웃 처리");
                        // router.replace('/(auth)/login');
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
                        // router.replace('/(auth)/login');
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
