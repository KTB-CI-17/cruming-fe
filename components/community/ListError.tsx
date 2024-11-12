import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';

interface ListErrorProps {
    onRetry: () => void;
    errorMessage: string;
}

export default function ListError({ onRetry, errorMessage }: ListErrorProps) {
    return (
        <View style={styles.container}>
            <Text style={styles.errorText}>{errorMessage}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
                <Text style={styles.retryButtonText}>새로고침</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    errorText: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
        lineHeight: 24,
        color: '#666',
    },
    retryButton: {
        backgroundColor: '#735BF2',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
    },
    retryButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
});