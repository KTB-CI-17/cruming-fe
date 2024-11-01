import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// 화면 너비에서 마진을 뺀 값 계산
const screenWidth = Dimensions.get('window').width;
const imageMargin = 20;
const imageWidth = screenWidth - (imageMargin * 2);

interface PostContentProps {
    image?: string;
    content: string;    // content는 필수
    location?: string;  // location은 선택
    level?: number;
    title?: string;
}

export default function PostContent({ image, content, location, level, title }: PostContentProps) {
    const hasLocationInfo = location || level;

    return (
        <View style={styles.container}>
            {title && <Text style={styles.title}>{title}</Text>}

            {hasLocationInfo && (
                <View style={styles.locationContainer}>
                    {location && (
                        <View style={styles.infoItem}>
                            <Ionicons name="location-outline" size={20} color="black" />
                            <Text style={styles.locationText}>{location}</Text>
                        </View>
                    )}
                    {level && (
                        <View style={styles.levelContainer}>
                            <Text style={styles.levelText}>LV. {level}</Text>
                        </View>
                    )}
                </View>
            )}

            {image && (
                <View style={styles.imageContainer}>
                    <Image
                        source={{ uri: image }}
                        style={styles.postImage}
                        resizeMode="contain"
                    />
                </View>
            )}

            <Text style={[
                styles.content,
                !image && styles.contentWithoutImage
            ]}>
                {content}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        padding: 16,
        paddingBottom: 8,
    },
    locationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingBottom: 12,
    },
    infoItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    locationText: {
        marginLeft: 4,
        fontSize: 14,
    },
    levelContainer: {
        backgroundColor: '#f0f0f0',
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 4,
    },
    levelText: {
        fontSize: 14,
    },
    imageContainer: {
        marginHorizontal: 20,
        marginVertical: 20,
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
    },
    postImage: {
        width: imageWidth,
        height: undefined,
        aspectRatio: 1,  // 기본값으로 1:1 비율 설정
        backgroundColor: '#f5f5f5',
    },
    content: {
        padding: 16,
        fontSize: 16,
        lineHeight: 24,
    },
    contentWithoutImage: {
        paddingTop: 20,
    }
});
