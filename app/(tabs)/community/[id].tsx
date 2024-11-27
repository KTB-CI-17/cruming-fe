import { useLocalSearchParams, Stack, router } from 'expo-router';
import {
    View, Text, StyleSheet, Alert, ActivityIndicator,
    ActionSheetIOS, KeyboardAvoidingView, Platform, TouchableOpacity,
    FlatList
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import React, { useState, useEffect, useRef } from 'react';
import { usePostService } from '@/api/services/community/usePostService';
import { useImageService } from '@/api/services/community/useImageService';
import {Post, Reply} from '@/api/types/community/post';
import { useReplyState } from '@/hooks/community/useReplyState';

import PostHeader from '@/components/community/PostHeader';
import PostImageSlider from '@/components/community/PostImageSlider';
import PostContent from '@/components/community/PostContent';
import PostActions from '@/components/community/PostActions';
import PostReply from '@/components/community/PostReply';
import PostReplyInput from '@/components/community/PostReplyInput';

type ListItem = {
    type: 'content' | 'replies';
};

export default function PostDetailPage() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const [post, setPost] = useState<Post | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [imagesCache, setImagesCache] = useState<{[key: string]: string}>({});
    const listRef = useRef<FlatList>(null);
    const [totalReplyCount, setTotalReplyCount] = useState(0);

    const fetchPost = async () => {
        try {
            setIsLoading(true);
            const data = await postService.fetchPost(id);
            setPost(data);
            const repliesResponse = await replyActions.fetchReplies();
            setTotalReplyCount(repliesResponse.totalElements);
        } catch (error) {
            setError("게시글을 불러오는데 실패했습니다.");
            Alert.alert("오류", "게시글을 불러오는데 실패했습니다.", [
                { text: "확인", onPress: () => router.back() }
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    const {
        state: replyState,
        actions: replyActions
    } = useReplyState(id);

    const postService = usePostService();
    const imageService = useImageService();

    const getSelectedReplyInfo = () => {
        if (!replyState.selectedReplyId) return null;
        return replyState.replies.reduce<Reply | null>((found, reply) => {
            if (found) return found;
            if (reply.id === replyState.selectedReplyId) return reply;
            if (reply.children) {
                const childReply = reply.children.find(child => child.id === replyState.selectedReplyId);
                if (childReply) return childReply;
            }
            return found;
        }, null);
    };

    const navigateToUserProfile = (userId: number) => {
        router.push(`/profile/${userId}`);
    };

    const showActionSheet = () => {
        ActionSheetIOS.showActionSheetWithOptions(
            {
                options: ['수정', '삭제', '취소'],
                cancelButtonIndex: 2,
                destructiveButtonIndex: 1,
            },
            (buttonIndex) => {
                if (buttonIndex === 0) {
                    handlePostAction(post!.id, 'edit');
                } else if (buttonIndex === 1) {
                    showDeleteConfirmation(post!.id);
                }
            }
        );
    };

    const showDeleteConfirmation = (postId: number) => {
        Alert.alert(
            '삭제 확인',
            '활동 기록을 삭제하시겠습니까?',
            [
                {
                    text: '취소',
                    style: 'cancel'
                },
                {
                    text: '삭제',
                    onPress: () => deletePost(postId),
                    style: 'destructive'
                }
            ]
        );
    };

    const deletePost = async (postId: number) => {
        try {
            await postService.deletePost(postId);
            Alert.alert("성공", "활동 기록이 삭제되었습니다.", [
                { text: "확인", onPress: () => router.back() }
            ]);
        } catch (error) {
            Alert.alert("오류", "삭제에 실패했습니다.");
        }
    };

    const handlePostAction = (postId: number, action: 'delete' | 'edit') => {
        if (action === 'delete') {
            showDeleteConfirmation(postId);
        } else if (action === 'edit') {
            // router.push(`/post/edit/${postId}`);
        }
    };

    const handleLike = async () => {
        if (!post) return false;

        try {
            const isLiked = await postService.togglePostLike(post.id);
            setPost(prevPost => {
                if (!prevPost) return null;
                return {
                    ...prevPost,
                    isLiked: isLiked,
                    likeCount: isLiked ? prevPost.likeCount + 1 : prevPost.likeCount - 1
                };
            });
            return isLiked; // boolean 값 반환
        } catch (error) {
            Alert.alert("오류", "좋아요 처리에 실패했습니다.");
            return false; // 에러 시에도 boolean 반환
        }
    };

    const handleShare = async () => {
        try {
            Alert.alert("알림", "공유하기 기능이 준비 중입니다.");
        } catch (error) {
            Alert.alert("오류", "공유하기에 실패했습니다.");
        }
    };

    const scrollToReplies = () => {
        listRef.current?.scrollToIndex({
            index: 1,
            animated: true,
        });
    };

    const handleSubmitReply = async () => {
        if (!replyState.replyText.trim() || replyState.isSubmitting) return;

        try {
            if (replyState.editingReplyId) {
                await replyActions.updateReply(replyState.editingReplyId, replyState.replyText.trim());
            } else {
                await replyActions.createReply(replyState.replyText.trim(), replyState.selectedReplyId);
                setTotalReplyCount(prev => prev + 1);
                setPost(prevPost => {
                    if (!prevPost) return null;
                    return {
                        ...prevPost,
                        replyCount: prevPost.replyCount + 1
                    };
                });
            }
        } catch (error: any) {
            Alert.alert("오류", error.message || "댓글 작성에 실패했습니다.");
        }
    };

    const handleEditReply = (replyId: number) => {
        const replyToEdit = replyState.replies.reduce<Reply | null>((found, reply) => {
            if (found) return found;
            if (reply.id === replyId) return reply;
            if (reply.children) {
                const childReply = reply.children.find(child => child.id === replyId);
                if (childReply) return childReply;
            }
            return found;
        }, null);

        if (replyToEdit) {
            replyActions.setEditing(replyId);
            replyActions.setReplyText(replyToEdit.content);
        }
    };


    const handleDeleteReply = async (replyId: number) => {
        Alert.alert(
            '삭제 확인',
            '댓글을 삭제하시겠습니까?',
            [
                {
                    text: '취소',
                    style: 'cancel'
                },
                {
                    text: '삭제',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await replyActions.deleteReply(replyId);
                            setTotalReplyCount(prev => prev - 1);
                            setPost(prevPost => {
                                if (!prevPost) return null;
                                return {
                                    ...prevPost,
                                    replyCount: prevPost.replyCount - 1
                                };
                            });
                        } catch (error) {
                            Alert.alert('오류', '댓글 삭제에 실패했습니다.');
                        }
                    }
                }
            ]
        );
    };

    useEffect(() => {
        const loadAllImages = async () => {
            if (!post) return;
            const urls = post.files.map(file => file.url);
            const cache = await imageService.loadImages(urls);
            setImagesCache(cache);
        };

        loadAllImages();
    }, [post]);

    useEffect(() => {
        fetchPost();
    }, [id]);

    const renderItem = ({ item }: { item: ListItem; index: number }) => {
        if (!post) return null;

        if (item.type === 'content') {
            return (
                <>
                    <PostHeader
                        post={post}
                        onProfilePress={navigateToUserProfile}
                        onMorePress={showActionSheet}
                    />

                    <PostContent post={post} />

                    <PostImageSlider
                        files={post.files}
                        imagesCache={imagesCache}
                        onImageIndexChange={setCurrentImageIndex}
                    />

                    <PostActions
                        post={post}
                        replyCount={totalReplyCount}
                        onLike={handleLike}
                        onShare={handleShare}
                        onReply={scrollToReplies}
                    />
                </>
            );
        }

        return (
            <PostReply
                replies={replyState.replies}
                onLoadMore={() => replyActions.fetchReplies(Math.ceil(replyState.replies.length / 10))}
                hasMore={!replyState.error}
                loading={replyState.isSubmitting}
                onReply={replyActions.selectReply}
                onProfilePress={navigateToUserProfile}
                onDeleteReply={handleDeleteReply}
                onEditReply={handleEditReply}
                onLoadChildren={replyActions.fetchChildReplies}
                totalCount={totalReplyCount} // totalReplyCount를 전달
            />
        );
    };

    if (isLoading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    if (error || !post) {
        return (
            <View style={styles.centerContainer}>
                <TouchableOpacity style={styles.retryButton} onPress={() => router.back()}>
                    <Text style={styles.retryButtonText}>뒤로가기</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const listData: ListItem[] = [
        { type: 'content' },
        { type: 'replies' }
    ];

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
        >
            <Stack.Screen
                options={{
                    headerLeft: () => (
                        <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
                            <Ionicons name="arrow-back" size={24} color="black" />
                        </TouchableOpacity>
                    ),
                    headerTitle: "",
                    headerShadowVisible: false,
                    headerStyle: { backgroundColor: '#FFFFFF' },
                }}
            />

            <FlatList
                ref={listRef}
                data={listData}
                renderItem={renderItem}
                keyExtractor={(item) => item.type}
                style={styles.container}
                onScrollToIndexFailed={(info) => {
                    const wait = new Promise(resolve => setTimeout(resolve, 500));
                    wait.then(() => {
                        listRef.current?.scrollToIndex({ index: info.index, animated: true });
                    });
                }}
            />

            <PostReplyInput
                replyText={replyState.replyText}
                onReplyTextChange={replyActions.setReplyText}
                selectedReply={getSelectedReplyInfo()}
                onCancelReply={() => {
                    replyActions.selectReply(null);
                    replyActions.setEditing(null);
                    replyActions.setReplyText('');
                }}
                onSubmitReply={handleSubmitReply}
                isSubmitting={replyState.isSubmitting}
                isEditing={!!replyState.editingReplyId}
            />
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    contentContainer: {
        borderBottomWidth: 0,
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
    },
    headerButton: {
        padding: 8,
    },
    retryButton: {
        backgroundColor: '#007AFF',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
    },
    retryButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
    },
});