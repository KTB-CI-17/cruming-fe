import { View, StyleSheet, ScrollView } from "react-native";
import PostCard from "@/app/components/community/PostCard";
import SearchBar from "@/app/components/common/SearchBar";
import React from "react";

const dummyPosts = [
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

export default function PostCardList() {
    return (
        <View style={styles.container}>
            <SearchBar />
            <ScrollView style={styles.scrollView}>
                <View style={styles.postsContainer}>
                    {dummyPosts.map((post) => (
                        <PostCard key={post.id} post={post} />
                    ))}
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
    },
    scrollView: {
    },
    postsContainer: {
        paddingHorizontal: 16,
    },
});
