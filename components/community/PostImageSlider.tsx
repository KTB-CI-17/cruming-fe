import React from 'react';
import { View, ScrollView, Image, ActivityIndicator, StyleSheet, Dimensions } from 'react-native';
import { File } from '@/api/types/community/post';

const { width } = Dimensions.get('window');

interface PostImageSliderProps {
    files: File[];
    imagesCache: { [key: string]: string };
    currentImageIndex: number;
    onImageIndexChange: (index: number) => void;
}

export default function PostImageSlider({
                                            files,
                                            imagesCache,
                                            currentImageIndex,
                                            onImageIndexChange
                                        }: PostImageSliderProps) {
    return (
        <View style={styles.container}>
            <ScrollView
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onScroll={e => {
                    const offsetX = e.nativeEvent.contentOffset.x;
                    const index = Math.round(offsetX / width);
                    onImageIndexChange(index);
                }}
                scrollEventThrottle={16}
            >
                {files.map((file) => (
                    <View key={file.id} style={styles.imageContainer}>
                        {imagesCache[file.url] ? (
                            <Image source={{ uri: imagesCache[file.url] }} style={styles.image} />
                        ) : (
                            <ActivityIndicator style={styles.image} />
                        )}
                    </View>
                ))}
            </ScrollView>

            {files.length > 1 && (
                <View style={styles.pagination}>
                    {files.map((_, index) => (
                        <View
                            key={index}
                            style={[
                                styles.paginationDot,
                                currentImageIndex === index && styles.paginationDotActive
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
        borderBottomWidth: 0,
        marginBottom: 30
    },
    imageContainer: {
        width: width,
        height: width,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: width,
        height: width,
    },
    pagination: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 6,
        marginTop: 8,
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