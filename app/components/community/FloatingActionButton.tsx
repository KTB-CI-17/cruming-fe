// components/FloatingActionButton.tsx
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function FloatingActionButton() {
    return (
        <TouchableOpacity style={styles.fab} onPress={() => {/* 작성하기 페이지로 이동 */}}>
            <Ionicons name="add" size={24} color="white" />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    fab: {
        position: 'absolute',
        bottom: 0, // 탭바 위에 위치하도록
        right: 20,
        backgroundColor: '#735BF2', // 보라색
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 4, // Android 그림자
        shadowColor: '#000', // iOS 그림자
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
});
