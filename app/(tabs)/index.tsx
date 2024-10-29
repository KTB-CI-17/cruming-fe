import {View, StyleSheet, ScrollView} from "react-native";
import React, {useState} from "react";
import CustomCalendar from "@/app/components/timeline/CustomCalendar";
import FloatingActionButton from "@/app/components/community/FloatingActionButton";
import {useFocusEffect} from "@react-navigation/native";
import TimelineWriteModal from "@/app/components/timeline/TimelineWriteModal";
import TimeLineCard from "@/app/components/common/TimeLineCard";

export default function Index() {
    const [isModalVisible, setIsModalVisible] = useState(false);

    useFocusEffect(
        React.useCallback(() => {
            setIsModalVisible(false);
        }, [])
    );

    // TODO: 활동 날짜 리스트 API 호출 후 연결
    const activeDates = [
        '2024-10-04',
        '2024-10-05',
        '2024-10-15'
    ];

    // TODO: 타임라인 정보 리스트 API 호출 후 연결
    const dummyTimelinePosts = [
        {
            id: 1,
            title: "손상원 클라이밍 판교점",
            subtitle: "엄청 다이나믹한 암장이었다 (사실 이지 브로)",
            date: "2024. 10. 04.",
            imageUrl: require("@/assets/images/climbing.png"),
            color: '#735BF2'
        },
        {
            id: 2,
            title: "손상원 클라이밍 판교점",
            subtitle: "오늘은 좀 힘들었다.",
            date: "2024. 10. 05.",
            imageUrl: require("@/assets/images/climbing.png"),
            color: '#E31A1A'
        },
        {
            id: 3,
            title: "손상원 클라이밍 분당점",
            subtitle: "오늘은 아쉬웠다.",
            date: "2024. 10. 15.",
            imageUrl: require("@/assets/images/climbing.png"),
            color: '#E31A1A'
        },
    ];


    const activeMarkedDates = activeDates.reduce((acc, date) => ({
        ...acc,
        [date]: {
            customStyles: {
                container: {
                    borderBottomWidth: 2,
                    borderBottomColor: '#735BF2',
                }
            }
        }
    }), {});

    return (
        <View style={styles.container}>
            <ScrollView style={styles.scrollView}>
                <CustomCalendar markedDates={activeMarkedDates} />
                <View style={styles.cardsContainer}>
                    {dummyTimelinePosts.map((post) => (
                        <TimeLineCard key={post.id} post={post} />
                    ))}
                </View>
            </ScrollView>
            <FloatingActionButton onPress={() => setIsModalVisible(true)} />
            <TimelineWriteModal
                visible={isModalVisible}
                onClose={() => setIsModalVisible(false)}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingTop: 0,
        flex: 1,
        backgroundColor: 'white',
    },
    scrollView: {
        flex: 1,
    },
    cardsContainer: {
        padding: 16,
    },
});
