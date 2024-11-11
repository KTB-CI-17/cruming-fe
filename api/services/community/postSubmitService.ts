import axios from 'axios';
import { API_URL } from '@/api/config/index';
import { ApiResponse } from '@/api/types/community/post';

enum Category {
    GENERAL = 'GENERAL',
    PROBLEM = 'PROBLEM'
}

interface PostRequest {
    title: string;
    content: string;
    category: Category;
}

export const PostSubmitService = {
    submit: async (title: string, content: string, category: Category = Category.GENERAL) => {
        const postRequestData: PostRequest = {
            title: title.trim(),
            content: content.trim(),
            category,
        };

        console.log('Request Data:', postRequestData);

        return await axios<ApiResponse<any>>({
            method: 'post',
            url: `${API_URL}/api/v1/posts`,
            data: postRequestData,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            timeout: 10000
        });
    }
};