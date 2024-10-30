import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Image } from 'react-native';

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
    type: '넓음',
    level: '중급',
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

  const handleSubmit = () => {
    console.log('Form Data:', formData);
    onSubmit(formData);
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
          <TextInput
              style={styles.input}
              placeholder="* 발 사이즈"
              value={formData.footSize}
              onChangeText={(value) => setFormData({ ...formData, footSize: value })}
              keyboardType="numeric"
          />
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
  radioOuter: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E4E9F2',
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  selectedRadioOuter: {
    borderColor: 'white',
  },
  radioInner: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  selectedRadioInner: {
    backgroundColor: 'white',
  },
  unselectedRadioInner: {
    backgroundColor: 'transparent',
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E4E9F2',
  },
  selectedRadio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#735BF2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'white',
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
