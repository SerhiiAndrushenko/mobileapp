import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useTranslation } from 'react-i18next';

// Інтерфейс для сервісу
interface ServiceItem {
  id: string;
  titleKey: string;
  icon: string;
  color: string;
}

// Заглушка сервісів для демонстрації
const mockServices: ServiceItem[] = [
  {
    id: 'utilities',
    titleKey: 'home.quickServices.utilities',
    icon: '🏠',
    color: '#2196F3',
  },
  {
    id: 'transport',
    titleKey: 'home.quickServices.transport',
    icon: '🚌',
    color: '#FF9800',
  },
  {
    id: 'health',
    titleKey: 'home.quickServices.health',
    icon: '🏥',
    color: '#4CAF50',
  },
  {
    id: 'education',
    titleKey: 'home.quickServices.education',
    icon: '🎓',
    color: '#9C27B0',
  },
  {
    id: 'services',
    titleKey: 'home.quickServices.services',
    icon: '⚙️',
    color: '#607D8B',
  },
];

// Компонент окремого сервісу
const ServiceItem: React.FC<{ 
  service: ServiceItem; 
  onPress: (serviceId: string) => void;
}> = ({ service, onPress }) => {
  const { t } = useTranslation();

  return (
    <TouchableOpacity
      style={styles.serviceItem}
      onPress={() => onPress(service.id)}
      activeOpacity={0.7}
    >
      <View style={[styles.serviceIconContainer, { backgroundColor: service.color }]}>
        <Text style={styles.serviceIcon}>{service.icon}</Text>
      </View>
      <Text style={styles.serviceTitle} numberOfLines={2}>
        {t(service.titleKey)}
      </Text>
    </TouchableOpacity>
  );
};

// Головний компонент панелі швидкого доступу
export const QuickServicesPanel: React.FC = () => {
  const { t } = useTranslation();

  // Обробник натискання на сервіс
  const handleServicePress = (serviceId: string) => {
    console.log(`Натиснуто сервіс: ${serviceId}`);
    // TODO: Додати навігацію до сервісу
  };

  return (
    <View style={styles.container}>
      {/* Заголовок панелі */}
      <Text style={styles.title}>{t('home.quickServices.title')}</Text>
      
      {/* Горизонтальний скрол сервісів */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.servicesContainer}
      >
        {mockServices.map((service) => (
          <ServiceItem
            key={service.id}
            service={service}
            onPress={handleServicePress}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  servicesContainer: {
    paddingHorizontal: 16,
  },
  serviceItem: {
    alignItems: 'center',
    marginRight: 16,
    width: 80,
  },
  serviceIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  serviceIcon: {
    fontSize: 24,
  },
  serviceTitle: {
    fontSize: 12,
    color: '#333',
    textAlign: 'center',
    lineHeight: 16,
  },
}); 