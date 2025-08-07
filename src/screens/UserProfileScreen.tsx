// screens/UserProfileScreen.tsx
import React from 'react';
import { View, Text, Image, StyleSheet, Button } from 'react-native';

type Props = {
  route: {
    params: {
      user: {
        name: string;
        email: string;
        avatarUri?: string;
      };
    };
  };
  navigation: any;
};

export default function UserProfileScreen({ route, navigation }: Props) {
  const { user } = route.params;

  return (
    <View style={styles.container}>
      {user.avatarUri ? (
        <Image source={{ uri: user.avatarUri }} style={styles.avatar} />
      ) : (
        <View style={[styles.avatar, styles.placeholder]}>
          <Text style={styles.placeholderText}>{user.name.charAt(0)}</Text>
        </View>
      )}
      <Text style={styles.name}>{user.name}</Text>
      <Text style={styles.email}>{user.email}</Text>

      <Button title="Logout" onPress={() => navigation.replace('LoginWithFace')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  avatar: {
    width: 140,
    height: 140,
    borderRadius: 70,
    marginBottom: 24,
  },
  placeholder: {
    backgroundColor: '#999',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 64,
    color: '#fff',
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  email: {
    fontSize: 18,
    color: '#666',
    marginBottom: 30,
  },
});
