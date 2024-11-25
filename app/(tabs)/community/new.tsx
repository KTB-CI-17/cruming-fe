import { useState } from 'react';
import {
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    Alert,
    TouchableOpacity,
    Text,
    StyleSheet,
    ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import PostFormContent from '@/components/community/PostFormContent';
import { PostSubmitService } from '@/api/services/community/postSubmitService';
import { useAuthenticatedFetch } from '@/hooks/useAuthenticatedFetch';

export default function NewPost() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [images, setImages] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const { authMultipartFetch } = useAuthenticatedFetch();

    const handleSubmit = async () => {
        if (!title.trim()) {
            Alert.alert('알림', '제목을 입력하세요.');
            return;
        }

        if (!content.trim()) {
            Alert.alert('알림', '내용을 입력하세요.');
            return;
        }

        if (title.length > 100) {
            Alert.alert('알림', '제목은 최대 100자까지 입력 가능합니다.');
            return;
        }

        if (content.length > 1000) {
            Alert.alert('알림', '본문은 최대 1,000자까지 입력 가능합니다.');
            return;
        }

        if (images.length > 5) {
            Alert.alert('알림', '이미지는 최대 5개까지만 업로드할 수 있습니다.');
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
                            await PostSubmitService.submit(authMultipartFetch, title, content, images);

                            Alert.alert('성공', '게시글이 등록되었습니다.', [
                                {
                                    text: '확인',
                                    onPress: () => {
                                        router.back();
                                    }
                                }
                            ]);
                        } catch (error: any) {
                            console.error('Post submission error:', error);
                            Alert.alert('오류', error.message || '게시글 등록에 실패했습니다.');
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
                {isLoading ? (
                    <ActivityIndicator color="white" />
                ) : (
                    <Text style={styles.submitButtonText}>완료</Text>
                )}
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