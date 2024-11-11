import { useLocalSearchParams, Stack, router } from 'expo-router';
import { View, Text, TouchableOpacity, Alert, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import PostAuthor from '@/components/common/PostAuthor';
import PostContent from '@/components/common/PostContent';
import PostReply from '@/components/common/PostReply';
import type { Post } from '@/api/types/community/post';

export default function PostDetailPage() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const [post, setPost] = useState<Post | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // 게시글 조회
    const fetchPost = async () => {
        try {
            // API 호출 대신 더미데이터 사용
            const dummyPost: Post = {
                id: id,
                title: "레전드로 어려운 문제",
                location: "손상원 클라이밍 판교점",
                level: 5,
                image: "link",
                content: "오늘은 핑크레벨을 도전하였다. ".repeat(20),
                authorName: "벽타는 낙타",
                authorImage: "link",  // 기본 프로필 이미지
                user_id: 2,
                is_writer: true,
                createdAt: new Date().toISOString(),
                instagram: "instagram_id"
            };
            setPost(dummyPost);
            console.log('게시글 조회 성공:', dummyPost);
        } catch (error) {
            console.error("게시글 조회 실패:", error);
            Alert.alert("오류", "게시글을 불러오는데 실패했습니다.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPost();
    }, [id]);

    if (isLoading || !post) {
        return <View style={styles.container}><Text>Loading...</Text></View>;
    }

    // 더미 댓글 데이터
    const dummyComments = Array.from({ length: 20 }, (_, index) => ({
        id: index.toString(),
        authorName: `클라이머${index + 1}`,
        content: `멋진 도전이네요! 댓글 내용 ${index + 1}`,
        createdAt: '2024-01-01 12:00'
    }));

    return (
        <>
            <Stack.Screen
                options={{
                    headerLeft: () => (
                        <TouchableOpacity onPress={() => router.back()}>
                            <Ionicons name="arrow-back" size={24} color="black" />
                        </TouchableOpacity>
                    ),
                    headerTitle: "",
                    headerShadowVisible: false,
                    headerStyle: {
                        backgroundColor: '#FFFFFF',
                    },
                }}
            />
            <ScrollView
                style={styles.container}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.contentContainer}>
                    <PostAuthor
                        authorName={post.authorName}
                        authorImage={post.authorImage}
                        instagram={post.instagram}
                        userId={post.user_id}
                    />
                    <PostContent
                        image={post.image}
                        content={post.content}
                        location={post.location}
                        level={post.level}
                        title={post.title}
                    />
                    <PostReply comments={dummyComments} />
                </View>
            </ScrollView>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    contentContainer: {
        flexGrow: 1,
    }
});
