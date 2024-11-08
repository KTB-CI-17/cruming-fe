import React, { useState, useEffect } from 'react';
import { View, Image, StyleSheet, TouchableOpacity, Platform, Dimensions, LayoutChangeEvent, Text, Alert } from 'react-native';
import { GestureHandlerRootView, PinchGestureHandler } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import * as MediaLibrary from 'expo-media-library';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
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

    const scale = useSharedValue(1);
    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);

    const screenWidth = Dimensions.get('window').width;

    // 애니메이션 스타일
    const animatedStyle = useAnimatedStyle(() => ({
        transform: [
            { translateX: translateX.value },
            { translateY: translateY.value },
            { scale: scale.value },
        ],
    }));

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

    const onPinchEvent = ({ nativeEvent }: any) => {
        scale.value = Math.max(1, Math.min(5, nativeEvent.scale));
        translateX.value = nativeEvent.focalX;
        translateY.value = nativeEvent.focalY;
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
            // 권한 확인
            if (!permissionResponse?.granted) {
                const permission = await requestPermission();
                if (!permission.granted) {
                    Alert.alert('권한 필요', '갤러리 접근 권한이 필요합니다.');
                    return;
                }
            }

            // 현재 이미지 처리
            const manipResult = await manipulateAsync(
                imageUri,
                [], // 여기에 필요한 이미지 처리 작업을 추가할 수 있습니다
                { compress: 1, format: SaveFormat.JPEG }
            );

            // 갤러리에 저장
            const asset = await MediaLibrary.createAssetAsync(manipResult.uri);
            await MediaLibrary.createAlbumAsync('ClimbingProblems', asset, false);

            // 성공 메시지
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
        }
    };

    const handleCreatePost = () => {
        // 문제 생성 데이터를 콘솔에 출력
        console.log('Problem creation data:', {
            imageUri,
            selectedHolds,
            startHold,
            endHold
        });

        // 게시글 작성 페이지로 이동
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
                <Text style={styles.headerText}>
                    {getHeaderText()}
                </Text>
            </View>
            <GestureHandlerRootView style={styles.container}>
                <View style={styles.imageContainer} onLayout={onLayout}>
                    <PinchGestureHandler onGestureEvent={onPinchEvent}>
                        <Animated.View style={[styles.animatedContainer, animatedStyle]}>
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
                            {imageInfo && analysisResult?.detections && analysisResult.detections.map((detection, index) => {
                                if (!detection.coordinates) return null;

                                const scaledCoords = calculateScaledCoordinates(detection.coordinates);

                                // 각 단계별로 표시할 홀드 필터링
                                const shouldShow = selectionStep === 'initial' ||
                                    (selectionStep !== 'complete' && selectedHolds.includes(index)) ||
                                    (selectionStep === 'complete' && (selectedHolds.includes(index) || index === startHold || index === endHold));

                                if (!shouldShow) return null;

                                return (
                                    <TouchableOpacity
                                        key={index}
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
                                        onPress={() => handleHoldPress(index)}
                                        activeOpacity={0.7}
                                    />
                                );
                            })}
                        </Animated.View>
                    </PinchGestureHandler>
                </View>
            </GestureHandlerRootView>

            <View style={styles.buttonContainer}>
                {selectionStep !== 'complete' ? (
                    <TouchableOpacity
                        style={[
                            styles.nextButton,
                            !isNextButtonEnabled() && styles.disabledButton
                        ]}
                        onPress={handleNext}
                        disabled={!isNextButtonEnabled()}
                    >
                        <Text style={styles.buttonText}>다음</Text>
                    </TouchableOpacity>
                ) : (
                    <>
                        <TouchableOpacity
                            style={[styles.actionButton, styles.downloadButton]}
                            onPress={handleDownload}
                        >
                            <Text style={styles.buttonText}>다운로드</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.actionButton, styles.postButton]}
                            onPress={handleCreatePost}
                        >
                            <Text style={styles.buttonText}>게시글 작성하기</Text>
                        </TouchableOpacity>
                    </>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
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
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    imageContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
    },
    animatedContainer: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: {
        position: 'absolute',
        backgroundColor: 'transparent',
        ...Platform.select({
            ios: {
                zIndex: 1,
            },
            android: {
                elevation: 1,
            },
        }),
    },
    holdButton: {
        position: 'absolute',
        borderWidth: 2,
        borderColor: 'transparent',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        ...Platform.select({
            ios: {
                zIndex: 2,
            },
            android: {
                elevation: 2,
            },
        }),
    },
    selectedHold: {
        borderColor: 'red',
        backgroundColor: 'rgba(255, 0, 0, 0.2)',
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
    actionButton: {
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 10,
    },
    downloadButton: {
        backgroundColor: '#4CAF50',
    },
    postButton: {
        backgroundColor: '#6366f1',
    },
    disabledButton: {
        backgroundColor: '#ccc',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    startHold: {
        borderColor: '#4CAF50',
        backgroundColor: 'rgba(76, 175, 80, 0.2)',
    },
    endHold: {
        borderColor: '#2196F3',
        backgroundColor: 'rgba(33, 150, 243, 0.2)',
    },
});