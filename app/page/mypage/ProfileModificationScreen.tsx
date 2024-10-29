import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

const ProfileModificationScreen = () => {
  const [nickname, setNickname] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [bio, setBio] = React.useState('');

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>프로필 수정</Text>

      <View style={styles.profileImageContainer}>
        <Text>프로필 이미지 업로드</Text>
        <TouchableOpacity style={styles.cameraButton}>
          <Text>카메라 아이콘</Text>
        </TouchableOpacity>
      </View>

      <TextInput
        style={styles.input}
        placeholder="닉네임"
        value={nickname}
        onChangeText={setNickname}
      />

      <TextInput
        style={styles.input}
        placeholder="이메일"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="한줄 소개"
        value={bio}
        onChangeText={setBio}
        multiline
      />

      <TouchableOpacity style={styles.submitButton}>
        <Text style={styles.submitButtonText}>수정</Text>
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
  profileImageContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  cameraButton: {
    position: 'absolute',
    right: '35%',
    bottom: 0,
    backgroundColor: '#fff',
    padding: 8,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  input: {
    borderBottomWidth: 1,
    borderColor: '#ddd',
    padding: 15,
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

export default ProfileModificationScreen;
