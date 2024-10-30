import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';

interface UserProfile {
    nickname: string;
    sns: string;
    info: string;
    height: number;
    arm: string;
    gym: string;
    followers: number;
    following: number;
}

const dummyProfile: UserProfile = {
    nickname: "벽타는 낙타",
    sns: "@_instangram_id",
    info: "안녕하세요. 초보 클라이머 낙타입니다!",
    height: 180,
    arm: "-",
    gym: "손상원 클라이밍 판교점",
    followers: 1,
    following: 20,
};

export default function MyPage() {
    const router = useRouter();

    const handleSettingsPress = () => {
        router.navigate('/my-page/settings');
    };

    const handleEditPress = () => {
        router.navigate('/my-page/edit');
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.settingsButtonContainer}>
                <TouchableOpacity
                    style={styles.settingsButton}
                    onPress={handleSettingsPress}
                >
                    <Ionicons name="settings-outline" size={24} color="#666" />
                </TouchableOpacity>
            </View>

            <View style={styles.profileSection}>
                <View style={styles.profileImageContainer}>
                    <Image
                        source={require('@/assets/images/default-profile.png')}
                        style={styles.profileImage}
                    />
                </View>
                <Text style={styles.nickname}>{dummyProfile.nickname}</Text>
                <Text style={styles.username}>{dummyProfile.sns}</Text>

                <View style={styles.infoContainer}>
                    <View style={styles.infoItem}>
                        <MaterialCommunityIcons name="human-male-height" size={20} color="#666" />
                        <Text style={styles.infoText}>키 : {dummyProfile.height}</Text>
                    </View>
                    <View style={styles.infoItem}>
                        <FontAwesome5 name="ruler-horizontal" size={16} color="#666" />
                        <Text style={styles.infoText}>팔 : {dummyProfile.arm}</Text>
                    </View>
                </View>

                <View style={styles.gymContainer}>
                    <Ionicons name="location-outline" size={20} color="#666" />
                    <Text style={styles.gymText}>{dummyProfile.gym}</Text>
                </View>

                <View style={styles.statsContainer}>
                    <View style={styles.statItem}>
                        <Text style={styles.statNumber}>{dummyProfile.followers}</Text>
                        <Text style={styles.statLabel}>팔로워</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                        <Text style={styles.statNumber}>{dummyProfile.following}</Text>
                        <Text style={styles.statLabel}>팔로잉</Text>
                    </View>
                </View>

                <Text style={styles.description}>{dummyProfile.info}</Text>

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
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    settingsButtonContainer: {
        position: 'absolute',
        top: 12,
        right: 16,
        zIndex: 1,
    },
    settingsButton: {
        padding: 8,
    },
    profileSection: {
        alignItems: 'center',
        paddingTop: 20,
    },
    profileImageContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#E8E6FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
        overflow: 'hidden',
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
        marginBottom: 16,
    },
    gymText: {
        fontSize: 14,
        color: '#666',
    },
    statsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    statItem: {
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    statNumber: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 14,
        color: '#666',
    },
    statDivider: {
        width: 1,
        height: 24,
        backgroundColor: '#eee',
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
    },
    button: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 8,
        backgroundColor: '#f5f5f5',
    },
    buttonText: {
        fontSize: 14,
        color: '#333',
    },
});
