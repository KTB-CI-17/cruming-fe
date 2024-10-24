import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const VideoAnalysisScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>비디오 분석</Text>
      <View style={styles.videoPreview}>
        <Text>비디오 미리보기</Text>
      </View>
      <View style={styles.videoControls}>
        <TouchableOpacity style={styles.controlButton}>
          <Text>다운로드</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.controlButton}>
          <Text>공유</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  videoPreview: {
    width: '100%',
    height: 400,
    borderRadius: 8,
  },
  videoControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  controlButton: {
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

export default VideoAnalysisScreen;
