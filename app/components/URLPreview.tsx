import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

type MetaData = {
    title?: string;
    description?: string;
    image?: string;
    keywords?: string;
};

const fetchMetaData = async (url: string): Promise<MetaData> => {
    try {
        const response = await fetch(url);
        const text = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, 'text/html');

        // Record<string, string>로 타입 정의
        const tags: Record<string, string> = {};

        // OG 태그 추출
        const ogTags = doc.querySelectorAll('meta[property^="og:"]');
        ogTags.forEach(tag => {
            const property = tag.getAttribute('property')?.replace('og:', '');
            if (property) {
                tags[property] = tag.getAttribute('content') || '';
            }
        });

        // Keywords 추출
        const keywords = doc.querySelector('meta[name="keywords"]');
        if (keywords) {
            tags.keywords = keywords.getAttribute('content') || '';
        }

        // MetaData 타입으로 반환
        return {
            title: tags.title,
            description: tags.description,
            image: tags.image,
            keywords: tags.keywords,
        };
    } catch (error) {
        console.error("Failed to fetch metadata:", error);
        return {};
    }
};

const MetaDataPreview: React.FC<{ url: string }> = ({ url }) => {
    const [metaData, setMetaData] = useState<MetaData>({});

    useEffect(() => {
        const getMetaData = async () => {
            const data = await fetchMetaData(url);
            setMetaData(data);
        };

        getMetaData();
    }, [url]);

    return (
        <View style={styles.container}>
            <View style={styles.preview}>
                {metaData.image && <Image source={{ uri: metaData.image }} style={styles.image} />}
                <Text style={styles.title}>{metaData.title}</Text>
                <Text style={styles.description}>{metaData.description}</Text>
                {metaData.keywords && <Text style={styles.keywords}>Keywords: {metaData.keywords}</Text>}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: '#fff',
    },
    preview: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        borderRadius: 8,
        maxWidth: 300,
        width: '100%',
    },
    image: {
        width: '100%',
        height: 200,
        borderRadius: 8,
        marginBottom: 8,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    description: {
        marginBottom: 4,
    },
    keywords: {
        color: 'gray',
    },
});

export default MetaDataPreview;
