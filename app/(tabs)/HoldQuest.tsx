import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useFocusEffect } from '@react-navigation/native';
import HoldAnalysisLoading from "@/app/page/hold-quest/HoldAnalysisLoading";

export default function HoldQuest() {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const pickImage = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (!permissionResult.granted) {
            alert('갤러리 접근 권한이 필요합니다.');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setSelectedImage(result.assets[0].uri);
        }
    };

    const handleSubmit = () => {
        if (selectedImage) {
            setIsLoading(true);
        }
    };

    useFocusEffect(
        useCallback(() => {
            setSelectedImage(null);
            setIsLoading(false);
        }, [])
    );

    if (isLoading) {
        return <HoldAnalysisLoading />;
    }

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.imageContainer}
                onPress={pickImage}
            >
                {selectedImage ? (
                    <Image
                        source={{ uri: selectedImage }}
                        style={styles.selectedImage}
                    />
                ) : (
                    <>
                        <Ionicons name="camera" size={40} color="#8F9BB3" />
                        <Text style={styles.imageText}>사진 선택</Text>
                    </>
                )}
            </TouchableOpacity>

            <Text style={styles.tipText}>
                Tip. 홀드가 잘 보이게 찍어주세요.
            </Text>

            <TouchableOpacity
                style={[
                    styles.submitButton,
                    !selectedImage && styles.submitButtonDisabled
                ]}
                disabled={!selectedImage}
                onPress={handleSubmit}
            >
                <Text style={styles.submitButtonText}>홀드 좌표 추출</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        padding: 20,
    },
    imageContainer: {
        flex: 1,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#E4E9F2',
        borderStyle: 'dashed',
        overflow: 'hidden',
    },
    imageText: {
        marginTop: 12,
        fontSize: 16,
        color: '#8F9BB3',
    },
    selectedImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
    },
    tipText: {
        fontSize: 14,
        color: '#1A1F36',
        marginBottom: 20,
    },
    submitButton: {
        backgroundColor: '#735BF2',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: 20,
    },
    submitButtonDisabled: {
        backgroundColor: '#E4E9F2',
    },
    submitButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
});
