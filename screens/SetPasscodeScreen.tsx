import React from 'react';
import { SafeAreaView, Text, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { PinPad } from '../components/PinPad';
import { usePasscode } from '../contexts/PasscodeContext';
import Toast from 'react-native-toast-message';

export const SetPasscodeScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { set } = usePasscode();
  const [step,setStep]=useState<1|2>(1);
  const [temp,setTemp]=useState('');
  const [error,setError]=useState('');

  const handleComplete=(code:string)=>{
    if(step===1){
      setTemp(code);
      setStep(2);
    }else{
      if(code===temp){
        set(code).then(()=>{
          Toast.show({type:'addressToast',text1:'Код для входу успішно встановлено'});
          navigation.goBack();
        });
      }else{
        setError('Коди не збігаються. Спробуйте ще раз');
        setStep(1);
        setTemp('');
      }
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.back} onPress={()=>navigation.goBack()}>
        <Ionicons name="chevron-back" size={20}/>
      </TouchableOpacity>
      <View style={{marginTop:40,alignItems:'center',width:'100%'}}>
        <PinPad
          title={step===1? 'Введіть код для входу':'Підтвердьте код для входу'}
          error={error}
          onComplete={handleComplete}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container:{flex:1,alignItems:'center',backgroundColor:'#F6F6F6'},
  back:{position:'absolute',left:16,top:40},
}); 