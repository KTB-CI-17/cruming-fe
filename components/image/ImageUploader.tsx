import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import ImageThumbnail from './ImageThumbnail';
import { ImageFile, ImageConfig } from '@/api/types/image';
import {compressImage} from "@/utils/ImageUtils";


const DEFAULT_CONFIG: ImageConfig = {
    maxFileSize: 10 * 1024 * 1024, // 10MB
    maxFiles: 5,
    maxDimensions: {
        width: 2000,
        height: 2000
    },
    quality: 0.8,
    supportedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
};

interface ImageUploaderProps {
    images: string[];
    onImagesChange: (images: string[]) => void;
    config?: Partial<ImageConfig>;
}

export default function ImageUploader({
                                          images,
                                          onImagesChange,
                                          config: userConfig
                                      }: ImageUploaderProps) {
    const config = { ...DEFAULT_CONFIG, ...userConfig };

    const pickImage = async () => {
        try {
            const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (!permissionResult.granted) {
                Alert.alert("권한 필요", "사진 접근 권한이 필요합니다.");
                return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsMultipleSelection: true,
                selectionLimit: config.maxFiles - images.length,
                quality: 1,
                exif: false,
            });

            if (!result.canceled && result.assets.length > 0) {
                const processedImages = await Promise.all(
                    result.assets.map(async (asset) => {
                        try {
                            const compressed = await compressImage(asset.uri, {
                                maxWidth: config.maxDimensions.width,
                                maxHeight: config.maxDimensions.height,
                                quality: config.quality
                            });

                            return compressed;
                        } catch (error) {
                            Alert.alert("오류", "이미지 처리 중 오류가 발생했습니다.");
                            return null;
                        }
                    })
                );

                const validImages = processedImages.filter((image): image is string => image !== null);
                onImagesChange([...images, ...validImages].slice(0, config.maxFiles));
            }
        } catch (error) {
            Alert.alert("오류", "이미지를 선택하는 중 오류가 발생했습니다.");
        }
    };

    const removeImage = (index: number) => {
        const newImages = images.filter((_, i) => i !== index);
        onImagesChange(newImages);
    };

    return (
        <View style={styles.container}>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {images.length < config.maxFiles && (
                    <TouchableOpacity
                        style={styles.addButton}
                        onPress={pickImage}
                    >
                        <Ionicons name="camera-outline" size={32} color="#735BF2" />
                        <Text style={styles.addButtonText}>
                            {images.length}/{config.maxFiles}
                        </Text>
                    </TouchableOpacity>
                )}

                {images.map((uri, index) => (
                    <ImageThumbnail
                        key={index}
                        uri={uri}
                        onRemove={() => removeImage(index)}
                    />
                ))}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        minHeight: 116,
        marginVertical: 8,
    },
    scrollContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    addButton: {
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
    addButtonText: {
        color: '#735BF2',
        marginTop: 4,
        fontSize: 12,
    },
});