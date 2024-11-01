import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, Alert, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import LocationSearch from "@/components/common/LocationSearchArea";

// 사용자 프로필 타입 정의
type UserProfile = {
    nickname: string;
    snsLink?: string;
    height?: string;
    armReach?: string;
    gym?: string;
    introduction?: string;
    profileImage?: string;
};

// 더미 데이터 (API 연동 전까지 사용)
const dummyUserProfile: UserProfile = {
    nickname: "벽타는 낙타",
    snsLink: "@climbing_camel",
    height: "180",
    armReach: "185",
    gym: "클라이밍 파크",
    introduction: "안녕하세요. 클라이밍 시작한 지 1년 된 초보 클라이머입니다!",
    profileImage: "https://cdn.shopify.com/s/files/1/0604/5140/0302/products/scarpa-instinct-vs-womens-climbing-shoes_1.jpg"
};

// API 호출 함수 - 실제 구현 시 사용
const fetchUserProfile = async (): Promise<UserProfile> => {
    // 실제 API 호출로 대체될 부분
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(dummyUserProfile);
        }, 500);
    });
};

export default function ProfileEditPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [profile, setProfile] = useState<UserProfile>({
        nickname: '',
        snsLink: '',
        height: '',
        armReach: '',
        gym: '',
        introduction: '',
    });
    const [profileImage, setProfileImage] = useState<string | null>(null);

    useEffect(() => {
        const loadUserProfile = async () => {
            try {
                setIsLoading(true);
                const userData = await fetchUserProfile();
                setProfile(userData);
                if (userData.profileImage) {
                    setProfileImage(userData.profileImage);
                }
            } catch (error) {
                console.error('Error loading user profile:', error);
                alert('프로필 정보를 불러오는데 실패했습니다.');
            } finally {
                setIsLoading(false);
            }
        };

        loadUserProfile();
    }, []);

    const pickImage = async () => {
        try {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

            if (status !== 'granted') {
                alert('카메라 롤 접근 권한이 필요합니다.');
                return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 1,
            });

            if (!result.canceled) {
                setProfileImage(result.assets[0].uri);
            }
        } catch (error) {
            console.error('Error picking image:', error);
            alert('이미지 선택 중 오류가 발생했습니다.');
        }
    };

    const handleGymSelect = (location: string) => {
        setProfile(prev => ({ ...prev, gym: location }));
    };

    const handleSave = async () => {
        try {
            console.log('Saving profile:', { ...profile, profileImage });
            Alert.alert(
                "알림",
                "프로필이 저장되었습니다.",
                [
                    {
                        text: "확인",
                        onPress: () => router.back()
                    }
                ]
            );
        } catch (error) {
            console.error('Error saving profile:', error);
            Alert.alert(
                "오류",
                "프로필 저장 중 오류가 발생했습니다.",
                [
                    { text: "확인" }
                ]
            );
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <ScrollView style={styles.scrollView}>
                {/* 프로필 이미지 섹션은 동일... */}

                <View style={styles.formSection}>
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>* 닉네임</Text>
                        <TextInput
                            style={styles.input}
                            value={profile.nickname}
                            onChangeText={(text) => setProfile(prev => ({ ...prev, nickname: text }))}
                            placeholder="닉네임을 입력하세요"
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>SNS Link</Text>
                        <TextInput
                            style={styles.input}
                            value={profile.snsLink}
                            onChangeText={(text) => setProfile(prev => ({ ...prev, snsLink: text }))}
                            placeholder="SNS 링크를 입력하세요"
                        />
                    </View>

                    <View style={styles.rowContainer}>
                        <View style={[styles.inputContainer, { flex: 1, marginRight: 8 }]}>
                            <Text style={styles.label}>키</Text>
                            <TextInput
                                style={styles.input}
                                value={profile.height}
                                onChangeText={(text) => setProfile(prev => ({ ...prev, height: text }))}
                                placeholder="키"
                                keyboardType="numeric"
                            />
                        </View>
                        <View style={[styles.inputContainer, { flex: 1, marginLeft: 8 }]}>
                            <Text style={styles.label}>팔 길이</Text>
                            <TextInput
                                style={styles.input}
                                value={profile.armReach}
                                onChangeText={(text) => setProfile(prev => ({ ...prev, armReach: text }))}
                                placeholder="팔 길이"
                                keyboardType="numeric"
                            />
                        </View>
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>주 암장</Text>
                        <LocationSearch
                            value={profile.gym || ''}
                            onLocationSelect={handleGymSelect}
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>한줄 소개</Text>
                        <TextInput
                            style={[styles.input, styles.multilineInput]}
                            value={profile.introduction}
                            onChangeText={(text) => setProfile(prev => ({ ...prev, introduction: text }))}
                            placeholder="한줄 소개를 입력하세요"
                            multiline
                        />
                    </View>

                    <View>
                        <TouchableOpacity
                            style={[
                                styles.saveButton,
                                (!profile.nickname.trim() && styles.saveButtonDisabled)
                            ]}
                            onPress={handleSave}
                            disabled={!profile.nickname.trim()}
                        >
                            <Text style={styles.saveButtonText}>저장</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scrollView: {
        flex: 1,
    },
    imageSection: {
        alignItems: 'center',
        paddingVertical: 20,
    },
    imageContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        position: 'relative',
    },
    profileImage: {
        width: '100%',
        height: '100%',
        borderRadius: 50,
    },
    imageEditButton: {
        position: 'absolute',
        right: -8,
        bottom: -8,
        backgroundColor: '#735BF2',
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    formSection: {
        padding: 20,
    },
    inputContainer: {
        marginBottom: 15,
    },
    rowContainer: {
        flexDirection: 'row',
    },
    label: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: '#E5E5E5',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
    },
    multilineInput: {
        height: 100,
        textAlignVertical: 'top',
    },
    saveButton: {
        backgroundColor: '#735BF2',
        paddingVertical: 16,
        borderRadius: 8,
        alignItems: 'center',
    },
    saveButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    saveButtonDisabled: {
        backgroundColor: '#ccc',
    },
});
