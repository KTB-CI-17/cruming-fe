// components/timeline/TimelineWriteModal.tsx
import React from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, Pressable } from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';

type TimelineWriteModalProps = {
    visible: boolean;
    onClose: () => void;
};

export default function TimelineWriteModal({ visible, onClose }: TimelineWriteModalProps) {
    return (
        <Modal transparent visible={visible} animationType="fade">
            <BlurView intensity={10} style={StyleSheet.absoluteFill}>
                <Pressable style={styles.overlay} onPress={onClose}>
                    <Pressable style={styles.modalContent} onPress={e => e.stopPropagation()}>
                        <Text style={styles.title}>활동 기록 등록</Text>

                        <View style={styles.inputContainer}>
                             {/*TODO: 클릭 시 주소찾기 팝업이 출력되도록*/}
                            <TextInput
                                style={styles.input}
                                placeholder="* 위치"
                                placeholderTextColor="#8F9BB3"
                            />

                            {/*TODO: 클릭 시 달력 선택 팝업이 출력되도록*/}
                            <TouchableOpacity style={styles.input}>
                                <Text style={styles.inputText}>* 활동 일자</Text>
                                <Ionicons name="calendar-outline" size={20} color="#8F9BB3" />
                            </TouchableOpacity>

                            {/*TODO: 클릭 시 색깔 선택 셀렉트 박스*/}
                            <TouchableOpacity style={styles.input}>
                                <Text style={styles.inputText}>* Level</Text>
                                <Ionicons name="chevron-down" size={20} color="#8F9BB3" />
                            </TouchableOpacity>

                            <TextInput
                                style={[styles.input, styles.multilineInput]}
                                placeholder="* 내용"
                                placeholderTextColor="#8F9BB3"
                                multiline
                                numberOfLines={4}
                            />

                            {/*TODO: 클릭 시 사진 업로드 가능하도록*/}
                            <TouchableOpacity style={styles.imageButton}>
                                <Ionicons name="camera" size={24} color="#8F9BB3" />
                                <Text style={styles.imageButtonText}>활동 사진</Text>
                            </TouchableOpacity>
                        </View>

                        {/*TODO: 공개 범위 클릭 시 변경 가능 하도록*/}
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity
                                style={[styles.button, styles.selectedButton]}
                                onPress={() => {}}>
                                <Text style={styles.selectedButtonText}>전체 공개</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.button}>
                                <Text style={styles.buttonText}>팔로워 공개</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.button}>
                                <Text style={styles.buttonText}>나만보기</Text>
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity style={styles.submitButton}>
                            <Text style={styles.submitButtonText}>등록</Text>
                        </TouchableOpacity>
                    </Pressable>
                </Pressable>
            </BlurView>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
    },
    modalContent: {
        width: '100%',
        marginTop: '70%',
        height: '100%',
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 20,
        elevation: 5,
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 20,
        textAlign: 'center',
    },
    inputContainer: {
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
    multilineInput: {
        // height: '28%',
        height: 150,
        textAlignVertical: 'top',
    },
    imageButton: {
        height: 150,
        borderWidth: 1,
        borderStyle: 'dashed',
        borderColor: '#E4E9F2',
        borderRadius: 8,
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    imageButtonText: {
        color: '#8F9BB3',
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
    },
    submitButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
});
