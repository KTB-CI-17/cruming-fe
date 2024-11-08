import React, { useState, useEffect } from 'react';
import { View, Image, StyleSheet, TouchableOpacity, Platform, Dimensions, LayoutChangeEvent, Text, Alert } from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import { captureRef } from 'react-native-view-shot';
import { useRouter } from 'expo-router';
import { Props, ImageInfo } from '@/api/types/hold-types';
import { AnalysisResponse } from "@/api/types/holds";

type HoldAnalysisResultProps = {
    imageUri: string;
    analysisResult: AnalysisResponse;
};

type SelectionStep = 'initial' | 'start' | 'end' | 'complete';

export default function HoldAnalysisResult({ imageUri, analysisResult }: HoldAnalysisResultProps) {
    const router = useRouter();
    const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();
    const [selectedHolds, setSelectedHolds] = useState<number[]>([]);
    const [startHold, setStartHold] = useState<number | null>(null);
    const [endHold, setEndHold] = useState<number | null>(null);
    const [imageInfo, setImageInfo] = useState<ImageInfo | null>(null);
    const [layoutInfo, setLayoutInfo] = useState<{ width: number; height: number } | null>(null);
    const [selectionStep, setSelectionStep] = useState<SelectionStep>('initial');
    const [showSaveButtons, setShowSaveButtons] = useState(true);

    const captureViewRef = React.useRef(null);
    const screenWidth = Dimensions.get('window').width;

    // 이미지 크기 계산
    useEffect(() => {
        if (!layoutInfo) return;

        Image.getSize(
            imageUri,
            (originalWidth, originalHeight) => {
                const containerWidth = layoutInfo.width;
                const containerHeight = layoutInfo.height;
                const imageRatio = originalWidth / originalHeight;
                const containerRatio = containerWidth / containerHeight;

                let displayWidth, displayHeight, offsetX, offsetY;

                if (imageRatio > containerRatio) {
                    displayWidth = containerWidth;
                    displayHeight = containerWidth / imageRatio;
                    offsetX = 0;
                    offsetY = (containerHeight - displayHeight) / 2;
                } else {
                    displayHeight = containerHeight;
                    displayWidth = containerHeight * imageRatio;
                    offsetX = (containerWidth - displayWidth) / 2;
                    offsetY = 0;
                }

                setImageInfo({
                    originalWidth,
                    originalHeight,
                    displayWidth,
                    displayHeight,
                    offsetX,
                    offsetY
                });
            },
            error => console.error('Error loading image:', error)
        );
    }, [layoutInfo, imageUri]);

    const calculateScaledCoordinates = (coordinates: any) => {
        if (!imageInfo) return { left: 0, top: 0, width: 0, height: 0 };

        const { originalWidth, originalHeight, displayWidth, displayHeight, offsetX, offsetY } = imageInfo;
        const scaleX = displayWidth / originalWidth;
        const scaleY = displayHeight / originalHeight;

        return {
            left: coordinates.x1 * scaleX + offsetX,
            top: coordinates.y1 * scaleY + offsetY,
            width: (coordinates.x2 - coordinates.x1) * scaleX,
            height: (coordinates.y2 - coordinates.y1) * scaleY,
        };
    };

    const onLayout = (event: LayoutChangeEvent) => {
        const { width, height } = event.nativeEvent.layout;
        setLayoutInfo({ width, height });
    };

    const handleHoldPress = (index: number) => {
        switch (selectionStep) {
            case 'initial':
                setSelectedHolds(prev =>
                    prev.includes(index)
                        ? prev.filter(i => i !== index)
                        : [...prev, index]
                );
                break;
            case 'start':
                if (selectedHolds.includes(index)) {
                    setStartHold(startHold === index ? null : index);
                }
                break;
            case 'end':
                if (selectedHolds.includes(index)) {
                    setEndHold(endHold === index ? null : index);
                }
                break;
        }
    };

    const getHeaderText = () => {
        switch (selectionStep) {
            case 'initial':
                return '문제로 만들 홀드를 선택해주세요';
            case 'start':
                return '시작 홀드를 선택해주세요';
            case 'end':
                return '종료 홀드를 선택해주세요';
            case 'complete':
                return '문제 생성이 완료되었습니다';
            default:
                return '';
        }
    };

    const isNextButtonEnabled = () => {
        switch (selectionStep) {
            case 'initial':
                return selectedHolds.length > 0;
            case 'start':
                return startHold !== null;
            case 'end':
                return endHold !== null;
            default:
                return false;
        }
    };

    const handleDownload = async () => {
        try {
            if (!permissionResponse?.granted) {
                const permission = await requestPermission();
                if (!permission.granted) {
                    Alert.alert('권한 필요', '갤러리 접근 권한이 필요합니다.');
                    return;
                }
            }

            // 버튼 숨기기
            setShowSaveButtons(false);

            // 잠시 대기하여 버튼이 UI에서 사라지게 함
            await new Promise(resolve => setTimeout(resolve, 100));

            // 현재 화면을 이미지로 캡처
            const capturedUri = await captureRef(captureViewRef, {
                format: 'jpg',
                quality: 1,
            });

            // 버튼 다시 표시
            setShowSaveButtons(true);

            // 갤러리에 저장
            const asset = await MediaLibrary.createAssetAsync(capturedUri);
            await MediaLibrary.createAlbumAsync('ClimbingProblems', asset, false);

            Alert.alert('저장 완료', '이미지가 갤러리에 저장되었습니다.');

            console.log('Download completed:', {
                originalUri: imageUri,
                savedUri: asset.uri,
                selectedHolds,
                startHold,
                endHold
            });
        } catch (error) {
            console.error('Download failed:', error);
            Alert.alert('저장 실패', '이미지 저장에 실패했습니다.');
            setShowSaveButtons(true);
        }
    };

    const handleCreatePost = () => {
        console.log('Problem creation data:', {
            imageUri,
            selectedHolds,
            startHold,
            endHold
        });
        router.push('/community/new');
    };

    const handleNext = () => {
        switch (selectionStep) {
            case 'initial':
                setSelectionStep('start');
                break;
            case 'start':
                setSelectionStep('end');
                break;
            case 'end':
                setSelectionStep('complete');
                break;
        }
    };

    return (
        <View style={styles.mainContainer}>
            <View style={styles.headerContainer}>
                <Text style={styles.headerText}>{getHeaderText()}</Text>
            </View>

            <View
                ref={captureViewRef}
                style={styles.captureContainer}
            >
                <View style={styles.imageContainer} onLayout={onLayout}>
                    <Image
                        source={{ uri: imageUri }}
                        style={[
                            styles.image,
                            imageInfo && {
                                width: imageInfo.displayWidth,
                                height: imageInfo.displayHeight,
                                marginLeft: imageInfo.offsetX,
                                marginTop: imageInfo.offsetY,
                            }
                        ]}
                        resizeMode="contain"
                    />
                    {imageInfo && analysisResult?.detections &&
                        analysisResult.detections.map((detection, index) => {
                            if (!detection.coordinates) return null;

                            const scaledCoords = calculateScaledCoordinates(detection.coordinates);

                            const shouldShow = selectionStep === 'initial' ||
                                (selectionStep !== 'complete' && selectedHolds.includes(index)) ||
                                (selectionStep === 'complete' && (selectedHolds.includes(index) || index === startHold || index === endHold));

                            if (!shouldShow) return null;

                            return (
                                <View key={index}>
                                    <TouchableOpacity
                                        style={[
                                            styles.holdButton,
                                            {
                                                left: scaledCoords.left,
                                                top: scaledCoords.top,
                                                width: scaledCoords.width,
                                                height: scaledCoords.height,
                                            },
                                            selectedHolds.includes(index) && styles.selectedHold,
                                            index === startHold && styles.startHold,
                                            index === endHold && styles.endHold,
                                        ]}
                                        onPress={() => selectionStep !== 'complete' && handleHoldPress(index)}
                                        activeOpacity={0.7}
                                    />
                                    {selectionStep === 'complete' && (
                                        <>
                                            {index === startHold && (
                                                <View style={[
                                                    styles.holdLabel,
                                                    {
                                                        left: scaledCoords.left + (scaledCoords.width / 2) - 20,
                                                        top: scaledCoords.top - 25,
                                                    }
                                                ]}>
                                                    <Text style={[styles.holdLabelText, { color: '#4CAF50' }]}>시작</Text>
                                                </View>
                                            )}
                                            {index === endHold && (
                                                <View style={[
                                                    styles.holdLabel,
                                                    {
                                                        left: scaledCoords.left + (scaledCoords.width / 2) - 20,
                                                        top: scaledCoords.top - 25,
                                                    }
                                                ]}>
                                                    <Text style={[styles.holdLabelText, { color: '#2196F3' }]}>종료</Text>
                                                </View>
                                            )}
                                        </>
                                    )}
                                </View>
                            );
                        })
                    }
                    {selectionStep === 'complete' && showSaveButtons && (
                        <View style={styles.overlayButtonContainer}>
                            <TouchableOpacity
                                style={[styles.actionButton, styles.downloadButton]}
                                onPress={handleDownload}
                            >
                                <Text style={[styles.buttonText, { color: '#4CAF50' }]}>다운로드</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.actionButton, styles.postButton]}
                                onPress={handleCreatePost}
                            >
                                <Text style={[styles.buttonText, { color: '#6366f1' }]}>게시글 작성하기</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            </View>

            {selectionStep !== 'complete' && (
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={[
                            styles.nextButton,
                            !isNextButtonEnabled() && styles.disabledButton
                        ]}
                        onPress={handleNext}
                        disabled={!isNextButtonEnabled()}
                    >
                        <Text style={styles.nextButtonText}>다음</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: 'white',
    },
    headerContainer: {
        paddingVertical: 16,
        paddingHorizontal: 20,
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: '#e5e5e5',
    },
    headerText: {
        fontSize: 18,
        fontWeight: '600',
        textAlign: 'center',
        color: '#333',
    },
    captureContainer: {
        flex: 1,
        backgroundColor: 'white',
    },
    imageContainer: {
        flex: 1,
        position: 'relative',
    },
    image: {
        position: 'absolute',
        backgroundColor: 'transparent',
    },
    holdButton: {
        position: 'absolute',
        borderWidth: 2,
        borderColor: 'transparent',
        backgroundColor: 'transparent',
    },
    selectedHold: {
        borderColor: 'red',
    },
    startHold: {
        borderColor: '#4CAF50',
    },
    endHold: {
        borderColor: '#2196F3',
    },
    holdLabel: {
        position: 'absolute',
        padding: 4,
        borderRadius: 4,
        backgroundColor: 'white',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    holdLabelText: {
        fontSize: 12,
        fontWeight: 'bold',
    },
    overlayButtonContainer: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        right: 20,
    },
    buttonContainer: {
        padding: 20,
        backgroundColor: 'white',
    },
    nextButton: {
        backgroundColor: '#6366f1',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
    },
    nextButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    actionButton: {
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 10,
        borderWidth: 1,
        backgroundColor: 'white',
    },
    downloadButton: {
        borderColor: '#4CAF50',
    },
    postButton: {
        borderColor: '#6366f1',
    },
    disabledButton: {
        backgroundColor: '#ccc',
    },
    buttonText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
});