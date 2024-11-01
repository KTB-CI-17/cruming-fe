import { Stack } from 'expo-router';

export default function MyPageLayout() {
    return (
        <Stack>
            <Stack.Screen
                name="index"
                options={{
                    headerShown: false
                }}
            />
            <Stack.Screen
                name="edit"
                options={{
                    headerShown: true,
                    headerTitle: '프로필 수정',
                    headerTintColor: '#735BF2',          // 뒤로가기 버튼 색상
                    headerBackTitle: ' ',             // 뒤로가기 텍스트 (iOS)
                    headerBackTitleVisible: false,        // 뒤로가기 텍스트 표시 여부 (iOS)
                    headerBackVisible: true,             // 뒤로가기 버튼 표시 여부
                    headerStyle: {
                        backgroundColor: 'white',        // 헤더 배경색
                    },
                    headerTitleStyle: {
                        color: '#000000',
                        fontSize: 18,                    // 헤더 제목 크기
                    },
                }}
            />
            <Stack.Screen
                name="settings"
                options={{
                    headerShown: true,
                    headerTitle: '설정',
                    headerTintColor: '#735BF2',          // 뒤로가기 버튼 색상
                    headerBackTitle: ' ',             // 뒤로가기 텍스트 (iOS)
                    headerBackTitleVisible: false,        // 뒤로가기 텍스트 표시 여부 (iOS)
                    headerBackVisible: true,             // 뒤로가기 버튼 표시 여부
                    headerStyle: {
                        backgroundColor: 'white',        // 헤더 배경색
                    },
                    headerTitleStyle: {
                        color: '#000000',
                        fontSize: 18,                    // 헤더 제목 크기
                    },
                }}
            />
        </Stack>
    );
}
