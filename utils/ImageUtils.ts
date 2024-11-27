import * as ImageManipulator from 'expo-image-manipulator';
import { Alert } from 'react-native';
import { ImageDimensions } from '@/api/types/image';

interface CompressImageOptions {
    maxWidth?: number;
    maxHeight?: number;
    quality?: number;
}

/**
 * 이미지 압축 및 리사이징을 수행하는 함수
 * @param uri 원본 이미지 URI
 * @param options 압축 옵션
 * @returns 압축된 이미지의 URI
 */
export const compressImage = async (
    uri: string,
    options: CompressImageOptions = {}
): Promise<string | null> => {
    try {
        // 원본 이미지 정보 가져오기
        const imageInfo = await ImageManipulator.manipulateAsync(
            uri,
            [],
            { base64: false }
        );

        // 리사이징이 필요한 경우 새로운 크기 계산
        const resizeAction = calculateResizeDimensions(
            { width: imageInfo.width, height: imageInfo.height },
            { width: options.maxWidth || 2000, height: options.maxHeight || 2000 }
        );

        // 이미지 처리 작업 배열
        const actions: ImageManipulator.Action[] = [];

        // 리사이징이 필요한 경우 작업 추가
        if (resizeAction) {
            actions.push({ resize: resizeAction });
        }

        // 이미지 처리 실행
        const result = await ImageManipulator.manipulateAsync(
            uri,
            actions,
            {
                compress: options.quality || 0.8,
                format: ImageManipulator.SaveFormat.JPEG,
                base64: false
            }
        );

        return result.uri;
    } catch (error) {
        console.error('Image compression failed:', error);
        return null;
    }
};

/**
 * 이미지 리사이징을 위한 새로운 크기 계산
 * @param original 원본 이미지 크기
 * @param max 최대 허용 크기
 * @returns 새로운 크기 또는 리사이징이 필요없는 경우 null
 */
function calculateResizeDimensions(
    original: ImageDimensions,
    max: ImageDimensions
): { width: number; height: number } | null {
    const { width: originalWidth, height: originalHeight } = original;
    const { width: maxWidth, height: maxHeight } = max;

    // 원본이 최대 크기보다 작은 경우 리사이징 불필요
    if (originalWidth <= maxWidth && originalHeight <= maxHeight) {
        return null;
    }

    // 가로세로 비율 계산
    const ratio = Math.min(maxWidth / originalWidth, maxHeight / originalHeight);

    return {
        width: Math.round(originalWidth * ratio),
        height: Math.round(originalHeight * ratio)
    };
}

/**
 * 파일 크기 검증
 * @param uri 이미지 URI
 * @param maxSize 최대 허용 크기 (bytes)
 * @returns 검증 결과
 */
export const validateImageSize = async (uri: string, maxSize: number): Promise<boolean> => {
    try {
        const response = await fetch(uri);
        const blob = await response.blob();
        return blob.size <= maxSize;
    } catch (error) {
        console.error('Image size validation failed:', error);
        return false;
    }
};