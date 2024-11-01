import React, { useState } from 'react';
import {
    Modal,
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Platform,
    Dimensions
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import { BlurView } from 'expo-blur';
import { X } from 'lucide-react-native';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import AntDesign from '@expo/vector-icons/AntDesign';

interface DatePickerAreaProps {
    value: string;
    onDateSelect: (date: string) => void;
}

export default function DatePickerArea({ value, onDateSelect }: DatePickerAreaProps) {
    const [isVisible, setIsVisible] = useState(false);
    const today = new Date();

    const handleDayPress = (day: any) => {
        onDateSelect(day.dateString);
        setIsVisible(false);
    };

    const handleModalBackdropPress = (event: any) => {
        // 모달 내부의 터치 이벤트가 발생한 경우에는 모달을 닫지 않음
        event.stopPropagation();
    };

    const formattedDate = value ?
        format(new Date(value), 'yyyy년 MM월 dd일', { locale: ko }) :
        '';

    return (
        <>
            <TouchableOpacity
                style={styles.input}
                onPress={() => setIsVisible(true)}
            >
                <Text style={[styles.inputText, value ? styles.filledInput : {}]}>
                    {formattedDate || '* 활동 일자'}
                </Text>
                <AntDesign name="calendar" size={24} color="black" />
            </TouchableOpacity>

            <Modal
                transparent
                visible={isVisible}
                animationType="fade"
                onRequestClose={() => setIsVisible(false)}
            >
                <TouchableOpacity
                    style={StyleSheet.absoluteFill}
                    activeOpacity={1}
                    onPress={() => setIsVisible(false)}
                >
                    <BlurView intensity={10} style={StyleSheet.absoluteFill}>
                        <View style={styles.modalContainer}>
                            <TouchableOpacity
                                activeOpacity={1}
                                onPress={handleModalBackdropPress}
                                style={styles.calendarContainer}
                            >
                                <View style={styles.headerArea}>
                                    <Text style={styles.headerText}>날짜 선택</Text>
                                    <TouchableOpacity
                                        style={styles.closeButton}
                                        onPress={() => setIsVisible(false)}
                                    >
                                        <X size={24} color="#8F9BB3" />
                                    </TouchableOpacity>
                                </View>
                                <Calendar
                                    current={value || today.toISOString()}
                                    maxDate={today.toISOString()}
                                    onDayPress={handleDayPress}
                                    markedDates={{
                                        [value]: { selected: true, selectedColor: '#735BF2' }
                                    }}
                                    theme={{
                                        selectedDayBackgroundColor: '#735BF2',
                                        todayTextColor: '#735BF2',
                                        arrowColor: '#735BF2',
                                    }}
                                />
                            </TouchableOpacity>
                        </View>
                    </BlurView>
                </TouchableOpacity>
            </Modal>
        </>
    );
}


const styles = StyleSheet.create({
    input: {
        borderWidth: 1,
        borderColor: '#E4E9F2',
        borderRadius: 8,
        padding: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    inputText: {
        color: '#8F9BB3',
        flex: 1,
    },
    filledInput: {
        color: '#000',
    },
    iconText: {
        fontSize: 16,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    calendarContainer: {
        backgroundColor: 'white',
        borderRadius: 12,
        width: '100%',
        maxWidth: 400,
        overflow: 'hidden',
    },
    headerArea: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E4E9F2',
        position: 'relative',
    },
    headerText: {
        fontSize: 18,
        fontWeight: '600',
    },
    closeButton: {
        position: 'absolute',
        right: 16,
    },
});
