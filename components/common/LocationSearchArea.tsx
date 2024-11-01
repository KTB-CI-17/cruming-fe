import React, { useState } from 'react';
import {
    View,
    TextInput,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface LocationSearchProps {
    value: string;
    onLocationSelect: (location: string) => void;
}

export default function LocationSearch({ value, onLocationSelect }: LocationSearchProps) {
    const [searchText, setSearchText] = useState(value);

    const handleTextChange = (text: string) => {
        setSearchText(text);
        onLocationSelect(text);
    };

    return (
        <View style={styles.container}>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="* 위치"
                    placeholderTextColor="#8F9BB3"
                    value={searchText}
                    onChangeText={handleTextChange}
                />
                <TouchableOpacity style={styles.searchIconButton}>
                    <Ionicons name="search" size={18} color="#8F9BB3" />
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
        position: 'relative',
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#E4E9F2',
        borderRadius: 8,
        padding: 12,
        paddingRight: 40, // 돋보기 아이콘을 위한 여백
    },
    searchIconButton: {
        position: 'absolute',
        right: 8,
        padding: 4,
    },
});
