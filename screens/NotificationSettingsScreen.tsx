import React, { useState } from 'react';
import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity, Switch, ScrollView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { useNavigation } from '@react-navigation/native';
import { useNotifications } from '../contexts/NotificationsContext';

interface Row {
  id: string;
  title: string;
  subtitle: string;
  icon?: string; // Ionicon name
  image?: any;   // require image
}

const images: Record<string, any> = {
  'trivoga.png': require('../assets/trivoga.png'),
  'movchanna.png': require('../assets/movchanna.png'),
  'transport.png': require('../assets/transport.png'),
  'oputyvannya.png': require('../assets/oputyvannya.png'),
  'zvernenya.png': require('../assets/zvernenya.png'),
  'icon_nagradi.png': require('../assets/icon_nagradi.png'),
  'remont.png': require('../assets/remont.png'),
};

const rows: Row[] = [
  { id: 'alarm', image: images['trivoga.png'], title: 'Повітряна тривога', subtitle: 'Сповіщення про початок тривоги' },
  { id: 'silence', image: images['movchanna.png'], title: 'Хвилина мовчання', subtitle: 'Нагадування про вшанування пам’яті' },
  { id: 'transport', image: images['transport.png'], title: 'Транспорт', subtitle: 'Нагадування про закінчення поїздок на картці «Січ»' },
  { id: 'poll', image: images['oputyvannya.png'], title: 'Опитування', subtitle: 'Сповіщення про нові опитування' },
  { id: 'appeals', image: images['zvernenya.png'], title: 'Звернення', subtitle: 'Зміна статусу звернень' },
  { id: 'achievements', image: images['icon_nagradi.png'], title: 'Досягнення', subtitle: 'Отримання нових досягнень' },
  { id: 'repairs', image: images['remont.png'], title: 'Ремонтні роботи', subtitle: 'Сповіщення за доданими адресами' },
  { id: 'system', icon: 'warning-outline', title: 'Системні', subtitle: 'Вітання, технічні роботи, оновлення тощо' },
];

export const NotificationSettingsScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { enabled, toggle } = useNotifications();

  const handleToggle = (id: string) => {
      const next = !enabled[id];
      setTimeout(() => {
        Toast.show({
          type: 'addressToast',
          text1: next
            ? 'Сповіщення увімкнено. Ви будете отримувати повідомлення з цієї категорії!'
            : 'Сповіщення вимкнено. Ви не будете отримувати повідомлення з цієї категорії!',
        });
      }, 0);
      toggle(id);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerCapsule}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={20} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Сповіщення</Text>
        <View style={{ width: 0 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20, paddingTop: 15 }}>
        {rows.map((row) => (
          <View key={row.id} style={styles.rowItem}>
            {row.image ? (
              <Image source={row.image} style={styles.imgIcon} resizeMode="contain" />
            ) : (
              <Ionicons name={row.icon as any} size={24} color="#E41B85" style={{ marginRight: 16 }} />
            )}
            <View style={{ flex: 1 }}>
              <Text style={[styles.rowText, styles.rowTextBold]}>{row.title}</Text>
              <Text style={styles.subtitle}>{row.subtitle}</Text>
            </View>
            <Switch
              value={enabled[row.id]}
              onValueChange={() => handleToggle(row.id)}
              trackColor={{ true: '#E41B85', false: '#BDBDBD' }}
              thumbColor="#fff"
            />
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F6F6F6', paddingHorizontal: 16 },
  headerCapsule: {
    height: 43,
    marginHorizontal: 8,
    marginTop: 4,
    borderRadius: 22,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    justifyContent: 'space-between',
  },
  headerTitle: { fontFamily: 'e-Ukraine', fontSize: 16, color: '#000' },
  rowItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginBottom: 12,
    marginHorizontal: 12,
  },
  rowText: { fontSize: 14, color: '#333', fontFamily: 'e-Ukraine' },
  rowTextBold: { fontWeight: '600' },
  subtitle: { fontSize: 11, color: '#8F8F8F', fontFamily: 'e-Ukraine', marginTop: 2 },
  imgIcon: { width:24, height:24, marginRight:16 },
}); 