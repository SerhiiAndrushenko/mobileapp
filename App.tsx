import React, { useState } from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import './locales/i18n'; // Ініціалізація i18n
import { BottomNavigation } from './components/BottomNavigation';
import { AuthProvider } from './contexts/AuthContext';
import { AddressProvider } from './contexts/AddressContext';
import { QuickAccessProvider } from './contexts/QuickAccessContext';
import { NotificationsProvider } from './contexts/NotificationsContext';
import { PasscodeProvider } from './contexts/PasscodeContext';
import { SplashScreen } from './screens/SplashScreen';
import { AppPasscodeGate } from './components/AppPasscodeGate';
import Toast from 'react-native-toast-message';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

// Custom toast design for address add/remove messages
const toastConfig = {
  addressToast: ({ text1 }: any) => (
    <View style={toastStyles.container}>
      <Ionicons name="checkmark" size={24} color="#E41B85" style={{ marginRight: 12 }} />
      <Text style={toastStyles.text}>{text1}</Text>
    </View>
  ),
};

const toastStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E41B85',
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginHorizontal: 16,
  },
  text: {
    color: '#8F8F8F',
    fontSize: 15,
    flexShrink: 1,
    fontFamily: 'e-Ukraine',
  },
});

const AppTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#F6F6F6',
  },
};

export default function App() {
  const [splashDone, setSplashDone] = useState(false);
  if (!splashDone) {
    return <SplashScreen onFinish={() => setSplashDone(true)} />;
  }
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <AddressProvider>
          <QuickAccessProvider>
            <PasscodeProvider>
              <AppPasscodeGate>
                <NotificationsProvider>
                  <NavigationContainer theme={AppTheme}>
                    <BottomNavigation />
                    <Toast config={toastConfig} />
                  </NavigationContainer>
                </NotificationsProvider>
              </AppPasscodeGate>
            </PasscodeProvider>
          </QuickAccessProvider>
        </AddressProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
