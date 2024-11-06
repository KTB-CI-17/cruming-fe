import { View, StyleSheet, FlatList, ActionSheetIOS, Platform, Alert, Modal, TouchableOpacity, Text, ActivityIndicator } from "react-native";
import React, { useState, useCallback } from "react";
import CustomCalendar from "@/components/timeline/CustomCalendar";
import AddTimelineButton from "@/components/timeline/AddTimelineButton";
import { useFocusEffect } from "@react-navigation/native";
import TimelineWriteModal from "@/components/timeline/TimelineWriteModal";
import TimelineCard from "@/components/common/TimeLineCard";

interface Post {
    id: number;
    title: string;
    subtitle: string;
    date: string;
    imageUrl: any;
    color: string;
}

interface APIResponse {
    posts: Post[];
    meta: {
        currentPage: number;
        totalPages: number;
        hasMore: boolean;
    };
}

export default function Index() {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isOptionsVisible, setIsOptionsVisible] = useState(false);
    const [selectedPostId, setSelectedPostId] = useState<number | null>(null);
    const [posts, setPosts] = useState<Post[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);

    // 더미 API 응답 생성 함수
    const getDummyAPIResponse = (page: number): APIResponse => {
        const dummyData = [
            {
                title: "손상원 클라이밍 판교점",
                subtitle: "오버행이 많아서 팔이 터질 것 같았다",
                color: '#735BF2',
                locations: ["판교", "강남", "역삼", "분당", "영등포"]
            },
            {
                title: "더클라이밍 강남점",
                subtitle: "슬랩이 많아서 발이 아프다",
                color: '#E31A1A',
                locations: ["강남", "신사", "압구정", "청담", "삼성"]
            },
            {
                title: "클라이밍파크",
                subtitle: "볼더링 루트가 재미있었다",
                color: '#00A3FF',
                locations: ["홍대", "합정", "상수", "망원", "연남"]
            }
        ];

        // 각 페이지당 10개의 포스트 생성
        const startIndex = (page - 1) * 10;
        const postsForPage = Array(10).fill(null).map((_, index) => {
            const postIndex = (startIndex + index) % dummyData.length;
            const dummyItem = dummyData[postIndex];

            // 날짜 생성 (최근 30일 내에서 랜덤하게)
            const today = new Date();
            const randomDays = Math.floor(Math.random() * 30);
            const postDate = new Date(today);
            postDate.setDate(postDate.getDate() - randomDays);

            const formattedDate = postDate.toISOString().split('T')[0];

            // 위치 랜덤 선택
            const locationIndex = Math.floor(Math.random() * dummyItem.locations.length);
            const location = dummyItem.locations[locationIndex];

            return {
                id: startIndex + index + 1,
                title: `${dummyItem.title} ${location}점`,
                subtitle: `${dummyItem.subtitle} (난이도: ${Math.floor(Math.random() * 3) + 3}단)`,
                date: formattedDate,
                imageUrl: require("@/assets/images/climbing.png"),
                color: dummyItem.color
            };
        });

        return {
            posts: postsForPage,
            meta: {
                currentPage: page,
                totalPages: 5,
                hasMore: page < 5
            }
        };
    };

    const fetchPosts = async (page: number = 1, isRefresh: boolean = false) => {
        if (isLoading || (!hasMore && !isRefresh)) return;

        try {
            setIsLoading(true);
            // TODO: 실제 API 호출로 대체
            // const response = await axios.get(`/api/posts?page=${page}&limit=10`);
            const response = getDummyAPIResponse(page);

            if (isRefresh) {
                setPosts(response.posts);
            } else {
                setPosts(prev => [...prev, ...response.posts]);
            }

            setCurrentPage(page);
            setHasMore(response.meta.hasMore);
        } catch (error) {
            console.error('Failed to fetch posts:', error);
            Alert.alert('오류', '데이터를 불러오는데 실패했습니다.');
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    };

    const handleRefresh = () => {
        setIsRefreshing(true);
        setHasMore(true);
        setCurrentPage(1);
        fetchPosts(1, true);
    };

    const handleLoadMore = () => {
        if (!isLoading && hasMore) {
            fetchPosts(currentPage + 1);
        }
    };

    const deletePost = async (id: number) => {
        try {
            // TODO: API 구현 후 실제 API 호출로 대체
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
        }
    };

    useFocusEffect(
        useCallback(() => {
            setIsModalVisible(false);
            handleRefresh();
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

    const renderItem = ({ item }: { item: Post }) => (
        <View style={styles.cardsContainer}>
            <TimelineCard
                post={{
                    ...item,
                    date: formatDateForDisplay(item.date)
                }}
                showOptions={true}
                onOptionsPress={() => showPostOptions(item.id)}
            />
        </View>
    );

    const renderHeader = () => (
        <CustomCalendar markedDates={activeMarkedDates} />
    );

    const renderFooter = () => {
        if (!isLoading) return null;
        return (
            <View style={styles.loadingFooter}>
                <ActivityIndicator size="small" color="#735BF2" />
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={posts}
                renderItem={renderItem}
                keyExtractor={item => item.id.toString()}
                ListHeaderComponent={renderHeader}
                ListFooterComponent={renderFooter}
                onRefresh={handleRefresh}
                refreshing={isRefreshing}
                onEndReached={handleLoadMore}
                onEndReachedThreshold={0.5}
                contentContainerStyle={styles.flatListContent}
            />

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
    flatListContent: {
        flexGrow: 1,
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
    loadingFooter: {
        paddingVertical: 20,
        alignItems: 'center',
    },
});
