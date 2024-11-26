import React, { useState } from 'react';
import {TouchableOpacity, StyleSheet, Alert} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { usePostService } from '@/api/services/community/usePostService';

interface LikeButtonProps {
    postId: number;
    initialIsLiked?: boolean;
}

export const LikeButton: React.FC<LikeButtonProps> = ({
                                                          postId,
                                                          initialIsLiked = false
                                                      }) => {
    const [isLiked, setIsLiked] = useState(initialIsLiked);
    const { togglePostLike } = usePostService();

    const handleLike = async () => {
        try {
            const newLikeStatus = await togglePostLike(postId);
            setIsLiked(newLikeStatus);
        } catch (error) {
            Alert.alert("오류", "좋아요 처리에 실패했습니다.");
        }
    };

    return (
        <TouchableOpacity
            onPress={handleLike}
            style={styles.container}
            activeOpacity={0.7}
        >
            {isLiked ? (
                <Ionicons name="heart" size={24} color="red" />
            ) : (
                <Ionicons name="heart-outline" size={24} color="black" />
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 8,
    },
});