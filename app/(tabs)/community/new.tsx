import { useState } from 'react';
import {
    StyleSheet,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    Alert, TouchableOpacity, Text
} from 'react-native';
import { router } from 'expo-router';
import PostFormContent from '@/components/community/PostFormContent';
import { PostSubmitService } from '@/api/services/community/postSubmitService';

export default function NewPost() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [images, setImages] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async () => {
        if (!title.trim()) {
            Alert.alert('알림', '제목을 입력하세요.');
            return;
        }

        if (!content.trim()) {
            Alert.alert('알림', '내용을 입력하세요.');
            return;
        }

        Alert.alert(
            '게시글 등록',
            '게시글을 등록하시겠습니까?',
            [
                {
                    text: '취소',
                    style: 'cancel'
                },
                {
                    text: '확인',
                    onPress: async () => {
                        try {
                            setIsLoading(true);
                            const response = await PostSubmitService.submit(title, content);
                            console.log('Response:', response.data);

                            Alert.alert('성공', '게시글이 등록되었습니다.', [
                                {
                                    text: '확인',
                                    onPress: () => router.back()
                                }
                            ]);
                        } catch (error: any) {
                            console.error('API Error Full Details:', {
                                message: error.message,
                                response: error.response?.data,
                                status: error.response?.status,
                                headers: error.response?.headers,
                                requestData: error.config?.data,
                                requestHeaders: error.config?.headers,
                                platform: Platform.OS
                            });

                            let errorMessage = '게시글 등록에 실패했습니다.';
                            if (error.response) {
                                if (error.response.status === 400) {
                                    errorMessage = '잘못된 요청입니다: ' + (error.response.data.message || '입력값을 확인해주세요.');
                                } else if (error.response.status === 500) {
                                    errorMessage = '서버 오류가 발생했습니다.';
                                }
                                console.error('Server Error Details:', error.response.data);
                            }

                            Alert.alert('오류', errorMessage);
                        } finally {
                            setIsLoading(false);
                        }
                    }
                }
            ]
        );
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
        >
            <ScrollView style={styles.scrollContainer}>
                <PostFormContent
                    title={title}
                    content={content}
                    images={images}
                    onTitleChange={setTitle}
                    onContentChange={setContent}
                    onImagesChange={setImages}
                    isLoading={isLoading}
                />
            </ScrollView>

            <TouchableOpacity
                style={[
                    styles.submitButton,
                    isLoading && styles.submitButtonDisabled
                ]}
                onPress={handleSubmit}
                disabled={isLoading}
            >
                <Text style={styles.submitButtonText}>
                    {isLoading ? '등록 중...' : '완료'}
                </Text>
            </TouchableOpacity>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    scrollContainer: {
        flex: 1,
    },
    submitButton: {
        backgroundColor: '#735BF2',
        padding: 16,
        margin: 16,
        borderRadius: 8,
        alignItems: 'center',
    },
    submitButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    submitButtonDisabled: {
        backgroundColor: '#B0A5F8',
    }
});