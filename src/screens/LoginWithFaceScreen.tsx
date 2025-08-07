// screens/LoginWithFaceScreen.tsx
import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Props = {
  navigation: any;
};

export default function LoginWithFaceScreen({ navigation }: Props) {
  const [faceDetected, setFaceDetected] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<any>(null);

  const getRegisteredPhotos = async () => {
    try {
      const photosJson = await AsyncStorage.getItem('registeredPhotosList');
      return photosJson ? JSON.parse(photosJson) : [];
    } catch (error) {
      console.error('Erro ao buscar fotos registradas:', error);
      return [];
    }
  };

  const compareFaces = (base64A: string, base64B: string) => {
    // Comparação simples: verifica se os base64 são idênticos
    // Em um sistema real, você usaria uma biblioteca de reconhecimento facial
    return base64A === base64B;
  };

  const handleFaceDetection = async () => {
    if (!faceDetected && !isProcessing && cameraRef.current) {
      setIsProcessing(true);
      
      try {
        // Capturar foto atual
        const photo = await cameraRef.current.takePictureAsync({ 
          quality: 0.7, 
          base64: true 
        });
        
        if (!photo.base64) {
          Alert.alert('Erro', 'Não foi possível capturar a foto');
          setIsProcessing(false);
          return;
        }

        // Buscar fotos registradas
        const registeredPhotos = await getRegisteredPhotos();
        
        if (registeredPhotos.length === 0) {
          Alert.alert('Erro', 'Nenhuma foto registrada encontrada. Registre uma foto primeiro.');
          setIsProcessing(false);
          return;
        }

        // Comparar com cada foto registrada
        let matchFound = false;
        for (const registeredPhoto of registeredPhotos) {
          if (compareFaces(photo.base64, registeredPhoto.base64)) {
            matchFound = true;
            break;
          }
        }

        if (matchFound) {
          setFaceDetected(true);
          Alert.alert('Sucesso', 'Face reconhecida! Entrando...');
          setTimeout(() => {
            navigation.replace('Home');
          }, 1500);
        } else {
          Alert.alert('Erro', 'Face não reconhecida. Tente novamente ou registre uma nova foto.');
        }
        
      } catch (error) {
        console.error('Erro na detecção facial:', error);
        Alert.alert('Erro', 'Falha na detecção facial. Tente novamente.');
      } finally {
        setIsProcessing(false);
      }
    }
  };

  if (!permission) {
    return <Text>Carregando permissões da câmera...</Text>;
  }

  if (!permission.granted) {
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
            <Text style={styles.text}>Face reconhecida! Entrando...</Text>
          ) : isProcessing ? (
            <Text style={styles.text}>Processando face...</Text>
          ) : (
            <Text style={styles.text}>Por favor, posicione sua face na frente da câmera</Text>
          )}
        </View>
        <View style={styles.buttonContainer}>
          <Text 
            style={[styles.detectButton, isProcessing && styles.disabledButton]} 
            onPress={handleFaceDetection}
          >
            {isProcessing ? 'Processando...' : 'Detectar face'}
          </Text>
        </View>
      </CameraView>
      {isProcessing && <ActivityIndicator size="large" color="#00ff00" style={styles.loader} />}
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
  disabledButton: {
    backgroundColor: '#666',
  },
});
