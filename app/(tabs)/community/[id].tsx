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
import { Post, Reply } from '@/api/types/community/post';

import PostHeader from '@/components/community/PostHeader';
import PostImageSlider from '@/components/community/PostImageSlider';
import PostContent from '@/components/community/PostContent';
import PostActions from '@/components/community/PostActions';
import PostReply from '@/components/community/PostReply';
import PostReplyInput from '@/components/community/PostReplyInput';
import PostLocation from "@/components/community/PostLocation";

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
    const [replies, setReplies] = useState<Reply[]>([]);
    const [replyText, setReplyText] = useState('');
    const [selectedReplyId, setSelectedReplyId] = useState<number | null>(null);
    const [editingReplyId, setEditingReplyId] = useState<number | null>(null);
    const [replyPage, setReplyPage] = useState(0);
    const [hasMoreReplies, setHasMoreReplies] = useState(true);
    const [loadingReplies, setLoadingReplies] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const listRef = useRef<FlatList>(null);

    const postService = usePostService();
    const imageService = useImageService();

    const getSelectedReplyInfo = () => {
        if (!selectedReplyId) return null;
        return replies.reduce((found: Reply | null, reply) => {
            if (found) return found;
            if (reply.id === selectedReplyId) return reply;
            if (reply.children) {
                const childReply = reply.children.find(child => child.id === selectedReplyId);
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

    const fetchPost = async () => {
        try {
            setIsLoading(true);
            const data = await postService.fetchPost(id);
            setPost(data);
            fetchReplies();
        } catch (error) {
            setError("게시글을 불러오는데 실패했습니다.");
            Alert.alert("오류", "게시글을 불러오는데 실패했습니다.", [
                { text: "확인", onPress: () => router.back() }
            ]);
        } finally {
            setIsLoading(false);
        }
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

    const handleLike = async (postId: number) => {
        try {
            await postService.likePost(postId);
            // TODO: Update like status in UI
        } catch (error) {
            Alert.alert("오류", "좋아요 처리에 실패했습니다.");
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

    const fetchReplies = async (page = 0) => {
        if (loadingReplies || (!hasMoreReplies && page > 0)) return;

        setLoadingReplies(true);
        try {
            const data = await postService.fetchReplies(id, page);
            if (page === 0) {
                setReplies(data.content);
            } else {
                setReplies(prev => [...prev, ...data.content]);
            }
            setHasMoreReplies(!data.last);
            setReplyPage(page);
        } catch (error) {
            console.error('Failed to load replies:', error);
        } finally {
            setLoadingReplies(false);
        }
    };

    const fetchChildReplies = async (parentId: number, page = 0) => {
        try {
            const data = await postService.fetchChildReplies(parentId, page);

            setReplies(prev => prev.map(reply => {
                if (reply.id === parentId) {
                    const updatedChildren = page === 0
                        ? data.content
                        : [...(reply.children || []), ...data.content];

                    return {
                        ...reply,
                        children: updatedChildren
                    };
                }
                return reply;
            }));

            return !data.last;
        } catch (error) {
            console.error('Failed to load child replies:', error);
            return false;
        }
    };

    const handleSubmitReply = async () => {
        if (!replyText.trim() || isSubmitting) return;

        setIsSubmitting(true);
        try {
            if (editingReplyId) {
                await postService.updateReply(editingReplyId, replyText.trim());
                setEditingReplyId(null);
            } else {
                await postService.createReply(id, replyText.trim(), selectedReplyId);
            }
            setReplyText('');
            setSelectedReplyId(null);
            await fetchReplies(0);
        } catch (error: any) {
            Alert.alert("오류", error.message || "댓글 작성에 실패했습니다.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEditReply = (replyId: number) => {
        const replyToEdit = replies.reduce((found: Reply | null, reply) => {
            if (found) return found;
            if (reply.id === replyId) return reply;
            if (reply.children) {
                const childReply = reply.children.find(child => child.id === replyId);
                if (childReply) return childReply;
            }
            return found;
        }, null);

        if (replyToEdit) {
            setEditingReplyId(replyId);
            setReplyText(replyToEdit.content);
            // 대댓글인 경우 부모 댓글 ID를 설정
            setSelectedReplyId(replyToEdit.parentId);
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
                            await postService.deleteReply(replyId);
                            await fetchReplies(0);
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

    const renderItem = ({ item, index }: { item: ListItem; index: number }) => {
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
                        currentImageIndex={currentImageIndex}
                        onImageIndexChange={setCurrentImageIndex}
                    />

                    <PostActions
                        post={post}
                        replyCount={replies.length}
                        onLike={() => handleLike(post.id)}
                        onShare={handleShare}
                        onReply={scrollToReplies}
                    />
                </>
            );
        }

        return (
            <PostReply
                replies={replies}
                onLoadMore={() => fetchReplies(replyPage + 1)}
                hasMore={hasMoreReplies}
                loading={loadingReplies}
                onReply={setSelectedReplyId}
                onProfilePress={navigateToUserProfile}
                onDeleteReply={handleDeleteReply}
                onEditReply={handleEditReply}
                onLoadChildren={fetchChildReplies}
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
                replyText={replyText}
                onReplyTextChange={setReplyText}
                selectedReply={getSelectedReplyInfo()}
                onCancelReply={() => {
                    setSelectedReplyId(null);
                    setEditingReplyId(null);
                    setReplyText('');
                }}
                onSubmitReply={handleSubmitReply}
                isSubmitting={isSubmitting}
                isEditing={!!editingReplyId}
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