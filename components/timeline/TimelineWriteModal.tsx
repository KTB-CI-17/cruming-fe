import React, { useState, useEffect, useRef } from 'react';
import {
    Modal,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    Platform,
    ScrollView,
    Animated,
    Dimensions
} from 'react-native';
import { BlurView } from 'expo-blur';
import { X } from 'lucide-react-native';
import { Ionicons } from '@expo/vector-icons';
import ImageUploadArea from '../../components/common/ImageUploadArea';
import LocationSearchArea from '../../components/common/LocationSearchArea';
import DatePickerArea from "@/components/common/DatePickerArea";

type TimelineWriteModalProps = {
    visible: boolean;
    onClose: () => void;
};

type PrivacyType = '전체 공개' | '팔로워 공개' | '나만보기';

interface TimelineFormData {
    location: string;
    activityDate: string;
    level: string;
    content: string;
    images: string[];
    privacy: PrivacyType;
}

const initialFormData: TimelineFormData = {
    location: '',
    activityDate: '',
    level: '',
    content: '',
    images: [],
    privacy: '전체 공개'
};

interface FormInputProps {
    value: string;
    placeholder: string;
    onChangeText?: (text: string) => void;
    onPress?: () => void;
    iconName?: keyof typeof Ionicons.glyphMap;
    editable?: boolean;
}

function FormInput({
                       value,
                       placeholder,
                       onChangeText,
                       onPress,
                       iconName,
                       editable = true
                   }: FormInputProps) {
    if (onPress) {
        return (
            <TouchableOpacity style={styles.input} onPress={onPress}>
                <Text style={[styles.inputText, value ? styles.filledInput : {}]}>
                    {value || placeholder}
                </Text>
                {iconName && <Ionicons name={iconName} size={20} color="#8F9BB3" />}
            </TouchableOpacity>
        );
    }

    return (
        <TextInput
            style={styles.input}
            placeholder={placeholder}
            placeholderTextColor="#8F9BB3"
            value={value}
            onChangeText={onChangeText}
            editable={editable}
        />
    );
}

export default function TimelineWriteModal({ visible, onClose }: TimelineWriteModalProps) {
    const [modalVisible, setModalVisible] = useState(visible);
    const [formData, setFormData] = useState<TimelineFormData>(initialFormData);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const slideAnim = useRef(new Animated.Value(0)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const screenHeight = Dimensions.get('window').height;
    const modalHeight = screenHeight * 0.9;

    useEffect(() => {
        if (visible) {
            setModalVisible(true);
            slideAnim.setValue(modalHeight);
            fadeAnim.setValue(0);

            Animated.parallel([
                Animated.timing(slideAnim, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
            ]).start();
        }
    }, [visible]);

    const validateForm = () => {
        const requiredFields: { field: keyof TimelineFormData; label: string }[] = [
            { field: 'location', label: '위치' },
            { field: 'activityDate', label: '활동 일자' },
            { field: 'level', label: 'Level' },
            { field: 'content', label: '내용' }
        ];

        const emptyFields = requiredFields
            .filter(({ field }) => !formData[field] || formData[field].toString().trim() === '')
            .map(({ label }) => label);

        if (emptyFields.length > 0) {
            Alert.alert(
                "입력 오류",
                `다음 항목을 입력해주세요:\n${emptyFields.join('\n')}`,
                [{ text: "확인" }]
            );
            return false;
        }

        return true;
    };

    const hasInputValues = () => {
        return (
            formData.location.trim() !== '' ||
            formData.activityDate !== '' ||
            formData.level !== '' ||
            formData.content.trim() !== '' ||
            formData.images.length > 0 ||
            formData.privacy !== '전체 공개'
        );
    };

    const closeWithAnimation = (afterClose?: () => void) => {
        if (!hasInputValues() || isSubmitting) {
            executeClose(afterClose);
            return;
        }

        Alert.alert(
            "입력 취소",
            "입력하신 내용은 저장되지 않습니다. 입력을 취소하시겠습니까?",
            [
                {
                    text: "계속 입력",
                    style: "cancel"
                },
                {
                    text: "취소",
                    style: "destructive",
                    onPress: () => executeClose(afterClose)
                }
            ]
        );
    };

    const executeClose = (afterClose?: () => void) => {
        Animated.parallel([
            Animated.timing(slideAnim, {
                toValue: modalHeight,
                duration: 300,
                useNativeDriver: true,
            }),
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }),
        ]).start(() => {
            setModalVisible(false);
            setFormData(initialFormData);
            setIsSubmitting(false);
            afterClose?.();
        });
    };

    const handleSubmit = () => {
        if (!validateForm()) {
            return;
        }

        Alert.alert(
            "타임라인 등록",
            "입력하신 내용으로 등록하시겠습니까?",
            [
                {
                    text: "등록",
                    style: "cancel",
                    onPress: () => {
                        setIsSubmitting(true);

                        console.log('=== Timeline 입력 데이터 ===');
                        console.log('위치:', formData.location);
                        console.log('활동 일자:', formData.activityDate);
                        console.log('Level:', formData.level);
                        console.log('내용:', formData.content);
                        console.log('이미지 개수:', formData.images.length);
                        console.log('이미지 목록:', formData.images);
                        console.log('공개 범위:', formData.privacy);
                        console.log('========================');
                        executeClose(onClose);
                    }
                },
                {
                    text: "취소",
                    style: "destructive",
                }
            ]
        );
    };



    const handleCloseAttempt = () => {
        closeWithAnimation(() => onClose());
    };

    const handleOverlayPress = () => {
        handleCloseAttempt();
    };

    const handleInputChange = (field: keyof TimelineFormData, value: any) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleDateSelect = (date: string) => {
        handleInputChange('activityDate', date);
    };

    const handleLevelSelect = () => {
        // TODO: 레벨 선택 로직 구현
        const tempLevel = 'Level 1';
        handleInputChange('level', tempLevel);
    };

    const handlePrivacySelect = (privacy: PrivacyType) => {
        handleInputChange('privacy', privacy);
    };

    const handleLocationSelect = (location: string) => {
        handleInputChange('location', location);
    };

    return (
        <Modal transparent visible={modalVisible} animationType="none" onRequestClose={handleCloseAttempt}>
            <Animated.View
                style={[
                    StyleSheet.absoluteFill,
                    styles.overlay,
                    {
                        opacity: fadeAnim,
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    }
                ]}
            >
                <TouchableOpacity
                    style={StyleSheet.absoluteFill}
                    activeOpacity={1}
                    onPress={handleOverlayPress}
                >
                    <BlurView intensity={10} style={StyleSheet.absoluteFill}>
                        <Animated.View
                            style={[
                                styles.modalContent,
                                {
                                    height: modalHeight,
                                    transform: [{
                                        translateY: slideAnim
                                    }]
                                }
                            ]}
                        >
                            <TouchableOpacity
                                activeOpacity={1}
                                onPress={(e) => e.stopPropagation()}
                                style={{ flex: 1 }}
                            >
                                <View style={styles.headerArea}>
                                    <View style={styles.titleContainer}>
                                        <Text style={styles.title}>타임라인 등록</Text>
                                        <TouchableOpacity
                                            style={styles.closeButton}
                                            onPress={handleCloseAttempt}
                                        >
                                            <X size={24} color="#8F9BB3" />
                                        </TouchableOpacity>
                                    </View>
                                </View>

                                <ScrollView style={styles.scrollContainer}>
                                    <View style={styles.inputContainer}>
                                        <LocationSearchArea
                                            value={formData.location}
                                            onLocationSelect={handleLocationSelect}
                                        />

                                        <DatePickerArea
                                            value={formData.activityDate}
                                            onDateSelect={handleDateSelect}
                                        />

                                        <FormInput
                                            value={formData.level}
                                            placeholder="* Level"
                                            onPress={handleLevelSelect}
                                            iconName="chevron-down"
                                        />

                                        <TextInput
                                            style={[styles.input, styles.multilineInput]}
                                            placeholder="* 내용"
                                            placeholderTextColor="#8F9BB3"
                                            multiline
                                            numberOfLines={4}
                                            value={formData.content}
                                            onChangeText={(text) => handleInputChange('content', text)}
                                        />

                                        <ImageUploadArea
                                            images={formData.images}
                                            onImagesChange={(images) => handleInputChange('images', images)}
                                        />

                                        <View style={styles.buttonContainer}>
                                            {(['전체 공개', '팔로워 공개', '나만보기'] as PrivacyType[]).map((privacy) => (
                                                <TouchableOpacity
                                                    key={privacy}
                                                    style={[
                                                        styles.button,
                                                        formData.privacy === privacy && styles.selectedButton
                                                    ]}
                                                    onPress={() => handlePrivacySelect(privacy)}>
                                                    <Text
                                                        style={[
                                                            styles.buttonText,
                                                            formData.privacy === privacy && styles.selectedButtonText
                                                        ]}>
                                                        {privacy}
                                                    </Text>
                                                </TouchableOpacity>
                                            ))}
                                        </View>

                                        <TouchableOpacity
                                            style={styles.submitButton}
                                            onPress={handleSubmit}
                                        >
                                            <Text style={styles.submitButtonText}>등록</Text>
                                        </TouchableOpacity>
                                    </View>
                                </ScrollView>
                            </TouchableOpacity>
                        </Animated.View>
                    </BlurView>
                </TouchableOpacity>
            </Animated.View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    modalContent: {
        width: '100%',
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
    },
    headerArea: {
        paddingVertical: 16,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#E4E9F2',
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        textAlign: 'center',
    },
    closeButton: {
        position: 'absolute',
        right: 0,
        padding: 4,
    },
    scrollContainer: {
        flex: 1,
    },
    inputContainer: {
        padding: 20,
        gap: 12,
    },
    input: {
        borderWidth: 1,
        borderColor: '#E4E9F2',
        borderRadius: 8,
        padding: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    inputText: {
        color: '#8F9BB3',
    },
    filledInput: {
        color: '#000',
    },
    multilineInput: {
        height: 150,
        textAlignVertical: 'top',
    },
    buttonContainer: {
        flexDirection: 'row',
        gap: 8,
        marginTop: 20,
        marginBottom: 20,
    },
    button: {
        flex: 1,
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#E4E9F2',
        alignItems: 'center',
    },
    selectedButton: {
        backgroundColor: '#735BF2',
        borderColor: '#735BF2',
    },
    buttonText: {
        color: '#8F9BB3',
    },
    selectedButtonText: {
        color: 'white',
    },
    submitButton: {
        backgroundColor: '#735BF2',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: Platform.OS === 'ios' ? 34 : 20,
    },
    submitButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
});
