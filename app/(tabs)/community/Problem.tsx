import { View, StyleSheet, FlatList, ActivityIndicator, Text } from "react-native";
import PostCard from "@/components/community/PostCard";
import SearchBar from "@/components/common/SearchBar";
import ListError from "@/components/community/ListError";
import React, { useCallback } from "react";
import { ListPost } from "@/api/types/community/post";
import { usePostList } from "@/hooks/community/usePostListPagination";

const INITIAL_FETCH_SIZE = 10;

export default function Problem() {
    const {
        posts,
        isLoading,
        isRefreshing,
        isLoadingMore,
        error,
        hasMore,
        handleRefresh,
        handleLoadMore,
        handleRetry
    } = usePostList({
        category: 'PROBLEM',
        pageSize: INITIAL_FETCH_SIZE
    });

    const renderItem = useCallback(({ item }: { item: ListPost }) => (
        <PostCard post={item} />
    ), []);

    const renderFooter = useCallback(() => {
        // hasMore가 true이고 실제로 posts가 있을 때만 로딩 표시
        if (!isLoadingMore || !hasMore || posts.length === 0) return null;
        return (
            <View style={styles.loadingFooter}>
                <ActivityIndicator size="small" color="#735BF2" />
            </View>
        );
    }, [isLoadingMore, hasMore, posts.length]);

    const renderEmpty = useCallback(() => {
        if (isLoading) return null;
        return (
            <View style={styles.emptyContainer}>
                <View style={styles.emptyContent}>
                    <Text style={styles.emptyText}>게시글이 없습니다.</Text>
                </View>
            </View>
        );
    }, [isLoading]);

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
            <View style={styles.listContainer}>
                <FlatList
                    data={posts}
                    renderItem={renderItem}
                    keyExtractor={item => item.id.toString()}
                    contentContainerStyle={[
                        styles.postsContainer,
                        posts.length === 0 && styles.emptyListContainer
                    ]}
                    onRefresh={handleRefresh}
                    refreshing={isRefreshing}
                    onEndReached={handleLoadMore}
                    onEndReachedThreshold={0.5}
                    ListFooterComponent={renderFooter}
                    ListEmptyComponent={renderEmpty}
                    scrollEventThrottle={16}
                    removeClippedSubviews={true}
                    maxToRenderPerBatch={5}
                    updateCellsBatchingPeriod={100}
                    windowSize={10}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    listContainer: {
        flex: 1,
    },
    centerContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    postsContainer: {
        paddingHorizontal: 16,
        paddingBottom: 20,
    },
    emptyListContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100%',
    },
    loadingFooter: {
        paddingVertical: 20,
        alignItems: 'center',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 40,
    },
    emptyContent: {
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 16,
        color: '#8F9BB3',
        marginTop: 8,
    },
});