import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Switch,
  Image,
} from 'react-native';
import { Share } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';
import { useTranslation } from 'react-i18next';
import { formatDateString } from '../utils/dateUtils';
import { useAuth } from '../contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

// Екран профілю користувача (точно по фото)
export const ProfileScreen: React.FC = () => {
  const { t } = useTranslation();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isUkrLanguage, setIsUkrLanguage] = useState(true);
  const currentDate = new Date();
  const { user } = useAuth();
  const navigation = useNavigation();
  const handleAvatarPress = () => {
    if (!user) {
      // navigate to Login screen in the same stack
      // @ts-ignore
      navigation.navigate('Login');
    }
  };

  // Функція переключення теми
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Функція переключення мови
  const toggleLanguage = () => {
    setIsUkrLanguage(!isUkrLanguage);
  };

      return (
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Заголовок */}
          <View style={styles.headerInScroll}>
            <Text style={styles.headerTitle}>Профіль користувача</Text>
          </View>

        {/* Секція привітання */}
        <View style={styles.greetingSection}>
          <View style={styles.profileInfo}>
            <TouchableOpacity style={styles.avatarContainer} onPress={handleAvatarPress} activeOpacity={0.7}>
              <Ionicons name="person" size={32} color="#9E9E9E" />
            </TouchableOpacity>
            <View style={styles.greetingTextContainer}>
              <Text style={styles.dateText}>
                {formatDateString(currentDate, t)}
              </Text>
              <MaskedView
                style={styles.greetingContainer}
                maskElement={
                  <View style={styles.maskContainer}>
                    <Text style={styles.greetingMask}>
                      {user ? `Вітаємо, ${user.name}!` : 'Вітаємо'}
                    </Text>
                  </View>
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

        {/* Основні налаштування */}
        <View style={styles.cardContainer}>
          <MenuItem
            iconSource={require('../assets/info.png')}
            title="Особиста інформація"
            hasArrow={true}
            noDivider={true}
            onPress={()=> (navigation as any).navigate('PersonalInfo')}
          />
        </View>
        <View style={styles.cardContainer}>
          <MenuItem
            iconSource={require('../assets/adres.png')}
            title="Адреса"
            hasArrow={true}
            noDivider={true}
            onPress={()=> (navigation as any).navigate('Address')}
          />
        </View>
        <View style={styles.cardContainer}>
          <MenuItem
            iconSource={require('../assets/zvernenya.png')}
            title="Мої звернення"
            hasArrow={true}
            noDivider={true}
          />
        </View>

        {/* Налаштування */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Налаштування</Text>
          {/* Групповая карточка: мова / тема / сповіщення */}
          <View style={styles.menuSection}>
            {/* Мова */}
            <View style={styles.menuItem}>
              <View style={styles.menuItemLeft}>
                <Image
                  source={require('../assets/language.png')}
                  style={styles.menuIconImage}
                  resizeMode="contain"
                />
                <Text style={styles.menuText}>Мова</Text>
              </View>
              <View style={styles.languageToggle}>
                <TouchableOpacity
                  style={[styles.languageButton, isUkrLanguage && styles.languageButtonActive]}
                  onPress={() => setIsUkrLanguage(true)}
                >
                  <Text style={[styles.languageButtonText, isUkrLanguage && styles.languageButtonTextActive]}>Укр</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.languageButton, !isUkrLanguage && styles.languageButtonActive]}
                  onPress={() => setIsUkrLanguage(false)}
                >
                  <Text style={[styles.languageButtonText, !isUkrLanguage && styles.languageButtonTextActive]}>Eng</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Тема */}
            <View style={styles.menuItem}>
              <View style={styles.menuItemLeft}>
                <Image
                  source={require('../assets/thema.png')}
                  style={styles.menuIconImage}
                  resizeMode="contain"
                />
                <Text style={styles.menuText}>Тема</Text>
              </View>
              <View style={styles.themeToggle}>
                <TouchableOpacity
                  style={[styles.themeButton, !isDarkMode && styles.themeButtonActive]}
                  onPress={() => setIsDarkMode(false)}
                >
                  <Ionicons name="sunny" size={18} color={!isDarkMode ? '#fff' : '#E41B85'} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.themeButton, isDarkMode && styles.themeButtonActive]}
                  onPress={() => setIsDarkMode(true)}
                >
                  <Ionicons name="moon" size={18} color={isDarkMode ? '#fff' : '#E41B85'} />
                </TouchableOpacity>
              </View>
            </View>

            {/* Сповіщення (последний пункт без разделителя) */}
            <MenuItem
              iconSource={require('../assets/Notification.png')}
              title="Сповіщення"
              hasArrow={true}
              onPress={()=> (navigation as any).navigate('Notifications')}
              noDivider={true}
            />
          </View>

          {/* Отдельные карточки */}
          <View style={styles.cardContainer}>
            <MenuItem
              iconSource={require('../assets/qweek.png')}
              title="Швидкий доступ"
              hasArrow={true}
              noDivider={true}
              onPress={() => (navigation as any).navigate('QuickAccess')}
            />
          </View>
          <View style={styles.cardContainer}>
            <MenuItem
              iconSource={require('../assets/security.png')}
              title="Безпека"
              hasArrow={true}
              onPress={()=> (navigation as any).navigate('Security')}
              noDivider={true}
            />
          </View>
          <View style={styles.cardContainer}>
            <MenuItem
              iconSource={require('../assets/share.png')}
              title="Поділитись з друзями"
              hasArrow={true}
              noDivider={true}
              onPress={() => {
                Share.share({
                  message:
                    'Спробуй застосунок “Цифрове Запоріжжя” — твій зручний доступ до міських сервісів. https://zp.digital/app',
                });
              }}
            />
          </View>
        </View>

        {/* Довідка */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Довідка</Text>
          <View style={styles.cardContainer}>
            <MenuItem
              iconSource={require('../assets/politic.png')}
              title="Політика конфіденційності"
              hasArrow={true}
              noDivider={true}
            />
          </View>
          <View style={styles.cardContainer}>
            <MenuItem
              iconSource={require('../assets/TEX.png')}
              title="Технічна підтримка"
              hasArrow={true}
              noDivider={true}
            />
          </View>
        </View>

        {/* Кнопка виходу */}
        <View style={styles.logoutContainer}>
          <TouchableOpacity style={styles.logoutButton}>
            <Text style={styles.logoutText}>Вийти</Text>
          </TouchableOpacity>
        </View>

        {/* Відступ знизу */}
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
};

// Компонент елементу меню
interface MenuItemProps {
  icon?: string;
  iconSource?: any;
  title: string;
  hasArrow?: boolean;
  onPress?: () => void;
  noDivider?: boolean;
}

const MenuItem: React.FC<MenuItemProps> = ({ icon, iconSource, title, hasArrow = false, onPress, noDivider = false }) => {
  return (
    <TouchableOpacity style={[styles.menuItem, noDivider && styles.menuItemNoDivider]} onPress={onPress}>
      <View style={styles.menuItemLeft}>
        {iconSource ? (
          <Image
            source={iconSource}
            style={styles.menuIconImage}
            resizeMode="contain"
          />
        ) : (
          <Text style={styles.menuIcon}>{icon}</Text>
        )}
        <Text style={styles.menuText}>{title}</Text>
      </View>
      {hasArrow && (
        <Text style={styles.arrowIcon}>›</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F6F6',
  },
  headerInScroll: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    backgroundColor: '#F6F6F6',
  },
  headerTitle: {
    fontSize: 13,
    fontWeight: '500',
    color: '#8F8F8F',
    fontFamily: 'e-Ukraine',
    letterSpacing: 0.2,
  },
  scrollView: {
    flex: 1,
  },
  greetingSection: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingBottom: 12,
  },
  avatarContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarIcon: {},
  greetingTextContainer: {
    flex: 1,
  },
  dateText: {
    fontSize: 12,
    color: '#8F8F8F',
    fontFamily: 'e-Ukraine',
    marginBottom: 2,
  },
  greetingContainer: {
    height: 28,
    width: 180,
  },
  maskContainer: {
    backgroundColor: 'transparent',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  greetingMask: {
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'e-Ukraine',
    color: 'black',
  },
  greetingGradient: {
    flex: 1,
    width: '100%',
    height: '100%',
    borderRadius: 6,
  },
  sectionContainer: {
    marginBottom: 0,
  },
  sectionTitle: {
    fontSize: 13,
    color: '#8F8F8F',
    fontFamily: 'e-Ukraine',
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 8,
    letterSpacing: 0.2,
  },
  menuSection: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: '#fff',
  },
  menuItemNoDivider: {
    borderBottomWidth: 0,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuIcon: {
    fontSize: 20,
    marginRight: 12,
    width: 24,
    textAlign: 'center',
  },
  menuIconImage: {
    width: 24,
    height: 24,
    marginRight: 12,
    tintColor: '#E41B85',
  },
  menuText: {
    fontSize: 16,
    color: '#333',
    fontFamily: 'e-Ukraine',
    fontWeight: '500', // regular
  },
  arrowIcon: {
    fontSize: 20,
    color: '#BDBDBD',
    fontWeight: 'bold',
  },
  languageToggle: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#E41B85',
    borderRadius: 5,
    overflow: 'hidden',
    minWidth: 120,
  },
  languageButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
  },
  languageButtonActive: {
    backgroundColor: '#E41B85',
  },
  languageButtonText: {
    fontSize: 13,
    color: '#BDBDBD',
    fontFamily: 'e-Ukraine',
    fontWeight: '500',
  },
  languageButtonTextActive: {
    color: '#fff',
  },
  themeToggle: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#E41B85',
    borderRadius: 5,
    overflow: 'hidden',
    minWidth: 120,
  },
  themeButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
  },
  themeButtonActive: {
    backgroundColor: '#E41B85',
  },
  themeIcon: {
    width: 18,
    height: 18,
    tintColor: '#E41B85',
  },
  logoutContainer: {
    paddingHorizontal: 0,
    paddingVertical: 18,
  },
  logoutButton: {
    backgroundColor: '#bdbdbd',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginHorizontal: 16,
  },
  logoutText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
    fontFamily: 'e-Ukraine',
  },
  bottomSpacer: {
    height: 20,
  },
  cardContainer: {
    backgroundColor: '#fff',
    borderRadius: 20,
    marginHorizontal: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
    overflow: 'hidden',
  },
}); 