import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, ActivityIndicator } from 'react-native';
import { Reply } from "@/api/types/community/post";

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
    totalCount: number;
    loadingStates?: { [key: number]: boolean }; // optional로 변경
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
                                      totalCount,
                                      loadingStates = {}, // 기본값 제공
                                  }: PostReplyProps) {
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
        const diffHours = Math.floor(diffMinutes / 60);
        const diffDays = Math.floor(diffHours / 24);

        if (diffMinutes < 2) {
            return '방금 전';
        } else if (diffMinutes < 60) {
            return `${diffMinutes}분 전`;
        } else if (diffHours < 24) {
            return `${diffHours}시간 전`;
        } else if (diffDays < 7) {
            return `${diffDays}일 전`;
        } else {
            return date.toLocaleDateString();
        }
    };

    const renderChildReplies = (reply: Reply) => {
        if (!reply.children || reply.children.length === 0) return null;

        const remainingReplies = reply.childCount ? (reply.childCount - reply.children.length) : 0;
        const isLoading = loadingStates?.[reply.id] ?? false; // optional chaining과 nullish coalescing 사용

        return (
            <View style={styles.childRepliesContainer}>
                {reply.children.map((child, index) => (
                    <React.Fragment key={`${child.id}-${index}`}>
                        {renderReplyItem(child, true)}
                    </React.Fragment>
                ))}
                {remainingReplies > 0 && reply.childCount && !isLoading && (
                    <TouchableOpacity
                        style={styles.viewMoreButton}
                        onPress={() => {
                            const nextPage = Math.ceil(reply.children!.length / 5);
                            onLoadChildren(reply.id, nextPage);
                        }}
                    >
                        <Text style={styles.viewMoreText}>대댓글 더보기</Text>
                    </TouchableOpacity>
                )}
                {isLoading && (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="small" color="#666" />
                    </View>
                )}
            </View>
        );
    };

    const renderReplyItem = (item: Reply, isChild = false) => (
        <View key={item.id} style={[styles.replyItem, isChild && styles.childReplyItem]}>
            <View style={styles.replyHeader}>
                <TouchableOpacity
                    style={styles.profileContainer}
                    onPress={() => onProfilePress(item.userId)}
                >
                    <Image
                        source={require('@/assets/images/default-profile.png')}
                        style={styles.replyProfileImage}
                    />
                    <View style={styles.replyInfo}>
                        <Text style={styles.replyNickname}>
                            {item.userNickname}
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>

            <Text style={styles.replyContent}>{item.content}</Text>

            <View style={styles.replyFooter}>
                <Text style={styles.replyDate}>{formatDate(item.createdAt)}</Text>
                <View style={styles.replyActions}>
                    {!isChild && (
                        <TouchableOpacity
                            style={styles.replyActionButton}
                            onPress={() => onReply(item.id)}
                        >
                            <Text style={styles.replyActionText}>답글</Text>
                        </TouchableOpacity>
                    )}
                    {item.isWriter && (
                        <>
                            <TouchableOpacity
                                style={styles.replyActionButton}
                                onPress={() => onEditReply(item.id)}
                            >
                                <Text style={styles.replyActionText}>수정</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.replyActionButton}
                                onPress={() => onDeleteReply(item.id)}
                            >
                                <Text style={styles.replyActionText}>삭제</Text>
                            </TouchableOpacity>
                        </>
                    )}
                </View>
            </View>
            {!isChild && renderChildReplies(item)}
        </View>
    );

    const remainingReplies = totalCount - replies.length;

    return (
        <View style={styles.container}>
            <View style={styles.contentContainer}>
                {replies.map(reply => renderReplyItem(reply, false))}
                {loading && (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="small" color="#666" />
                    </View>
                )}
                {!loading && hasMore && remainingReplies > 0 && (
                    <TouchableOpacity
                        style={styles.loadMoreButton}
                        onPress={onLoadMore}
                    >
                        <Text style={styles.loadMoreText}>댓글 더보기</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        borderTopWidth: 1,
        borderTopColor: '#EEEEEE',
    },
    listContainer: {
        paddingBottom: 20,
    },
    replyItem: {
        padding: 16,
        paddingRight: 16,
        borderBottomColor: '#EEEEEE',
    },
    childReplyItem: {
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    childRepliesContainer: {
        marginTop: 8,
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
    replyNickname: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1A1A1A',
    },
    replyContent: {
        fontSize: 14,
        lineHeight: 20,
        marginLeft: 40,
        color: '#1A1A1A',
    },
    replyFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 40,
        marginTop: 8,
        justifyContent: 'space-between',
    },
    replyDate: {
        fontSize: 12,
        color: '#8E8E8E',
    },
    replyActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    replyActionButton: {
        padding: 4,
    },
    replyActionText: {
        color: '#8E8E8E',
        fontSize: 12,
        fontWeight: '500',
    },
    viewRepliesButton: {
        paddingVertical: 8,
        paddingHorizontal: 16,
    },
    viewRepliesText: {
        color: '#8E8E8E',
        fontSize: 12,
        fontWeight: '500',
    },
    loadingFooter: {
        padding: 16,
        alignItems: 'center',
    },
    viewMoreButton: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        marginTop: 8,
        backgroundColor: '#F5F5F5',
        borderRadius: 8,
        alignSelf: 'flex-start',
        marginLeft: 40,
    },
    viewMoreText: {
        color: '#666666',
        fontSize: 12,
        fontWeight: '500',
    },
    loadingContainer: {
        paddingVertical: 16,
        alignItems: 'center',
    },
    contentContainer: {
        paddingBottom: 16,
    },
    loadMoreButton: {
        marginTop: 8,
        paddingVertical: 12,
        paddingHorizontal: 16,
        backgroundColor: '#F5F5F5',
        borderRadius: 8,
        alignSelf: 'center',
    },
    loadMoreText: {
        color: '#666666',
        fontSize: 14,
        fontWeight: '500',
    },
});
