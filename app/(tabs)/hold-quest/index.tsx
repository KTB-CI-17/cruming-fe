import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useFocusEffect } from '@react-navigation/native';
import * as FileSystem from 'expo-file-system';
import HoldAnalysisLoading from "@/components/problems/HoldAnalysisLoading";
import HoldAnalysisResult from '@/components/problems/HoldAnalysisResult';
import { AnalysisResponse } from "@/api/types/holds";

export default function HoldQuest() {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [analysisComplete, setAnalysisComplete] = useState(false);
    const [analysisResult, setAnalysisResult] = useState<AnalysisResponse | null>(null);

    const pickImage = async () => {
        try {
            const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

            if (!permissionResult.granted) {
                Alert.alert('권한 오류', '갤러리 접근 권한이 필요합니다.');
                return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                quality: 1,
            });

            if (!result.canceled) {
                setSelectedImage(result.assets[0].uri);
                setAnalysisComplete(false);
                setAnalysisResult(null);
            }
        } catch (error) {
            console.error('Error picking image:', error);
            Alert.alert('오류', '이미지를 선택하는 중 문제가 발생했습니다.');
        }
    };

    const handleSubmit = async () => {
        if (!selectedImage) return;

        setIsLoading(true);
        setAnalysisComplete(false);

        try {
            const formData = new FormData();

            const fileInfo = await FileSystem.getInfoAsync(selectedImage);

            if (!fileInfo.exists) {
                throw new Error('File does not exist');
            }

            formData.append('file', {
                uri: Platform.OS === 'android' ? selectedImage : selectedImage.replace('file://', ''),
                type: 'image/jpeg',
                name: 'image.jpg',
            } as any);

            console.log('Sending request...');

            const response = await fetch('http://3.35.176.227:8000/detect', {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json',
                }
            });

            console.log('Response status:', response.status);
            const responseText = await response.text();
            console.log('Raw response:', responseText);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}, body: ${responseText}`);
            }

            try {
                const data = JSON.parse(responseText);
                console.log('Parsed data:', data);

                // API 응답 형식에 맞게 변환
                const formattedResult: AnalysisResponse = {
                    image_path: selectedImage,
                    detections: data.holds || [] // holds 배열을 detections로 사용
                };

                console.log('Formatted result:', formattedResult);
                setAnalysisResult(formattedResult);
                setAnalysisComplete(true);
            } catch (parseError) {
                console.error('JSON parsing error:', parseError);
                throw new Error('Invalid response format');
            }
        } catch (error) {
            console.error('Error during image analysis:', error);
            Alert.alert(
                '오류 발생',
                '이미지 분석 중 문제가 발생했습니다. 다시 시도해주세요.'
            );
            setAnalysisComplete(false);
            setAnalysisResult(null);
        } finally {
            setIsLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            return () => {
                setSelectedImage(null);
                setIsLoading(false);
                setAnalysisComplete(false);
                setAnalysisResult(null);
            };
        }, [])
    );

    console.log('Current state:', {
        isLoading,
        analysisComplete,
        hasAnalysisResult: !!analysisResult,
        hasSelectedImage: !!selectedImage
    });

    if (isLoading) {
        return <HoldAnalysisLoading />;
    }

    if (analysisComplete && analysisResult && selectedImage) {
        console.log('Rendering analysis result with:', analysisResult);
        return (
            <HoldAnalysisResult
                imageUri={selectedImage}
                analysisResult={analysisResult}
            />
        );
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