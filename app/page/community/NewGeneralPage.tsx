// page/community/NewGeneral.tsx
import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type NewGeneralProps = {
    onClose: () => void;  // 작성 취소/뒤로가기 시 호출될 함수
};

export default function NewGeneralPage({ onClose }: NewGeneralProps) {
    return (
        <SafeAreaView edges={['bottom']} style={styles.safeArea}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={onClose}>
                        <Text style={styles.cancelText}>취소</Text>
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>글쓰기</Text>
                    <TouchableOpacity>
                        <Text style={styles.submitText}>완료</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.contentContainer}>
                    <TextInput
                        style={styles.titleInput}
                        placeholder="제목을 입력하세요."
                        placeholderTextColor="#8F9BB3"
                    />
                    <TextInput
                        style={styles.contentInput}
                        placeholder="내용을 입력하세요."
                        placeholderTextColor="#8F9BB3"
                        multiline
                        textAlignVertical="top"
                    />
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: 'white',
    },
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1A1F36',
    },
    cancelText: {
        fontSize: 16,
        color: '#8F9BB3',
    },
    submitText: {
        fontSize: 16,
        color: '#735BF2',
        fontWeight: '600',
    },
    contentContainer: {
        flex: 1,
        padding: 16,
    },
    titleInput: {
        fontSize: 16,
        color: '#1A1F36',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    contentInput: {
        flex: 1,
        fontSize: 16,
        color: '#1A1F36',
        paddingTop: 16,
    },
});
