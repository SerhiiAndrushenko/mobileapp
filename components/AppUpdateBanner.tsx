import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Image,
} from 'react-native';
import { useTranslation } from 'react-i18next';

interface AppUpdateBannerProps {
  visible?: boolean;
  onDismiss?: () => void;
}

// Компонент банера оновлення додатку (без рамки)
export const AppUpdateBanner: React.FC<AppUpdateBannerProps> = ({
  visible = true,
  onDismiss,
}) => {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(visible);
  const [fadeAnim] = useState(new Animated.Value(visible ? 1 : 0));

  // Функція для закриття банера
  const handleDismiss = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setIsVisible(false);
      onDismiss?.();
    });
  };

  // Якщо банер невидимий, не рендеримо його
  if (!isVisible) {
    return null;
  }

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <View style={styles.banner}>
        {/* Логотип додатку */}
        <View style={styles.iconContainer}>
          <Image
            source={require('../assets/icon.png')}
            style={styles.appIcon}
            resizeMode="contain"
          />
        </View>

        {/* Контент банера */}
        <View style={styles.content}>
          <Text style={styles.title}>Що нового?</Text>
          <Text style={styles.subtitle}>Оновлення системи</Text>
        </View>

        {/* Кнопка закриття */}
        <TouchableOpacity
          style={styles.closeButton}
          onPress={handleDismiss}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={styles.closeButtonText}>✕</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    marginVertical: 8,
  },
  banner: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconContainer: {
    width: 40,
    height: 40,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  appIcon: {
    width: 40,
    height: 40,
  },
  content: {
    flex: 1,
    marginRight: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
    fontFamily: 'e-Ukraine',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'e-Ukraine',
  },
  closeButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 14,
    color: '#666',
    fontWeight: 'bold',
  },
}); 