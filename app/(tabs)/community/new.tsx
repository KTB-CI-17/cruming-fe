// app/(tabs)/community/new.tsx
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
    Platform
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';

export default function NewPost() {
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

                {/* 구분선 */}
                <View style={styles.divider} />

                {/* 내용 입력 */}
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

                {/* 구분선 */}
                <View style={styles.divider} />

                {/* 이미지 업로드 섹션 */}
                <View style={styles.imageSection}>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        style={styles.imageScrollView}
                    >
                        {/* 이미지 추가 버튼 */}
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

                        {/* 선택된 이미지들 */}
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
        minHeight: 360,
    },
    divider: {
        height: 1,
        backgroundColor: '#E4E9F2',
    },imageSection: {
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
        marginVertical: 8,     // 상하 마진 추가하여 이미지와 높이 맞춤
    },
    addImageText: {
        color: '#735BF2',
        marginTop: 4,
        fontSize: 12,
    },
    imageContainer: {
        width: 100,            // 명시적 너비 지정
        height: 100,           // 명시적 높이 지정
        marginRight: 12,
        marginVertical: 8,     // 이미지 컨테이너도 동일한 상하 마진
        position: 'relative',
    },
    image: {
        width: '100%',         // 부모 컨테이너에 맞춤
        height: '100%',        // 부모 컨테이너에 맞춤
        borderRadius: 8,
    },
    removeButton: {
        position: 'absolute',
        top: -8,               // 위치 미세 조정
        right: -8,             // 위치 미세 조정
        backgroundColor: 'white',
        borderRadius: 12,
        zIndex: 1,
    },
});
