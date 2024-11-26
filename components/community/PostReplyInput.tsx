import React from 'react';
import {
    View,
    TextInput,
    TouchableOpacity,
    Text,
    StyleSheet,
    ActivityIndicator,
    Platform,
} from 'react-native';
import { Reply } from '@/api/types/community/reply';

interface PostReplyInputProps {
    replyText: string;
    onReplyTextChange: (text: string) => void;
    selectedReply: Reply | null;
    onCancelReply: () => void;
    onSubmitReply: () => void;
    isSubmitting: boolean;
    isEditing: boolean;
}

export default function PostReplyInput({
                                           replyText,
                                           onReplyTextChange,
                                           selectedReply,
                                           onCancelReply,
                                           onSubmitReply,
                                           isSubmitting,
                                           isEditing,
                                       }: PostReplyInputProps) {
    return (
        <View style={styles.container}>
            {(selectedReply || isEditing) && (
                <View style={styles.replyingToContainer}>
                    <Text style={styles.replyingToText}>
                        {isEditing ? '댓글 수정 중' : `${selectedReply?.userNickname}님에게 답글 작성 중`}
                    </Text>
                    <TouchableOpacity
                        onPress={onCancelReply}
                        hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
                    >
                        <Text style={styles.cancelText}>취소</Text>
                    </TouchableOpacity>
                </View>
            )}
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder={isEditing ? "댓글을 수정하세요" : selectedReply ? "답글을 입력하세요" : "댓글을 입력하세요"}
                    value={replyText}
                    onChangeText={onReplyTextChange}
                    multiline
                    maxLength={1000}
                    autoCapitalize="none"
                    returnKeyType="done"
                />
                {isSubmitting ? (
                    <ActivityIndicator size="small" color="#007AFF" style={styles.submitButton} />
                ) : (
                    <TouchableOpacity
                        style={[
                            styles.submitButton,
                            (!replyText.trim() || isSubmitting) && styles.submitButtonDisabled
                        ]}
                        onPress={onSubmitReply}
                        disabled={!replyText.trim() || isSubmitting}
                    >
                        <Text
                            style={[
                                styles.submitButtonText,
                                (!replyText.trim() || isSubmitting) && styles.submitButtonTextDisabled
                            ]}
                        >
                            {isEditing ? '수정' : '작성'}
                        </Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        borderTopWidth: 1,
        borderTopColor: '#EEEEEE',
        backgroundColor: '#FFFFFF',
        paddingBottom: Platform.OS === 'ios' ? 20 : 0,
    },
    replyingToContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: '#F8F9FA',
        borderBottomWidth: 1,
        borderBottomColor: '#EEEEEE',
    },
    replyingToText: {
        fontSize: 12,
        color: '#666666',
        fontWeight: '500',
    },
    cancelText: {
        fontSize: 12,
        color: '#8E8E8E',
        fontWeight: '500',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: '#FFFFFF',
    },
    input: {
        flex: 1,
        minHeight: 36,
        maxHeight: 100,
        backgroundColor: '#F8F9FA',
        borderRadius: 18,
        paddingHorizontal: 16,
        paddingTop: 8,
        paddingBottom: 8,
        fontSize: 14,
        lineHeight: 20,
        color: '#1A1A1A',
    },
    submitButton: {
        marginLeft: 8,
        paddingHorizontal: 12,
        paddingVertical: 8,
        justifyContent: 'center',
        alignItems: 'center',
        minWidth: 48,
    },
    submitButtonDisabled: {
        opacity: 0.5,
    },
    submitButtonText: {
        color: '#007AFF',
        fontSize: 14,
        fontWeight: '600',
    },
    submitButtonTextDisabled: {
        color: '#8E8E8E',
    },
});