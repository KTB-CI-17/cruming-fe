// api/services/holdService.ts
import { AnalysisResponse, CreateProblemRequest } from '../types/holds';

export const analyzeHolds = async (imageUri: string): Promise<AnalysisResponse> => {
    try {
        // TODO: Implement actual API call
        // 더미 데이터 반환
        return {
            status: 'success',
            message: 'Analysis completed successfully',
            imageUrl: imageUri,
            detections: [
                {
                    coordinates: { x1: 100, y1: 100, x2: 150, y2: 150 },
                    confidence: 0.95,
                    label: 'hold'
                },
                {
                    coordinates: { x1: 200, y1: 200, x2: 250, y2: 250 },
                    confidence: 0.92,
                    label: 'hold'
                },
                // 더 많은 더미 홀드 데이터 추가 가능
            ]
        };
    } catch (error) {
        console.error('Error analyzing holds:', error);
        throw error;
    }
};

export const createProblem = async (data: CreateProblemRequest) => {
    try {
        // TODO: Implement actual API call
        // 요청 데이터 콘솔에 출력
        console.log('Create Problem Request:', {
            imageUri: data.imageUri,
            selectedHolds: data.selectedHolds,
            startHold: data.startHold,
            endHold: data.endHold
        });

        return {
            status: 'success',
            message: 'Problem created successfully'
        };
    } catch (error) {
        console.error('Error creating problem:', error);
        throw error;
    }
};