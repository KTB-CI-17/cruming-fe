import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Image, Alert } from 'react-native';

type OptionType = {
  id: string;
  label: string;
};

export type FormData = {
  shape: string;
  type: string;
  level: string;
  footSize: string;
};

type FootAnalysisFormProps = {
  onSubmit: (data: FormData) => void;
};

const Option = ({ selected, label, onPress }: {
  selected: boolean;
  label: string;
  onPress: () => void;
}) => (
    <TouchableOpacity
        style={[styles.option, selected && styles.selectedOption]}
        onPress={onPress}
    >
      <View style={styles.radioContainer}>
        {selected ? (
            <View style={styles.selectedCircle}>
              <View style={styles.outerRing} />
              <View style={styles.innerCircle} />
            </View>
        ) : (
            <View style={styles.unselectedCircle} />
        )}
        <Text style={[styles.optionText, selected && styles.selectedOptionText]}>
          {label}
        </Text>
      </View>
    </TouchableOpacity>
);

export default function FootAnalysisForm({ onSubmit }: FootAnalysisFormProps) {
  const [formData, setFormData] = useState<FormData>({
    shape: 'Roman',
    type: 'normal',
    level: 'intermediate',
    footSize: '',
  });

  const shapeOptions: OptionType[] = [
    { id: 'Egyptian', label: 'Egyptian' },
    { id: 'Roman', label: 'Roman' },
    { id: 'Greek', label: 'Greek' },
  ];

  const typeOptions: OptionType[] = [
    { id: 'narrow', label: '좁음' },
    { id: 'normal', label: '보통' },
    { id: 'wide', label: '넓음' },
  ];

  const levelOptions: OptionType[] = [
    { id: 'elite', label: '엘리트' },
    { id: 'advanced', label: '고급' },
    { id: 'intermediate', label: '중급' },
    { id: 'beginner', label: '초급' },
  ];

  const validateFootSize = (size: string): boolean => {
    // 숫자만 입력되었는지 확인
    if (!/^\d+$/.test(size)) {
      Alert.alert('입력 오류', '신발 사이즈는 숫자만 입력 가능합니다.');
      return false;
    }

    // 5단위 확인
    const sizeNum = parseInt(size, 10);
    if (sizeNum % 5 !== 0) {
      Alert.alert('입력 오류', '신발 사이즈는 5단위로 입력해주세요.\n(예: 230, 235, 240...)');
      return false;
    }

    return true;
  };

  const handleSubmit = () => {
    if (!formData.footSize) {
      Alert.alert('입력 오류', '신발 사이즈를 입력해주세요.');
      return;
    }

    if (!validateFootSize(formData.footSize)) {
      return;
    }

    console.log('Form Data:', formData);
    onSubmit(formData);
  };

  const handleSizeChange = (value: string) => {
    // 숫자가 아닌 문자 입력 방지
    if (value && !/^\d+$/.test(value)) {
      return;
    }
    setFormData({ ...formData, footSize: value });
  };

  return (
      <View style={styles.container}>
        <Image
            source={require('@/assets/images/foot-types.png')}
            style={styles.footTypesImage}
            resizeMode="contain"
        />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>족형</Text>
          <View style={styles.optionsContainer}>
            {shapeOptions.map((option) => (
                <Option
                    key={option.id}
                    selected={formData.shape === option.id}
                    label={option.label}
                    onPress={() => setFormData({ ...formData, shape: option.id })}
                />
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>발볼</Text>
          <View style={styles.optionsContainer}>
            {typeOptions.map((option) => (
                <Option
                    key={option.id}
                    selected={formData.type === option.id}
                    label={option.label}
                    onPress={() => setFormData({ ...formData, type: option.id })}
                />
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Level</Text>
          <View style={styles.optionsContainer}>
            {levelOptions.map((option) => (
                <Option
                    key={option.id}
                    selected={formData.level === option.id}
                    label={option.label}
                    onPress={() => setFormData({ ...formData, level: option.id })}
                />
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Size</Text>
          <View>
            <TextInput
                style={styles.input}
                placeholder="* 발 사이즈 (예: 230, 235, 240...)"
                value={formData.footSize}
                onChangeText={handleSizeChange}
                keyboardType="numeric"
                maxLength={3}
            />
            <Text style={styles.helperText}>5단위로 입력해주세요</Text>
          </View>
        </View>

        <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmit}
        >
          <Text style={styles.submitButtonText}>추천 암벽화 검색</Text>
        </TouchableOpacity>
      </View>
  );
}

const styles = StyleSheet.create({
  // 기존 스타일은 유지
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
  },
  footTypesImage: {
    width: '100%',
    height: 100,
    marginBottom: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#1A1F36',
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  option: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E4E9F2',
    backgroundColor: 'white',
  },
  selectedOption: {
    backgroundColor: '#735BF2',
    borderColor: '#735BF2',
  },
  optionText: {
    color: '#8F9BB3',
    fontSize: 14,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E4E9F2',
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
  },
  helperText: {
    fontSize: 12,
    color: '#8F9BB3',
    marginTop: 4,
    marginLeft: 4,
  },
  submitButton: {
    backgroundColor: '#735BF2',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 'auto',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  selectedOptionText: {
    color: 'white',
  },
  radioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  unselectedCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E4E9F2',
  },
  selectedCircle: {
    width: 20,
    height: 20,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  outerRing: {
    position: 'absolute',
    width: 16,
    height: 16,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: 'white',
  },
  innerCircle: {
    width: 8,
    height: 8,
    borderRadius: 6,
    backgroundColor: 'white',
  },
});
