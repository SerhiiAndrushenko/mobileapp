import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ActivityIndicator, Alert, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import { AuthLayout } from '../../components/AuthLayout';

const GoogleWord = () => (
  <View style={{ flexDirection: 'row' }}>
    <Text style={[styles.gLetter, { color: '#4285F4' }]}>G</Text>
    <Text style={[styles.gLetter, { color: '#EA4335' }]}>o</Text>
    <Text style={[styles.gLetter, { color: '#FBBC05' }]}>o</Text>
    <Text style={[styles.gLetter, { color: '#4285F4' }]}>g</Text>
    <Text style={[styles.gLetter, { color: '#34A853' }]}>l</Text>
    <Text style={[styles.gLetter, { color: '#EA4335' }]}>e</Text>
  </View>
);

export const LoginScreen: React.FC = () => {
  const { login, loading } = useAuth();
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);

  const handleSubmit = async () => {
    try {
      await login(email.trim(), password);
    } catch (e: any) {
      Alert.alert('Помилка', e.message || 'Не вдалося увійти');
    }
  };

  return (
    <AuthLayout>
      <MaskedView style={styles.maskFixed} maskElement={<Text style={styles.titleMask}>Вхід</Text>}>
        <LinearGradient start={{x:0,y:0}} end={{x:1,y:0}} colors={['#D8156B', '#373839']} style={styles.gradientFill} />
      </MaskedView>
      <MaskedView style={styles.maskFixedSub} maskElement={<Text style={styles.subMask}>Вибір методу авторизації:</Text>}>
        <LinearGradient start={{x:0,y:0}} end={{x:1,y:0}} colors={['#D8156B', '#373839']} style={styles.gradientFill} />
      </MaskedView>

      <TextInput
        style={styles.input}
        placeholder="Адреса електронної пошти"
        placeholderTextColor="#999"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Пароль"
        placeholderTextColor="#999"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {/* Remember / forgot row */}
      <View style={styles.rowBetween}>
        <Pressable style={styles.checkRow} onPress={() => setRemember(!remember)}>
          <View style={[styles.checkbox, remember && styles.checkboxChecked]}>
            {remember && <Ionicons name="checkmark" size={12} color="#fff" />}
          </View>
          <Text style={styles.checkLabel}>Запам’ятати</Text>
        </Pressable>
        <TouchableOpacity>
          <Text style={styles.forgot}>Забули пароль?</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.primaryButton} onPress={handleSubmit} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryText}>Увійти</Text>}
      </TouchableOpacity>

      <TouchableOpacity style={styles.secondaryButton} onPress={()=> (navigation as any).navigate('Register')}>
        <Text style={styles.secondaryText}>Реєстрація</Text>
      </TouchableOpacity>

      {/* Separator */}
      <View style={styles.separatorRow}>
        <View style={styles.separatorLine} />
        <Text style={styles.separatorLabel}>або</Text>
        <View style={styles.separatorLine} />
      </View>

      {/* Google button */}
      <TouchableOpacity style={styles.googleBtn} activeOpacity={0.8}>
        <GoogleWord />
      </TouchableOpacity>
    </AuthLayout>
  );
};

const styles = StyleSheet.create({
  maskContainer: { alignSelf: 'center', marginBottom: 16 },
  gradientFill: { flex: 1 },
  maskFixed:{width:200,height:40,alignSelf:'center',marginBottom:8},
  maskFixedSub:{width:260,height:24,alignSelf:'center',marginBottom:24},
  titleMask:{fontSize:28,fontWeight:'bold',textAlign:'center',color:'black'},
  subMask:{fontSize:14,fontWeight:'600',textAlign:'center',color:'black'},
  gLetter:{fontSize:20,fontWeight:'600'},
  input: {
    width: '100%',
    height: 48,
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 24,
    paddingHorizontal: 16,
    marginBottom: 16,
    backgroundColor: '#fff',
    color: '#000',
  },
  rowBetween: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  checkRow: { flexDirection: 'row', alignItems: 'center' },
  checkbox: {
    width: 16,
    height: 16,
    borderWidth: 1,
    borderColor: '#000',
    marginRight: 6,
    borderRadius: 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  checkboxChecked: {
    backgroundColor: '#E41B85',
    borderColor: '#E41B85',
  },
  checkLabel: { fontSize: 12, color: '#000' },
  forgot: { fontSize: 12, color: '#E41B85' },
  primaryButton: {
    width: '100%',
    height: 48,
    backgroundColor: '#E41B85',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  primaryText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  secondaryButton: {
    width: '100%',
    height: 48,
    backgroundColor: '#9E9E9E',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  secondaryText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  separatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  separatorLine: { flex: 1, height: 1, backgroundColor: '#BDBDBD' },
  separatorLabel: { marginHorizontal: 12, color: '#000' },
  googleBtn: {
    width: '100%',
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#BDBDBD',
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
  googleText: { fontSize: 18, color: '#4285F4', marginLeft: 2 },
}); 