import TimeLineCard from "@/components/common/TimeLineCard";
import {StyleSheet, View} from "react-native";
import React from "react";

const dummyTimelinePosts = [
    {
        id: 1,
        title: "손상원 클라이밍 판교점",
        subtitle: "엄청 다이나믹한 암장이었다 (사실 이지 브로)",
        date: "2024. 10. 08.",
        imageUrl: require("@/assets/images/climbing.png"),
        color: '#735BF2'
    },
    {
        id: 2,
        title: "손상원 클라이밍 판교점",
        subtitle: "오늘은 좀 힘들었다.",
        date: "2024. 10. 08.",
        imageUrl: require("@/assets/images/climbing.png"),
        color: '#E31A1A'
    },
    {
        id: 3,
        title: "손상원 클라이밍 분당점",
        subtitle: "오늘은 아쉬웠다.",
        date: "2024. 09. 08.",
        imageUrl: require("@/assets/images/climbing.png"),
        color: '#E31A1A'
    },
];



export default function Timeline() {
    return (<View style={styles.cardsContainer}>
        {dummyTimelinePosts.map((post) => (
            <TimeLineCard key={post.id} post={post}/>
        ))}
    </View>);
};

const styles = StyleSheet.create({
    cardsContainer: {
        padding: 16,
    },
});
