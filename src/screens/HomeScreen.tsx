import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

type Props = {
  navigation: any;
};

export default function HomeScreen({ navigation }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bem-vindo!</Text>
      <Button
        title="Login com Face ID"
        onPress={() => navigation.navigate('LoginWithFace')}
      />
      <Button
        title="Registrar Face ID"
        onPress={() => navigation.navigate('RegisterFace')}
        color="#4CAF50"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    gap: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
});