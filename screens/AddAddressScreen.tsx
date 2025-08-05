import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, SafeAreaView } from 'react-native';
import { useAddress } from '../contexts/AddressContext';
import Toast from 'react-native-toast-message';
import { useNavigation } from '@react-navigation/native';

export const AddAddressScreen: React.FC = () => {
  const { add, addresses } = useAddress();
  const navigation = useNavigation();
  const [street, setStreet] = useState('');
  const [house, setHouse] = useState('');
  const disabled = !street || !house || addresses.length >= 5;
  const handleSave = async () => {
    try {
      await add({ id: Date.now().toString(), street, house });
      Toast.show({ type: 'addressToast', text1: 'Адресу  додано.  Ви  будете  отримувати  сповіщення  про  ремонтні  роботи  за  цією  адресою.' });
      navigation.goBack();
    } catch (e: any) {
      Alert.alert('Помилка', e.message || 'Не вдалося додати');
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerCapsule}>
        <TouchableOpacity onPress={() => navigation.goBack()}><Text style={styles.back}>{'<'} </Text></TouchableOpacity>
        <Text style={styles.header}>Адреса</Text>
      </View>
       <TextInput style={styles.input} placeholder="Вулиця" value={street} onChangeText={setStreet} />
       <TextInput style={styles.input} placeholder="Номер будинку" value={house} onChangeText={setHouse} />

      <TouchableOpacity style={[styles.saveBtn, disabled && styles.disabledBtn]} disabled={disabled} onPress={handleSave}>
        <Text style={styles.saveText}>Додати адресу</Text>
      </TouchableOpacity>
      
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F6F6F6', paddingTop: 16 },
  headerCapsule:{flexDirection:'row',alignItems:'center',backgroundColor:'#fff',borderRadius:24,paddingHorizontal:16,height:40,marginBottom:24},
  header:{fontSize:17,fontWeight:'600',flex:1,textAlign:'center'},
  back:{fontSize:18},
  input:{height:48,borderWidth:1,borderColor:'#000',borderRadius:24,paddingHorizontal:16,marginBottom:16,backgroundColor:'#fff',marginHorizontal:16},
  saveBtn:{height:48,borderRadius:24,backgroundColor:'#E41B85',justifyContent:'center',alignItems:'center',marginTop:8,marginHorizontal:16},
  disabledBtn:{backgroundColor:'#9E9E9E'},
  saveText:{color:'#fff',fontSize:16,fontWeight:'600'},
  note:{textAlign:'center',marginTop:16,color:'#888',fontSize:14},
}); 