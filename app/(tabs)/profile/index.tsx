import React, {useEffect, useState} from 'react';
import {View, Text, Image, TouchableOpacity, StyleSheet, ScrollView} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import Timeline from "@/components/profile/Timeline";
import FollowButton from '@/components/profile/FollowButton';
import ProfileDetail from "@/components/profile/ProfileDetail";

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

// 자신의 프로필 더미 데이터
const myDummyProfile: UserProfile = {
    id: '123',
    nickname: "벽타는 낙타",
    sns: "@_instangram_id",
    info: "안녕하세요. 초보 클라이머 낙타입니다!",
    height: 180,
    arm_reach: 20,
    gym: "손상원 클라이밍 판교점",
    followers: 1,
    following: 20,
    isSelf: true,  // 자신의 프로필이므로 true
    isFollowing: false,
    isFollowingMe: false,
};

export default function ProfilePage() {
    const [profile, setProfile] = useState<UserProfile>(myDummyProfile);
    const router = useRouter();

    useEffect(() => {
        fetchMyProfile();
    }, []);

    const fetchMyProfile = async () => {
        setProfile(myDummyProfile);
    };

    const handleSettingsPress = () => {
        router.push('/profile/settings');
    };

    const handleEditPress = () => {
        router.push('/profile/edit');
    };

    return (
        <ProfileDetail
            profile={profile}
            onSettingsPress={handleSettingsPress}
            onEditPress={handleEditPress}
        />
    );
}
