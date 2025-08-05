import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { 
  fetchAirAlarmStatus,
  AirAlarmData,
  getAlarmIcon,
  getAlarmColor 
} from '../services/airAlarmService';

// Компонент картки повітряної тривоги (точні розміри 169x118px)
export const AirAlarmCard: React.FC = () => {
  const { t } = useTranslation();
  const [alarmData, setAlarmData] = useState<AirAlarmData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Завантаження даних тривоги при монтуванні компонента
  useEffect(() => {
    loadAlarmData();
    
    // Оновлення даних кожні 30 секунд
    const interval = setInterval(loadAlarmData, 30000);
    return () => clearInterval(interval);
  }, []);

  // Функція завантаження даних тривоги
  const loadAlarmData = async () => {
    try {
      console.log('🔔 Початок завантаження даних тривоги...');
      setError(false);
      
      const data = await fetchAirAlarmStatus();
      console.log('🔔 Отримані дані тривоги в компоненті:', data);
      
      setAlarmData(data);
      
      if (data) {
        console.log('🔔 Встановлено стан тривоги:', {
          region: data.regionName,
          isActive: data.isAlarmActive,
          status: data.isAlarmActive ? 'ТРИВОГА' : 'НЕМАЄ ТРИВОГИ'
        });
      }
    } catch (err) {
      console.error('❌ Критична помилка завантаження даних тривоги:', err);
      setError(true);
      // Встановлюємо дефолтні дані для Запорізької області
      const fallbackData = {
        regionId: '7',
        regionName: 'м. Запоріжжя та Запорізька територіальна громада',
        isAlarmActive: false, // Встановлюємо відсутність тривоги за замовчуванням для Запорізької області
        lastUpdate: new Date().toISOString(),
      };
      console.log('🔔 Встановлено fallback дані:', fallbackData);
      setAlarmData(fallbackData);
    } finally {
      setLoading(false);
      console.log('🔔 Завантаження тривоги завершено');
    }
  };

  // Якщо йде завантаження
  if (loading) {
    return (
      <View style={styles.card}>
        <ActivityIndicator size="small" color="#E41B85" />
        <Text style={styles.loadingText}>Завантаження...</Text>
      </View>
    );
  }

  return (
    <View style={styles.card}>
      {/* Текст регіону (динамічний) */}
      <Text style={styles.regionText}>
        {alarmData?.regionName || 'Завантаження...'}
      </Text>

      {/* Статус тривоги з іконкою по центру (динамічний) */}
      <View style={styles.statusContainer}>
        {alarmData?.isAlarmActive ? (
          <Text style={styles.triangleIcon}>⚠</Text>
        ) : (
          <View style={styles.checkCircle}>
            <Text style={styles.checkMark}>✓</Text>
          </View>
        )}
        <Text style={styles.statusText}>
          {alarmData?.isAlarmActive ? 'Тривога' : 'Немає тривоги'}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 16, // Радіус закруглення 16px
    padding: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    width: 169, // Точна ширина 169px
    height: 118, // Точна висота 118px
    justifyContent: 'space-between',
  },
  regionText: {
    fontSize: 11,
    color: '#666',
    lineHeight: 14,
    fontFamily: 'e-Ukraine',
    textAlign: 'left',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#E41B85',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  checkMark: {
    fontSize: 12,
    color: '#fff',
    fontWeight: 'bold',
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#E41B85',
    fontFamily: 'e-Ukraine',
  },
  triangleIcon: {
    fontSize: 20,
    color: '#E41B85',
    marginRight: 8,
    fontWeight: 'bold',
  },
  loadingText: {
    textAlign: 'center',
    color: '#666',
    fontSize: 14,
    fontFamily: 'e-Ukraine',
  },
}); 