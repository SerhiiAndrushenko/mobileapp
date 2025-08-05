import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, SafeAreaView } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';
import { formatDateString } from '../utils/dateUtils';
import { ConfirmModal } from '../components/ConfirmModal';

export const PersonalInfoScreen: React.FC = () => {
  const { user, updateProfile, deleteAccount } = useAuth();
  const [edit, setEdit] = useState(false);
  const [surname, setSurname] = useState(user?.surname || '');
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [modal1, setModal1] = useState(false);
  const [modal2, setModal2] = useState(false);

  const handleSave = async () => {
    try {
      await updateProfile({ surname, name, email });
      setEdit(false);
    } catch (e: any) {
      Alert.alert('Помилка', e.message || 'Не вдалося зберегти');
    }
  };

  const handleDelete = () => setModal1(true);
  const confirmDelete = () => { setModal1(false); setModal2(true); };
  const finalDelete = () => { setModal2(false); deleteAccount(); };

  const currentDate = new Date();

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Особиста інформація</Text>
      <View style={styles.card}>
        {/* Greeting */}
        <View style={styles.greetRow}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={32} color="#9E9E9E" />
          </View>
          <View>
            <Text style={styles.date}>{formatDateString(currentDate, ()=>'')}</Text>
            <MaskedView maskElement={<Text style={styles.greetingMask}>Вітаємо, {user?.name || ''}!</Text>}>
              <LinearGradient start={{x:0,y:0}} end={{x:1,y:0}} colors={['#D8156B','#373839']} style={{height:24}} />
            </MaskedView>
          </View>
        </View>

        {/* Fields */}
        <TextInput
          editable={edit}
          style={styles.input}
          value={surname}
          onChangeText={setSurname}
          placeholder="Прізвище"
          placeholderTextColor="#8F8F8F"
        />
        <TextInput
          editable={edit}
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Ім'я"
          placeholderTextColor="#8F8F8F"
        />
        <TextInput
          editable={edit}
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="Електронна пошта"
          placeholderTextColor="#8F8F8F"
        />

        {edit ? (
          <>
            <TouchableOpacity style={styles.primaryBtn} onPress={handleSave}>
              <Text style={styles.primaryText}>Зберегти</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryBtn} onPress={() => setEdit(false)}>
              <Text style={styles.secondaryText}>Скасувати</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TouchableOpacity style={styles.editBtn} onPress={() => setEdit(true)}>
              <Text style={styles.editText}>Редагувати</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.primaryBtn} onPress={handleDelete}>
              <Text style={styles.primaryText}>Видалити обліковий запис</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
      <ConfirmModal
        visible={modal1}
        title="Шановний користувач!"
        message="Ваш акаунт буде повністю видалено з мобільного застосунку та вебпорталу «Цифрове Запоріжжя».  Ви видаляєте особисті дані, адреси та всю інформацію з акаунта. Цю дію не можна скасувати, відновлення буде неможливим.                Доведеться створювати новий акаунт."
        secondaryLabel="Скасувати"
        primaryLabel="Видалити обліковий запис"
        onSecondary={()=>setModal1(false)}
        onPrimary={confirmDelete}
      />

      <ConfirmModal
        visible={modal2}
        title="Шановний користувач!"
        message="Ви дійсно вирішили видалити акаунт?"
        secondaryLabel="Скасувати"
        primaryLabel="Підтвердити"
        onSecondary={()=>setModal2(false)}
        onPrimary={finalDelete}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F6F6F6', padding: 16 },
  header: { fontSize: 13, color: '#8F8F8F', marginBottom: 8, marginLeft: 16, fontFamily: 'e-Ukraine' },
  card: { backgroundColor: '#fff', borderRadius: 20, padding: 16 },
  greetRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  avatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#E0E0E0', justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  date: { fontSize: 11, color: '#8F8F8F', fontFamily: 'e-Ukraine' },
  greeting: { fontSize: 18, fontWeight: 'bold', fontFamily: 'e-Ukraine' },
  input: { height: 40, borderBottomWidth: 1, borderBottomColor: '#E0E0E0', marginBottom: 8, fontFamily: 'e-Ukraine' },
  editBtn: { height: 48, borderWidth: 1, borderColor: '#000', borderRadius: 24, justifyContent: 'center', alignItems: 'center', marginTop: 16 },
  editText: { fontFamily: 'e-Ukraine', fontSize: 16 },
  primaryBtn: { height: 48, borderRadius: 24, backgroundColor: '#E41B85', justifyContent: 'center', alignItems: 'center', marginTop: 16 },
  primaryText: { color: '#fff', fontSize: 16, fontFamily: 'e-Ukraine' },
  secondaryBtn: { height: 48, borderRadius: 24, backgroundColor: '#9E9E9E', justifyContent: 'center', alignItems: 'center', marginTop: 16 },
  secondaryText: { color: '#fff', fontSize: 16, fontFamily: 'e-Ukraine' },
  greetingMask: { fontSize: 18, fontWeight: 'bold', fontFamily: 'e-Ukraine', color: '#000' },
}); 