export interface Coordinates {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
}

export interface Detection {
    coordinates: Coordinates;
    confidence: number;
    label: string;
}

export interface AnalysisResponse {
    detections: Detection[];
    imageUrl: string;
    message: string;
    status: string;
}

export interface CreateProblemRequest {
    imageUri: string;
    selectedHolds: number[];
    startHold: number;
    endHold: number;
}