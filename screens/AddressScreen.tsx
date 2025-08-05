import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { useAddress } from '../contexts/AddressContext';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { ConfirmModal } from '../components/ConfirmModal';
import { useNavigation } from '@react-navigation/native';

export const AddressScreen: React.FC = () => {
  const { addresses, remove } = useAddress();
  const [editMode, setEditMode] = useState(false);
  const [confirmId, setConfirmId] = useState<string|null>(null);

  const confirmDelete = async () => {
    if (confirmId) {
      await remove(confirmId);
      Toast.show({ type: 'addressToast', text1: 'Адресу  видалено.' });
      setConfirmId(null);
    }
  };

  const navigation = useNavigation();
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerCapsule}>
        <TouchableOpacity onPress={()=>navigation.goBack()}><Ionicons name="chevron-back" size={20} /></TouchableOpacity>
        <Text style={styles.headerTitle}>Адреса</Text>
        {addresses.length>0 && (
          editMode ? (
            <TouchableOpacity onPress={()=>setEditMode(false)}><Text style={styles.editLink}>Скасувати</Text></TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={()=>setEditMode(true)}><Text style={styles.editLink}>Редагувати</Text></TouchableOpacity>
          )
        )}
      </View>
      <Text style={styles.sub}>Отримуйте сповіщення про ремонтні роботи за вашою адресою</Text>

      <ScrollView contentContainerStyle={{paddingBottom:20}} showsVerticalScrollIndicator={false}>
        {addresses.map(item => (
          <View key={item.id} style={styles.addrRow}>
            <Ionicons name="home-outline" size={20} style={{marginRight:8}} />
            <Text style={{flex:1}}>{item.street},  {item.house}{item.letter?item.letter:''}</Text>
            {editMode && (
              <TouchableOpacity onPress={()=>setConfirmId(item.id)}>
                <Ionicons name="trash" size={20} color="#E41B85" />
              </TouchableOpacity>
            )}
          </View>
        ))}

        <TouchableOpacity style={[styles.addBtn, addresses.length>=5 && styles.addBtnDisabled]} disabled={addresses.length>=5} onPress={()=> (navigation as any).navigate('AddAddress')}>
          <Text style={[styles.addText, addresses.length>=5 && {color:'#9E9E9E'}]}>Додати адресу</Text>
        </TouchableOpacity>

        <Text style={styles.limit}>Можна додати лише 5 адрес. Щоб додати нову, спершу видаліть одну з наявних.</Text>
      </ScrollView>

      <ConfirmModal
        visible={!!confirmId}
        title="Видалити адресу?"
        message="Сповіщення за цією адресою більше не надходитимуть"
        secondaryLabel="Скасувати"
        primaryLabel="Видалити"
        onSecondary={() => setConfirmId(null)}
        onPrimary={confirmDelete}
      />

      {/* <AddAddressModal visible={modal} onClose={()=>setModal(false)} onAdd={handleAdd} /> */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container:{flex:1,backgroundColor:'#F6F6F6',paddingTop:16},
  headerCapsule:{flexDirection:'row', alignItems:'center', backgroundColor:'#fff', borderRadius:24, paddingHorizontal:16, height:40, marginHorizontal:16, marginBottom:16},
  headerTitle:{fontSize:17,fontWeight:'600',flex:1,textAlign:'center'},
  editLink:{color:'#1877F2'},
  sub:{fontSize:13,color:'#8F8F8F',marginBottom:16, marginHorizontal:16,textAlign:'center'},
  addrRow:{flexDirection:'row',alignItems:'center',backgroundColor:'#fff',borderRadius:12,padding:12,marginBottom:12, marginHorizontal:16},
  addBtn:{height:48,borderRadius:24,borderWidth:1,borderColor:'#000',backgroundColor:'#FFFFFF',justifyContent:'center',alignItems:'center',marginHorizontal:16,marginBottom:12},
  addBtnDisabled:{borderColor:'#9E9E9E'},
  addText:{fontSize:16},
  limit:{fontSize:12,color:'#8F8F8F',textAlign:'center', marginHorizontal:16},
}); 