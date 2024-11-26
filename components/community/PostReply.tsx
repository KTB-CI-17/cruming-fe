import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, ActionSheetIOS, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

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

interface PostReplyProps {
    replies: Reply[];
    onLoadMore: () => void;
    hasMore: boolean;
    loading: boolean;
    onReply: (replyId: number) => void;
    onProfilePress: (userId: number) => void;
    onLoadChildren: (parentId: number, page: number) => Promise<boolean>;
    onDeleteReply: (replyId: number) => void;
    onEditReply: (replyId: number) => void;
}

export default function PostReply({
                                      replies,
                                      onLoadMore,
                                      hasMore,
                                      loading,
                                      onReply,
                                      onProfilePress,
                                      onLoadChildren,
                                      onDeleteReply,
                                      onEditReply,
                                  }: PostReplyProps) {
    const [loadingChildReplies, setLoadingChildReplies] = useState<{[key: number]: boolean}>({});
    const [childReplyPages, setChildReplyPages] = useState<{[key: number]: number}>({});

    const showActionSheet = (reply: Reply) => {
        ActionSheetIOS.showActionSheetWithOptions(
            {
                options: ['수정', '삭제', '취소'],
                cancelButtonIndex: 2,
                destructiveButtonIndex: 1,
            },
            (buttonIndex) => {
                if (buttonIndex === 0) {
                    onEditReply(reply.id);
                } else if (buttonIndex === 1) {
                    onDeleteReply(reply.id);
                }
            }
        );
    };

    const handleLoadMoreChildren = async (parentId: number) => {
        if (loadingChildReplies[parentId]) return;

        setLoadingChildReplies(prev => ({ ...prev, [parentId]: true }));
        try {
            // 페이지는 1부터 시작 (첫 5개는 이미 로드되어 있음)
            const nextPage = (childReplyPages[parentId] || 1);
            await onLoadChildren(parentId, nextPage);
            setChildReplyPages(prev => ({ ...prev, [parentId]: nextPage + 1 }));
        } finally {
            setLoadingChildReplies(prev => ({ ...prev, [parentId]: false }));
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
        const diffHours = Math.floor(diffMinutes / 60);
        const diffDays = Math.floor(diffHours / 24);

        if (diffMinutes < 60) {
            return `${diffMinutes}분 전`;
        } else if (diffHours < 24) {
            return `${diffHours}시간 전`;
        } else if (diffDays < 7) {
            return `${diffDays}일 전`;
        } else {
            return date.toLocaleDateString();
        }
    };

    const renderReplyItem = (reply: Reply, isChild: boolean = false) => (
        <View key={reply.id} style={[styles.replyItem, isChild && styles.childReplyItem]}>
            <View style={styles.replyHeader}>
                <TouchableOpacity
                    style={styles.profileContainer}
                    onPress={() => onProfilePress(reply.userId)}
                >
                    <Image
                        source={require('@/assets/images/default-profile.png')}
                        style={styles.replyProfileImage}
                    />
                    <View style={styles.replyInfo}>
                        <Text style={styles.replyNickname}>
                            {reply.userNickname}
                        </Text>
                    </View>
                </TouchableOpacity>

                {reply.isWriter && (
                    <TouchableOpacity
                        onPress={() => showActionSheet(reply)}
                        style={styles.moreButton}
                    >
                        <Ionicons name="ellipsis-horizontal" size={20} color="#666" />
                    </TouchableOpacity>
                )}
            </View>

            <Text style={styles.replyContent}>{reply.content}</Text>

            <View style={styles.replyFooter}>
                <Text style={styles.replyDate}>{formatDate(reply.createdAt)}</Text>
                {!isChild && (
                    <TouchableOpacity
                        style={styles.replyActionButton}
                        onPress={() => onReply(reply.id)}
                    >
                        <Text style={styles.replyActionText}>답글</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );

    const renderChildReplies = (reply: Reply) => {
        if (!reply.children || reply.children.length === 0) return null;

        const remainingReplies = reply.childCount - reply.children.length;
        const isLoading = loadingChildReplies[reply.id];

        return (
            <View style={styles.childRepliesContainer}>
                {reply.children.map(child => renderReplyItem(child, true))}
                {remainingReplies > 0 && (
                    <TouchableOpacity
                        style={styles.viewRepliesButton}
                        onPress={() => handleLoadMoreChildren(reply.id)}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <ActivityIndicator size="small" color="#666" />
                        ) : (
                            <Text style={styles.viewRepliesText}>
                                답글 {remainingReplies}개 더보기
                            </Text>
                        )}
                    </TouchableOpacity>
                )}
            </View>
        );
    };

    return (
        <View style={styles.container}>
            {replies.map((reply) => (
                <View key={reply.id}>
                    {renderReplyItem(reply)}
                    {renderChildReplies(reply)}
                </View>
            ))}

            {hasMore && !loading && (
                <TouchableOpacity
                    style={styles.loadMoreButton}
                    onPress={onLoadMore}
                >
                    <Text style={styles.loadMoreText}>더보기</Text>
                </TouchableOpacity>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: '#EEEEEE',
    },
    replyItem: {
        marginBottom: 16,
    },
    childRepliesContainer: {
        marginLeft: 40,
        marginBottom: 16,
    },
    replyHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    profileContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    replyProfileImage: {
        width: 32,
        height: 32,
        borderRadius: 16,
        marginRight: 8,
    },
    replyInfo: {
        flex: 1,
    },
    replyActions: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    moreButton: {
        padding: 8,
    },
    replyNickname: {
        fontSize: 14,
        fontWeight: '500',
    },
    replyContent: {
        fontSize: 14,
        lineHeight: 20,
        marginLeft: 40,
    },
    replyFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 40,
        marginTop: 4,
        gap: 8,
    },
    replyDate: {
        fontSize: 12,
        color: '#666',
    },
    replyActionButton: {
        padding: 4,
    },
    replyActionText: {
        color: '#666',
        fontSize: 12,
    },
    childReplyItem: {
        marginBottom: 12,
    },
    viewRepliesButton: {
        marginTop: 8,
        padding: 8,
    },
    viewRepliesText: {
        color: '#666',
        fontSize: 12,
    },
    loadMoreButton: {
        alignItems: 'center',
        padding: 16,
    },
    loadMoreText: {
        color: '#666',
        fontSize: 14,
    },
});