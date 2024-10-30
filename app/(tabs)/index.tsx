import { GestureHandlerRootView, Swipeable } from 'react-native-gesture-handler';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import CustomCalendar from "@/app/components/timeline/CustomCalendar";
import FloatingActionButton from "@/app/components/community/FloatingActionButton";
import { useFocusEffect } from "@react-navigation/native";
import TimelineWriteModal from "@/app/components/timeline/TimelineWriteModal";
import TimeLineCard from "@/app/components/common/TimeLineCard";

export default function Index() {
    const [isModalVisible, setIsModalVisible] = useState(false);

    useFocusEffect(
        React.useCallback(() => {
            setIsModalVisible(false);
        }, [])
    );

    const dummyTimelinePosts = [
        {
            id: 1,
            title: "손상원 클라이밍 판교점",
            subtitle: "엄청 다이나믹한 암장이었다 (사실 이지 브로)",
            date: "2024-10-04",
            imageUrl: require("@/assets/images/climbing.png"),
            color: '#735BF2'
        },
        {
            id: 2,
            title: "손상원 클라이밍 판교점",
            subtitle: "오늘은 좀 힘들었다.",
            date: "2024-10-05",
            imageUrl: require("@/assets/images/climbing.png"),
            color: '#E31A1A'
        },
        {
            id: 3,
            title: "손상원 클라이밍 분당점",
            subtitle: "오늘은 아쉬웠다.",
            date: "2024-10-15",
            imageUrl: require("@/assets/images/climbing.png"),
            color: '#E31A1A'
        },
    ];

    const activeMarkedDates = dummyTimelinePosts.reduce((acc, post) => ({
        ...acc,
        [post.date]: {
            customStyles: {
                container: {
                    borderBottomWidth: 2,
                    borderBottomColor: '#735BF2',
                }
            }
        }
    }), {});

    const renderRightActions = () => (
        <TouchableOpacity style={styles.deleteButton} onPress={() => alert("활동 기록을 삭제하시겠습니까?")}>
            <Text style={styles.deleteButtonText}>삭제</Text>
        </TouchableOpacity>
    );

    const formatDateForDisplay = (date: string) => {
        return date.replace(/-/g, '. ') + '.';
    };

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <View style={styles.container}>
                <ScrollView style={styles.scrollView}>
                    <CustomCalendar markedDates={activeMarkedDates} />
                    {dummyTimelinePosts.map((post) => (
                        <Swipeable
                            key={post.id}
                            containerStyle={{margin: 0, padding: 0}}
                            renderRightActions={renderRightActions}
                        >
                            <View style={styles.cardsContainer}>
                                <TimeLineCard
                                    post={{
                                        ...post,
                                        date: formatDateForDisplay(post.date) // 표시용 날짜 형식으로 변환
                                    }}
                                />
                            </View>
                        </Swipeable>
                    ))}
                </ScrollView>
                <FloatingActionButton onPress={() => setIsModalVisible(true)} />
                <TimelineWriteModal
                    visible={isModalVisible}
                    onClose={() => setIsModalVisible(false)}
                />
            </View>
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingTop: 0,
        flex: 1,
        paddingBottom: 0,
        backgroundColor: 'white',
    },
    scrollView: {
        flex: 1,
    },
    cardsContainer: {
        paddingTop: 16,
        paddingHorizontal: 16,
        paddingBottom: 0
    },
    deleteButton: {
        backgroundColor: '#E31A1A',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 12,
        width: 76,
        margin: 16,
        marginLeft: 0,
        marginBottom: 20
    },
    deleteButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});
