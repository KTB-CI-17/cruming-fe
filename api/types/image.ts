export type SupportedImageType = 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp';

export interface ImageFile {
    uri: string;
    type?: SupportedImageType;
    fileName?: string;
    fileSize?: number;
}

export interface ImageDimensions {
    width: number;
    height: number;
}

export interface ImageConfig {
    maxFileSize: number; // 10MB in bytes
    maxFiles: number; // 5
    maxDimensions: ImageDimensions; // 2000x2000
    quality: number; // 0.8
    supportedTypes: SupportedImageType[];
}

export type ImageLoadingState = 'idle' | 'loading' | 'error' | 'success';

export interface ImageError {
    code: 'SIZE_EXCEEDED' | 'INVALID_TYPE' | 'COMPRESSION_FAILED' | 'LOAD_FAILED';
    message: string;
}