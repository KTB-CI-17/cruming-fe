import { API_URL } from '@/api/config';
import { useAuthenticatedFetch } from '@/hooks/useAuthenticatedFetch';

export function useImageService() {
    const { authFetch } = useAuthenticatedFetch();

    const loadImage = async (imageUrl: string) => {
        const response = await authFetch(`${API_URL}${imageUrl}`);
        if (!response.ok) throw new Error();
        const imageBase64 = await response.text();
        return `data:image/jpeg;base64,${imageBase64}`;
    };

    const loadImages = async (urls: string[]) => {
        const imagePromises = urls.map(async url => {
            try {
                const imageData = await loadImage(url);
                return { [url]: imageData };
            } catch (error) {
                console.error('Image loading failed:', error);
                return { [url]: null };
            }
        });

        const results = await Promise.all(imagePromises);
        return Object.assign({}, ...results);
    };

    return {
        loadImage,
        loadImages,
    };
}