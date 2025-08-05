import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { AuthLayout } from '../../components/AuthLayout';
import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';

export const RegisterScreen: React.FC = () => {
  const { register, loading } = useAuth();
  const [surname, setSurname] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeat, setRepeat] = useState('');

  const handleSubmit = async () => {
    if (password !== repeat) {
      Alert.alert('Помилка', 'Паролі не співпадають');
      return;
    }
    try {
      await register({ surname, name, email: email.trim(), password });
    } catch (e: any) {
      Alert.alert('Помилка', e.message || 'Не вдалося зареєструватись');
    }
  };

  return (
    <AuthLayout>
      <MaskedView style={styles.maskFixed} maskElement={<Text style={styles.titleMask}>Реєстрація</Text>}>
        <LinearGradient start={{x:0,y:0}} end={{x:1,y:0}} colors={['#D8156B','#373839']} style={styles.gradientFill} />
      </MaskedView>
      <TextInput style={styles.input} placeholder="Прізвище" value={surname} onChangeText={setSurname} />
      <TextInput style={styles.input} placeholder="Ім’я" value={name} onChangeText={setName} />
      <TextInput
        style={styles.input}
        placeholder="Електронна пошта"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput style={styles.input} placeholder="Пароль" value={password} onChangeText={setPassword} secureTextEntry />
      <TextInput style={styles.input} placeholder="Повторіть пароль" value={repeat} onChangeText={setRepeat} secureTextEntry />
      <TouchableOpacity style={styles.primaryButton} onPress={handleSubmit} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryText}>Реєстрація</Text>}
      </TouchableOpacity>
      <Text style={styles.note}>Натискаючи кнопку «Реєстрація», Ви погоджуєтесь з <Text style={styles.link}>Політикою конфіденційності</Text></Text>
    </AuthLayout>
  );
};

const styles = StyleSheet.create({
  maskFixed:{width:220,height:40,alignSelf:'center',marginBottom:24},
  titleMask:{fontSize:28,fontWeight:'bold',textAlign:'center',color:'black'},
  gradientFill:{flex:1},
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
  primaryButton:{width:'100%',height:48,backgroundColor:'#E41B85',borderRadius:24,justifyContent:'center',alignItems:'center',marginTop:16,marginBottom:16},
  primaryText:{color:'#fff',fontSize:16,fontWeight:'600'},
  note:{fontSize:10,color:'#000',textAlign:'center',paddingHorizontal:10},
  link:{color:'#1877F2',textDecorationLine:'underline'},
}); 