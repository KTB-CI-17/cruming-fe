import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { useRouter } from 'expo-router';
import { ListPost } from "@/api/types/community/post";
import { format, parseISO } from 'date-fns';
import { ko } from 'date-fns/locale';

interface PostCardProps {
    post: ListPost;
}

export default function PostCard({ post }: PostCardProps) {
    const router = useRouter();

    // 날짜 포맷팅 함수
    const formatDate = (dateString?: string) => {
        if (!dateString) return '';

        try {
            return format(parseISO(dateString), 'yyyy. MM. dd', { locale: ko });
        } catch (error) {
            console.error('Date parsing error:', error);
            return dateString; // 파싱 실패시 원본 문자열 반환
        }
    };

    const handlePress = () => {
        router.push(`/community/${post.id}`);
    };

    return (
        <TouchableOpacity
            style={styles.postItem}
            onPress={handlePress}
            activeOpacity={0.7}
        >
            <View style={styles.postContent}>
                <View style={styles.titleContainer}>
                    {post.isHot && (
                        <View style={styles.hotBadge}>
                            <Text style={styles.badgeText}>🔥</Text>
                        </View>
                    )}
                    {post.isNew && (
                        <View style={styles.newBadge}>
                            <Text style={styles.newBadgeText}>NEW</Text>
                        </View>
                    )}
                    <Text style={styles.title} numberOfLines={1}>{post.title}</Text>
                </View>
                <Text style={styles.date}>{formatDate(post.createdAt)}</Text>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    postItem: {
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    postContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        marginRight: 8,
    },
    title: {
        fontSize: 16,
        color: '#1A1F36',
        marginRight: 8,
    },
    date: {
        fontSize: 14,
        color: '#8F9BB3',
    },
    hotBadge: {
        marginRight: 8,
    },
    badgeText: {
        fontSize: 16,
    },
    newBadge: {
        backgroundColor: '#735BF2',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
        marginRight: 8,
    },
    newBadgeText: {
        color: 'white',
        fontSize: 12,
        fontWeight: '600',
    }
});