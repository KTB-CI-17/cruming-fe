// timeline/index.tsx
import { View, StyleSheet, ScrollView, ActionSheetIOS, Platform, Alert, Modal, TouchableOpacity, Text } from "react-native";
import React, { useState } from "react";
import CustomCalendar from "@/components/timeline/CustomCalendar";
import AddTimelineButton from "@/components/timeline/AddTimelineButton";
import { useFocusEffect } from "@react-navigation/native";
import TimelineWriteModal from "@/components/timeline/TimelineWriteModal";
import TimeLineCard from "@/components/common/TimeLineCard";

export default function Index() {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isOptionsVisible, setIsOptionsVisible] = useState(false);
    const [selectedPostId, setSelectedPostId] = useState<number | null>(null);

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

    const [posts, setPosts] = useState(dummyTimelinePosts);

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

    const deletePost = async (id: number) => {
        try {
            // TODO: API 구현 후 실제 API 호출로 대체
            // await axios.delete(`/api/posts/${id}`);
            console.log('삭제할 카드 ID:', id);
            setPosts(prev => prev.filter(post => post.id !== id));
        } catch (error) {
            console.error('Failed to delete post:', error);
            Alert.alert('오류', '삭제에 실패했습니다. 다시 시도해주세요.');
        }
    };

    const handlePostAction = (id: number, action: 'delete' | 'edit') => {
        setIsOptionsVisible(false);
        if (action === 'delete') {
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
        } else if (action === 'edit') {
            console.log('수정할 카드 ID:', id);
            // TODO: 수정 기능 구현
        }
    };

    useFocusEffect(
        React.useCallback(() => {
            setIsModalVisible(false);
            fetchPosts();
        }, [])
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

    const showPostOptions = (postId: number) => {
        if (Platform.OS === 'ios') {
            ActionSheetIOS.showActionSheetWithOptions(
                {
                    options: ["취소", "수정", "삭제"],
                    cancelButtonIndex: 0,
                    destructiveButtonIndex: 2,
                },
                (buttonIndex) => {
                    if (buttonIndex === 1) {
                        handlePostAction(postId, 'edit');
                    } else if (buttonIndex === 2) {
                        handlePostAction(postId, 'delete');
                    }
                }
            );
        } else {
            setSelectedPostId(postId);
            setIsOptionsVisible(true);
        }
    };

    return (
        <View style={styles.container}>
            <ScrollView style={styles.scrollView}>
                <CustomCalendar markedDates={activeMarkedDates} />
                {posts.map((post) => (
                    <View key={post.id} style={styles.cardsContainer}>
                        <TimeLineCard
                            post={{
                                ...post,
                                date: formatDateForDisplay(post.date)
                            }}
                            onOptionsPress={() => showPostOptions(post.id)}
                        />
                    </View>
                ))}
            </ScrollView>
            <AddTimelineButton onPress={() => setIsModalVisible(true)} />
            <TimelineWriteModal
                visible={isModalVisible}
                onClose={() => setIsModalVisible(false)}
            />

            {/* Android 옵션 모달 */}
            {Platform.OS === 'android' && (
                <Modal
                    visible={isOptionsVisible}
                    transparent
                    animationType="slide"
                    onRequestClose={() => setIsOptionsVisible(false)}
                >
                    <TouchableOpacity
                        style={styles.modalOverlay}
                        activeOpacity={1}
                        onPress={() => setIsOptionsVisible(false)}
                    >
                        <View style={styles.bottomSheet}>
                            <TouchableOpacity
                                style={styles.optionButton}
                                onPress={() => selectedPostId && handlePostAction(selectedPostId, 'edit')}
                            >
                                <Text style={styles.optionText}>수정</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.optionButton, styles.deleteOption]}
                                onPress={() => selectedPostId && handlePostAction(selectedPostId, 'delete')}
                            >
                                <Text style={styles.deleteText}>삭제</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.optionButton, styles.cancelOption]}
                                onPress={() => setIsOptionsVisible(false)}
                            >
                                <Text style={styles.optionText}>취소</Text>
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                </Modal>
            )}
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
    cardsContainer: {
        paddingTop: 16,
        paddingHorizontal: 16,
        paddingBottom: 0
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        justifyContent: 'flex-end',
    },
    bottomSheet: {
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingVertical: 20,
        paddingHorizontal: 16,
    },
    optionButton: {
        paddingVertical: 15,
        alignItems: 'center',
        borderRadius: 8,
        marginBottom: 8,
    },
    optionText: {
        fontSize: 16,
        color: '#1A1F36',
    },
    deleteOption: {
        backgroundColor: '#FFF1F1',
    },
    deleteText: {
        fontSize: 16,
        color: '#E31A1A',
    },
    cancelOption: {
        backgroundColor: '#F7F8FA',
        marginTop: 8,
    },
});
