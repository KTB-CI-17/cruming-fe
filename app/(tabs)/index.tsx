import {Text, View, StyleSheet} from "react-native";
import React, {useState} from "react";
import CustomCalendar from "@/app/components/timeline/CustomCalendar";
import FloatingActionButton from "@/app/components/community/FloatingActionButton";
import {useFocusEffect} from "@react-navigation/native";
import TimelineWriteModal from "@/app/components/timeline/TimelineWriteModal";

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
            <CustomCalendar markedDates={activeMarkedDates} />
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
});
