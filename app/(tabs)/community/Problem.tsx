import { View, StyleSheet, FlatList, ActivityIndicator } from "react-native";
import PostCard from "@/components/community/PostCard";
import SearchBar from "@/components/common/SearchBar";
import ListError from "@/components/community/ListError";
import React, { useCallback, useEffect, useState, useRef } from "react";
import { ListPost } from "@/api/types/community/post";
import { PostService } from "@/api/services/community/postListService";
import axios from 'axios';

const POSTS_PER_PAGE = 10;

export default function Problem() {
    const [posts, setPosts] = useState<ListPost[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [pageNumber, setPageNumber] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const abortControllerRef = useRef<AbortController | null>(null);
    const [isInitialLoad, setIsInitialLoad] = useState(true);

    const cancelPreviousRequest = useCallback(() => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
            abortControllerRef.current = null;
        }
    }, []);

    const fetchPosts = useCallback(async (page: number, isRefresh: boolean = false) => {
        if ((!isRefresh && error) || (!hasMore && !isRefresh) || (isLoading && !isRefresh)) return;

        try {
            cancelPreviousRequest();
            abortControllerRef.current = new AbortController();

            setIsLoading(true);
            setError(null);

            const response = await PostService.getPosts({
                page,
                size: POSTS_PER_PAGE,
                category: 'PROBLEM'
            }, abortControllerRef.current.signal);

            if (isRefresh) {
                setPosts(response.content);
            } else {
                setPosts(prevPosts => [...prevPosts, ...response.content]);
            }

            setHasMore(!response.last);
            setPageNumber(page);
            setIsInitialLoad(false);

        } catch (error) {
            if (axios.isCancel(error)) {
                return;
            }

            setError('게시글을 불러오는데 실패했습니다.');

        } finally {
            if (abortControllerRef.current) {
                setIsLoading(false);
                setIsRefreshing(false);
            }
        }
    }, [hasMore, isLoading, cancelPreviousRequest, error]);

    useEffect(() => {
        if (isInitialLoad) {
            fetchPosts(0, true);
        }

        return () => {
            cancelPreviousRequest();
        };
    }, [isInitialLoad]);

    const handleRefresh = useCallback(() => {
        if (isRefreshing) return;
        setIsRefreshing(true);
        setPageNumber(0);
        fetchPosts(0, true);
    }, [fetchPosts, isRefreshing]);

    const handleLoadMore = useCallback(() => {
        if (!isLoading && hasMore && !error) {
            fetchPosts(pageNumber + 1, false);
        }
    }, [isLoading, hasMore, pageNumber, fetchPosts, error]);

    const handleRetry = useCallback(() => {
        if (isLoading) return;
        fetchPosts(pageNumber, true);
    }, [fetchPosts, pageNumber, isLoading]);

    const renderItem = useCallback(({ item }: { item: ListPost }) => (
        <PostCard post={item} />
    ), []);

    const renderFooter = useCallback(() => {
        if (!isLoading || error) return null;
        return (
            <View style={styles.loadingFooter}>
                <ActivityIndicator size="small" color="#735BF2" />
            </View>
        );
    }, [isLoading, error]);

    if (isLoading && posts.length === 0 && !error) {
        return (
            <View style={[styles.container, styles.centerContainer]}>
                <ActivityIndicator size="large" color="#735BF2" />
            </View>
        );
    }

    if (error && posts.length === 0) {
        return (
            <View style={styles.container}>
                <SearchBar />
                <ListError
                    onRetry={handleRetry}
                    errorMessage={error}
                />
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