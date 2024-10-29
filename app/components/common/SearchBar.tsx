import { View, TextInput, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';

export default function SearchBar() {
    const [isFocused, setIsFocused] = useState(false);
    const [searchText, setSearchText] = useState('');

    const handleBlur = () => {
        setIsFocused(false);
    };

    const handleScreenTouch = () => {
        Keyboard.dismiss();  // 키보드 닫기
        setIsFocused(false); // 포커스 상태 해제
    };

    return (
        <TouchableWithoutFeedback onPress={handleScreenTouch}>
            <View style={styles.container}>
                <View style={[
                    styles.searchContainer,
                    isFocused && styles.searchContainerFocused
                ]}>
                    <TextInput
                        style={styles.input}
                        placeholder="검색어를 입력해 주세요."
                        placeholderTextColor="#8F9BB3"
                        value={searchText}
                        onChangeText={setSearchText}
                        onFocus={() => setIsFocused(true)}
                        onBlur={handleBlur}
                    />
                    <TouchableOpacity
                        style={styles.searchIcon}
                        onPress={() => {}}
                    >
                        <Ionicons
                            name="search"
                            size={20}
                            color={isFocused ? '#735BF2' : '#8F9BB3'}
                        />
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#8F9BB3',
        borderRadius: 20,
        paddingHorizontal: 15,
        height: 40,
        backgroundColor: 'white',
    },
    searchContainerFocused: {
        borderColor: '#735BF2',
    },
    input: {
        flex: 1,
        fontSize: 14,
        color: '#000000',
        padding: 0,
    },
    searchIcon: {
        padding: 5,
    },
});
