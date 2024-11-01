// components/my-page/FollowButton.tsx
import React, { useState } from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';

type FollowButtonProps = {
    initialIsFollowing: boolean;
    isFollowingMe: boolean;
    userId: string;
    onFollowStatusChange?: (isFollowing: boolean) => void;
};

export default function FollowButton({
                                         initialIsFollowing,
                                         isFollowingMe,
                                         userId,
                                         onFollowStatusChange
                                     }: FollowButtonProps) {
    const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
    const [isLoading, setIsLoading] = useState(false);

    const handleFollow = async () => {
        setIsLoading(true);
        try {
            if (isFollowing) {
                console.log('언팔로우:', userId);
            } else {
                console.log('팔로우:', userId);
            }

            const newFollowingStatus = !isFollowing;
            setIsFollowing(newFollowingStatus);
            onFollowStatusChange?.(newFollowingStatus);
        } catch (error) {
            console.error('Failed to update follow status:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const getButtonText = () => {
        if (isFollowing) return "팔로잉 취소";
        if (isFollowingMe) return "맞팔로잉";
        return "팔로잉";
    };

    return (
        <TouchableOpacity
            style={styles.button}
            onPress={handleFollow}
            disabled={isLoading}
        >
            {isLoading ? (
                <ActivityIndicator size="small" color="#333" />
            ) : (
                <Text style={styles.buttonText}>
                    {getButtonText()}
                </Text>
            )}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        paddingVertical: 8,
        paddingHorizontal: 35,
        borderRadius: 8,
        width: '70%',
        backgroundColor: '#735BF2',
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        fontSize: 14,
        color: '#FFFFFF',
    },
});


