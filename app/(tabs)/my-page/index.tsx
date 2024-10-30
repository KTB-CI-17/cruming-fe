import React, {useEffect, useState} from 'react';
import {View, Text, Image, TouchableOpacity, StyleSheet, ScrollView} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import Timeline from "@/components/my-page/Timeline";

// TODO: 로그인 기능 구현 후 프로필 수정/공유 영역과 설정 영역 노출 여부 체크 로직 구현
interface UserProfile {
    nickname: string;      // 필수
    sns?: string;         // 선택
    info?: string;        // 선택
    height?: number;      // 선택 (없으면 "-" 표시)
    arm_reach?: number;         // 선택 (없으면 "-" 표시)
    gym?: string;         // 선택
    followers?: number;   // 선택
    following?: number;   // 선택
}



const dummyProfile: UserProfile = {
    nickname: "벽타는 낙타",
    sns: "@_instangram_id",
    info: "안녕하세요. 초보 클라이머 낙타입니다!",
    height: 180,
    arm_reach: 20,
    gym: "손상원 클라이밍 판교점",
    followers: 1,
    following: 20,
};

export default function MyPage() {
    const [profile, setProfile] = useState<UserProfile>(dummyProfile);
    const router = useRouter();

    const handleSettingsPress = () => {
        router.navigate('/my-page/settings');
    };

    const handleEditPress = () => {
        router.navigate('/my-page/edit');
    };

    useEffect(() => {
        // TODO: 실제 구현 시 사용자 ID 가져오기

        // loadProfile();
    }, []);

    const renderOptionalSection = (value: any, component: JSX.Element) => {
        return value ? component : null;
    };

    const formatMeasurement = (value?: number) => {
        return value ? `${value} cm` : "-";
    };

    return (
        <View style={styles.container}>
            <ScrollView style={styles.scrollView}>
                {/* Settings 버튼 */}
                <View style={styles.settingsButtonContainer}>
                    <TouchableOpacity onPress={() => router.navigate('/my-page/settings')}>
                        <Ionicons name="settings-outline" size={24} color="#666" />
                    </TouchableOpacity>
                </View>

                {/* 프로필 기본 정보 (필수) */}
                <View style={styles.profileSection}>
                    <View style={styles.profileImageContainer}>
                        <Image
                            source={require('@/assets/images/default-profile.png')}
                            style={styles.profileImage}
                        />
                    </View>
                    <Text style={styles.nickname}>{profile.nickname}</Text>

                    {/* SNS ID (선택) */}
                    {renderOptionalSection(
                        profile.sns,
                        <Text style={styles.username}>{profile.sns}</Text>
                    )}

                    {/* 신장/팔길이 정보 (항상 표시) */}
                    <View style={styles.infoContainer}>
                        <View style={styles.infoItem}>
                            <MaterialCommunityIcons name="human-male-height" size={18} color="black" />
                            <Text style={styles.infoText}>키 : {formatMeasurement(profile.height)}</Text>
                        </View>
                        <View style={styles.infoItem}>
                            <MaterialCommunityIcons name="arm-flex" size={18} color="black" />
                            <Text style={styles.infoText}>팔 길이 : {formatMeasurement(profile.arm_reach)}</Text>
                        </View>
                    </View>

                    {/* 체육관 정보 (선택) */}
                    {renderOptionalSection(
                        profile.gym,
                        <View style={styles.gymContainer}>
                            <Ionicons name="location-outline" size={18} color="#666" />
                            <Text style={styles.gymText}>{profile.gym}</Text>
                        </View>
                    )}

                    {/* 팔로워/팔로잉 정보 (선택) */}
                    {renderOptionalSection(
                        profile.followers !== undefined && profile.following !== undefined,
                        <View style={styles.statsContainer}>
                            <TouchableOpacity style={styles.statItem}>
                                <View style={styles.statContent}>
                                    <Text style={styles.statLabel}>
                                        팔로워 <Text style={styles.statNumber}>{profile.followers}</Text>
                                    </Text>
                                </View>
                            </TouchableOpacity>
                            <View style={styles.statDivider} />
                            <TouchableOpacity style={styles.statItem}>
                                <View style={styles.statContent}>
                                    <Text style={styles.statLabel}>
                                        팔로잉 <Text style={styles.statNumber}>{profile.following}</Text>
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    )}

                    {/* 자기소개 (선택) */}
                    {renderOptionalSection(
                        profile.info,
                        <Text style={styles.description}>{profile.info}</Text>
                    )}
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={styles.button}
                            onPress={handleEditPress}
                        >
                            <Text style={styles.buttonText}>프로필 수정</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button}>
                            <Text style={styles.buttonText}>프로필 공유</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <Timeline/>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    settingsButtonContainer: {
        position: 'absolute',
        top: 12,
        right: 16,
        zIndex: 1,
    },
    profileSection: {
        alignItems: 'center',
    },
    profileImageContainer: {
        width: 120,
        height: 120,
        borderRadius: 50,
        marginVertical: 16,
    },
    profileImage: {
        width: '100%',
        height: '100%',
    },
    nickname: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    username: {
        fontSize: 16,
        color: '#666',
        marginBottom: 16,
    },
    infoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 20,
        marginBottom: 8,
    },
    infoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    infoText: {
        fontSize: 14,
        color: '#666',
    },
    gymContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginBottom: 5,
    },
    gymText: {
        fontSize: 14,
        color: '#666',
    },
    statsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
        padding: 4,
        width: 'auto',
    },
    statItem: {
        alignItems: 'center',
        paddingVertical: 4,
        paddingHorizontal: 16,
        minWidth: 80,
    },
    statContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statLabel: {
        fontSize: 14,
        color: '#666',
    },
    statNumber: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
    },
    statDivider: {
        width: 1,
        height: '80%',
        backgroundColor: '#e0e0e0',
    },
    description: {
        fontSize: 14,
        color: '#333',
        marginBottom: 20,
        paddingHorizontal: 16,
        textAlign: 'center',
    },
    buttonContainer: {
        flexDirection: 'row',
        gap: 12,
        paddingBottom: 30
    },
    button: {
        paddingVertical: 8,
        paddingHorizontal: 35,
        borderRadius: 8,
        backgroundColor: '#f5f5f5',
    },
    buttonText: {
        fontSize: 14,
        color: '#333',
    },
    scrollView: {
        flex: 1,
    },
});
