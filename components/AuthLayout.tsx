import React from 'react';
import { View, Image, StyleSheet, ScrollView } from 'react-native';

export const AuthLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <View style={styles.container}>
     
      {/* Logo */}
      <Image source={require('../assets/logo.png')} style={styles.logo} resizeMode="contain" />

      <View style={styles.fullCard}>
        <ScrollView contentContainerStyle={styles.cardInner} showsVerticalScrollIndicator={false}>
          {children}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: 112
  },
  fullCard:{
    flex:1,
    width:'100%',
    backgroundColor:'#fff',
    borderTopLeftRadius:105,
    paddingHorizontal:24,
    paddingTop:38,
    shadowColor:'#000',
    shadowOffset:{width:-3,height:0},
    shadowOpacity:0.18,
    shadowRadius:3.6,
    elevation:4,
  },
 
  cardInner: { justifyContent: 'center', alignItems: 'center' },
  logo: {
    width: 180,
    height: 50,
    alignSelf: 'center',
    marginBottom: 44,
    marginTop: -35,
  },
}); 