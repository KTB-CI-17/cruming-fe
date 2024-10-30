import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { StyleSheet } from 'react-native';
import General from '@/app/(tabs)/community/General';
import Problem from "@/app/(tabs)/community/Problem";
import Timeline from "@/app/(tabs)/community/Timeline";

const Tab = createMaterialTopTabNavigator();

export default function CommunityIndex() {
    return (
        <Tab.Navigator
            screenOptions={{
                tabBarIndicatorStyle: {
                    backgroundColor: '#735BF2',
                    height: 0,
                },
                tabBarLabelStyle: styles.tabText,
                tabBarActiveTintColor: '#735BF2',
                tabBarInactiveTintColor: '#8F9BB3',
            }}
        >
            <Tab.Screen
                name="General"
                options={{
                    title: '자유게시판',
                    tabBarLabel: '자유게시판'
                }}
                component={General}
            />
            <Tab.Screen
                name="Problem"
                options={{
                    title: '만든 문제',
                    tabBarLabel: '만든 문제'
                }}
                component={Problem}
            />
            <Tab.Screen
                name="Timeline"
                options={{
                    title: '타임라인',
                    tabBarLabel: '타임라인'
                }}
                component={Timeline}
            />
        </Tab.Navigator>
    );
}

const styles = StyleSheet.create({
    tabText: {
        fontSize: 16,
        fontWeight: 'normal',
    }
});
