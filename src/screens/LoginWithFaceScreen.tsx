// screens/LoginWithFaceScreen.tsx
import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';

type Props = {
  navigation: any;
};

export default function LoginWithFaceScreen({ navigation }: Props) {
  const [faceDetected, setFaceDetected] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<any>(null);

  const handleFaceDetection = () => {
    if (!faceDetected) {
      setFaceDetected(true);
      Alert.alert('Sucesso', 'Face detectada! Entrando...');
      setTimeout(() => {
        navigation.replace('Home');
      }, 1500);
    }
  };

  if (!permission) {
    // Camera permissions are still loading.
    return <Text>Loading camera permissions...</Text>;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={styles.message}>Precisamos de sua permissão para mostrar a câmera</Text>
        <Text style={styles.message} onPress={requestPermission}>Conceder permissão</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing="front"
      >
        <View style={styles.overlay}>
          {faceDetected ? (
            <Text style={styles.text}>Face detectada! Entrando...</Text>
          ) : (
            <Text style={styles.text}>Por favor, posicione sua face na frente da câmera</Text>
          )}
        </View>
        <View style={styles.buttonContainer}>
          <Text style={styles.detectButton} onPress={handleFaceDetection}>
            Detectar face
          </Text>
        </View>
      </CameraView>
      {!faceDetected && <ActivityIndicator size="large" color="#00ff00" style={styles.loader} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  camera: { flex: 1 },
  overlay: {
    position: 'absolute',
    bottom: 120,
    width: '100%',
    alignItems: 'center',
  },
  text: {
    color: '#fff',
    fontSize: 18,
    backgroundColor: '#00000099',
    padding: 10,
    borderRadius: 10,
    textShadowColor: '#000',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
    elevation: 8,
  },
  loader: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
  },
  message: {
    color: '#fff',
    textAlign: 'center',
    paddingBottom: 10,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 60,
    alignSelf: 'center',
  },
  detectButton: {
    color: '#fff',
    fontSize: 16,
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 5,
  },
});
