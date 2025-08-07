// screens/RegisterFaceScreen.tsx
import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Alert } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Props = {
  navigation: any;
};

export default function RegisterFaceScreen({ navigation }: Props) {
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [photoBase64, setPhotoBase64] = useState<string | null>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<any>(null);

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({ quality: 0.7, base64: true });
        setPhotoUri(photo.uri);
        setPhotoBase64(photo.base64); // Salva o base64 no estado
      } catch (error) {
        Alert.alert('Erro', 'Falha ao tirar foto');
      }
    }
  };

  const savePhotoToRegisteredList = async (base64Data: string) => {
    try {
      // Buscar a lista atual de fotos registradas
      const existingPhotosJson = await AsyncStorage.getItem('registeredPhotosList');
      const existingPhotos = existingPhotosJson ? JSON.parse(existingPhotosJson) : [];
      
      // Criar um novo registro de foto com ID único e timestamp
      const newPhoto = {
        id: Date.now().toString(),
        base64: base64Data,
        registeredAt: new Date().toISOString(),
      };
      
      // Adicionar a nova foto à lista
      const updatedPhotosList = [...existingPhotos, newPhoto];
      
      // Salvar a lista atualizada
      await AsyncStorage.setItem('registeredPhotosList', JSON.stringify(updatedPhotosList));
      
      console.log('Foto adicionada à lista de registros. Total de fotos:', updatedPhotosList.length);
      return true;
    } catch (error) {
      console.error('Erro ao salvar foto na lista:', error);
      return false;
    }
  };

  if (!permission) {
    return <Text>Carregando permissões da câmera...</Text>;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>Precisamos da sua permissão para usar a câmera</Text>
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <Text style={styles.text}>Garantir permissão</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {!photoUri ? (
        <CameraView 
          style={styles.camera} 
          facing="front"
          ref={cameraRef}
        >
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={takePicture}>
              <Text style={styles.text}>Capture Face</Text>
            </TouchableOpacity>
          </View>
        </CameraView>
      ) : (
        <View style={styles.preview}>
          <Image source={{ uri: photoUri }} style={styles.capturedImage} />
          <TouchableOpacity
            style={[styles.button, { marginTop: 20 }]}
            onPress={() => {
              setPhotoUri(null);
            }}
          >
            <Text style={styles.text}>Tirar foto novamente</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: 'green', marginTop: 10 }]}
            onPress={async () => {
              if (photoBase64) {
                try {
                  const success = await savePhotoToRegisteredList(photoBase64);
                  if (success) {
                    console.log(photoBase64);
                    console.log('Foto registrada na lista com sucesso');
                    Alert.alert('Face registrada!', 'Sua foto foi adicionada à lista de registros.');
                    navigation.goBack();
                  } else {
                    Alert.alert('Erro', 'Não foi possível adicionar a foto à lista de registros.');
                  }
                } catch (e) {
                  Alert.alert('Erro', 'Não foi possível salvar a foto localmente.');
                }
              } else {
                Alert.alert('Erro', 'Base64 da foto não encontrado.');
              }
            }}
          >
            <Text style={styles.text}>Confirmar</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  camera: { flex: 1, justifyContent: 'flex-end' },
  buttonContainer: {
    backgroundColor: '#00000080',
    alignSelf: 'center',
    marginBottom: 40,
    borderRadius: 10,
    alignItems: 'center',
    width: 'auto',
  },
  button: {
    padding: 22,
    backgroundColor: '#2196F3',
    borderRadius: 10,
    alignItems: 'center',
    minWidth: 150,
  },
  text: { color: '#fff', fontWeight: 'bold' },
  preview: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  capturedImage: {
    width: '80%',
    height: '60%',
    borderRadius: 15,
  },
  message: {
    color: '#fff',
    textAlign: 'center',
    paddingBottom: 10,
  },
});