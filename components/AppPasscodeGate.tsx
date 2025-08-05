import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { EnterPin } from './EnterPin';
import { usePasscode } from '../contexts/PasscodeContext';
import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';

interface Props {
  children: React.ReactNode;
}

export const AppPasscodeGate: React.FC<Props> = ({ children }) => {
  const { initialized, exists } = usePasscode();
  const [verified, setVerified] = useState(false);
  const [biometryTried, setBiometryTried] = useState(false);

  const tryBiometrics = async () => {
    try {
      const enabled = await SecureStore.getItemAsync('use_biometrics');
      if (enabled !== '1') return false;
      const supported = await LocalAuthentication.hasHardwareAsync();
      if (!supported) return false;
      const enrolled = await LocalAuthentication.isEnrolledAsync();
      if (!enrolled) return false;
      const res = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Увійдіть за допомогою Face ID / Touch ID',
        cancelLabel: 'Скасувати',
        disableDeviceFallback: true,
      });
      return res.success;
    } catch {
      return false;
    }
  };

  // attempt biometrics once when initialized and passcode exists
  useEffect(()=>{
    if (!initialized || verified || biometryTried) return;
    setBiometryTried(true);
    (async ()=>{
      if (exists) {
        const ok = await tryBiometrics();
        if (ok) setVerified(true);
      }
    })();
  }, [initialized, exists, verified, biometryTried]);

  // While secure storage still loading, show nothing (could be splash background).
  if (!initialized) {
    return <View style={styles.container} />;
  }

  // If no passcode set, or already verified, render app normally
  if (!exists || verified) {
    return <>{children}</>;
  }

  const handleSuccess = () => {
    setVerified(true);
  };

  return (
    <EnterPin onSuccess={handleSuccess} />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
    justifyContent: 'center',
    alignItems: 'center',
  },
}); 