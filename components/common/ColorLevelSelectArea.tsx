import React, { useState } from 'react';
import {
    Modal,
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Platform,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import Dot from './Dot';

interface ColorLevelSelectAreaProps {
    value: string;
    onLevelSelect: (level: string) => void;
}

interface ColorLevelOption {
    color: string;
    label: string;
    value: string;
}

const colorLevelOptions: ColorLevelOption[] = [
    { color: '#FF4747', label: '빨강', value: '#FF4747' },
    { color: '#FF8A3D', label: '주황', value: '#FF8A3D' },
    { color: '#FFD43D', label: '노랑', value: '#FFD43D' },
    { color: '#B4E233', label: '초록', value: '#B4E233' },
    { color: '#69DB7C', label: '연두', value: '#69DB7C' },
    { color: '#38D9A9', label: '하늘', value: '#38D9A9' },
    { color: '#4DABF7', label: '남색', value: '#4DABF7' },
    { color: '#748FFC', label: '보라', value: '#748FFC' },
    { color: '#E599F7', label: '핑크', value: '#E599F7' },
    { color: '#CED4DA', label: '흰색', value: '#FAFAFA' },
    { color: '#495057', label: '회색', value: '#495057' },
    { color: '#212529', label: '검정', value: '#212529' },
];

export default function ColorLevelSelectArea({ value, onLevelSelect }: ColorLevelSelectAreaProps) {
    const [modalVisible, setModalVisible] = useState(false);

    const handleLevelSelect = (level: ColorLevelOption) => {
        onLevelSelect(level.value);
        setModalVisible(false);
    };

    const getLevelLabel = (colorValue: string) => {
        const option = colorLevelOptions.find(opt => opt.value === colorValue);
        return option ? option.label : '* Level';
    };

    const getSelectedDot = () => {
        if (!value) return null;
        const option = colorLevelOptions.find(opt => opt.value === value);
        return option ? <Dot color={option.color} /> : null;
    };

    return (
        <>
            <TouchableOpacity
                style={styles.container}
                onPress={() => setModalVisible(true)}
            >
                <View style={styles.inputContent}>
                    {getSelectedDot()}
                    <Text style={[styles.inputText, value ? styles.filledInput : {}]}>
                        {value ? getLevelLabel(value) : '* Level'}
                    </Text>
                </View>
                <Ionicons name="chevron-down" size={20} color="#8F9BB3" />
            </TouchableOpacity>

            <Modal
                transparent
                visible={modalVisible}
                animationType="fade"
                onRequestClose={() => setModalVisible(false)}
            >
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={() => setModalVisible(false)}
                >
                    <BlurView intensity={10} style={StyleSheet.absoluteFill}>
                        <TouchableOpacity
                            activeOpacity={1}
                            style={styles.modalContentWrapper}
                            onPress={(e) => e.stopPropagation()}
                        >
                            <View style={styles.modalContent}>
                                <View style={styles.header}>
                                    <Text style={styles.title}>Level 선택</Text>
                                    <TouchableOpacity
                                        onPress={() => setModalVisible(false)}
                                        style={styles.closeButton}
                                    >
                                        <Ionicons name="close" size={24} color="#8F9BB3" />
                                    </TouchableOpacity>
                                </View>

                                <View style={styles.optionsContainer}>
                                    {colorLevelOptions.map((option) => (
                                        <TouchableOpacity
                                            key={option.value}
                                            style={styles.optionButton}
                                            onPress={() => handleLevelSelect(option)}
                                        >
                                            <Dot color={option.color} />
                                            <Text style={styles.optionText}>{option.label}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>
                        </TouchableOpacity>
                    </BlurView>
                </TouchableOpacity>
            </Modal>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        borderWidth: 1,
        borderColor: '#E4E9F2',
        borderRadius: 8,
        padding: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    inputContent: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    inputText: {
        color: '#8F9BB3',
    },
    filledInput: {
        color: '#000',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContentWrapper: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E4E9F2',
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
    },
    closeButton: {
        position: 'absolute',
        right: 16,
        padding: 4,
    },
    optionsContainer: {
        padding: 20,
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    optionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '45%',
        paddingVertical: 8,
    },
    optionText: {
        fontSize: 16,
        color: '#495057',
    },
});
