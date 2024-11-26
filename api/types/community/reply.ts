export interface Reply {
    id: number;
    content: string;
    userId: number;
    userNickname: string;
    createdAt: string;
    isWriter: boolean;
    children?: Reply[];
    childCount: number;
    parent?: Reply;
    parentId?: number | null;
}

export interface CreateReplyRequest {
    content: string;
    parentId?: number | null;
}

export interface UpdateReplyRequest {
    content: string;
}

export interface ReplyResponse {
    content: Reply[];
    pageable: {
        pageNumber: number;
        pageSize: number;
        sort: {
            sorted: boolean;
            unsorted: boolean;
            empty: boolean;
        };
        offset: number;
        paged: boolean;
        unpaged: boolean;
    };
    last: boolean;
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
    sort: {
        sorted: boolean;
        unsorted: boolean;
        empty: boolean;
    };
    first: boolean;
    numberOfElements: number;
    empty: boolean;
}

export interface ReplyState {
    replies: Reply[];
    childrenMap: { [key: number]: Reply[] };
    loadingStates: { [key: number]: boolean };
    pageStates: { [key: number]: number };
    pendingReplies: { [key: string]: PendingReply };
    selectedReplyId: number | null;
    editingReplyId: number | null;
    replyText: string;
    isSubmitting: boolean;
    error: Error | null;
}

export interface PendingReply {
    id: string;
    content: string;
    parentId: number | null;
    timestamp: number;
}

export type ReplyAction =
    | { type: 'SET_REPLIES'; payload: Reply[] }
    | { type: 'ADD_REPLY'; payload: Reply }
    | { type: 'UPDATE_REPLY'; payload: { id: number; content: string } }
    | { type: 'DELETE_REPLY'; payload: number }
    | { type: 'SET_CHILDREN'; payload: { parentId: number; children: Reply[] } }
    | { type: 'SET_LOADING'; payload: { replyId: number; isLoading: boolean } }
    | { type: 'SET_PAGE'; payload: { replyId: number; page: number } }
    | { type: 'SELECT_REPLY'; payload: number | null }
    | { type: 'SET_EDITING'; payload: number | null }
    | { type: 'SET_REPLY_TEXT'; payload: string }
    | { type: 'SET_SUBMITTING'; payload: boolean }
    | { type: 'SET_ERROR'; payload: Error | null };