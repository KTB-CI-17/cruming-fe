import React from 'react';
import { View, StyleSheet } from 'react-native';

type DotProps = {
    color: string;
};

export default function Dot({ color }: DotProps) {
    const isWhite = color === '#FAFAFA';

    if (isWhite) {
        return (
            <View style={styles.container}>
                <View style={styles.outerCircle}>
                    <View style={styles.innerCircle} />
                </View>
            </View>
        );
    }

    return (
        <View style={[styles.dot, { borderColor: color }]} />
    );
}

const styles = StyleSheet.create({
    container: {
        marginRight: 8,
    },
    dot: {
        width: 12,
        height: 12,
        borderRadius: 8,
        marginRight: 8,
        borderWidth: 3,
        backgroundColor: 'transparent',
    },
    outerCircle: {
        width: 12,
        height: 12,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: '#8F9BB3',
        alignItems: 'center',
        justifyContent: 'center',
    },
    innerCircle: {
        width: 6,
        height: 6,
        borderRadius: 3,
        borderWidth: 1,
        borderColor: '#8F9BB3',
    },
});
