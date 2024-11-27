import React from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ImageBase from './ImageBase';

interface ImageThumbnailProps {
    uri: string;
    size?: number;
    onRemove?: () => void;
    onPress?: () => void;
    onRetry?: () => void;
}

export default function ImageThumbnail({
                                           uri,
                                           size = 100,
                                           onRemove,
                                           onPress,
                                           onRetry,
                                       }: ImageThumbnailProps) {
    return (
        <View style={[styles.container, { width: size, height: size }]}>
            {onPress ? (
                <TouchableOpacity onPress={onPress} style={styles.imageContainer}>
                    <ImageBase
                        source={{ uri }}
                        style={styles.image}
                        onRetry={onRetry}
                    />
                </TouchableOpacity>
            ) : (
                <View style={styles.imageContainer}>
                    <ImageBase
                        source={{ uri }}
                        style={styles.image}
                        onRetry={onRetry}
                    />
                </View>
            )}

            {onRemove && (
                <TouchableOpacity
                    style={styles.removeButton}
                    onPress={onRemove}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                    <Ionicons name="close-circle" size={24} color="#735BF2" />
                </TouchableOpacity>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        marginRight: 12,
    },
    imageContainer: {
        width: '100%',
        height: '100%',
        borderRadius: 8,
        overflow: 'hidden',
    },
    image: {
        borderRadius: 8,
    },
    removeButton: {
        position: 'absolute',
        top: -8,
        right: -8,
        backgroundColor: 'white',
        borderRadius: 12,
        zIndex: 1,
    },
});