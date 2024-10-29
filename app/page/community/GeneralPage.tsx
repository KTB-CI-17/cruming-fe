import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import FloatingActionButton from '@/app/components/community/FloatingActionButton';
import SearchBar from "@/app/components/common/SearchBar";

type PostItem = {
    id: number;
    title: string;
    date: string;
    isNew?: boolean;
    isHot?: boolean;
};

const dummyPosts: PostItem[] = [
    {
        id: 1,
        title: "암장 민페 썰",
        date: "2024. 10. 08.",
        isHot: true
    },
    {
        id: 2,
        title: "소개팅 가는데 옷 추천 좀..",
        date: "2024. 10. 07.",
        isHot: true
    },
    {
        id: 3,
        title: "안녕하세요!",
        date: "2024. 10. 27.",
        isNew: true
    },
    {
        id: 4,
        title: "내일 일 가기 싫다..",
        date: "2024. 10. 27.",
        isNew: true
    },
    {
        id: 5,
        title: "집에 가고싶다.",
        date: "2024. 09. 11.",
    },
    {
        id: 6,
        title: "집에 가고싶다.",
        date: "2024. 09. 11.",
    },
    {
        id: 7,
        title: "집에 가고싶다.",
        date: "2024. 09. 11.",
    },
    {
        id: 8,
        title: "집에 가고싶다.",
        date: "2024. 09. 11.",
    },
    {
        id: 9,
        title: "집에 가고싶다.",
        date: "2024. 09. 11.",
    },
    {
        id: 10,
        title: "집에 가고싶다.",
        date: "2024. 09. 11.",
    },
    {
        id: 11,
        title: "집에 가고싶다.",
        date: "2024. 09. 11.",
    },
    {
        id: 12,
        title: "집에 가고싶다.",
        date: "2024. 09. 11.",
    },
    {
        id: 13,
        title: "집에 가고싶다.",
        date: "2024. 09. 11.",
    },
];

export default function GeneralPage() {
    const renderPostItem = (item: PostItem) => (
        <TouchableOpacity
            key={item.id}
            style={styles.postItem}
            onPress={() => {/* 게시글 상세페이지로 이동 */}}
        >
            <View style={styles.postContent}>
                <View style={styles.titleContainer}>
                    {item.isHot && (
                        <View style={styles.hotBadge}>
                            <Text style={styles.badgeText}>🔥</Text>
                        </View>
                    )}
                    {item.isNew && (
                        <View style={styles.newBadge}>
                            <Text style={styles.newBadgeText}>NEW</Text>
                        </View>
                    )}
                    <Text style={styles.title}>{item.title}</Text>
                </View>
                <Text style={styles.date}>{item.date}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <SearchBar />
            <ScrollView style={styles.scrollView}>
                <View style={styles.postsContainer}>
                    {dummyPosts.map(renderPostItem)}
                </View>
            </ScrollView>
            <FloatingActionButton />
        </View>
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
    postsContainer: {
        paddingHorizontal: 16,
    },
    postItem: {
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    postContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        marginRight: 8,
    },
    title: {
        fontSize: 16,
        color: '#1A1F36',
        marginRight: 8,
    },
    date: {
        fontSize: 14,
        color: '#8F9BB3',
    },
    hotBadge: {
        marginRight: 8,
    },
    badgeText: {
        fontSize: 16,
    },
    newBadge: {
        backgroundColor: '#735BF2',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
        marginRight: 8,
    },
    newBadgeText: {
        color: 'white',
        fontSize: 12,
        fontWeight: '600',
    }
});
