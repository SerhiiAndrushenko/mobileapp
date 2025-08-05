import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';

interface Props {
  visible: boolean;
  title: string;
  message: string;
  primaryLabel: string;
  secondaryLabel: string;
  onPrimary: () => void;
  onSecondary: () => void;
}

export const ConfirmModal: React.FC<Props> = ({ visible, title, message, primaryLabel, secondaryLabel, onPrimary, onSecondary }) => {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.card}>
          <MaskedView style={styles.titleWrap} maskElement={<Text style={styles.titleMask}>{title}</Text>}>
            <LinearGradient start={{x:0,y:0}} end={{x:1,y:0}} colors={['#D8156B','#373839']} style={{ height:40, width:'100%' }} />
          </MaskedView>
          <Text style={styles.message}>{message}</Text>
          <TouchableOpacity style={styles.secondaryBtn} onPress={onSecondary}>
            <Text style={styles.secondaryText}>{secondaryLabel}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.primaryBtn} onPress={onPrimary}>
            <Text style={styles.primaryText}>{primaryLabel}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  overlay:{ flex:1, justifyContent:'center', alignItems:'center', backgroundColor:'rgba(0,0,0,0.4)' },
  card:{ width: width*0.97, backgroundColor:'#fff', borderRadius:16, padding:24, alignItems:'center' },
  titleWrap:{ width:'100%', height:40, justifyContent:'center', alignItems:'center', marginBottom:12 },
  titleMask:{ fontSize:20, fontWeight:'bold', textAlign:'center', color:'#000', fontFamily:'e-Ukraine' },
  message:{ fontSize:14, textAlign:'center', marginBottom:24, fontFamily:'e-Ukraine' },
  secondaryBtn:{ width:'100%', height:48, borderRadius:24, backgroundColor:'#9E9E9E', justifyContent:'center', alignItems:'center', marginBottom:12 },
  secondaryText:{ color:'#fff', fontSize:16, fontFamily:'e-Ukraine' },
  primaryBtn:{ width:'100%', height:48, borderRadius:24, backgroundColor:'#E41B85', justifyContent:'center', alignItems:'center' },
  primaryText:{ color:'#fff', fontSize:16, fontFamily:'e-Ukraine' },
}); 