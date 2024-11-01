import { apiClient } from '../config';
import { ApiResponse, Post, CreatePostData, UpdatePostData } from '../types/post';

// 게시글 목록 조회
export const getPosts = async (): Promise<ApiResponse<Post[]>> => {
    try {
        const response = await apiClient.get('/posts');
        return response.data;
    } catch (error) {
        throw new Error('Failed to fetch posts');
    }
};

// 게시글 상세 조회
export const getPost = async (id: string): Promise<ApiResponse<Post>> => {
    try {
        const response = await apiClient.get(`/posts/${id}`);
        return response.data;
    } catch (error) {
        throw new Error('Failed to fetch post');
    }
};

// 게시글 생성
export const createPost = async (data: CreatePostData): Promise<ApiResponse<Post>> => {
    try {
        const response = await apiClient.post('/posts', data);
        return response.data;
    } catch (error) {
        throw new Error('Failed to create post');
    }
};

// 게시글 수정
export const updatePost = async (id: string, data: UpdatePostData): Promise<ApiResponse<Post>> => {
    try {
        const response = await apiClient.put(`/posts/${id}`, data);
        return response.data;
    } catch (error) {
        throw new Error('Failed to update post');
    }
};

// 게시글 삭제
export const deletePost = async (id: string): Promise<ApiResponse<void>> => {
    try {
        const response = await apiClient.delete(`/posts/${id}`);
        return response.data;
    } catch (error) {
        throw new Error('Failed to delete post');
    }
};
