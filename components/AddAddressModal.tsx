import React, { useState, useEffect } from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, TextInput, FlatList, ActivityIndicator } from 'react-native';
import { fetchStreets, fetchLetters, Address } from '../services/addressService';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  visible: boolean;
  onClose: () => void;
  onAdd: (addr: Address) => void;
}

export const AddAddressModal: React.FC<Props> = ({ visible, onClose, onAdd }) => {
  const [search, setSearch] = useState('');
  const [streets, setStreets] = useState<any[]>([]);
  const [street, setStreet] = useState<any | null>(null);
  const [house, setHouse] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (search.length < 3) return;
    let isCancelled = false;
    setLoading(true);
    fetchStreets(search).then(res => { if(!isCancelled) { setStreets(res); setLoading(false);} });
    return () => { isCancelled = true; };
  }, [search]);

  const disabled = !street || !house;

  const handleAdd = () => {
    if(disabled) return;
    onAdd({ id: Date.now().toString(), street: street.name, house });
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.card}>
          <View style={styles.headerRow}>
            <Text style={styles.title}>Додати адресу</Text>
            <TouchableOpacity onPress={onClose}><Ionicons name="close" size={24} /></TouchableOpacity>
          </View>
          <TextInput style={styles.input} placeholder="Вулиця" value={search} onChangeText={setSearch} />
          {loading && <ActivityIndicator />}
          {street && (
            <Text style={styles.chosen}>{street.name}</Text>
          )}
          {!street && (
            <FlatList
              data={streets}
              keyExtractor={item=>item.id.toString()}
              renderItem={({item})=> (
                <TouchableOpacity onPress={()=>{setStreet(item); setSearch('');}}><Text style={styles.item}>{item.name}</Text></TouchableOpacity>
              )}
              style={{ maxHeight:120 }}
            />
          )}
          <TextInput style={styles.input} placeholder="Номер будинку" value={house} onChangeText={setHouse} />
          <TouchableOpacity style={[styles.addBtn, disabled && {opacity:0.5}]} disabled={disabled} onPress={handleAdd}>
            <Text style={styles.addText}>Додати адресу</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay:{flex:1, justifyContent:'center', alignItems:'center', backgroundColor:'rgba(0,0,0,0.4)'},
  card:{width:'90%', backgroundColor:'#fff', borderRadius:16, padding:16},
  headerRow:{flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginBottom:12},
  title:{fontSize:18, fontWeight:'bold'},
  input:{height:48,borderWidth:1,borderColor:'#BDBDBD',borderRadius:24,paddingHorizontal:16,marginBottom:12},
  addBtn:{height:48,borderRadius:24,backgroundColor:'#E41B85',justifyContent:'center',alignItems:'center',marginTop:8},
  addText:{color:'#fff',fontWeight:'600'},
  item:{padding:8},
  chosen:{padding:8, fontWeight:'600'},
}); 