import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ImageSourcePropType } from 'react-native';
import Dot from './Dot';

type TimelinePost = {
    id: number;
    title: string;
    subtitle: string;
    date: string;
    author?: string; // ?로 필수가 아닌 선택사항으로 받을 수 있다.
    imageUrl: ImageSourcePropType;
    color: string;
};

type TimeLineCardProps = {
    post: TimelinePost;
};

export default function TimeLineCard({ post }: TimeLineCardProps) {
    return (
        <TouchableOpacity style={styles.postCard} onPress={() => {}}>
            <View style={styles.postHeader}>
                <View style={styles.dateContainer}>
                    <Dot color={post.color} />
                    <Text style={styles.date}>{post.date}</Text>
                </View>
                <Text style={styles.author}>{post.author}</Text>
            </View>
            <View style={styles.textContainer}>
                <Text style={styles.title}>{post.title}</Text>
                <Text style={styles.subtitle}>{post.subtitle}</Text>
            </View>
            <Image
                source={post.imageUrl}
                style={styles.image}
                resizeMode="cover"
            />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    scrollView: {
        flex: 1,
    },
    timelineContainer: {
        padding: 16,
    },
    postCard: {
        marginBottom: 20,
        backgroundColor: 'white',
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 2,
    },
    postHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
    },
    dateContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    date: {
        fontSize: 14,
    },
    author: {
        fontSize: 14,
        color: '#8F9BB3',
        fontWeight: '500',
    },
    contentContainer: {
        paddingHorizontal: 16,
        paddingBottom: 16,
    },
    textContainer: {
        paddingHorizontal: 16,
        paddingBottom: 0,
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 8,
        color: '#1A1F36',
    },
    subtitle: {
        fontSize: 14,
        color: '#8F9BB3',
        marginBottom: 12,
    },
    image: {
        width: '100%',
        height: 150,
        borderRadius: 8,
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
    },
});
