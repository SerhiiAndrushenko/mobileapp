import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';
import { useTranslation } from 'react-i18next';
import { formatDateString } from '../utils/dateUtils';
import { WeatherCard } from '../components/WeatherCard';
import { AirAlarmCard } from '../components/AirAlarmCard';
import { AppUpdateBanner } from '../components/AppUpdateBanner';
import { NotificationsPanel } from '../components/NotificationsPanel';
import { Ionicons } from '@expo/vector-icons';
import { useQuickAccess } from '../contexts/QuickAccessContext';
import { useAuth } from '../contexts/AuthContext';

// Головний екран додатку (точно по новому скріншоту)
export const HomeScreen: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { selectedServices } = useQuickAccess();
  // прокрутка по горизонталі – navigation більше не потрібна тут
  const currentDate = new Date();

  return (
    <SafeAreaView style={styles.container}>
      {/* Заголовок з датою та привітанням */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.profilePhotoContainer}>
            <Ionicons name="person" size={24} color="#9E9E9E" />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.dateText}>
              {formatDateString(currentDate, t)}
            </Text>
            <MaskedView
              style={styles.greetingContainer}
              maskElement={
                <Text style={styles.greetingMask}>
                  {user ? t('home.greetingUser',{name:user.name}) : t('home.greeting')}
                </Text>
              }
            >
              <LinearGradient
                colors={['#D8156B', '#373839']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.greetingGradient}
              />
            </MaskedView>
          </View>
        </View>
      </View>

      {/* Прокручуваний контент */}
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Блоки погоди та тривоги горизонтально */}
        <View style={styles.weatherAlarmContainer}>
          <View style={styles.weatherHalf}>
            <WeatherCard />
          </View>
          <View style={styles.alarmHalf}>
            <AirAlarmCard />
          </View>
        </View>

        {/* Швидкий доступ — горизонтальна прокрутка */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.quickScroll}
          style={{ marginTop: 12 }}
        >
          {selectedServices.map((s) => (
            <TouchableOpacity key={s.id} style={styles.quickCard} activeOpacity={0.7}>
              <Ionicons name={s.icon as any} size={24} color="#E41B85" />
              <Text style={styles.quickCardText}>{s.title}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* В цьому варіанті індикатор сторінок не потрібен */}

        {/* Банер оновлення додатку */}
        <AppUpdateBanner />

        {/* Панель повідомлень */}
        <NotificationsPanel />

        {/* Додатковий відступ знизу */}
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F6F6',
  },
  header: {
    backgroundColor: 'transparent',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profilePhotoContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  profilePhotoPlaceholder: {},
  textContainer: {
    flex: 1,
  },
  dateText: {
    fontSize: 12,
    color: '#8F8F8F',
    fontFamily: 'e-Ukraine',
  },
  greetingContainer: {
    height: 32,
    width: 120,
  },
  greetingMask: {
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: 'e-Ukraine',
    color: 'black',
    backgroundColor: 'transparent',
  },
  greetingGradient: {
    flex: 1,
    height: '100%',
    width: '100%',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  weatherAlarmContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 16,
    gap: 12,
  },
  weatherHalf: {
    flex: 1,
  },
  alarmHalf: {
    flex: 1,
  },
  mapButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  mapIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  mapIconText: {
    fontSize: 20,
  },
  mapText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
    fontFamily: 'e-Ukraine',
  },
  bottomSpacer: {
    height: 20,
  },
  quickScroll: {
    paddingHorizontal: 16,
  },
  quickCard: {
    width: 110,
    height: 90,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 12,
    justifyContent: 'flex-start',
    marginRight: 12,
  },
  quickCardText: {
    fontSize: 12,
    color: '#333',
    fontFamily: 'e-Ukraine',
    marginTop: 8,
  },
  quickPlaceholder: {},
  pageIndicator: {},
  pageDot: {},
  pageDotActive: {},
}); 