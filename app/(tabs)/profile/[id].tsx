import { useLocalSearchParams } from 'expo-router';
import React, {useEffect, useState} from 'react';
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

// 다른 사용자 프로필 더미 데이터
const userDummyProfile: UserProfile = {
    id: '123',
    nickname: "벽타는 낙타",
    sns: "@_instangram_id",
    info: "안녕하세요. 초보 클라이머 낙타입니다!",
    height: 180,
    arm_reach: 20,
    gym: "손상원 클라이밍 판교점",
    followers: 1,
    following: 20,
    isSelf: false,  // 다른 사용자의 프로필이므로 false
    isFollowing: false,
    isFollowingMe: false,
};

export default function UserProfilePage() {
    const { id } = useLocalSearchParams();
    const [profile, setProfile] = useState<UserProfile>(userDummyProfile);

    useEffect(() => {
        fetchUserProfile(id as string);
    }, [id]);

    const fetchUserProfile = async (userId: string) => {
        setProfile({
            ...userDummyProfile,
            id: userId,
        });
    };

    const handleFollowStatusChange = (isFollowing: boolean) => {
        setProfile(prev => ({
            ...prev,
            followers: isFollowing ? (prev.followers || 0) + 1 : (prev.followers || 0) - 1,
            isFollowing: isFollowing
        }));
    };

    return (
        <ProfileDetail
            profile={profile}
            onFollowStatusChange={handleFollowStatusChange}
        />
    );
}
