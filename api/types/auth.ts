export interface User {
    id: string;
    nickname: string;
    profileImage?: string;
}

export interface AuthResponse {
    user: User;
    token: string;
}