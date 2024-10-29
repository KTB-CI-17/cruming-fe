import {Text, View, StyleSheet} from "react-native";
import React, {useState} from "react";
import CustomCalendar from "@/app/components/timeline/CustomCalendar";
import FloatingActionButton from "@/app/components/community/FloatingActionButton";
import {useFocusEffect} from "@react-navigation/native";
import {SafeAreaView} from "react-native-safe-area-context";

export default function Index() {
    const [isWriting, setIsWriting] = useState(false);

    useFocusEffect(
        React.useCallback(() => {
            setIsWriting(false);
        }, [])
    );

    // 활동 날짜 리스트
    const activeDates = [
        '2024-11-04',
        '2024-11-05',
        '2024-11-06'
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
            <CustomCalendar
                markedDates={activeMarkedDates}
            />
            <FloatingActionButton onPress={() => setIsWriting(true)} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingTop: 0,
        flex: 1,
        backgroundColor: 'white',
    },
});
