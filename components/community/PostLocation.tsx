import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface PostLocationProps {
    location?: string;
}

export default function PostLocation({ location }: PostLocationProps) {
    if (!location) return null;

    return (
        <View style={styles.container}>
            <Ionicons name="location-outline" size={18} color="#666666" />
            <Text style={styles.locationText} numberOfLines={1}>
                {location}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#f8f8f8',
        marginHorizontal: 16,
        marginBottom: 16,
        borderRadius: 8,
    },
    locationText: {
        flex: 1,
        fontSize: 14,
        color: '#333333',
        marginLeft: 8,
    },
});