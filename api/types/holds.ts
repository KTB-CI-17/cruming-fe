// src/types/holds.ts

export interface Coordinates {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
}

export interface HoldDetection {
    coordinates: Coordinates;
    confidence: number;
    class_id: number;
}

export interface AnalysisResponse {
    image_path: string;
    detections: HoldDetection[];
}
