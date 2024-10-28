import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import {SafeAreaView} from "react-native-safe-area-context";

const FootAnalysisScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.headerText}>족형 분석</Text>

      <TouchableOpacity style={styles.imageUploadBox}>
        <Text>측면 사진 업로드</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.imageUploadBox}>
        <Text>발바닥 사진 업로드</Text>
      </TouchableOpacity>

      <View style={styles.tipBox}>
        <Text>사용 예시</Text>
        <Text>Tip: 발등의 높이가 잘 나오게 찍어주세요.</Text>
        <Text>Tip: 발 볼의 넓이가 잘 나오게 찍어주세요.</Text>
      </View>

      <TouchableOpacity style={styles.submitButton}>
        <Text style={styles.submitButtonText}>암벽화 분석</Text>
      </TouchableOpacity>
    </SafeAreaView>
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
  imageUploadBox: {
    height: 120,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  tipBox: {
    marginVertical: 20,
  },
  tipImage: {
    width: '100%',
    height: 120,
    marginVertical: 10,
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

export default FootAnalysisScreen;
