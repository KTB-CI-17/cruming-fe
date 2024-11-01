// components/common/TimeLineCard.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ImageSourcePropType } from 'react-native';
import { useRouter } from 'expo-router';
import { MoreVertical } from 'lucide-react-native';
import Dot from './Dot';

type TimelinePost = {
    id: number;
    title: string;
    subtitle: string;
    date: string;
    author?: string;
    imageUrl: ImageSourcePropType;
    color: string;
};

type TimeLineCardProps = {
    post: TimelinePost;
    onOptionsPress: () => void;
};

export default function TimeLineCard({ post, onOptionsPress }: TimeLineCardProps) {
    const router = useRouter();

    const handlePress = () => {
        router.push(`/timeline/${post.id}`);
    };

    return (
        <TouchableOpacity
            style={styles.postCard}
            onPress={handlePress}
            activeOpacity={0.7}
        >
            <View style={styles.postHeader}>
                <View style={styles.dateContainer}>
                    <Dot color={post.color} />
                    <Text style={styles.date}>{post.date}</Text>
                </View>
                <TouchableOpacity
                    onPress={(e) => {
                        e.stopPropagation();
                        onOptionsPress();
                    }}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                    <MoreVertical size={20} color="#8F9BB3" />
                </TouchableOpacity>
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
