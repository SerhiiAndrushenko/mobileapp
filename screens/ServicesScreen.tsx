import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { allServices, ServiceItem } from '../services/allServices';

const CARD_SIZE = 160; // width & height

export const ServicesScreen: React.FC = () => {
  const renderItem = ({ item }: { item: ServiceItem }) => (
    <TouchableOpacity style={styles.card} activeOpacity={0.8}>
      <Ionicons name={item.icon as any} size={32} color="#E41B85" style={{ marginBottom: 12 }} />
      <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <FlatList
      contentContainerStyle={styles.list}
      data={allServices}
      numColumns={2}
      keyExtractor={(i) => i.id}
      renderItem={renderItem}
      showsVerticalScrollIndicator={false}
    />
  );
};

const styles = StyleSheet.create({
  list: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 32,
  },
  card: {
    width: CARD_SIZE,
    height: CARD_SIZE,
    backgroundColor: '#fff',
    borderRadius: 20,
    margin: 10,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 2,
    padding: 12,
  },
  title: {
    fontFamily: 'e-Ukraine',
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  }
}); 