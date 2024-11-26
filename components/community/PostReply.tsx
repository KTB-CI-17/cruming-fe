import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, ActivityIndicator, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Reply } from '@/api/types/community/post';

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

    const handleLoadMoreChildren = async (parentId: number) => {
        if (loadingChildReplies[parentId]) return;

        setLoadingChildReplies(prev => ({ ...prev, [parentId]: true }));
        try {
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

    const renderChildReplies = (reply: Reply) => {
        if (!reply.children || reply.children.length === 0) return null;

        const remainingReplies = reply.childCount - reply.children.length;
        const isLoading = loadingChildReplies[reply.id];

        return (
            <View style={styles.childRepliesContainer}>
                {reply.children.map(child => renderReplyItem({ item: child, isChild: true }))}
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

    const renderReplyItem = ({ item, isChild = false }: { item: Reply; isChild?: boolean }) => (
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

    const renderFooter = () => {
        if (!loading) return null;
        return (
            <View style={styles.loadingFooter}>
                <ActivityIndicator size="small" color="#666" />
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={replies}
                renderItem={renderReplyItem}
                keyExtractor={(item) => item.id.toString()}
                onEndReached={() => hasMore && onLoadMore()}
                onEndReachedThreshold={0.5}
                ListFooterComponent={renderFooter}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        borderTopWidth: 1,
        borderTopColor: '#EEEEEE',
    },
    replyItem: {
        padding: 16,
        paddingRight: 0,
        marginRight: 0
    },
    childRepliesContainer: {
        marginLeft: 40,
        marginRight: 0,
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
    replyActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    replyActionButton: {
        padding: 4,
    },
    replyActionText: {
        color: '#666',
        fontSize: 12,
    },
    childReplyItem: {
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    viewRepliesButton: {
        marginTop: 8,
        padding: 8,
    },
    viewRepliesText: {
        color: '#666',
        fontSize: 12,
    },
    loadingFooter: {
        padding: 16,
        alignItems: 'center',
    },
});