import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { saveLanguage } from '../locales/i18n';

export interface Language {
  code: string;
  name: string;
  nativeName: string;
}

export const availableLanguages: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский' },
  { code: 'uk', name: 'Ukrainian', nativeName: 'Українська' },
];

export const useLanguage = () => {
  const { i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState<string>(i18n.language);

  useEffect(() => {
    const loadStoredLanguage = async () => {
      try {
        const storedLanguage = await AsyncStorage.getItem('language');
        if (storedLanguage && storedLanguage !== currentLanguage) {
          setCurrentLanguage(storedLanguage);
          i18n.changeLanguage(storedLanguage);
        }
      } catch (error) {
        console.log('Error loading stored language:', error);
      }
    };

    loadStoredLanguage();
  }, []);

  const changeLanguage = async (languageCode: string) => {
    try {
      await saveLanguage(languageCode);
      setCurrentLanguage(languageCode);
    } catch (error) {
      console.log('Error changing language:', error);
    }
  };

  const getCurrentLanguageInfo = (): Language => {
    return availableLanguages.find(lang => lang.code === currentLanguage) || availableLanguages[0];
  };

  return {
    currentLanguage,
    changeLanguage,
    availableLanguages,
    getCurrentLanguageInfo,
  };
}; 