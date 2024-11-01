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

interface LevelSelectAreaProps {
    value: string;
    onLevelSelect: (level: string) => void;
}

interface LevelOption {
    color: string;
    label: string;
    value: string;
}

const levelOptions: LevelOption[] = [
    { color: '#E80F0F', label: '빨강', value: '#E80F0F' },
    { color: '#F35B04', label: '주황', value: '#F35B04' },
    { color: '#FAC31D', label: '노랑', value: '#FAC31D' },
    { color: '#62DF28', label: '초록', value: '#62DF28' },
    { color: '#AFEE56', label: '연두', value: '#AFEE56' },
    { color: '#80D1F3', label: '하늘', value: '#80D1F3' },
    { color: '#040487', label: '남색', value: '#040487' },
    { color: '#A161FC', label: '보라', value: '#A161FC' },
    { color: '#F642CC', label: '핑크', value: '#F642CC' },
    { color: '#FAFAFA', label: '흰색', value: '#FAFAFA' },
    { color: '#888888', label: '회색', value: '#888888' },
    { color: '#333333', label: '검정', value: '#333333' },
    { color: '#5F4842', label: '갈색', value: '#5F4842' },
];

export default function ColorLevelSelectArea({ value, onLevelSelect }: LevelSelectAreaProps) {
    const [modalVisible, setModalVisible] = useState(false);

    const handleLevelSelect = (level: LevelOption) => {
        onLevelSelect(level.value);
        setModalVisible(false);
    };

    const getLevelLabel = (colorValue: string) => {
        const option = levelOptions.find(opt => opt.value === colorValue);
        return option ? option.label : '* Level';
    };

    const getSelectedDot = () => {
        if (!value) return null;
        const option = levelOptions.find(opt => opt.value === value);
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
                                {levelOptions.map((option) => (
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
    modalContent: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
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
