// screens/RegisterFaceScreen.tsx
import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Alert } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';

type Props = {
  navigation: any;
};

export default function RegisterFaceScreen({ navigation }: Props) {
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<any>(null);

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({ quality: 0.7, base64: true });
        setPhotoUri(photo.uri);
      } catch (error) {
        Alert.alert('Error', 'Failed to take picture');
      }
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
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <Text style={styles.text}>Grant Permission</Text>
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
            <Text style={styles.text}>Retake</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: 'green', marginTop: 10 }]}
            onPress={() => {
              Alert.alert('Face registered!', 'You can now use this photo for recognition.');
              navigation.goBack();
            }}
          >
            <Text style={styles.text}>Confirm</Text>
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
    marginBottom: 30,
    borderRadius: 10,
  },
  button: {
    padding: 15,
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