import { Tabs } from 'expo-router';
import React from 'react';
import { Image } from "react-native";

import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
    const colorScheme = useColorScheme();

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: '#735BF2',
                tabBarInactiveTintColor: '#8F9BB3',
                headerShown: false,
            }}>
            <Tabs.Screen
                name="MyPage"
                options={{
                    title: '내 정보',
                    tabBarIcon: ({ color }) => (
                        <Image
                            source={require('../../assets/images/mypage-icon.png')}
                            style={{
                                width: 24,
                                height: 24,
                                tintColor: color
                            }}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="Question"
                options={{
                    title: '문제 출제',
                    tabBarIcon: ({ color }) => (
                        <Image
                            source={require('../../assets/images/hold-icon.png')}
                            style={{
                                width: 24,
                                height: 24,
                                tintColor: color
                            }}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="index"
                options={{
                    title: '타임라인',
                    tabBarIcon: ({ color }) => (
                        <Image
                            source={require('../../assets/images/timeline-icon.png')}
                            style={{
                                width: 24,
                                height: 24,
                                tintColor: color
                            }}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="Community"
                options={{
                    title: '커뮤니티',
                    tabBarIcon: ({ color }) => (
                        <Image
                            source={require('../../assets/images/community-icon.png')}
                            style={{
                                width: 24,
                                height: 24,
                                tintColor: color
                            }}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="FootAnalysis"
                options={{
                    title: '암벽화',
                    tabBarIcon: ({ color }) => (
                        <Image
                            source={require('../../assets/images/shoes-icon.png')}
                            style={{
                                width: 24,
                                height: 24,
                                tintColor: color
                            }}
                        />
                    ),
                }}
            />
        </Tabs>
    );
}
