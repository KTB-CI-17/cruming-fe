import { useLocalSearchParams } from 'expo-router';
import { View, Text } from 'react-native';
import { Stack } from 'expo-router';

export default function TimelineDetailPage() {
    const { id } = useLocalSearchParams<{ id: string }>();

    return (
        <>
            <Stack.Screen
                options={{
                    headerShown: false,
                }}
            />
            <View style={{ flex: 1 }}>
                <Text>Timeline Detail Page - ID: {id}</Text>
            </View>
        </>
    );
}
