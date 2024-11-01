import { View, StyleSheet, FlatList, ActivityIndicator } from "react-native";
import TimelineCard from "@/components/common/TimelineCard";
import React, { useState, useEffect } from "react";

interface TimelinePost {
    id: number;
    title: string;
    subtitle: string;
    date: string;
    author: string;
    imageUrl: any;
    color: string;
}

interface APIResponse {
    posts: TimelinePost[];
    meta: {
        currentPage: number;
        totalPages: number;
        hasMore: boolean;
    };
}

const POSTS_PER_PAGE = 5;  // 카드형이므로 한 번에 5개씩 로드

const generateDummyPost = (id: number): TimelinePost => {
    const gyms = [
        { name: "손상원 클라이밍", locations: ["판교점", "강남점", "분당점", "일산점", "수원점"] },
        { name: "더클라이밍", locations: ["강남점", "신촌점", "홍대점", "건대점", "신림점"] },
        { name: "클라이밍 파크", locations: ["성수점", "잠실점", "송파점", "강동점", "천호점"] },
        { name: "클라이머스", locations: ["역삼점", "선릉점", "삼성점", "청담점", "압구정점"] }
    ];

    const subtitles = [
        "오늘은 6급 완등했다! 기분이 너무 좋다",
        "새로운 문제들이 많이 세팅됐다. 재밌었음",
        "다이나믹 무브 연습하다가 손바닥 터짐ㅠㅠ",
        "오랜만에 방문했는데 시설이 더 좋아졌다",
        "친구들이랑 같이 가서 더 재미있었다",
        "오버행 루트가 너무 어려웠다",
        "슬랩 위주로 연습했다. 발력이 늘어난 느낌",
        "새로운 클라이밍화 신고 첫 등반!",
        "크림핑 홀드 잡는 연습 많이 했다",
        "오늘 처음으로 7급 도전했다"
    ];

    const authors = [
        "벽타는 낙타",
        "클라이밍 고수",
        "암장 지박령",
        "등반 초보자",
        "홀드 마스터",
        "크랙 러버",
        "다이노 킹",
        "볼더링 장인",
        "클라이밍 덕후",
        "락클 매니아"
    ];

    const colors = ['#735BF2', '#E31A1A', '#00A3FF', '#FF9F00', '#4CAF50'];

    const randomGym = gyms[Math.floor(Math.random() * gyms.length)];
    const randomLocation = randomGym.locations[Math.floor(Math.random() * randomGym.locations.length)];

    // 최근 30일 내의 랜덤한 날짜 생성
    const today = new Date();
    const randomDays = Math.floor(Math.random() * 30);
    const postDate = new Date(today);
    postDate.setDate(postDate.getDate() - randomDays);

    const formattedDate = postDate.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    }).replace(/\. /g, '. ');

    return {
        id,
        title: `${randomGym.name} ${randomLocation}`,
        subtitle: subtitles[Math.floor(Math.random() * subtitles.length)],
        date: formattedDate,
        author: authors[Math.floor(Math.random() * authors.length)],
        imageUrl: require("@/assets/images/climbing.png"),
        color: colors[Math.floor(Math.random() * colors.length)]
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
            totalPages: 20,  // 총 100개의 포스트
            hasMore: page < 20
        }
    };
};

export default function Timeline() {
    const [posts, setPosts] = useState<TimelinePost[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const fetchPosts = async (page: number, isRefresh: boolean = false) => {
        if (isLoading || (!hasMore && !isRefresh)) return;

        try {
            setIsLoading(true);
            // TODO: 실제 API 호출로 대체
            // const response = await axios.get(`/api/timeline?page=${page}&limit=${POSTS_PER_PAGE}`);
            const response = getDummyAPIResponse(page);

            if (isRefresh) {
                setPosts(response.posts);
            } else {
                setPosts(prev => [...prev, ...response.posts]);
            }

            setCurrentPage(page);
            setHasMore(response.meta.hasMore);
        } catch (error) {
            console.error('Failed to fetch timeline posts:', error);
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

    useEffect(() => {
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

    const renderItem = ({ item }: { item: TimelinePost }) => (
        <View style={styles.cardWrapper}>
            <TimelineCard post={item} />
        </View>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={posts}
                renderItem={renderItem}
                keyExtractor={item => item.id.toString()}
                contentContainerStyle={styles.cardsContainer}
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
        width: '100%',
        backgroundColor: 'white',
    },
    cardsContainer: {
        padding: 16,
    },
    cardWrapper: {
        marginBottom: 16,
    },
    loadingFooter: {
        paddingVertical: 20,
        alignItems: 'center',
    },
});
