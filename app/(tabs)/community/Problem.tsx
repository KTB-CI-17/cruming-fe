import { View, StyleSheet, FlatList, ActivityIndicator } from "react-native";
import PostCard from "@/components/community/PostCard";
import SearchBar from "@/components/common/SearchBar";
import React, { useCallback, useEffect, useState } from "react";
import { ListPost } from "@/api/types/community/post";
import { PostService } from "@/api/services/community/postListService";

const POSTS_PER_PAGE = 10;

export default function Problem() {
    const [posts, setPosts] = useState<ListPost[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [pageNumber, setPageNumber] = useState(0);
    const [hasMore, setHasMore] = useState(true);

    const fetchPosts = useCallback(async (page: number, isRefresh: boolean = false) => {
        if ((!hasMore && !isRefresh) || isLoading) return;

        try {
            setIsLoading(true);
            console.log('Fetching page:', page);

            const response = await PostService.getPosts({
                page,
                size: POSTS_PER_PAGE,
                category: 'PROBLEM' // GENERAL 대신 PROBLEM으로 변경
            });

            console.log('Response:', {
                content: response.content.length,
                page: response.pageable.pageNumber,
                last: response.last
            });

            if (isRefresh) {
                setPosts(response.content);
            } else {
                setPosts(prevPosts => [...prevPosts, ...response.content]);
            }

            setHasMore(!response.last);
            setPageNumber(page);

        } catch (error) {
            console.error('Failed to fetch posts:', error);
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    }, [hasMore, isLoading]);

    useEffect(() => {
        fetchPosts(0, true);
    }, []);

    const handleRefresh = useCallback(() => {
        setIsRefreshing(true);
        setPageNumber(0);
        fetchPosts(0, true);
    }, [fetchPosts]);

    const handleLoadMore = useCallback(() => {
        console.log('HandleLoadMore called', {
            isLoading,
            hasMore,
            currentPage: pageNumber
        });

        if (!isLoading && hasMore) {
            const nextPage = pageNumber + 1;
            console.log('Loading next page:', nextPage);
            fetchPosts(nextPage, false);
        }
    }, [isLoading, hasMore, pageNumber, fetchPosts]);

    const renderItem = useCallback(({ item }: { item: ListPost }) => (
        <PostCard post={item} />
    ), []);

    const renderFooter = useCallback(() => {
        if (!isLoading) return null;
        return (
            <View style={styles.loadingFooter}>
                <ActivityIndicator size="small" color="#735BF2" />
            </View>
        );
    }, [isLoading]);

    if (isLoading && posts.length === 0) {
        return (
            <View style={[styles.container, styles.centerContainer]}>
                <ActivityIndicator size="large" color="#735BF2" />
            </View>
        );
    }

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
                removeClippedSubviews={true}
                maxToRenderPerBatch={5}
                updateCellsBatchingPeriod={100}
                windowSize={10}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    centerContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    postsContainer: {
        paddingHorizontal: 16,
        paddingBottom: 20,
    },
    loadingFooter: {
        paddingVertical: 20,
        alignItems: 'center',
    },
});