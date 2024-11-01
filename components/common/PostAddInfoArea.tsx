import React from 'react';
import { Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface FormInputProps {
    value: string;
    placeholder: string;
    onChangeText?: (text: string) => void;
    onPress?: () => void;
    iconName?: keyof typeof Ionicons.glyphMap;
    editable?: boolean;
}

export default function PostAddInfoArea({
                                            value,
                                            placeholder,
                                            onChangeText,
                                            onPress,
                                            iconName,
                                            editable = true
                                        }: FormInputProps) {
    if (onPress) {
        return (
            <TouchableOpacity style={styles.input} onPress={onPress}>
                <Text style={[styles.inputText, value ? styles.filledInput : {}]}>
                    {value || placeholder}
                </Text>
                {iconName && <Ionicons name={iconName} size={20} color="#8F9BB3" />}
            </TouchableOpacity>
        );
    }

    return (
        <TextInput
            style={styles.input}
            placeholder={placeholder}
            placeholderTextColor="#8F9BB3"
            value={value}
            onChangeText={onChangeText}
            editable={editable}
        />
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
    },
    filledInput: {
        color: '#000',
    },
});
