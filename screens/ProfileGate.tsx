import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../contexts/AuthContext';
import { ProfileScreen } from './ProfileScreen';
import { LoginScreen } from './auth/LoginScreen';
import { RegisterScreen } from './auth/RegisterScreen';
import { PersonalInfoScreen } from './PersonalInfoScreen';
import { AddressScreen } from './AddressScreen';
import { AddAddressScreen } from './AddAddressScreen';
import { QuickAccessScreen } from './QuickAccessScreen';
import { NotificationSettingsScreen } from './NotificationSettingsScreen';
import SecurityTab from '../components/security';
import SetPinScreen from '../components/set-pin';
import VerifyPinScreen from '../components/verify-pin';
import RemovePinScreen from '../components/remove-pin';

const Stack = createNativeStackNavigator();

export const ProfileGate: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ProfileMain" component={ProfileScreen} />
      <Stack.Screen name="PersonalInfo" component={PersonalInfoScreen} />
      <Stack.Screen name="Address" component={AddressScreen} />
      <Stack.Screen name="AddAddress" component={AddAddressScreen} />
      <Stack.Screen name="QuickAccess" component={QuickAccessScreen} />
      <Stack.Screen name="Notifications" component={NotificationSettingsScreen} />
      <Stack.Screen name="Security" component={SecurityTab} />
      <Stack.Screen name="SetPasscode" component={SetPinScreen} />
      <Stack.Screen name="VerifyPasscode" component={VerifyPinScreen} />
      <Stack.Screen name="RemovePasscode" component={RemovePinScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
}; 