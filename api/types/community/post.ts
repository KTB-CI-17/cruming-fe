interface BasePost {
    id: number;
    title: string;
    createdAt: string;
}

export interface ListPost extends BasePost {
    isNew?: boolean;
    isHot?: boolean;
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

export interface Post extends BasePost {
    content: string;
    location?: string;
    level?: string;
    category: string;
    visibility: string;
    userId: number;
    userNickname: string;
    isWriter: boolean;
    files: File[];
    instagram_id?: string;
}

export interface File {
    id: number;
    fileName: string;
    fileKey: string;
    url: string;
    fileType: string;
    fileSize: number;
    displayOrder: number;
    userId: number;
    status: string;
    createdAt: string;
}

export interface Reply {
    id: number;
    content: string;
    createdAt: string;
    userId: number;
    userNickname: string;
    childCount: number;
    children?: Reply[];
    isWriter?: boolean;
}