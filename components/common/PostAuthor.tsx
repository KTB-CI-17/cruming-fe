import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {router} from "expo-router";

interface PostAuthorProps {
    authorName: string;
    authorImage?: string;
    instagram?: string;
    userId: number;
}

export default function PostAuthor({ authorName, authorImage, instagram, userId }: PostAuthorProps) {
    const navigation = useNavigation();

    const handleProfilePress = () => {
        router.push(`/profile/${userId}`);
    };

    return (
        <TouchableOpacity
            onPress={handleProfilePress}
            style={styles.authorContainer}
        >
            <Image
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
        </TouchableOpacity>
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
