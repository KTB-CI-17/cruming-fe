// @/api/types/community/post.ts
interface BasePost {
    id: number;
    title: string;
    createdAt: string;
}

export interface ListPost extends BasePost {
    isNew?: boolean;
    isHot?: boolean;
}

export interface User {
    userId: number;
    nickname: string;
}

export interface DetailPost extends BasePost {
    content: string;
    location?: string;
    level?: number;
    images?: string[];
    user: User;
    isWriter: boolean;
}

export interface PageableSort {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
}

export interface Pageable {
    pageNumber: number;
    pageSize: number;
    sort: PageableSort;
    offset: number;
    paged: boolean;
    unpaged: boolean;
}

export interface PostListResponse {
    content: ListPost[];
    pageable: Pageable;
    last: boolean;
    totalPages: number;
    totalElements: number;
    first: boolean;
    size: number;
    number: number;
    sort: PageableSort;
    numberOfElements: number;
    empty: boolean;
}

export interface PostListParams {
    page: number;
    size: number;
    category: string;
}

export interface CreatePostData {
    title: string;
    content: string;
    location?: string;
    level?: number;
    images?: string[];
}

export interface UpdatePostData extends Partial<CreatePostData> {}

export interface ApiResponse<T> {
    data: T;
    message: string;
    status: number;
}

export const isDetailPost = (post: ListPost | DetailPost): post is DetailPost => {
    return 'content' in post && 'user' in post && 'isWriter' in post;
};