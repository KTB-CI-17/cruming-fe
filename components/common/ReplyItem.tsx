import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

interface ReplyItemProps {
    authorName: string;
    content: string;
    createdAt: string;
    authorImage?: string;  // 프로필 이미지는 선택적으로 받음
}

export default function ReplyItem({
                                      authorName,
                                      content,
                                      createdAt,
                                      authorImage
                                  }: ReplyItemProps) {
    return (
        <View style={styles.container}>
            <View style={styles.profileContainer}>
                {authorImage ? (
                    <Image
                        source={{ uri: authorImage }}
                        style={styles.profileImage}
                    />
                ) : (
                    <View style={styles.profileImagePlaceholder}>
                        <Text style={styles.profileImageText}>
                            {authorName.charAt(0)}
                        </Text>
                    </View>
                )}
            </View>
            <View style={styles.contentContainer}>
                <View style={styles.header}>
                    <Text style={styles.authorName}>{authorName}</Text>
                    <Text style={styles.createdAt}>{createdAt}</Text>
                </View>
                <Text style={styles.content}>{content}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
        backgroundColor: 'white',
    },
    profileContainer: {
        marginRight: 12,
    },
    profileImage: {
        width: 36,
        height: 36,
        borderRadius: 18,
    },
    profileImagePlaceholder: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#e1e1e1',
        justifyContent: 'center',
        alignItems: 'center',
    },
    profileImageText: {
        fontSize: 16,
        color: '#666',
        fontWeight: '600',
    },
    contentContainer: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    authorName: {
        fontSize: 14,
        fontWeight: '600',
        color: '#000',
    },
    createdAt: {
        fontSize: 12,
        color: '#666',
    },
    content: {
        fontSize: 14,
        color: '#333',
        lineHeight: 20,
    },
});
