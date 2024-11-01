// 게시글 관련 타입 정의
export interface Post {
    id: string;
    title?: string;
    location?: string;
    level?: number;
    image?: string;
    content: string;
    authorName: string;
    authorImage?: string;
    is_writer: boolean;
    createdAt: string;
    instagram?: string;  // 선택적 필드
}
export interface CreatePostData {
    title?: string;
    location?: string;
    level?: number;
    image: string;
    content: string;
}

export interface UpdatePostData extends Partial<CreatePostData> {}

export interface ApiResponse<T> {
    data: T;
    message: string;
    status: number;
}
