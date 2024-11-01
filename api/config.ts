import axios from 'axios';

// API 기본 설정
export const API_CONFIG = {
    baseURL: 'YOUR_API_BASE_URL',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
};

// axios 인스턴스 생성
export const apiClient = axios.create(API_CONFIG);

// 요청 인터셉터 설정
apiClient.interceptors.request.use(
    (config) => {
        // 토큰이 있다면 헤더에 추가
        const token = ''; // TODO: 토큰 가져오기
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 응답 인터셉터 설정
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        // 에러 처리
        if (error.response?.status === 401) {
            // 인증 에러 처리
            console.log('인증 에러');
        }
        return Promise.reject(error);
    }
);
