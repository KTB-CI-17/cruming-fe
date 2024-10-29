import { Calendar } from 'react-native-calendars';
import { Text, View, StyleSheet } from 'react-native';  // StyleSheet import 추가

interface CustomCalendarProps {
    markedDates: { [key: string]: any };
}

const CustomCalendar: React.FC<CustomCalendarProps> = ({ markedDates }) => {
    const today = new Date().toISOString().split('T')[0];

    return (
        <Calendar
            style={{
                marginHorizontal: 20,
            }}
            markedDates={{
                ...markedDates,
                [today]: {
                    ...markedDates[today],
                    customStyles: {
                        text: {
                            color: '#735BF2',
                        },
                        ...(markedDates[today]?.customStyles || {}),
                    }
                }
            }}
            dayComponent={({ date, state, marking }) => {
                const isMarked = date?.dateString && markedDates[date.dateString];

                return (
                    <View pointerEvents="none" style={[
                        styles.dayContainer,
                        {
                            borderBottomColor: isMarked ? '#735BF2' : 'white'
                        }
                    ]}>
                        <Text style={{
                            color: state === 'disabled' ? '#6C7470' :
                                date?.dateString === today ? '#735BF2' : '#1A1F36',
                            fontSize: 14,
                            marginVertical: 3,
                            marginHorizontal: 3
                        }}>
                            {date?.day}
                        </Text>
                    </View>
                );
            }}
            markingType="custom"
            theme={{
                textMonthFontSize: 20,
                textMonthFontWeight: '400',
                arrowColor: '#000000',

                textDayFontSize: 16,
                textDayFontWeight: '400',
                dayTextColor: '#1A1F36',

                textDisabledColor: '#E4E9F2',

                // 요일 폰트 색상 변경 부분
                textSectionTitleColor: '#FF6347',       // Sun, Mon, ..., Sat 색상
                textSectionTitleDisabledColor: '#D3D3D3', // 비활성화된 요일 색상
            }}
            enableSwipeMonths={true}
        />
    );
};

const styles = StyleSheet.create({  // StyleSheet.create() 사용
    dayContainer: {
        alignItems: 'center',
        borderBottomWidth: 2,
        paddingBottom: 2,
        marginBottom: 2,
        minHeight: 30,
    }
});

export default CustomCalendar;
