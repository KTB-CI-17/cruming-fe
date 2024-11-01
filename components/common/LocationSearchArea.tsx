import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Platform
} from 'react-native';

interface LocationSearchProps {
    value: string;
    onLocationSelect: (location: string) => void;
}

export default function LocationSearch({ value, onLocationSelect }: LocationSearchProps) {
    const [searchText, setSearchText] = useState('');

    const handleSearch = async () => {
        try {
            // TODO: 주소 검색 API 호출
            console.log('=== 주소 검색 API 호출 ===');
            console.log('검색어:', searchText);
            console.log('========================');

            // API 호출 후 결과 예시
            const mockResult = '서울특별시 강남구 테헤란로 419';
            onLocationSelect(mockResult);
            setSearchText('');
        } catch (error) {
            console.error('주소 검색 실패:', error);
            // TODO: 에러 처리
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="* 위치"
                    placeholderTextColor="#8F9BB3"
                    value={value || searchText}
                    onChangeText={setSearchText}
                />
                <TouchableOpacity
                    style={styles.searchButton}
                    onPress={handleSearch}
                >
                    <Text style={styles.searchButtonText}>주소 검색</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#E4E9F2',
        borderRadius: 8,
        padding: 12,
    },
    searchButton: {
        backgroundColor: '#735BF2',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    searchButtonText: {
        color: 'white',
        fontSize: 14,
        fontWeight: '600',
    },
});
