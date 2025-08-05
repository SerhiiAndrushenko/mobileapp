import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Localization from 'expo-localization';

// Импорт переводов
import en from './en.json';
import ru from './ru.json';
import uk from './uk.json';

const resources = {
  en: { translation: en },
  ru: { translation: ru },
  uk: { translation: uk },
};

// Функция для получения сохраненного языка
const getStoredLanguage = async (): Promise<string> => {
  try {
    const storedLanguage = await AsyncStorage.getItem('language');
    if (storedLanguage && ['en', 'ru', 'uk'].includes(storedLanguage)) {
      return storedLanguage;
    }
  } catch (error) {
    console.log('Error getting stored language:', error);
  }
  
  // Определяем язык устройства как fallback
  const deviceLanguage = Localization.locale.split('-')[0];
  return ['en', 'ru', 'uk'].includes(deviceLanguage) ? deviceLanguage : 'en';
};

// Функция для сохранения языка
export const saveLanguage = async (language: string): Promise<void> => {
  try {
    await AsyncStorage.setItem('language', language);
    i18n.changeLanguage(language);
  } catch (error) {
    console.log('Error saving language:', error);
  }
};

// Инициализация i18n
const initI18n = async () => {
  const language = await getStoredLanguage();
  
  i18n
    .use(initReactI18next)
    .init({
      resources,
      lng: language,
      fallbackLng: 'en',
      interpolation: {
        escapeValue: false,
      },
      react: {
        useSuspense: false,
      },
    });
};

initI18n();

export default i18n; 