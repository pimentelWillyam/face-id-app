import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from './screens/HomeScreen';
import LoginWithFaceScreen from './screens/LoginWithFaceScreen';
import RegisterFaceScreen from './screens/RegisterFaceScreen';
import UserProfileScreen from './screens/UserProfileScreen';

type RootStackParamList = {
  Home: undefined;
  LoginWithFace: undefined;
  RegisterFace: undefined;
  UserProfile: {
    user: {
      name: string;
      email: string;
      avatarUri?: string;
    };
  };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function Routes() {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="LoginWithFace" component={LoginWithFaceScreen} />
      <Stack.Screen name="RegisterFace" component={RegisterFaceScreen} />
      <Stack.Screen name="UserProfile" component={UserProfileScreen} />
    </Stack.Navigator>
  );
}
