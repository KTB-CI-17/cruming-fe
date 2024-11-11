import axios from 'axios';
import { PostListResponse, PostListParams } from '@/api/types/community/post';

const API_URL = `http://localhost:8080/api/v1/posts`;

export const PostService = {
    getPosts: async ({ page, size, category }: PostListParams): Promise<PostListResponse> => {
        try {
            const response = await axios.get<PostListResponse>(API_URL, {
                params: {
                    page,
                    size,
                    category
                }
            });
            console.log('API Response:', response.data);
            return response.data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }
};