import { useLocalSearchParams, Stack, router } from 'expo-router';
import {
    View, Text, TouchableOpacity, StyleSheet, ScrollView, Image,
    Dimensions, TextInput, Alert, ActivityIndicator, ActionSheetIOS,
    KeyboardAvoidingView, Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import React, { useState, useEffect, useRef } from 'react';
import { usePostService } from '@/api/services/community/usePostService';
import { useImageService } from '@/api/services/community/useImageService';
import PostReply from '@/components/community/PostReply';

const { width } = Dimensions.get('window');

interface Post {
    id: number;
    title: string;
    content: string;
    location: string;
    level: number;
    category: string;
    visibility: string;
    createdAt: string;
    userId: number;
    userNickname: string;
    isWriter: boolean;
    files: File[];
    instagram_id?: string;
}

interface File {
    id: number;
    fileName: string;
    fileKey: string;
    url: string;
    fileType: string;
    fileSize: number;
    displayOrder: number;
    userId: number;
    status: string;
    createdAt: string;
}

interface Reply {
    id: number;
    content: string;
    createdAt: string;
    userId: number;
    userNickname: string;
    childCount: number;
    children?: Reply[];
    isWriter?: boolean;
}

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
    const [replyPage, setReplyPage] = useState(0);
    const [hasMoreReplies, setHasMoreReplies] = useState(true);
    const [loadingReplies, setLoadingReplies] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const scrollViewRef = useRef<ScrollView>(null);

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

    useEffect(() => {
        const loadAllImages = async () => {
            if (!post) return;
            const urls = post.files.map(file => file.url);
            const cache = await imageService.loadImages(urls);
            setImagesCache(cache);
        };

        loadAllImages();
    }, [post]);

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

    const handleShare = async (post: Post) => {
        try {
            Alert.alert("알림", "공유하기 기능이 준비 중입니다.");
        } catch (error) {
            Alert.alert("오류", "공유하기에 실패했습니다.");
        }
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
            await postService.createReply(id, replyText.trim(), selectedReplyId);
            setReplyText('');
            setSelectedReplyId(null);
            await fetchReplies(0);
        } catch (error) {
            Alert.alert("오류", "댓글 작성에 실패했습니다.");
        } finally {
            setIsSubmitting(false);
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

    const handleEditReply = (replyId: number) => {
        Alert.alert('알림', '댓글 수정 기능이 준비 중입니다.');
    };

    useEffect(() => {
        fetchPost();
    }, [id]);

    if (isLoading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text style={styles.loadingText}>게시글을 불러오는 중...</Text>
            </View>
        );
    }

    if (error || !post) {
        return (
            <View style={styles.centerContainer}>
                <Text style={styles.errorText}>{error}</Text>
                <TouchableOpacity style={styles.retryButton} onPress={() => router.back()}>
                    <Text style={styles.retryButtonText}>뒤로가기</Text>
                </TouchableOpacity>
            </View>
        );
    }

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
            <ScrollView style={styles.container}>
                <TouchableOpacity
                    style={styles.header}
                    onPress={() => navigateToUserProfile(post.userId)}
                >
                    <View style={styles.profileContainer}>
                        <Image
                            source={require('@/assets/images/default-profile.png')}
                            style={styles.profileImage}
                        />
                        <View>
                            <Text style={styles.nickname}>{post.userNickname}</Text>
                            {post.instagram_id && (
                                <Text style={styles.instagramId}>@{post.instagram_id}</Text>
                            )}
                        </View>
                    </View>
                    {post.isWriter && (
                        <TouchableOpacity onPress={showActionSheet}>
                            <Ionicons name="ellipsis-horizontal" size={24} color="#666" />
                        </TouchableOpacity>
                    )}
                </TouchableOpacity>

                <Text style={styles.title}>{post.title}</Text>

                <ScrollView
                    ref={scrollViewRef}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    onScroll={e => {
                        const offsetX = e.nativeEvent.contentOffset.x;
                        setCurrentImageIndex(Math.round(offsetX / width));
                    }}
                    scrollEventThrottle={16}
                >
                    {post.files.map((file) => (
                        <View key={file.id} style={styles.imageContainer}>
                            {imagesCache[file.url] ? (
                                <Image source={{ uri: imagesCache[file.url] }} style={styles.image} />
                            ) : (
                                <ActivityIndicator style={styles.image} />
                            )}
                        </View>
                    ))}
                </ScrollView>

                {post.files.length > 1 && (
                    <View style={styles.pagination}>
                        {post.files.map((_, index) => (
                            <View
                                key={index}
                                style={[
                                    styles.paginationDot,
                                    currentImageIndex === index && styles.paginationDotActive
                                ]}
                            />
                        ))}
                    </View>
                )}

                <View style={styles.locationLevel}>
                    <View style={styles.locationContainer}>
                        <Ionicons name="location-outline" size={16} color="#666" />
                        <Text style={styles.location}>{post.location}</Text>
                    </View>
                    <Text style={styles.level}>LV. {post.level}</Text>
                </View>

                <Text style={styles.content}>{post.content}</Text>

                <View style={styles.actionButtons}>
                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
                    >
                        <Ionicons name="chatbubble-outline" size={24} color="#666" />
                        {replies.length > 0 && (
                            <Text style={styles.actionCount}>{replies.length}</Text>
                        )}
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => handleLike(post.id)}
                    >
                        <Ionicons name="heart-outline" size={24} color="#666" />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => handleShare(post)}
                    >
                        <Ionicons name="share-social-outline" size={24} color="#666" />
                    </TouchableOpacity>
                </View>
                <PostReply
                    replies={replies}
                    onLoadMore={() => fetchReplies(replyPage + 1)}
                    hasMore={hasMoreReplies}
                    loading={loadingReplies}
                    onReply={setSelectedReplyId}
                    onProfilePress={navigateToUserProfile}
                    onLoadChildren={fetchChildReplies}
                    onDeleteReply={handleDeleteReply}
                    onEditReply={handleEditReply}
                />
            </ScrollView>

            <View style={styles.replyInputContainer}>
                {selectedReplyId && (
                    <View style={styles.replyingToContainer}>
                        <Text style={styles.replyingToText}>
                            <Text style={styles.replyingToName}>{getSelectedReplyInfo()?.userNickname}</Text>
                            님에게 답글 작성 중
                        </Text>
                        <TouchableOpacity
                            onPress={() => setSelectedReplyId(null)}
                            style={styles.cancelReplyButton}
                        >
                            <Ionicons name="close-circle" size={20} color="#666" />
                        </TouchableOpacity>
                    </View>
                )}
                <View style={styles.inputRow}>
                    <TextInput
                        value={replyText}
                        onChangeText={setReplyText}
                        placeholder={selectedReplyId ? "답글을 입력하세요..." : "댓글을 입력하세요..."}
                        style={styles.replyInput}
                        multiline
                    />
                    <TouchableOpacity
                        style={[
                            styles.submitButton,
                            (!replyText.trim() || isSubmitting) && styles.submitButtonDisabled
                        ]}
                        onPress={handleSubmitReply}
                        disabled={!replyText.trim() || isSubmitting}
                    >
                        <Text style={[
                            styles.submitButtonText,
                            (!replyText.trim() || isSubmitting) && styles.submitButtonTextDisabled
                        ]}>
                            게시
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    replyInputContainer: {
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: '#EEEEEE',
        backgroundColor: '#FFFFFF',
    },
    replyingToContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingBottom: 8,
    },
    replyingToText: {
        fontSize: 14,
        color: '#666',
    },
    replyingToName: {
        fontWeight: '600',
        color: '#000',
    },
    cancelReplyButton: {
        padding: 4,
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    replyInput: {
        flex: 1,
        backgroundColor: '#F5F5F5',
        borderRadius: 8,
        padding: 12,
        marginRight: 8,
        maxHeight: 100,
    },
    submitButton: {
        paddingVertical: 8,
        paddingHorizontal: 16,
    },
    submitButtonDisabled: {
        opacity: 0.5,
    },
    submitButtonText: {
        color: '#007AFF',
        fontSize: 16,
        fontWeight: '500',
    },
    submitButtonTextDisabled: {
        color: '#999',
    },
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        padding: 20,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
    },
    profileContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    profileImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    nickname: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    instagramId: {
        fontSize: 14,
        color: '#666',
    },
    title: {
        fontSize: 18,
        fontWeight: '500',
        padding: 16,
        paddingTop: 0,
    },
    imageContainer: {
        width: width,
        height: width,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: width,
        height: width,
    },
    pagination: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 6,
        marginTop: 8,
    },
    paginationDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#D9D9D9',
    },
    paginationDotActive: {
        backgroundColor: '#666',
    },
    locationLevel: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
    },
    locationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    location: {
        fontSize: 14,
        color: '#666',
    },
    level: {
        fontSize: 14,
        color: '#666',
    },
    content: {
        fontSize: 16,
        lineHeight: 24,
        padding: 16,
        paddingTop: 0,
    },
    actionButtons: {
        flexDirection: 'row',
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: '#EEEEEE',
    },
    actionButton: {
        marginRight: 16,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    actionCount: {
        fontSize: 14,
        color: '#666',
    },
    headerButton: {
        padding: 8,
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#666',
    },
    errorText: {
        fontSize: 16,
        color: '#ff0000',
        marginBottom: 20,
        textAlign: 'center',
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