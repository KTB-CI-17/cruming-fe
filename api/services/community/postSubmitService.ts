import { Platform } from 'react-native';
import { API_URL } from '@/api/config/index';
import * as FileSystem from 'expo-file-system';

interface PostGeneralRequest {
    title: string;
    content: string;
    files: Array<{
        originalFileName: string;
        displayOrder: number;
    }>;
}

export class PostSubmitService {
    static async submit(authMultipartFetch: any, title: string, content: string, imageUris: string[]) {
        try {
            // Create boundary for multipart form-data
            const boundary = 'X-BOUNDARY-' + Math.random().toString().slice(2);

            let body = '';

            // Add request part
            const fileMetadata = imageUris.map((_, index) => ({
                originalFileName: `image_${index + 1}.jpg`,
                displayOrder: index
            }));

            const requestData = {
                title: title.trim(),
                content: content.trim(),
                files: fileMetadata
            };

            // Add request part
            body += `--${boundary}\r\n`;
            body += 'Content-Disposition: form-data; name="request"\r\n';
            body += 'Content-Type: application/json\r\n\r\n';
            body += JSON.stringify(requestData) + '\r\n';

            // Add file parts
            for (let i = 0; i < imageUris.length; i++) {
                const uri = imageUris[i];
                const fileUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri;

                // Read file as base64
                const base64 = await FileSystem.readAsStringAsync(fileUri, {
                    encoding: FileSystem.EncodingType.Base64
                });

                body += `--${boundary}\r\n`;
                body += `Content-Disposition: form-data; name="files"; filename="image_${i + 1}.jpg"\r\n`;
                body += 'Content-Type: image/jpeg\r\n';
                body += 'Content-Transfer-Encoding: base64\r\n\r\n';
                body += base64 + '\r\n';
            }

            // End boundary
            body += `--${boundary}--\r\n`;

            console.log('Making request with boundary:', boundary);

            const response = await fetch(`${API_URL}/api/v1/posts/general`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${await authMultipartFetch.getToken()}`,
                    'Content-Type': `multipart/form-data; boundary=${boundary}`,
                },
                body: body
            });

            console.log('Response status:', response.status);
            const responseText = await response.text();
            console.log('Response body:', responseText);

            if (!response.ok) {
                throw new Error(responseText || '게시글 등록에 실패했습니다.');
            }

            return true;
        } catch (error: any) {
            console.error('Post submission error:', {
                message: error.message,
                status: error.status,
                response: error.response
            });
            throw error;
        }
    }
}