import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Post } from '@/api/types/community/post';

interface PostActionsProps {
    post: Post;
    replyCount: number;
    onLike: () => void;
    onShare: () => void;
    onReply: () => void;
}

export default function PostActions({ post, replyCount, onLike, onShare, onReply }: PostActionsProps) {
    return (
        <View style={styles.actionButtons}>
            <TouchableOpacity
                style={styles.actionButton}
                onPress={onReply}
            >
                <Ionicons name="chatbubble-outline" size={24} color="#666" />
                {replyCount > 0 && (
                    <Text style={styles.actionCount}>{replyCount}</Text>
                )}
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.actionButton}
                onPress={onLike}
            >
                <Ionicons name="heart-outline" size={24} color="#666" />
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.actionButton}
                onPress={onShare}
            >
                <Ionicons name="share-social-outline" size={24} color="#666" />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    actionButtons: {
        flexDirection: 'row',
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: '#EEEEEE',
    },
    actionButton: {
        marginRight: 16,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    actionCount: {
        fontSize: 14,
        color: '#666',
    },
});