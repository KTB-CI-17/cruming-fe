import React from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {Reply} from '@/api/types/community/post';

interface PostReplyInputProps {
    replyText: string;
    onReplyTextChange: (text: string) => void;
    selectedReply: Reply | null;
    onCancelReply: () => void;
    onSubmitReply: () => void;
    isSubmitting: boolean;
}

export default function PostReplyInput({
                                           replyText,
                                           onReplyTextChange,
                                           selectedReply,
                                           onCancelReply,
                                           onSubmitReply,
                                           isSubmitting,
                                       }: PostReplyInputProps) {
    return (
        <View style={styles.replyInputContainer}>
            {selectedReply && (
                <View style={styles.replyingToContainer}>
                    <Text style={styles.replyingToText}>
                        <Text style={styles.replyingToName}>{selectedReply.userNickname}</Text>
                        님에게 답글 작성 중
                    </Text>
                    <TouchableOpacity
                        onPress={onCancelReply}
                        style={styles.cancelReplyButton}
                    >
                        <Ionicons name="close-circle" size={20} color="#666" />
                    </TouchableOpacity>
                </View>
            )}
            <View style={styles.inputRow}>
                <TextInput
                    value={replyText}
                    onChangeText={onReplyTextChange}
                    placeholder={selectedReply ? "답글을 입력하세요..." : "댓글을 입력하세요..."}
                    style={styles.replyInput}
                    multiline
                />
                <TouchableOpacity
                    style={[
                        styles.submitButton,
                        (!replyText.trim() || isSubmitting) && styles.submitButtonDisabled
                    ]}
                    onPress={onSubmitReply}
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
});