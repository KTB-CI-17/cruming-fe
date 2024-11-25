import { useLocalSearchParams, Stack, router } from 'expo-router';
import {
    View, Text, TouchableOpacity, StyleSheet, ScrollView, Image,
    Dimensions, TextInput, Alert, ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import React, { useState, useEffect, useRef } from 'react';
import { API_URL } from '@/api/config/index';
import { useAuthenticatedFetch } from '@/hooks/useAuthenticatedFetch';

const { width } = Dimensions.get('window');

export default function PostDetailPage() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const [post, setPost] = useState<Post | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [imagesCache, setImagesCache] = useState<{[key: string]: string}>({});
    const scrollViewRef = useRef<ScrollView>(null);
    const { authFetch } = useAuthenticatedFetch();

    useEffect(() => {
        const loadAllImages = async () => {
            if (!post) return;

            const imagePromises = post.files.map(async file => {
                try {
                    const response = await authFetch(`${API_URL}${file.url}`);
                    const imageBase64 = await response.text();
                    return { [file.url]: `data:image/jpeg;base64,${imageBase64}` };
                } catch (error) {
                    console.error('Image loading failed:', error);
                    return { [file.url]: null };
                }
            });

            const results = await Promise.all(imagePromises);
            const cache = Object.assign({}, ...results);
            setImagesCache(cache);
        };

        loadAllImages();
    }, [post]);

    const fetchPost = async () => {
        try {
            setIsLoading(true);
            const response = await authFetch(`${API_URL}/api/v1/posts/${id}`);
            if (!response.ok) throw new Error();
            const data = await response.json();
            setPost(data);
        } catch (error) {
            setError("게시글을 불러오는데 실패했습니다.");
            Alert.alert("오류", "게시글을 불러오는데 실패했습니다.", [
                { text: "확인", onPress: () => router.back() }
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPost();
    }, [id]);

    if (isLoading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text style={styles.loadingText}>게시글을 불러오는 중...</Text>
            </View>
        );
    }

    if (error || !post) {
        return (
            <View style={styles.centerContainer}>
                <Text style={styles.errorText}>{error}</Text>
                <TouchableOpacity style={styles.retryButton} onPress={() => router.back()}>
                    <Text style={styles.retryButtonText}>뒤로가기</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <>
            <Stack.Screen
                options={{
                    headerLeft: () => (
                        <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
                            <Ionicons name="arrow-back" size={24} color="black" />
                        </TouchableOpacity>
                    ),
                    headerTitle: "",
                    headerShadowVisible: false,
                    headerStyle: { backgroundColor: '#FFFFFF' },
                }}
            />
            <ScrollView style={styles.container}>
                <View style={styles.header}>
                    <View style={styles.profileContainer}>
                        <Image
                            source={require('@/assets/images/default-profile.png')}
                            style={styles.profileImage}
                        />
                        <View>
                            <Text style={styles.nickname}>{post.userNickname}</Text>
                            <Text style={styles.instagramId}>@ instagram-id</Text>
                        </View>
                    </View>
                    <TouchableOpacity>
                        <Ionicons name="ellipsis-horizontal" size={24} color="#666" />
                    </TouchableOpacity>
                </View>

                <Text style={styles.title}>{post.title}</Text>

                <ScrollView
                    ref={scrollViewRef}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    onScroll={e => {
                        const offsetX = e.nativeEvent.contentOffset.x;
                        setCurrentImageIndex(Math.round(offsetX / width));
                    }}
                    scrollEventThrottle={16}
                >
                    {post.files.map((file) => (
                        <View key={file.id} style={styles.imageContainer}>
                            {imagesCache[file.url] ? (
                                <Image source={{ uri: imagesCache[file.url] }} style={styles.image} />
                            ) : (
                                <ActivityIndicator style={styles.image} />
                            )}
                        </View>
                    ))}
                </ScrollView>

                {post.files.length > 1 && (
                    <View style={styles.pagination}>
                        {post.files.map((_, index) => (
                            <View
                                key={index}
                                style={[
                                    styles.paginationDot,
                                    currentImageIndex === index && styles.paginationDotActive
                                ]}
                            />
                        ))}
                    </View>
                )}

                <View style={styles.locationLevel}>
                    <View style={styles.locationContainer}>
                        <Ionicons name="location-outline" size={16} color="#666" />
                        <Text style={styles.location}>{post.location}</Text>
                    </View>
                    <Text style={styles.level}>LV. {post.level}</Text>
                </View>

                <Text style={styles.content}>{post.content}</Text>

                <View style={styles.actionButtons}>
                    <TouchableOpacity style={styles.actionButton}>
                        <Ionicons name="chatbubble-outline" size={24} color="#666" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionButton}>
                        <Ionicons name="heart-outline" size={24} color="#666" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionButton}>
                        <Ionicons name="share-social-outline" size={24} color="#666" />
                    </TouchableOpacity>
                </View>

                <View style={styles.commentInput}>
                    <TextInput
                        placeholder="답글을 입력해주세요."
                        style={styles.input}
                    />
                </View>
            </ScrollView>
        </>
    );
}

interface Post {
    id: number;
    title: string;
    content: string;
    location: string;
    level: number;
    category: string;
    visibility: string;
    createdAt: string;
    userId: number;
    userNickname: string;
    isWriter: boolean;
    files: File[];
}

interface File {
    id: number;
    fileName: string;
    fileKey: string;
    url: string;
    fileType: string;
    fileSize: number;
    displayOrder: number;
    userId: number;
    status: string;
    createdAt: string;
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        padding: 20,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
    },
    profileContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    profileImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    nickname: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    instagramId: {
        fontSize: 14,
        color: '#666',
    },
    title: {
        fontSize: 18,
        fontWeight: '500',
        padding: 16,
        paddingTop: 0,
    },
    imageContainer: {
        width: width,
        height: width,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: width,
        height: width,
    },
    pagination: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 6,
        marginTop: 8,
    },
    paginationDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#D9D9D9',
    },
    paginationDotActive: {
        backgroundColor: '#666',
    },
    locationLevel: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
    },
    locationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    location: {
        fontSize: 14,
        color: '#666',
    },
    level: {
        fontSize: 14,
        color: '#666',
    },
    content: {
        fontSize: 16,
        lineHeight: 24,
        padding: 16,
        paddingTop: 0,
    },
    actionButtons: {
        flexDirection: 'row',
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: '#EEEEEE',
    },
    actionButton: {
        marginRight: 16,
    },
    commentInput: {
        padding: 16,
        paddingTop: 0,
    },
    input: {
        backgroundColor: '#F5F5F5',
        padding: 12,
        borderRadius: 8,
    },
    headerButton: {
        padding: 8,
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#666',
    },
    errorText: {
        fontSize: 16,
        color: '#ff0000',
        marginBottom: 20,
        textAlign: 'center',
    },
    retryButton: {
        backgroundColor: '#007AFF',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
    },
    retryButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
    }
});