import React, { useState } from 'react';
import { View, ScrollView, Dimensions, StyleSheet } from 'react-native';
import { File } from '@/api/types/community/post';
import ImageBase from "@/components/image/ImageBase";

const { width } = Dimensions.get('window');

interface PostImageSliderProps {
    files: File[];
    imagesCache: { [key: string]: string };
    onImageIndexChange: (index: number) => void;
}

export default function PostImageSlider({
                                            files,
                                            imagesCache,
                                            onImageIndexChange
                                        }: PostImageSliderProps) {
    const [currentIndex, setCurrentIndex] = useState(0);

    // 이미지나 캐시가 없으면 렌더링하지 않음
    if (files.length === 0) return null;

    const cachedImages = files
        .map(file => imagesCache[file.url])
        .filter((url): url is string => url != null);

    if (cachedImages.length === 0) return null;

    const handleScroll = (event: any) => {
        const offsetX = event.nativeEvent.contentOffset.x;
        const index = Math.round(offsetX / width);
        if (currentIndex !== index) {
            setCurrentIndex(index);
            onImageIndexChange(index);
        }
    };

    return (
        <View style={styles.container}>
            <ScrollView
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onScroll={handleScroll}
                scrollEventThrottle={16}
            >
                {cachedImages.map((uri, index) => (
                    <View key={index} style={styles.imageContainer}>
                        <ImageBase
                            source={{ uri }}
                            style={styles.image}
                            resizeMode="contain"
                        />
                    </View>
                ))}
            </ScrollView>

            {cachedImages.length > 1 && (
                <View style={styles.pagination}>
                    {cachedImages.map((_, index) => (
                        <View
                            key={index}
                            style={[
                                styles.paginationDot,
                                currentIndex === index && styles.paginationDotActive
                            ]}
                        />
                    ))}
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: width,
        marginBottom: 30
    },
    imageContainer: {
        width: width,
        height: width,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    pagination: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: 16,
        left: 0,
        right: 0,
        gap: 6,
    },
    paginationDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#D9D9D9',
    },
    paginationDotActive: {
        backgroundColor: '#666',
    },
});