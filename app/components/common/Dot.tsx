import React from 'react';
import { View, StyleSheet } from 'react-native';

type DotProps = {
    color: string;
};

export default function Dot({ color }: DotProps) {
    return (
        <View style={[styles.dot, { borderColor: color }]} />
    );
}

const styles = StyleSheet.create({
    dot: {
        width: 12,
        height: 12,
        borderRadius: 8,
        marginRight: 8,
        borderWidth: 3,
        backgroundColor: 'transparent',
    },
});
