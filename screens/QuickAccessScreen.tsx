import React from 'react';
import { View, Text, SafeAreaView, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
// @ts-ignore – бібліотека не має typings у комплекті
import DraggableFlatList, { RenderItemParams } from 'react-native-draggable-flatlist';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { useQuickAccess } from '../contexts/QuickAccessContext';
import { allServices, ServiceItem } from '../services/allServices';

export const QuickAccessScreen: React.FC = () => {
  const { selectedIds, selectedServices, toggle, reorder } = useQuickAccess();
  const navigation = useNavigation<any>();

  const selected = selectedServices; // preserve exact order
  const available = allServices.filter((s) => !selectedIds.includes(s.id));
  const pinned = selected.find((s)=>s.id==='shelters');
  const draggableData = selected.filter((s)=>s.id!=='shelters');

  const handleRemove = (id: string) => {
    toggle(id);
    Toast.show({ type: 'addressToast', text1: 'Сервіс видалено.' });
  };

  const handleAdd = (id: string) => {
    if (draggableData.length >= 5) return; // лимит 5 додаткових
    toggle(id);
    Toast.show({ type: 'addressToast', text1: 'Сервіс додано.' });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerCapsule}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={20} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Швидкий доступ</Text>
        <View style={{ width: 20 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
        <Text style={styles.sectionTitle}>Обрані сервіси</Text>
        {pinned && (
          <View style={styles.rowItem}>
            <Ionicons name={pinned.icon as any} size={24} color="#E41B85" style={{ marginRight: 16 }} />
            <Text style={[styles.rowText, styles.rowTextBold]}>{pinned.title}</Text>
          </View>
        )}
        {draggableData.length === 0 && <Text style={styles.note}>Немає інших сервісів</Text>}
        <DraggableFlatList<ServiceItem>
          data={draggableData}
          keyExtractor={(item: ServiceItem) => item.id}
          onDragEnd={({ data }: { data: ServiceItem[] }) => reorder(data.map((item) => item.id))}
          scrollEnabled={false}
          renderItem={({ item, drag, isActive }: RenderItemParams<ServiceItem>) => (
            <TouchableOpacity
              style={[styles.rowItem, isActive && [styles.draggingItem]]}
              onLongPress={() => { if(item.id!=='shelters'){ Haptics.selectionAsync(); drag(); } }}
              delayLongPress={150}
              activeOpacity={0.9}
            >
              <Ionicons name={item.icon as any} size={24} color="#E41B85" style={{ marginRight: 16 }} />
              <Text style={[styles.rowText, styles.rowTextBold]}>{item.title}</Text>
              {item.id !== 'shelters' && (
                <>
                  {/* drag handle */}
                  <TouchableOpacity
                    onPressIn={drag}
                    style={styles.rowDragHandle}
                    hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
                  >
                    <Ionicons name="reorder-three" size={20} color="#B0B0B0" />
                  </TouchableOpacity>
                  {/* delete button */}
                  <TouchableOpacity
                    onPress={() => handleRemove(item.id)}
                    style={styles.rowIconBtn}
                    hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
                  >
                    <Ionicons name="trash" size={18} color="#E41B85" />
                  </TouchableOpacity>
                </>
              )}
            </TouchableOpacity>
          )}
        />

        <Text style={styles.sectionTitle}>Доступні сервіси</Text>
        {available.map((s: ServiceItem) => {
          const disabled = draggableData.length >= 5; // 5 додаткових
          return (
            <TouchableOpacity
              key={s.id}
              style={[styles.rowItem, disabled && styles.disabledRow]}
              disabled={disabled}
              onPress={() => handleAdd(s.id)}
            >
              <Ionicons name={s.icon as any} size={24} color="#E41B85" style={{ marginRight: 16 }} />
              <Text style={[styles.rowText, styles.rowTextBold]}>{s.title}</Text>
              <Ionicons name="add" size={18} color={disabled ? '#BDBDBD' : '#E41B85'} style={styles.rowAddIcon} />
            </TouchableOpacity>
          );
        })}
        {draggableData.length >= 5 && (
          <Text style={styles.limitText}>Додано максимальну кількість сервісів (5).</Text>
        )}
        <View style={{ height: 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F6F6F6', paddingHorizontal: 16 },
  headerCapsule: {
    height: 44,
    marginHorizontal: 0,
    marginTop: 4,
    borderRadius: 22,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    justifyContent: 'space-between',
  },
  headerTitle: { fontFamily: 'e-Ukraine', fontSize: 16, color: '#000' },
  sectionTitle: {
    fontFamily: 'e-Ukraine',
    fontSize: 14,
    color: '#8F8F8F',
    marginHorizontal: 16,
    marginTop: 24,
    marginBottom: 8,
  },
  rowItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginBottom: 14,
    marginHorizontal: 8,
  },
  rowText: { fontSize: 15, color: '#333', fontFamily: 'e-Ukraine', flex: 1 },
  rowTextBold: { fontWeight: '500' },
  rowDragHandle: { marginLeft: 16 },
  rowIconBtn: { marginLeft: 12 },
  rowAddIcon: { marginLeft: 12 },
  disabledRow: { opacity: 0.4 },
  disabledCard: { opacity: 0.4 },
  note: { fontFamily: 'e-Ukraine', color: '#8F8F8F', fontSize: 12 },
  limitText: { fontFamily: 'e-Ukraine', color: '#8F8F8F', fontSize: 12, marginTop: 12, textAlign:'center' },
  draggingItem: { transform:[{scale:1.03}], shadowColor:'#000', shadowOffset:{width:0,height:3}, shadowOpacity:0.15, shadowRadius:4, elevation:4 },
}); 