import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

interface PostAuthorProps {
    authorName: string;         // 필수
    authorImage?: string;       // 선택
    instagram?: string;         // 선택
}

export default function PostAuthor({ authorName, authorImage, instagram }: PostAuthorProps) {
    return (
        <View style={styles.authorContainer}>
            <Image
                // source={authorImage
                //     ? { uri: authorImage }
                //     : require('@/assets/images/default-profile.png')  // 기본 프로필 이미지
                // }
                source={require('@/assets/images/default-profile.png')}
                style={styles.authorImage}
            />
            <View style={styles.authorInfo}>
                <Text style={styles.authorName}>{authorName}</Text>
                {instagram && (
                    <View style={styles.instagramContainer}>
                        <Text style={styles.instagramHandle}>@{instagram}</Text>
                    </View>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    authorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: 'white',
    },
    authorImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 12,
        backgroundColor: '#f5f5f5', // 이미지 로드 전 배경색
    },
    authorInfo: {
        flex: 1,
    },
    authorName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    instagramContainer: {
        marginTop: 4,
    },
    instagramHandle: {
        fontSize: 14,
        color: '#666',
    },
});
