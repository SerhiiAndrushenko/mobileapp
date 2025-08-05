import React, { useEffect, useRef } from 'react';
import { View, Image, StyleSheet, Animated } from 'react-native';
import { fetchWeatherData } from '../services/weatherService';
import { fetchAirAlarmStatus } from '../services/airAlarmService';

interface Props {
  onFinish: () => void;
}

export const SplashScreen: React.FC<Props> = ({ onFinish }) => {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Promise.allSettled([fetchWeatherData(), fetchAirAlarmStatus()]).finally(() => {
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 800, useNativeDriver: true }),
        Animated.delay(800),
        Animated.timing(opacity, { toValue: 0, duration: 400, useNativeDriver: true }),
      ]).start(() => onFinish());
    });
  }, []);

  return (
    <View style={styles.container}>
      <Animated.Image
        source={require('../assets/logo.png')}
        style={[styles.logo, { opacity }]}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center' },
  logo: { width: 260, height: 80 },
}); 