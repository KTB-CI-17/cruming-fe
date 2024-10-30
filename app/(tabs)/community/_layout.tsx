import { Stack } from 'expo-router';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';

export default function CommunityLayout() {
    return (
        <View style={styles.safeArea}>
            <Stack>
                <Stack.Screen
                    name="index"
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="new"
                    options={{
                        headerShown: true,
                        headerTitle: '',
                        headerTintColor: '#735BF2',          // 뒤로가기 버튼 색상
                        headerBackTitle: ' ',             // 뒤로가기 텍스트 (iOS)
                        headerBackTitleVisible: false,        // 뒤로가기 텍스트 표시 여부 (iOS)
                        headerBackVisible: true,             // 뒤로가기 버튼 표시 여부
                        headerStyle: {
                            backgroundColor: 'white',        // 헤더 배경색
                        },
                        headerTitleStyle: {
                            color: '#FFFFFF',               // 헤더 제목 색상
                            fontSize: 18,                    // 헤더 제목 크기
                            fontWeight: '600',              // 헤더 제목 굵기
                        },
                        // 오른쪽 제출 버튼 추가
                        headerRight: () => (
                            <TouchableOpacity
                                onPress={() => {
                                    // 여기에 제출 로직 추가
                                    console.log('제출 버튼 클릭');
                                }}
                            >
                                <Text style={styles.submitText}>완료</Text>
                            </TouchableOpacity>
                        ),
                    }}
                />
            </Stack>
        </View>
    );
}
const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: 'white',
    },
    submitText: {
        fontSize: 16,
        fontWeight: 'normal',
        color: '#735BF2'
    }
});
