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
                    headerTitle: "프로필 수정",
                    headerTitleAlign: 'center',
                    headerShadowVisible: false,
                    headerStyle: {
                        backgroundColor: '#fff',
                    }
                }}
            />
            <Stack.Screen
                name="settings"
                options={{
                    headerTitle: "설정",
                    headerTitleAlign: 'center',
                    headerShadowVisible: false,
                    headerStyle: {
                        backgroundColor: '#fff',
                    }
                }}
            />
        </Stack>
    );
}
