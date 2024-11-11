import { useState, useRef, useCallback } from 'react';
import { PostListResponse, PostListParams } from '@/api/types/community/post';

interface UsePaginationProps<T> {
    fetchFunction: (page: number, size: number) => Promise<PostListResponse>;
    pageSize?: number;
}

export const postListPagination = <T>({
                                          fetchFunction,
                                          pageSize = 10
                                      }: UsePaginationProps<T>) => {
    const [posts, setPosts] = useState<T[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [totalPages, setTotalPages] = useState(0);

    const loadingRef = useRef(false);

    const fetchPosts = useCallback(async (page: number, isRefresh: boolean = false) => {
        if (loadingRef.current || (!hasMore && !isRefresh)) return;

        try {
            loadingRef.current = true;
            isRefresh ? setIsLoading(true) : setIsRefreshing(true);

            const response = await fetchFunction(page, pageSize);

            if (isRefresh) {
                setPosts(response.content as T[]);
            } else {
                setPosts(prev => [...prev, ...(response.content as T[])]);
            }

            setCurrentPage(response.pageable.pageNumber);
            setTotalPages(response.totalPages);
            setHasMore(!response.last);

        } catch (error) {
            console.error('Failed to fetch posts:', error);
        } finally {
            loadingRef.current = false;
            setIsLoading(false);
            setIsRefreshing(false);
        }
    }, [fetchFunction, pageSize, hasMore]);

    const handleRefresh = useCallback(() => {
        if (loadingRef.current) return;
        setHasMore(true);
        setCurrentPage(0);
        fetchPosts(0, true);
    }, [fetchPosts]);

    const handleLoadMore = useCallback(() => {
        if (loadingRef.current || !hasMore || currentPage >= totalPages - 1) return;
        fetchPosts(currentPage + 1);
    }, [currentPage, hasMore, totalPages, fetchPosts]);

    return {
        posts,
        isLoading,
        isRefreshing,
        hasMore,
        handleRefresh,
        handleLoadMore,
        fetchPosts
    };
};