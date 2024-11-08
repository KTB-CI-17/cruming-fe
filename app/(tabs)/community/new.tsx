import { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    Alert
} from 'react-native';
import { router } from 'expo-router';
import ImageUploadArea from '@/components/common/ImageUploadArea';
import axios from 'axios';
import { API_URL } from '@/api/config/index';

// 서버의 enum 값과 정확히 일치하도록 설정
enum Category {
    GENERAL = 'GENERAL',
    PROBLEM = 'PROBLEM'
}

enum Visibility {
    PRIVATE = 'PRIVATE',
}

interface PostRequest {
    title: string;
    content: string;
    category: Category;
}

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

                            // 요청 데이터 구성
                            const postRequestData: PostRequest = {
                                title: title.trim(),
                                content: content.trim(),
                                category: Category.GENERAL,
                            };

                            console.log('Request Data:', postRequestData);

                            const response = await axios({
                                method: 'post',
                                url: `${API_URL}/api/v1/posts`,
                                data: postRequestData,
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Accept': 'application/json',
                                },
                                timeout: 10000
                            });

                            console.log('Response:', response.data);

                            Alert.alert('성공', '게시글이 등록되었습니다.', [
                                {
                                    text: '확인',
                                    onPress: () => {
                                        router.back();
                                    }
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
                                url: `${API_URL}/api/v1/posts`,
                                platform: Platform.OS
                            });

                            let errorMessage = '게시글 등록에 실패했습니다.';
                            if (error.response) {
                                if (error.response.status === 400) {
                                    errorMessage = '잘못된 요청입니다: ' + (error.response.data.message || '입력값을 확인해주세요.');
                                } else if (error.response.status === 500) {
                                    errorMessage = '서버 오류가 발생했습니다.';
                                }
                                // 서버에서 온 상세 에러 로깅
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
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.titleInput}
                        placeholder="제목을 입력하세요"
                        placeholderTextColor="#8F9BB3"
                        value={title}
                        onChangeText={setTitle}
                        maxLength={100}
                        editable={!isLoading}
                    />
                </View>

                <View style={styles.divider} />

                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.contentInput}
                        multiline
                        placeholder="내용을 입력하세요"
                        placeholderTextColor="#8F9BB3"
                        value={content}
                        onChangeText={setContent}
                        textAlignVertical="top"
                        editable={!isLoading}
                    />
                </View>

                <View style={styles.divider} />

                <View style={styles.imageSection}>
                    <ImageUploadArea
                        images={images}
                        onImagesChange={setImages}
                    />
                </View>
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

// styles 부분은 동일
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    scrollContainer: {
        flex: 1,
    },
    inputContainer: {
        padding: 16,
    },
    titleInput: {
        fontSize: 16,
        color: '#222B45',
        padding: 6,
        minHeight: 20,
    },
    contentInput: {
        fontSize: 16,
        color: '#222B45',
        padding: 6,
        minHeight: 300,
    },
    divider: {
        height: 1,
        backgroundColor: '#E4E9F2',
    },
    imageSection: {
        padding: 12,
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
