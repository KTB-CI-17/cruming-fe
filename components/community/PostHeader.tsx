import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Post } from '@/api/types/community/post';

interface PostHeaderProps {
    post: Post;
    onProfilePress: (userId: number) => void;
    onMorePress: () => void;
}

export default function PostHeader({ post, onProfilePress, onMorePress }: PostHeaderProps) {
    return (
        <TouchableOpacity
            style={styles.header}
            onPress={() => onProfilePress(post.userId)}
        >
            <View style={styles.profileContainer}>
                <Image
                    source={require('@/assets/images/default-profile.png')}
                    style={styles.profileImage}
                />
                <View>
                    <Text style={styles.nickname}>{post.userNickname}</Text>
                    {post.instagram_id && (
                        <Text style={styles.instagramId}>@{post.instagram_id}</Text>
                    )}
                </View>
            </View>
            {post.isWriter && (
                <TouchableOpacity onPress={onMorePress}>
                    <Ionicons name="ellipsis-horizontal" size={24} color="#666" />
                </TouchableOpacity>
            )}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
    },
    profileContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    profileImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    nickname: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    instagramId: {
        fontSize: 14,
        color: '#666',
    },
});