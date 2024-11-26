import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Post } from '@/api/types/community/post';

interface PostContentProps {
    post: Post;
}

export default function PostContent({ post }: PostContentProps) {
    return (
        <>
            <Text style={styles.title}>{post.title}</Text>
            <View style={styles.locationLevel}>
                <View style={styles.locationContainer}>
                    <Ionicons name="location-outline" size={16} color="#666" />
                    <Text style={styles.location}>{post.location}</Text>
                </View>
                <Text style={styles.level}>LV. {post.level}</Text>
            </View>
            <Text style={styles.content}>{post.content}</Text>
        </>
    );
}

const styles = StyleSheet.create({
    title: {
        fontSize: 18,
        fontWeight: '500',
        padding: 16,
        paddingTop: 0,
    },
    locationLevel: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
    },
    locationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    location: {
        fontSize: 14,
        color: '#666',
    },
    level: {
        fontSize: 14,
        color: '#666',
    },
    content: {
        fontSize: 16,
        lineHeight: 24,
        padding: 16,
        paddingTop: 0,
    },
});