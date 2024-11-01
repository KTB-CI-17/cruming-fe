import { View, StyleSheet, FlatList, ActivityIndicator } from "react-native";
import PostCard from "@/components/community/PostCard";
import SearchBar from "@/components/common/SearchBar";
import React, { useState, useCallback } from "react";

interface Post {
    id: number;
    title: string;
    date: string;
    isHot?: boolean;
    isNew?: boolean;
}

interface APIResponse {
    posts: Post[];
    meta: {
        currentPage: number;
        totalPages: number;
        hasMore: boolean;
    };
}

const POSTS_PER_PAGE = 10;

const generateDummyPost = (id: number): Post => {
    const titles = [
        "옐로우 37번 홀드 순서 질문",
        "레드 루트 마지막 홀드 팁",
        "이 문제 해결하신 분?",
        "블랙 코스 시작 자세 질문",
        "초록색 42번 문제 풀이 공유",
        "레드 루트 풀영상 올립니다",
        "이 문제 난이도 어떤가요?",
        "동영상 보고 피드백 부탁드려요",
        "처음 만들어본 문제입니다",
        "새로 세팅된 문제 후기",
        "퍼플 코스 크럭스 공략",
        "다이노 무브 문제 제작기",
        "오늘 세팅한 6급 문제",
        "문제 해결 영상 피드백 부탁",
        "홀드 각도 세팅 질문",
        "이번 주 신규 문제 후기"
    ];

    const today = new Date();
    const randomDays = Math.floor(Math.random() * 30);  // 최근 30일
    const postDate = new Date(today);
    postDate.setDate(postDate.getDate() - randomDays);

    const formattedDate = postDate.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    }).replace(/\. /g, '. ');

    const isRecent = randomDays <= 2;  // 2일 이내 게시물
    const isPopular = Math.random() < 0.2;  // 20% 확률로 인기글

    return {
        id,
        title: titles[id % titles.length],
        date: formattedDate,
        isHot: isPopular && !isRecent,
        isNew: isRecent && !isPopular,
    };
};

const getDummyAPIResponse = (page: number): APIResponse => {
    const startIndex = (page - 1) * POSTS_PER_PAGE;
    const posts = Array(POSTS_PER_PAGE).fill(null).map((_, index) =>
        generateDummyPost(startIndex + index + 1)
    );

    return {
        posts,
        meta: {
            currentPage: page,
            totalPages: 10,
            hasMore: page < 10
        }
    };
};

export default function Problem() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const fetchPosts = async (page: number, isRefresh: boolean = false) => {
        if (isLoading || (!hasMore && !isRefresh)) return;

        try {
            setIsLoading(true);
            // TODO: 실제 API 호출로 대체
            // const response = await axios.get(`/api/problems?page=${page}&limit=${POSTS_PER_PAGE}`);
            const response = getDummyAPIResponse(page);

            if (isRefresh) {
                setPosts(response.posts);
            } else {
                setPosts(prev => [...prev, ...response.posts]);
            }

            setCurrentPage(page);
            setHasMore(response.meta.hasMore);
        } catch (error) {
            console.error('Failed to fetch posts:', error);
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    };

    const handleRefresh = () => {
        setIsRefreshing(true);
        setHasMore(true);
        setCurrentPage(1);
        fetchPosts(1, true);
    };

    const handleLoadMore = () => {
        if (!isLoading && hasMore) {
            fetchPosts(currentPage + 1);
        }
    };

    // 컴포넌트 마운트 시 첫 페이지 로드
    React.useEffect(() => {
        fetchPosts(1, true);
    }, []);

    const renderFooter = () => {
        if (!isLoading) return null;
        return (
            <View style={styles.loadingFooter}>
                <ActivityIndicator size="small" color="#735BF2" />
            </View>
        );
    };

    const renderItem = ({ item }: { item: Post }) => (
        <PostCard post={item} />
    );

    return (
        <View style={styles.container}>
            <SearchBar />
            <FlatList
                data={posts}
                renderItem={renderItem}
                keyExtractor={item => item.id.toString()}
                contentContainerStyle={styles.postsContainer}
                onRefresh={handleRefresh}
                refreshing={isRefreshing}
                onEndReached={handleLoadMore}
                onEndReachedThreshold={0.5}
                ListFooterComponent={renderFooter}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    postsContainer: {
        paddingHorizontal: 16,
    },
    loadingFooter: {
        paddingVertical: 20,
        alignItems: 'center',
    },
});
