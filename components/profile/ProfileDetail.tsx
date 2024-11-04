import React from 'react';
import {View, Text, Image, TouchableOpacity, StyleSheet, ScrollView} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import Timeline from "@/components/profile/Timeline";
import FollowButton from '@/components/profile/FollowButton';

interface UserProfile {
    id: string;
    nickname: string;
    sns?: string;
    info?: string;
    height?: number;
    arm_reach?: number;
    gym?: string;
    followers?: number;
    following?: number;
    isSelf?: boolean;
    isFollowing?: boolean;
    isFollowingMe?: boolean;
}

interface ProfileDetailProps {
    profile: UserProfile;
    onSettingsPress?: () => void;
    onEditPress?: () => void;
    onFollowStatusChange?: (isFollowing: boolean) => void;
}

export default function ProfileDetail({
                                          profile,
                                          onSettingsPress,
                                          onEditPress,
                                          onFollowStatusChange
                                      }: ProfileDetailProps) {
    const renderOptionalSection = (value: any, component: JSX.Element) => {
        return value ? component : null;
    };

    const formatMeasurement = (value?: number) => {
        return value ? `${value} cm` : "-";
    };

    const renderButtons = () => {
        if (!profile.isSelf) {
            return (
                <View style={styles.buttonContainer}>
                    <FollowButton
                        initialIsFollowing={profile.isFollowing || false}
                        isFollowingMe={profile.isFollowingMe || false}
                        userId={profile.id}
                        onFollowStatusChange={onFollowStatusChange}
                    />
                </View>
            );
        }

        return (
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={styles.button}
                    onPress={onEditPress}
                >
                    <Text style={styles.buttonText}>프로필 수정</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>프로필 공유</Text>
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <ScrollView style={styles.scrollView}>
                {profile.isSelf && onSettingsPress && (
                    <View style={styles.settingsButtonContainer}>
                        <TouchableOpacity onPress={onSettingsPress}>
                            <Ionicons name="settings-outline" size={24} color="#666" />
                        </TouchableOpacity>
                    </View>
                )}

                <View style={styles.profileSection}>
                    <View style={styles.profileImageContainer}>
                        <Image
                            source={require('@/assets/images/default-profile.png')}
                            style={styles.profileImage}
                        />
                    </View>
                    <Text style={styles.nickname}>{profile.nickname}</Text>

                    {renderOptionalSection(
                        profile.sns,
                        <Text style={styles.username}>{profile.sns}</Text>
                    )}

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

                    {renderOptionalSection(
                        profile.gym,
                        <View style={styles.gymContainer}>
                            <Ionicons name="location-outline" size={18} color="#666" />
                            <Text style={styles.gymText}>{profile.gym}</Text>
                        </View>
                    )}

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

                    {renderOptionalSection(
                        profile.info,
                        <Text style={styles.description}>{profile.info}</Text>
                    )}

                    {renderButtons()}
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
