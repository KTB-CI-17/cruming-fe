import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import 'react-native-reanimated';
import Header from "@/app/components/layout/Header";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    const [loaded] = useFonts({
        SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    });

    useEffect(() => {
        if (loaded) {
            SplashScreen.hideAsync();
        }
    }, [loaded]);

    if (!loaded) {
        return null;
    }

    return (
        <SafeAreaProvider>
            <Stack
                screenOptions={{
                    header: () => <Header />,
                    contentStyle: { backgroundColor: 'white' },
                    headerShown: true,
                }}
            >
                <Stack.Screen name="(tabs)" />
                <Stack.Screen name="+not-found" />
            </Stack>
        </SafeAreaProvider>
    );
}
