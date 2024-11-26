import { API_URL } from '@/api/config/index';
import { useAuthenticatedFetch } from '@/hooks/useAuthenticatedFetch';

export function usePostService() {
    const { authFetch } = useAuthenticatedFetch();

    const fetchPost = async (postId: string) => {
        const response = await authFetch(`${API_URL}/api/v1/posts/${postId}`);
        if (!response.ok) throw new Error();
        return response.json();
    };

    const deletePost = async (postId: number) => {
        const response = await authFetch(`${API_URL}/api/v1/posts/${postId}`, {
            method: 'DELETE',
        });
        if (!response.ok) throw new Error();
        return response.json();
    };

    const likePost = async (postId: number) => {
        const response = await authFetch(`${API_URL}/api/v1/posts/${postId}/like`, {
            method: 'POST',
        });
        if (!response.ok) throw new Error();
        return response.json();
    };

    // Reply APIs with sorting
    const fetchReplies = async (postId: string, page = 0, size = 10) => {
        const response = await authFetch(
            `${API_URL}/api/v1/posts/${postId}/replies?page=${page}&size=${size}&sort=createdAt,asc`
        );
        if (!response.ok) throw new Error();
        return response.json();
    };

    const fetchChildReplies = async (parentId: number, page = 0) => {
        // 대댓글은 항상 5개씩 고정
        const response = await authFetch(
            `${API_URL}/api/v1/posts/replies/${parentId}/children?page=${page}&size=5&sort=createdAt,asc`
        );
        if (!response.ok) throw new Error();
        return response.json();
    };

    const createReply = async (postId: string, content: string, parentId?: number | null) => {
        const url = parentId
            ? `${API_URL}/api/v1/posts/${postId}/replies/${parentId}`
            : `${API_URL}/api/v1/posts/${postId}/replies`;

        const response = await authFetch(url, {
            method: 'POST',
            body: JSON.stringify({ content }),
        });

        if (!response.ok) {
            throw new Error('댓글 작성 실패');
        }
    };


    const updateReply = async (replyId: number, content: string) => {
        try {
            await authFetch(`${API_URL}/api/v1/posts/replies/${replyId}`, {
                method: 'PUT',
                body: JSON.stringify({ content }),
            });
        } catch (error) {
            console.error('Update reply error:', error);
            throw error;
        }
    };

    const deleteReply = async (replyId: number) => {
        const response = await authFetch(`${API_URL}/api/v1/posts/replies/${replyId}`, {
            method: 'DELETE',
        });
        if (!response.ok) throw new Error();
        return;
    };

    return {
        fetchPost,
        deletePost,
        likePost,
        fetchReplies,
        fetchChildReplies,
        createReply,
        updateReply,
        deleteReply,
    };
}