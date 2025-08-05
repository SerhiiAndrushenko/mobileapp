import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeScreen } from './HomeScreen';
import { QuickAccessScreen } from './QuickAccessScreen';

const Stack = createNativeStackNavigator();

export const HomeGate: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeMain" component={HomeScreen} />
      <Stack.Screen name="QuickAccess" component={QuickAccessScreen} />
    </Stack.Navigator>
  );
}; 