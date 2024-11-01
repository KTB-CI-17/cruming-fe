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
import { useNavigation } from '@react-navigation/native';
import ImageUploadArea from '@/components/common/ImageUploadArea';

export default function NewPost() {
    const navigation = useNavigation();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [images, setImages] = useState<string[]>([]);

    // 게시글 등록 함수
    const handleSubmit = async () => {
        if (!title.trim()) {
            Alert.alert('알림', '제목을 입력해주세요.');
            return;
        }

        if (!content.trim()) {
            Alert.alert('알림', '내용을 입력해주세요.');
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
                            // TODO: API 호출 구현
                            console.log('=== 게시글 입력 데이터 ===');
                            console.log('제목:', title);
                            console.log('내용:', content);
                            console.log('이미지 개수:', images.length);
                            console.log('이미지 목록:', images);
                            console.log('========================');

                            // 더미 데이터로 작업 중이므로 API 호출 성공으로 가정
                            Alert.alert('성공', '게시글이 등록되었습니다.', [
                                {
                                    text: '확인',
                                    onPress: () => {
                                        navigation.goBack();
                                    }
                                }
                            ]);
                        } catch (error) {
                            Alert.alert('오류', '게시글 등록에 실패했습니다.');
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
                style={styles.submitButton}
                onPress={handleSubmit}
            >
                <Text style={styles.submitButtonText}>완료</Text>
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
    }
});
