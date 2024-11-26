import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Post } from '@/api/types/community/post';
import PostLocation from "@/components/community/PostLocation";
import PostLevel from "@/components/community/PostLevel";

interface PostContentProps {
    post: Post;
}

export default function PostContent({ post }: PostContentProps) {
    return (
        <>
            <Text style={styles.title}>{post.title}</Text>
            <PostLocation location={post.location} />
            <PostLevel level={post.level} />
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
    content: {
        fontSize: 16,
        lineHeight: 24,
        padding: 16,
        paddingTop: 0,
    },
});