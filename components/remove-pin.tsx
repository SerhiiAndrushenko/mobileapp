import { useNavigation } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Dimensions, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const PIN_KEY = 'app_pin_code';
const { width } = Dimensions.get('window');
const GRAY = '#B0BEC5';
const COLORS = ['#008C45', '#FFD600', '#E91E63'];

function getCircleColor(index: number) {
  return COLORS[index % COLORS.length];
}

export default function RemovePinScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const [input, setInput] = useState('');
  const [error, setError] = useState('');
  const [pressedKey, setPressedKey] = useState<string | null>(null);

  const handlePress = (digit: string, idx: number) => {
    setPressedKey(digit + idx);
    setTimeout(() => setPressedKey(null), 120);
    if (input.length < 4) {
      setInput(input + digit);
      setError('');
    }
  };

  const handleBackspace = (idx: number) => {
    setPressedKey('back' + idx);
    setTimeout(() => setPressedKey(null), 120);
    if (input.length > 0) setInput(input.slice(0, -1));
  };

  React.useEffect(() => {
    if (input.length === 4) {
      SecureStore.getItemAsync(PIN_KEY).then(storedPin => {
        if (storedPin === input) {
          SecureStore.deleteItemAsync(PIN_KEY).then(() => {
            setInput('');
            setError('');
            navigation.replace('Security', { success: '1' });
          });
        } else {
          setError(t('Коди не співпадають, спробуйте ще раз'));
          setTimeout(() => setInput(''), 700);
        }
      });
    }
  }, [input]);

  const renderDots = (value: string) => (
    <View style={{ flexDirection: 'row', justifyContent: 'center', marginVertical: 18 }}>
      {[0, 1, 2, 3].map(i => (
        <View key={i} style={[styles.dot, { backgroundColor: value.length > i ? '#E91E63' : '#E0E0E0' }]} />
      ))}
    </View>
  );

  const renderKeyboard = () => {
    const digits = [
      ['1', '2', '3'],
      ['4', '5', '6'],
      ['7', '8', '9'],
      ['', '0', 'back'],
    ];
    return (
      <View style={{ width: '100%', alignItems: 'center', marginTop: 8 }}>
        {digits.map((row, rowIdx) => (
          <View key={rowIdx} style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 10 }}>
            {row.map((d, colIdx) => {
              const idx = rowIdx * 3 + colIdx;
              const isPressed = pressedKey === (d === 'back' ? 'back' + idx : d + idx);
              const borderColor = isPressed && d !== '' ? getCircleColor(idx) : GRAY;
              const textColor = isPressed && d !== '' ? getCircleColor(idx) : '#222';
              if (d === '') return <View key={colIdx} style={{ width: keySize, height: keySize, marginHorizontal: 8 }} />;
              if (d === 'back')
                return (
                  <TouchableOpacity key={colIdx} style={[styles.key, { borderColor }]} onPress={() => handleBackspace(idx)} activeOpacity={1}>
                    <Text style={{ fontSize: 26, color: textColor }}>⌫</Text>
                  </TouchableOpacity>
                );
              return (
                <TouchableOpacity key={colIdx} style={[styles.key, { borderColor }]} onPress={() => handlePress(d, idx)} activeOpacity={1}>
                  <Text style={{ fontSize: 26, color: textColor }}>{d}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Image source={require('../assets/logo.png')} style={{ width: 160, height: 48, resizeMode: 'contain', marginTop: 18, alignSelf: 'center' }} />
        <Text style={styles.title}>{t('Введіть поточний код для входу')}</Text>
        {renderDots(input)}
        {error ? <Text style={styles.error}>{error}</Text> : <View style={{ height: 22 }} />}
        {renderKeyboard()}
      </View>
    </SafeAreaView>
  );
}

const keySize = Math.min(80, width / 4.2);

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FAFAFA' },
  container: { flex: 1, justifyContent: 'flex-start', alignItems: 'center', paddingHorizontal: 0 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#222', marginTop: 32, marginBottom: 8, textAlign: 'center' },
  dot: { width: 16, height: 16, borderRadius: 8, marginHorizontal: 8, backgroundColor: '#E0E0E0' },
  key: { width: keySize, height: keySize, borderRadius: keySize / 2, borderWidth: 1.5, borderColor: GRAY, alignItems: 'center', justifyContent: 'center', marginHorizontal: 8, backgroundColor: '#fff' },
  error: { color: '#E91E63', fontSize: 15, marginTop: 0, marginBottom: 8, textAlign: 'center', fontWeight: 'bold' },
}); 