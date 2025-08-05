import React from 'react';
import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export const SecurityMainScreen: React.FC = () => {
  const navigation = useNavigation<any>();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerCapsule}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={20} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Безпека</Text>
        <View style={{ width: 20 }} />
      </View>

      <View style={styles.cardContainer}>
        <TouchableOpacity style={styles.menuItem} onPress={() => (navigation as any).navigate('SetPasscode')}>
          <View style={styles.menuItemLeft}>
            <Image source={require('../assets/security.png')} style={styles.icon} />
            <Text style={styles.menuText}>Встановити код для входу</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#BDBDBD" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex:1, backgroundColor:'#F6F6F6' },
  headerCapsule:{ height:44, marginHorizontal:16, marginTop:4, borderRadius:22, backgroundColor:'#fff', flexDirection:'row', alignItems:'center', paddingHorizontal:12, justifyContent:'space-between' },
  headerTitle:{ fontFamily:'e-Ukraine', fontSize:16, color:'#000' },
  cardContainer:{ marginHorizontal:16, marginTop:16, backgroundColor:'#fff', borderRadius:20, overflow:'hidden' },
  menuItem:{ flexDirection:'row', alignItems:'center', justifyContent:'space-between', paddingHorizontal:16, paddingVertical:14 },
  menuItemLeft:{ flexDirection:'row', alignItems:'center' },
  icon:{ width:20, height:20, marginRight:12, resizeMode:'contain' },
  menuText:{ fontFamily:'e-Ukraine', fontSize:14, color:'#333' },
}); 