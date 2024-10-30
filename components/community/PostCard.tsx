import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { useRouter } from 'expo-router';

type PostCard = {
    id: number;
    title: string;
    date: string;
    isNew?: boolean;
    isHot?: boolean;
    category?: string; // 카테고리 추가 (선택적)
}

type PostCardProps = {
    post: PostCard;
}

export default function PostCard({ post }: PostCardProps) {
    const router = useRouter();

    const handlePress = () => {
        // 방법 1: category가 고정값인 경우
        router.push(`/community/general/${post.id}`);

        // 방법 2: category가 동적인 경우
        // router.push(`/community/${post.category || 'general'}/${post.id}`);
    };

    return (
        <TouchableOpacity
            key={post.id}
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
                <Text style={styles.date}>{post.date}</Text>
            </View>
        </TouchableOpacity>
    );
}


const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
    },
    scrollView: {
    },
    postsContainer: {
        paddingHorizontal: 16,
    },
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
