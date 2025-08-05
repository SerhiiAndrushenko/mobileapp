import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTranslation } from 'react-i18next';
import { View, Text, StyleSheet, Image } from 'react-native';

// Імпорт екранів
import { HomeGate } from '../screens/HomeGate';
import { ProfileGate } from '../screens/ProfileGate';
import { ServicesScreen } from '../screens/ServicesScreen';

// placeholder removed; using real services screen

const RewardsScreen = () => (
  <View style={styles.screenContainer}>
    <Text style={styles.screenTitle}>Нагороди</Text>
    <Text style={styles.screenSubtitle}>Розробка екрану нагород</Text>
  </View>
);

// ProfileScreen тепер імпортується з окремого файлу

const Tab = createBottomTabNavigator();

// Функція для отримання іконки вкладки з assets
const getTabIcon = (routeName: string, focused: boolean) => {
  const iconStyle = [
    styles.tabIcon,
    { tintColor: focused ? '#E41B85' : '#999' }
  ];

  switch (routeName) {
    case 'Home':
      return (
        <Image
          source={require('../assets/icon_main.png')}
          style={iconStyle}
          resizeMode="contain"
        />
      );
    case 'Services':
      return (
        <Image
          source={require('../assets/icon_poslugi.png')}
          style={iconStyle}
          resizeMode="contain"
        />
      );
    case 'Rewards':
      return (
        <Image
          source={require('../assets/icon_nagradi.png')}
          style={iconStyle}
          resizeMode="contain"
        />
      );
    case 'Profile':
      return (
        <Image
          source={require('../assets/icon_profil.png')}
          style={iconStyle}
          resizeMode="contain"
        />
      );
    default:
      return (
        <Text style={[styles.tabIconText, { color: focused ? '#E41B85' : '#999' }]}>
          📱
        </Text>
      );
  }
};

// Головний компонент навігації з новими іконками
export const BottomNavigation: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => getTabIcon(route.name, focused),
        tabBarActiveTintColor: '#E41B85',
        tabBarInactiveTintColor: '#999',
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
        headerShown: false,
        tabBarShowLabel: false, // Приховуємо підписи як на скріншоті
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeGate}
        options={{
          tabBarLabel: t('navigation.home'),
        }}
      />
      
      <Tab.Screen
        name="Services"
        component={ServicesScreen}
        options={{
          tabBarLabel: t('navigation.services'),
        }}
      />
      
      <Tab.Screen
        name="Rewards"
        component={RewardsScreen}
        options={{
          tabBarLabel: t('navigation.rewards'),
        }}
      />
      
      <Tab.Screen
        name="Profile"
        component={ProfileGate}
        options={{
          tabBarLabel: t('navigation.profile'),
          unmountOnBlur: true,
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#fff',
    borderTopWidth: 0,
    paddingTop: 16,
    paddingBottom: 16,
    height: 75,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  tabBarLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 4,
    fontFamily: 'e-Ukraine',
  },
  tabIcon: {
    width: 30,
    height: 30,
  },
  tabIconText: {
    fontSize: 24,
  },
  screenContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F6F6F6',
    paddingHorizontal: 20,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    fontFamily: 'e-Ukraine',
  },
  screenSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    fontFamily: 'e-Ukraine',
  },
}); 