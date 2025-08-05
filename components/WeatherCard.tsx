import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { 
  fetchWeatherData, 
  ProcessedWeatherData,
  getWeatherIcon 
} from '../services/weatherService';

// Компонент картки погоди (точні розміри 169x118px з реальними даними)
export const WeatherCard: React.FC = () => {
  const { t } = useTranslation();
  const [weatherData, setWeatherData] = useState<ProcessedWeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Завантаження даних погоди при монтуванні компонента
  useEffect(() => {
    loadWeatherData();
    
    // Оновлення даних кожні 10 хвилин
    const interval = setInterval(loadWeatherData, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Функція завантаження даних погоди
  const loadWeatherData = async () => {
    try {
      console.log('🌤️ Початок завантаження погоди...');
      setLoading(true);
      setError(false);
      
      const data = await fetchWeatherData();
      console.log('🌤️ Результат API:', data);
      
      if (data) {
        setWeatherData(data);
        console.log('✅ Дані погоди успішно оновлено:', {
          current: data.currentTemp,
          day: data.dayTemp, 
          night: data.nightTemp,
          description: data.weatherDescription
        });
      } else {
        console.warn('⚠️ API повернув null, використовуємо дефолтні дані');
        setWeatherData({
          currentTemp: 26,
          dayTemp: 26,
          nightTemp: 14,
          weatherCode: 0,
          weatherDescription: 'sunny'
        });
      }
    } catch (err) {
      console.error('❌ Критична помилка завантаження погоди:', err);
      setError(true);
      // Використовуємо дефолтні дані при помилці
      setWeatherData({
        currentTemp: 26,
        dayTemp: 26,
        nightTemp: 14,
        weatherCode: 0,
        weatherDescription: 'sunny'
      });
    } finally {
      setLoading(false);
      console.log('🏁 Завантаження погоди завершено');
    }
  };

  // Отримання опису погоди українською
  const getWeatherDescriptionUA = (description: string, code: number): string => {
    // Базовані на кодах WMO
    if (code === 0 || code === 1) return 'Досить сонячно';
    if (code === 2) return 'Частково хмарно';
    if (code === 3) return 'Хмарно';
    if (code >= 45 && code <= 48) return 'Туман';
    if (code >= 51 && code <= 67) return 'Дощ';
    if (code >= 71 && code <= 86) return 'Сніг';
    if (code >= 95 && code <= 99) return 'Гроза';
    
    return 'Досить сонячно'; // За замовчуванням
  };

  // Якщо йде завантаження
  if (loading) {
    return (
      <View style={styles.card}>
        <ActivityIndicator size="small" color="#E41B85" />
        <Text style={styles.loadingText}>Завантаження погоди...</Text>
      </View>
    );
  }

  return (
    <View style={styles.card}>
      {/* Поточна температура по центру */}
      <Text style={styles.currentTemp}>
        {(weatherData?.currentTemp ?? 26) >= 0 ? '+' : ''}{weatherData?.currentTemp ?? 26}°
      </Text>
      
      {/* Назва міста великими жирними літерами */}
      <Text style={styles.cityName}>ЗАПОРІЖЖЯ</Text>
      
      {/* Опис погоди */}
      <Text style={styles.weatherDescription}>
        {weatherData ? getWeatherDescriptionUA(weatherData.weatherDescription, weatherData.weatherCode) : 'Досить сонячно'}
      </Text>
      
      {/* Температура день/ніч з іконками */}
      <View style={styles.dayNightContainer}>
        <View style={styles.tempColumn}>
          <Image
            source={require('../assets/sun.png')}
            style={styles.tempIcon}
            resizeMode="contain"
          />
                     <Text style={styles.tempValue}>
             {weatherData?.dayTemp ?? 26}
           </Text>
        </View>
        
        <View style={styles.tempColumn}>
          <Image
            source={require('../assets/moon.png')}
            style={styles.tempIcon}
            resizeMode="contain"
          />
                     <Text style={styles.tempValue}>
             {weatherData?.nightTemp ?? 14}
           </Text>
        </View>
      </View>

      {/* Кнопка оновлення при помилці */}
      {error && (
        <TouchableOpacity style={styles.refreshButton} onPress={loadWeatherData}>
          <Text style={styles.refreshText}>↻</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    width: 169,
    height: 118,
    justifyContent: 'center',
    position: 'relative',
  },
  currentTemp: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
    fontFamily: 'e-Ukraine',
  },
  cityName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#E41B85',
    letterSpacing: 0.5,
    marginBottom: 2,
    fontFamily: 'e-Ukraine',
    textAlign: 'center',
    alignSelf: 'center',
  },
  weatherDescription: {
    fontSize: 10,
    color: '#333',
    marginBottom: 4,
    fontFamily: 'e-Ukraine',
    textAlign: 'center',
  },
  dayNightContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    gap: 20,
  },
  tempColumn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tempIcon: {
    width: 16,
    height: 16,
    marginRight: 4,
  },
  tempValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
    fontFamily: 'e-Ukraine',
  },
  loadingText: {
    textAlign: 'center',
    color: '#666',
    fontFamily: 'e-Ukraine',
    fontSize: 10,
  },
  refreshButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(228, 27, 133, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  refreshText: {
    fontSize: 12,
    color: '#E41B85',
    fontWeight: 'bold',
  },
}); 