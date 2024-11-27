import React, { useState } from 'react';
import { Image, ImageProps, ActivityIndicator, TouchableOpacity, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ImageLoadingState } from '@/api/types/image';

interface ImageBaseProps extends Omit<ImageProps, 'onError' | 'onLoad'> {
    onRetry?: () => void;
    showLoader?: boolean;
}

export default function ImageBase({
                                      source,
                                      style,
                                      onRetry,
                                      showLoader = true,
                                      ...props
                                  }: ImageBaseProps) {
    const [loadingState, setLoadingState] = useState<ImageLoadingState>('idle');

    return (
        <View style={[styles.container, style]}>
            <Image
                {...props}
                source={source}
                style={[styles.image, loadingState === 'error' && styles.hiddenImage]}
                onLoadStart={() => setLoadingState('loading')}
                onLoadEnd={() => setLoadingState('success')}
                onError={() => setLoadingState('error')}
            />

            {loadingState === 'loading' && showLoader && (
                <View style={styles.loaderContainer}>
                    <ActivityIndicator size="large" color="#735BF2" />
                </View>
            )}

            {loadingState === 'error' && onRetry && (
                <TouchableOpacity
                    style={styles.errorContainer}
                    onPress={onRetry}
                >
                    <Ionicons name="reload" size={24} color="#735BF2" />
                </TouchableOpacity>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'relative',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    hiddenImage: {
        opacity: 0,
    },
    loaderContainer: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
    },
    errorContainer: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
    },
});