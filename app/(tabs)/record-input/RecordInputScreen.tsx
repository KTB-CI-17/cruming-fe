import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

const RecordInputScreen = () => {
  const [gymName, setGymName] = React.useState('');
  const [date, setDate] = React.useState('');
  const [level, setLevel] = React.useState('');
  const [description, setDescription] = React.useState('');

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>활동 기록 등록</Text>

      <TextInput
        style={styles.input}
        placeholder="체육관 이름"
        value={gymName}
        onChangeText={setGymName}
      />

      <TouchableOpacity style={styles.datePickerButton}>
        <Text>날짜 선택</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.levelPickerButton}>
        <Text>Level 선택</Text>
      </TouchableOpacity>

      <TextInput
        style={[styles.input, styles.multilineInput]}
        placeholder="한줄평"
        value={description}
        onChangeText={setDescription}
        multiline
      />

      <TouchableOpacity style={styles.imageUploadBox}>
        <Text>활동 사진 업로드</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.submitButton}>
        <Text style={styles.submitButtonText}>등록</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderBottomWidth: 1,
    borderColor: '#ddd',
    padding: 15,
    marginBottom: 15,
  },
  multilineInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  datePickerButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    borderBottomWidth: 1,
    borderColor: '#ddd',
    marginBottom: 15,
  },
  levelPickerButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    borderBottomWidth: 1,
    borderColor: '#ddd',
    marginBottom: 15,
  },
  imageUploadBox: {
    height: 120,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  submitButton: {
    backgroundColor: '#6B4EFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 'auto',
  },
  submitButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default RecordInputScreen;
