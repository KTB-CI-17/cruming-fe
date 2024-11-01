import { AnalysisResponse } from '@/api/types/holds';

export interface Props {
    imageUri: string;
}

export interface ImageInfo {
    originalWidth: number;
    originalHeight: number;
    displayWidth: number;
    displayHeight: number;
    offsetX: number;
    offsetY: number;
}

// PinchGestureHandler의 context 타입 수정
export type PinchContext = {
    scale: number;
    translateX: number;
    translateY: number;
    oldScale?: number;
    focusX?: number;
    focusY?: number;
}
