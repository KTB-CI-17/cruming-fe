import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Pressable, ScrollView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

interface ImageUploadAreaProps {
    images: string[];
    maxImages?: number;
    onImagesChange: (images: string[]) => void;
}

export default function ImageUploadArea({
                                            images,
                                            maxImages = 5,
                                            onImagesChange
                                        }: ImageUploadAreaProps) {
    const pickImage = async () => {
        try {
            // Request permissions first
            const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

            if (!permissionResult.granted) {
                alert("사진 접근 권한이 필요합니다.");
                return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsMultipleSelection: true,
                selectionLimit: maxImages - images.length,
                quality: 0.8,
                exif: false,
                allowsEditing: false,
            });

            if (!result.canceled && result.assets.length > 0) {
                const newImages = result.assets.map(asset => asset.uri);
                const updatedImages = [...images, ...newImages].slice(0, maxImages);
                onImagesChange(updatedImages);
            }
        } catch (error) {
            console.error('Error picking images:', error);
            alert('이미지를 선택하는 중 오류가 발생했습니다.');
        }
    };

    const removeImage = (index: number) => {
        const newImages = images.filter((_, i) => i !== index);
        onImagesChange(newImages);
    };

    return (
        <View style={styles.imageSection}>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.imageScrollView}
                contentContainerStyle={styles.imageScrollContent}
            >
                <Pressable style={styles.imageRow}>
                    {images.length < maxImages && (
                        <TouchableOpacity
                            style={styles.addImageButton}
                            onPress={pickImage}
                        >
                            <Ionicons name="camera-outline" size={32} color="#735BF2" />
                            <Text style={styles.addImageText}>
                                {images.length}/{maxImages}
                            </Text>
                        </TouchableOpacity>
                    )}

                    {images.map((uri, index) => (
                        <Pressable key={index} style={styles.imageContainer}>
                            <Image
                                source={{ uri }}
                                style={styles.image}
                                resizeMode="cover"
                            />
                            <TouchableOpacity
                                style={styles.removeButton}
                                onPress={() => removeImage(index)}
                                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                            >
                                <Ionicons name="close-circle" size={24} color="#735BF2" />
                            </TouchableOpacity>
                        </Pressable>
                    ))}
                </Pressable>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    imageSection: {
        marginVertical: 8,
        minHeight: 116,
    },
    imageScrollView: {
        flex: 1,
    },
    imageScrollContent: {
        flexGrow: 1,
    },
    imageRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    imageContainer: {
        width: 100,
        height: 100,
        marginRight: 12,
        position: 'relative',
    },
    image: {
        width: '100%',
        height: '100%',
        borderRadius: 8,
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
    },
    removeButton: {
        position: 'absolute',
        top: -8,
        right: -8,
        backgroundColor: 'white',
        borderRadius: 12,
        zIndex: 1,
    },
    addImageText: {
        color: '#735BF2',
        marginTop: 4,
        fontSize: 12,
    },
});
