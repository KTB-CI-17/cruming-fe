import { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    ScrollView,
    TouchableOpacity,
    Image,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    Alert
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function NewPost() {
    const navigation = useNavigation();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [images, setImages] = useState<string[]>([]);

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled && result.assets[0].uri) {
            setImages([...images, result.assets[0].uri]);
        }
    };

    const removeImage = (index: number) => {
        const newImages = images.filter((_, i) => i !== index);
        setImages(newImages);
    };

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
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        style={styles.imageScrollView}
                    >
                        {images.length < 10 && (
                            <TouchableOpacity
                                style={styles.addImageButton}
                                onPress={pickImage}
                            >
                                <Ionicons name="camera-outline" size={32} color="#735BF2" />
                                <Text style={styles.addImageText}>
                                    {images.length}/10
                                </Text>
                            </TouchableOpacity>
                        )}

                        {images.map((uri, index) => (
                            <View key={index} style={styles.imageContainer}>
                                <Image
                                    source={{ uri }}
                                    style={styles.image}
                                />
                                <TouchableOpacity
                                    style={styles.removeButton}
                                    onPress={() => removeImage(index)}
                                >
                                    <Ionicons name="close-circle" size={24} color="#735BF2" />
                                </TouchableOpacity>
                            </View>
                        ))}
                    </ScrollView>
                </View>
            </ScrollView>

            {/* 완료 버튼 추가 */}
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
    imageScrollView: {
        flexDirection: 'row',
    },
    addImageButton: {
        width: 100,
        height: 100,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#735BF2',
        borderStyle: 'dashed',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
        marginVertical: 8,
    },
    addImageText: {
        color: '#735BF2',
        marginTop: 4,
        fontSize: 12,
    },
    imageContainer: {
        width: 100,
        height: 100,
        marginRight: 12,
        marginVertical: 8,
        position: 'relative',
    },
    image: {
        width: '100%',
        height: '100%',
        borderRadius: 8,
    },
    removeButton: {
        position: 'absolute',
        top: -8,
        right: -8,
        backgroundColor: 'white',
        borderRadius: 12,
        zIndex: 1,
    },
    // 완료 버튼 스타일 추가
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
