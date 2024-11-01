import { View, StyleSheet, FlatList, ActivityIndicator } from "react-native";
import PostCard from "@/components/community/PostCard";
import SearchBar from "@/components/common/SearchBar";
import React, { useState, useCallback } from "react";
import AddGeneral from "@/components/community/AddGeneralButton";

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
        "암장 민페 썰",
        "소개팅 가는데 옷 추천 좀..",
        "운동화 추천해주세요!",
        "오늘 등반 성공했습니다!",
        "클라이밍화 세탁 어떻게 하시나요?",
        "볼더링 시작한지 1개월 됐어요",
        "클라이밍 실력 안늘 때 꿀팁",
        "오늘 악력 대박이었음",
        "홀드 색깔별 난이도 질문",
        "초보자인데 무릎 아파요",
        "근육통 완화하는 방법 공유",
        "클라이밍장 추천해주세요",
        "오늘 스냅 나갔어요ㅠㅠ",
        "3개월 만에 6급 성공!"
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
        isHot: isPopular && !isRecent,  // 최신글이 아닌 경우에만 인기글 가능
        isNew: isRecent && !isPopular,  // 인기글이 아닌 경우에만 최신글 가능
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
            totalPages: 10,  // 총 100개의 게시물
            hasMore: page < 10
        }
    };
};

export default function General() {
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
            // const response = await axios.get(`/api/posts?page=${page}&limit=${POSTS_PER_PAGE}`);
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
            <AddGeneral />
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
