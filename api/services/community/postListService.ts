import { PostListResponse, PostListParams } from '@/api/types/community/post';
import { useAuthenticatedFetch } from '@/hooks/useAuthenticatedFetch';
import { API_URL } from '@/api/config/index';

export const PostService = {
    getPosts: async ({ page, size, category }: PostListParams, signal?: AbortSignal): Promise<PostListResponse> => {
        const { authFetch } = useAuthenticatedFetch();
        try {
            console.log('Making request with params:', { page, size, category }); // 요청 파라미터 로깅

            const queryParams = new URLSearchParams({
                page: page.toString(),
                size: size.toString(),
                category: category.toString()
            }).toString();

            const response = await authFetch(`${API_URL}/api/v1/posts?${queryParams}`, {
                method: 'GET',
                requireAuth: true,
                signal
            });

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Failed to fetch posts:', error);
            throw error;
        }
    }
};