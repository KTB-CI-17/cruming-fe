import { useLocalSearchParams } from 'expo-router';
import { View, Text } from 'react-native';
import { Stack } from 'expo-router';

export default function PostDetailPage() {
    const { id } = useLocalSearchParams<{ id: string }>();

    return (
        <>
            <Stack.Screen
                options={{
                    headerShown: false,
                }}
            />
            <View style={{ flex: 1 }}>
                <Text>post Detail Page - ID: {id}</Text>
            </View>
        </>
    );
}
