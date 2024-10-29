import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import GeneralPage from "../../page/community/GeneralPage";
import QuestionPage from "../../page/community/QuestionPage";
import TimeLinePage from "../../page/community/TimeLinePage";

type TabType = '자유게시판' | '만든 문제' | '타임라인';

export default function CustomTabMenu() {
    const [selectedTab, setSelectedTab] = useState<TabType>('자유게시판');

    const renderContent = () => {
        switch(selectedTab) {
            case '자유게시판':
                return <GeneralPage />;
            case '만든 문제':
                return <QuestionPage />;
            case '타임라인':
                return <TimeLinePage />;
            default:
                return <GeneralPage />;
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.tabContainer}>
                {['자유게시판', '만든 문제', '타임라인'].map((tab) => (
                    <TouchableOpacity
                        key={tab}
                        onPress={() => setSelectedTab(tab as TabType)}
                        style={styles.tab}
                    >
                        <Text style={[
                            styles.tabText,
                            selectedTab === tab && styles.selectedTabText
                        ]}>
                            {tab}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
            <View style={styles.content}>
                {renderContent()}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    tabContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    tab: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 5,
    },
    tabText: {
        fontSize: 16,
        color: '#8F9BB3',
    },
    selectedTabText: {
        color: '#735BF2',
        fontWeight: '600',
    },
    content: {
        flex: 1,
    },
});
