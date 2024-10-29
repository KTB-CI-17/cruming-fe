// components/LoadingPage.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withTiming,
    cancelAnimation,
    Easing
} from 'react-native-reanimated';
import { useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';

export default function HoldAnalysisLoading() {
    const rotation = useSharedValue(0);

    useEffect(() => {
        rotation.value = withRepeat(
            withTiming(360, {
                duration: 2000,
                easing: Easing.linear,
            }),
            -1, // 무한 반복
        );

        return () => {
            cancelAnimation(rotation);
        };
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ rotate: `${rotation.value}deg` }],
    }));

    return (
        <View style={styles.container}>
            <Text style={styles.title}>분석중</Text>
            <Text style={styles.subtitle}>잠시만 기다려 주세요.</Text>
            <Animated.View style={[styles.loadingIcon, animatedStyle]}>
                <Ionicons name="reload-outline" size={40} color="#735BF2" />
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: '600',
        color: '#1A1F36',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#8F9BB3',
        marginBottom: 40,
    },
    loadingIcon: {
        width: 40,
        height: 40,
    },
});
