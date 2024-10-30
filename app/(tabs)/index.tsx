import { GestureHandlerRootView, Swipeable } from 'react-native-gesture-handler';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity, Alert } from "react-native";
import React, { useState } from "react";
import CustomCalendar from "@/app/components/timeline/CustomCalendar";
import FloatingActionButton from "@/app/components/community/FloatingActionButton";
import { useFocusEffect } from "@react-navigation/native";
import TimelineWriteModal from "@/app/components/timeline/TimelineWriteModal";
import TimeLineCard from "@/app/components/common/TimeLineCard";

export default function Index() {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const swipeableRefs = React.useRef<(Swipeable | null)[]>([]);
    const dummyTimelinePosts = [
        {
            id: 1,
            title: "손상원 클라이밍 판교점",
            subtitle: "엄청 다이나믹한 암장이었다 (사실 이지 브로)",
            date: "2024-10-04",
            imageUrl: require("@/assets/images/climbing.png"),
            color: '#735BF2'
        },
        {
            id: 2,
            title: "손상원 클라이밍 판교점",
            subtitle: "오늘은 좀 힘들었다.",
            date: "2024-10-05",
            imageUrl: require("@/assets/images/climbing.png"),
            color: '#E31A1A'
        },
        {
            id: 3,
            title: "손상원 클라이밍 분당점",
            subtitle: "오늘은 아쉬웠다.",
            date: "2024-10-15",
            imageUrl: require("@/assets/images/climbing.png"),
            color: '#E31A1A'
        },
    ];
    
    // 실제 API 연동 시 사용할 posts state
    const [posts, setPosts] = useState(dummyTimelinePosts);

    // API 호출 함수 (현재는 더미데이터 사용)
    const fetchPosts = async () => {
        try {
            // TODO: API 구현 후 실제 API 호출로 대체
            // const response = await axios.get('/api/posts');
            // setPosts(response.data);
            setPosts(dummyTimelinePosts);
        } catch (error) {
            console.error('Failed to fetch posts:', error);
        }
    };

    // 삭제 API 호출 함수
    const deletePost = async (id: number) => {
        try {
            // TODO: API 구현 후 실제 API 호출로 대체
            // await axios.delete(`/api/posts/${id}`);
            console.log('삭제할 카드 ID:', id);
            setPosts(prev => prev.filter(post => post.id !== id));
        } catch (error) {
            console.error('Failed to delete post:', error);
            alert('삭제에 실패했습니다. 다시 시도해주세요.');
        }
    };

    // 외부 영역 클릭 시 모든 스와이프 닫기
    const handleOutsidePress = () => {
        swipeableRefs.current.forEach((ref) => {
            if (ref) {
                ref.close();
            }
        });
    };

    useFocusEffect(
        React.useCallback(() => {
            setIsModalVisible(false);
            fetchPosts(); // 화면 진입 시 posts 데이터 가져오기
        }, [])
    );

    const renderRightActions = (id: number) => () => (
        <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => {
                Alert.alert(
                    "삭제 확인",
                    "활동 기록을 삭제하시겠습니까?",
                    [
                        {
                            text: "취소",
                            style: "cancel"
                        },
                        {
                            text: "삭제",
                            onPress: () => deletePost(id),
                            style: "destructive"
                        }
                    ]
                );
            }}
        >
            <Text style={styles.deleteButtonText}>삭제</Text>
        </TouchableOpacity>
    );

    const formatDateForDisplay = (date: string) => {
        return date.replace(/-/g, '. ') + '.';
    };

    const activeMarkedDates = posts.reduce((acc, post) => ({
        ...acc,
        [post.date]: {
            customStyles: {
                container: {
                    borderBottomWidth: 2,
                    borderBottomColor: '#735BF2',
                }
            }
        }
    }), {});

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <View style={styles.container}>
                <TouchableOpacity
                    activeOpacity={1}
                    style={{ flex: 1 }}
                    onPress={handleOutsidePress}
                >
                    <ScrollView
                        style={styles.scrollView}
                        onScrollBeginDrag={handleOutsidePress}
                    >
                        <CustomCalendar markedDates={activeMarkedDates} />
                        {posts.map((post, index) => (
                            <Swipeable
                                key={post.id}
                                ref={ref => {
                                    swipeableRefs.current[index] = ref;
                                }}
                                containerStyle={{margin: 0, padding: 0}}
                                renderRightActions={renderRightActions(post.id)}
                                friction={2}
                                overshootFriction={8}
                            >
                                <TouchableOpacity
                                    activeOpacity={1}
                                    onPress={(e) => {
                                        e.stopPropagation();
                                    }}
                                >
                                    <View style={styles.cardsContainer}>
                                        <TimeLineCard
                                            post={{
                                                ...post,
                                                date: formatDateForDisplay(post.date)
                                            }}
                                        />
                                    </View>
                                </TouchableOpacity>
                            </Swipeable>
                        ))}
                    </ScrollView>
                    <FloatingActionButton onPress={() => setIsModalVisible(true)} />
                    <TimelineWriteModal
                        visible={isModalVisible}
                        onClose={() => setIsModalVisible(false)}
                    />
                </TouchableOpacity>
            </View>
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingTop: 0,
        flex: 1,
        paddingBottom: 0,
        backgroundColor: 'white',
    },
    scrollView: {
        flex: 1,
    },
    cardsContainer: {
        paddingTop: 16,
        paddingHorizontal: 16,
        paddingBottom: 0
    },
    deleteButton: {
        backgroundColor: '#E31A1A',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 12,
        width: 76,
        margin: 16,
        marginLeft: 0,
        marginBottom: 20
    },
    deleteButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});
