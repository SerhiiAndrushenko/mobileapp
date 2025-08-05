import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as LocalAuthentication from 'expo-local-authentication';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, StyleSheet, Switch, Text, TouchableOpacity, View, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const PIN_KEY = 'app_pin_code';
const FACE_ID_KEY = 'use_biometrics';

export default function SecurityScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const params = route.params || {};
  const [pinSet, setPinSet] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [biometrySupported, setBiometrySupported] = useState(false);
  const [biometryEnabled, setBiometryEnabled] = useState(false);
  const { t } = useTranslation();

  // Обновлять состояние при каждом фокусе
  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      (async () => {
        const pin = await SecureStore.getItemAsync(PIN_KEY);
        if (isActive) setPinSet(!!pin);
        const bio = await SecureStore.getItemAsync(FACE_ID_KEY);
        if (isActive) setBiometryEnabled(bio === '1');
        const supported = await LocalAuthentication.hasHardwareAsync();
        const types = await LocalAuthentication.supportedAuthenticationTypesAsync();
        if (isActive) setBiometrySupported(supported && types.length > 0);
      })();
      return () => { isActive = false; };
    }, [])
  );

  useEffect(() => {
    if (params?.success === '1') {
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  }, [params]);

  const handleSetPin = () => {
    navigation.navigate('SetPasscode');
  };

  const handleRemovePin = async () => {
    navigation.navigate('RemovePasscode');
  };

  const handleChangePin = () => {
    navigation.navigate('VerifyPasscode');
  };

  const handleToggleBiometry = async (value: boolean) => {
    if (value) {
      const supported = await LocalAuthentication.hasHardwareAsync();
      const enrolled = await LocalAuthentication.isEnrolledAsync();
      if (!supported || !enrolled) {
        Alert.alert('Біометрія недоступна', 'На цьому пристрої Face ID / Touch ID не налаштовані. Налаштуйте їх у системних параметрах.');
        return;
      }
      // Try to authenticate once to trigger system permission dialog
      const res = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Дозвольте Face ID / Touch ID для входу',
        cancelLabel: 'Скасувати',
        disableDeviceFallback: true,
      });
      if (!res.success) {
        const reason = res.error ?? 'unknown';
        Alert.alert('Не вдалося активувати', `Причина: ${reason}. Спробуйте ще раз або перевірте налаштування Face ID / Touch ID.`);
        return;
      }
    }
    setBiometryEnabled(value);
    await SecureStore.setItemAsync(FACE_ID_KEY, value ? '1' : '0');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        {showSuccess && (
          <View style={styles.successBox}>
            <Ionicons name="checkmark-circle" size={22} color="#E41B85" style={{ marginRight: 8 }} />
            <Text style={styles.successText}>{t('security_success')}</Text>
          </View>
        )}
        <Text style={styles.header}>{t('Безпека')}</Text>
        {!pinSet && (
          <TouchableOpacity style={styles.setBtn} onPress={handleSetPin}>
            <Ionicons name="lock-closed-outline" size={20} color="#E41B85" style={{ marginRight: 8 }} />
            <Text style={styles.setBtnText}>{t('Встановити код для входу')}</Text>
          </TouchableOpacity>
        )}
        {pinSet && (
          <>
            {/* Face ID / Touch ID */}
            <View style={styles.faceBox}>
              <MaterialCommunityIcons name={Platform.OS === 'ios' ? 'face-recognition' : 'fingerprint'} size={28} color={biometrySupported ? '#1976D2' : '#B0BEC5'} style={{ marginRight: 12 }} />
              <View style={{ flex: 1 }}>
                <Text style={styles.faceTitle}>{t('Використовувати Face ID', { method: Platform.OS === 'ios' ? 'Face ID' : 'Touch ID' })}</Text>
                <Text style={styles.faceSub}>{t('для входу в додаток')}</Text>
              </View>
              <Switch
                value={biometryEnabled}
                onValueChange={handleToggleBiometry}
                disabled={!biometrySupported}
                thumbColor={biometryEnabled ? '#1976D2' : '#E41B85'}
                trackColor={{ true: '#BBDEFB', false: '#E0E0E0' }}
              />
            </View>
            {/* Кнопки */}
            <TouchableOpacity style={styles.actionBtn} onPress={handleChangePin}>
              <Ionicons name="pencil-outline" size={20} color="#1976D2" style={{ marginRight: 10 }} />
              <Text style={styles.actionBtnTextBlue}>{t('Змінити код для входу')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionBtn, { marginTop: 10 }]} onPress={handleRemovePin}>
              <Ionicons name="close-circle-outline" size={22} color="#E53935" style={{ marginRight: 10 }} />
              <Text style={styles.actionBtnTextRed}>{t('Скинути код для входу')}</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({

  
  safe: { flex: 1, backgroundColor: '#FAFAFA' },
  container: { flex: 1, padding: 0, paddingTop: 0 },
  header: { fontSize: 20, fontWeight: '600', color: '#222', marginTop: 32, marginLeft: 18, marginBottom: 18, fontFamily: 'e-Ukraine' },
  setBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#E3F2FD', borderRadius: 12, paddingVertical: 16, paddingHorizontal: 18, marginHorizontal: 12, marginTop: 12, fontFamily: 'e-Ukraine' },
  setBtnText: { color: '#1976D2', fontWeight: '400', fontSize: 16, fontFamily: 'e-Ukraine' },
  faceBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 12, paddingVertical: 16, paddingHorizontal: 18, marginHorizontal: 12, marginBottom: 18, shadowColor: '#E41B85', shadowOpacity: 0.04, shadowRadius: 4, elevation: 1 },
  faceTitle: { color: '#E41B85', fontWeight: '600', fontSize: 16, fontFamily: 'e-Ukraine' },
  faceSub: { color: '#E41B85', fontSize: 13, fontFamily: 'e-Ukraine' },
  actionBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 12, paddingVertical: 16, paddingHorizontal: 18, marginHorizontal: 12, shadowColor: '#E41B85', shadowOpacity: 0.04, shadowRadius: 4, elevation: 1 },
  actionBtnTextBlue: { color: '#E41B85', fontWeight: '400', fontSize: 16, fontFamily: 'e-Ukraine' },
  actionBtnTextRed: { color: '#E41B85', fontWeight: '400', fontSize: 16, fontFamily: 'e-Ukraine' },
  successBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#E8F5E9', borderRadius: 10, paddingVertical: 10, paddingHorizontal: 18, marginHorizontal: 12, marginTop: 18, marginBottom: 0 },
  successText: { color: '#388E3C', fontSize: 15, fontWeight: 'bold', fontFamily: 'e-Ukraine' },
}); 