import React, {useState} from 'react';
import {View, StyleSheet, TouchableOpacity, Text} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import GeneralPage from "@/app/page/community/GeneralPage";
import QuestionPage from "@/app/page/community/QuestionPage";
import TimeLinePage from "@/app/page/community/TimeLinePage";
import FloatingActionButton from "@/app/components/community/FloatingActionButton";
import NewGeneralPage from "@/app/page/community/NewGeneralPage";
import {useFocusEffect} from "@react-navigation/native";

type TabType = '자유게시판' | '만든 문제' | '타임라인';

export default function CommunityTabs() {
    const [selectedTab, setSelectedTab] = useState<TabType>('자유게시판');
    const [isWriting, setIsWriting] = useState(false);

    useFocusEffect(
        React.useCallback(() => {
            setIsWriting(false);
        }, [])
    );

    const renderContent = () => {
        switch(selectedTab) {
            case '자유게시판':
                return (<View>
                    <GeneralPage />
                    <FloatingActionButton onPress={() => setIsWriting(true)} />
                </View>);
            case '만든 문제':
                return <QuestionPage />;
            case '타임라인':
                return <TimeLinePage />;
            default:
                return <GeneralPage />;
        }
    };

    if (isWriting) {
        return <NewGeneralPage onClose={() => setIsWriting(false)} />;
    }

    return (
        <SafeAreaView edges={['bottom']} style={styles.safeArea}>
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
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: 'white',
    },
    container: {
        flex: 1,
        backgroundColor: 'white',
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
