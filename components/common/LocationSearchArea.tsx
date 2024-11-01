import React, { useState } from 'react';
import {
    View,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    FlatList,
    Text,
    Platform, Modal, ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Document {
    place_name: string;
    road_address_name: string;
    address_name: string;
    phone: string;
    place_url: string;
    category_name: string;
    x: string;  // longitude
    y: string;  // latitude
}

interface Meta {
    total_count: number;
    pageable_count: number;
    is_end: boolean;
    same_name: {
        keyword: string;
        region: string[];
        selected_region: string;
    };
}

export interface KakaoKeywordResponse {
    meta: Meta;
    documents: Document[];
}

interface LocationData {
    placeName: string;
    roadAddress: string;
}

interface LocationSearchProps {
    value: string;
    onLocationSelect: (location: LocationData) => void;
}



export default function LocationSearch({ value, onLocationSelect }: LocationSearchProps) {
    const [searchText, setSearchText] = useState(value);
    const [searchResults, setSearchResults] = useState<Document[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [isSearching, setIsSearching] = useState(false);

    const handleTextChange = (text: string) => {
        setSearchText(text);
        if (text.length === 0) {
            setSearchResults([]);
            setPage(1);
            setHasMore(true);
        }
    };

    const searchAddress = async (pageNumber: number = 1, isNewSearch: boolean = true) => {
        if (isLoading || (pageNumber > 1 && !hasMore)) return;

        try {
            setIsLoading(true);
            if (isNewSearch) {
                setIsSearching(true);
            }

            const response = await fetch(
                `https://dapi.kakao.com/v2/local/search/keyword?query=${encodeURIComponent(searchText)}&page=${pageNumber}&size=15`,
                {
                    method: 'GET',
                    headers: {
                        Authorization: `KakaoAK ${process.env.EXPO_PUBLIC_KAKAO_REST_API_KEY}`,
                    },
                }
            );

            if (!response.ok) {
                throw new Error('주소 검색 실패');
            }

            const data: KakaoKeywordResponse = await response.json();

            // 새로운 검색이면 결과를 대체하고, 아니면 기존 결과에 추가
            if (isNewSearch) {
                setSearchResults(data.documents);
                setShowModal(true);
            } else {
                setSearchResults(prev => [...prev, ...data.documents]);
            }

            // 더 불러올 데이터가 있는지 확인
            setHasMore(
                data.meta.is_end === false &&
                data.meta.pageable_count > pageNumber * 15
            );

            setPage(pageNumber);

        } catch (error) {
            console.error('주소 검색 중 오류 발생:', error);
            if (isNewSearch) {
                setSearchResults([]);
            }
        } finally {
            setIsLoading(false);
            if (isNewSearch) {
                setIsSearching(false);
            }
        }
    };

    const handleLoadMore = () => {
        if (!isLoading && hasMore) {
            searchAddress(page + 1, false);
        }
    };

    const handleLocationSelect = (location: Document) => {
        setSearchText(location.place_name);
        setShowModal(false);
        // 모달이 닫힐 때 검색 상태 초기화
        setPage(1);
        setHasMore(true);
        setSearchResults([]);

        const locationData: LocationData = {
            placeName: location.place_name,
            roadAddress: location.road_address_name,
        };
        onLocationSelect(locationData);
    };

    const renderFooter = () => {
        if (!isLoading) return null;
        return (
            <View style={styles.loadingFooter}>
                <ActivityIndicator size="small" color="#0080FF" />
            </View>
        );
    };

    const renderItem = ({ item }: { item: Document }) => (
        <TouchableOpacity
            style={styles.resultItem}
            onPress={() => handleLocationSelect(item)}
        >
            <Text style={styles.placeName}>{item.place_name}</Text>
            <Text style={styles.roadAddress}>{item.road_address_name}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="* 위치"
                    placeholderTextColor="#8F9BB3"
                    value={searchText}
                    onChangeText={handleTextChange}
                />
                <TouchableOpacity
                    style={styles.searchIconButton}
                    onPress={() => searchAddress(1, true)}
                    disabled={isSearching}
                >
                    {isSearching ? (
                        <ActivityIndicator size="small" color="#8F9BB3" />
                    ) : (
                        <Ionicons name="search" size={18} color="#8F9BB3" />
                    )}
                </TouchableOpacity>
            </View>

            <Modal
                visible={showModal}
                transparent={true}
                animationType="fade"
                onRequestClose={() => {
                    setShowModal(false);
                    setPage(1);
                    setHasMore(true);
                    setSearchResults([]);
                }}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>위치 검색 결과</Text>
                            <TouchableOpacity
                                onPress={() => {
                                    setShowModal(false);
                                    setPage(1);
                                    setHasMore(true);
                                    setSearchResults([]);
                                }}
                                style={styles.closeButton}
                            >
                                <Ionicons name="close" size={24} color="#2E3A59" />
                            </TouchableOpacity>
                        </View>
                        {searchResults.length > 0 ? (
                            <FlatList
                                data={searchResults}
                                renderItem={renderItem}
                                keyExtractor={(item, index) => `${item.place_name}-${index}`}
                                style={styles.resultsList}
                                contentContainerStyle={styles.resultsContent}
                                onEndReached={handleLoadMore}
                                onEndReachedThreshold={0.5}
                                ListFooterComponent={renderFooter}
                            />
                        ) : (
                            <View style={styles.noResultsContainer}>
                                <Text style={styles.noResultsText}>검색 결과가 없습니다.</Text>
                            </View>
                        )}
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        position: 'relative',
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#E4E9F2',
        borderRadius: 8,
        padding: 12,
        paddingRight: 40,
    },
    searchIconButton: {
        position: 'absolute',
        right: 8,
        padding: 4,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: 12,
        width: '90%',
        maxHeight: '70%',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
            },
            android: {
                elevation: 5,
            },
        }),
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E4E9F2',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#2E3A59',
    },
    closeButton: {
        padding: 4,
    },
    resultsList: {
        maxHeight: 400,
    },
    resultsContent: {
        paddingBottom: 8,
    },
    resultItem: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E4E9F2',
    },
    placeName: {
        fontSize: 16,
        fontWeight: '500',
        color: '#2E3A59',
        marginBottom: 4,
    },
    roadAddress: {
        fontSize: 14,
        color: '#8F9BB3',
    },
    noResultsContainer: {
        padding: 20,
        alignItems: 'center',
    },
    noResultsText: {
        fontSize: 16,
        color: '#8F9BB3',
    },
    loadingFooter: {
        paddingVertical: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
