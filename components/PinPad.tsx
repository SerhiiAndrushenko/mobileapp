import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  length?: number;
  title?: string;
  error?: string;
  onComplete: (code: string) => void;
}

export const PinPad: React.FC<Props> = ({ length = 4, title, error, onComplete }) => {
  const [code, setCode] = useState('');
  const [show, setShow] = useState(false);

  const press = (digit: string) => {
    if (code.length >= length) return;
    const next = code + digit;
    setCode(next);
    if (next.length === length) {
      setTimeout(() => {
        onComplete(next);
        setCode('');
      }, 100);
    }
  };

  const backspace = () => {
    if (code.length === 0) return;
    setCode(code.slice(0, -1));
  };

  const renderDots = () => {
    const arr = [];
    for (let i = 0; i < length; i++) {
      arr.push(
        <View key={i} style={[styles.dot, code.length > i && styles.dotFilled]} />
      );
    }
    return <View style={styles.dotsRow}>{arr}</View>;
  };

  return (
    <View style={styles.wrap}>
      {title && <Text style={styles.title}>{title}</Text>}
      {renderDots()}
      {error && <Text style={styles.error}>{error}</Text>}
      <View style={styles.padWrap}>
        {[['1','2','3'],['4','5','6'],['7','8','9'],['','0','<']].map((row,rowIdx)=>(
          <View key={rowIdx} style={styles.row}>
            {row.map((digit,idx)=>{
              if(digit==='') return <View key={idx} style={styles.btn}/>
              if(digit==='<' ) return (
                <TouchableOpacity key={idx} style={styles.btn} onPress={backspace}>
                  <Ionicons name="backspace" size={24} color="#333" />
                </TouchableOpacity>
              );
              return (
                <TouchableOpacity key={idx} style={styles.btn} onPress={()=>press(digit)}>
                  <Text style={styles.btnText}>{show?digit:'•'}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap:{alignItems:'center',width:'100%'},
  title:{fontFamily:'e-Ukraine',fontSize:15,color:'#333',marginBottom:12},
  dotsRow:{flexDirection:'row',gap:8,marginBottom:12},
  dot:{width:10,height:10,borderRadius:5,borderWidth:1,borderColor:'#BDBDBD'},
  dotFilled:{backgroundColor:'#333',borderColor:'#333'},
  error:{color:'#ff4444',fontSize:12,fontFamily:'e-Ukraine',marginBottom:6},
  padWrap:{alignItems:'center'},
  row:{flexDirection:'row',gap:24,marginVertical:6},
  btn:{width:56,height:56,borderRadius:28,backgroundColor:'#EAEAEA',justifyContent:'center',alignItems:'center'},
  btnText:{fontSize:22,color:'#333',fontFamily:'e-Ukraine'},
}); 