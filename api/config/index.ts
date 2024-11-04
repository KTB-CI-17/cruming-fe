import { Platform } from 'react-native';

const DEV_API_URL = Platform.select({
    ios: 'http://localhost:8080',
    android: 'http://10.0.2.2:8080',  // Android 에뮬레이터를 위한 특수 IP
    default: 'http://localhost:8080'
});

// prod는 나중에 실서버 주소로 변경하면 됩니다
const PROD_API_URL = 'http://your-production-url.com';

// 현재 환경에 따른 API URL 선택
export const API_URL = __DEV__ ? DEV_API_URL : PROD_API_URL;
