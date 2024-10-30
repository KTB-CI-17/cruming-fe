import { TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';  // expo-router에서 useRouter import

export default function AddGeneralButton() {
    const router = useRouter();  // useRouter 훅 사용

    const handlePress = () => {
        router.push('/community/new');  // new 페이지로 이동
    };

    return (
        <TouchableOpacity
            style={styles.fab}
            onPress={handlePress}  // onPress 핸들러 추가
        >
            <Ionicons name="add" size={24} color="white" />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    fab: {
        position: 'absolute',
        bottom: 10,
        right: 20,
        backgroundColor: '#735BF2',
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
});
