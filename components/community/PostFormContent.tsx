import { View, TextInput, StyleSheet } from 'react-native';
import ImageUploadArea from '@/components/common/ImageUploadArea';

interface PostFormContentProps {
    title: string;
    content: string;
    images: string[];
    onTitleChange: (text: string) => void;
    onContentChange: (text: string) => void;
    onImagesChange: (images: string[]) => void;
    isLoading: boolean;
}

export default function PostFormContent({
                                            title,
                                            content,
                                            images,
                                            onTitleChange,
                                            onContentChange,
                                            onImagesChange,
                                            isLoading
                                        }: PostFormContentProps) {
    return (
        <>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.titleInput}
                    placeholder="제목을 입력하세요"
                    placeholderTextColor="#8F9BB3"
                    value={title}
                    onChangeText={onTitleChange}
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
                    onChangeText={onContentChange}
                    textAlignVertical="top"
                    editable={!isLoading}
                />
            </View>

            <View style={styles.divider} />

            <View style={styles.imageSection}>
                <ImageUploadArea
                    images={images}
                    onImagesChange={onImagesChange}
                />
            </View>
        </>
    );
}

const styles = StyleSheet.create({
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
});