import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  FlatList,
  Dimensions,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useLanguage, Language } from '../hooks/useLanguage';

const { width } = Dimensions.get('window');

interface LanguageSelectorProps {
  style?: any;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ style }) => {
  const { t } = useTranslation();
  const { currentLanguage, changeLanguage, availableLanguages, getCurrentLanguageInfo } = useLanguage();
  const [modalVisible, setModalVisible] = useState(false);

  const handleLanguageSelect = async (languageCode: string) => {
    await changeLanguage(languageCode);
    setModalVisible(false);
  };

  const renderLanguageItem = ({ item }: { item: Language }) => (
    <TouchableOpacity
      style={[
        styles.languageItem,
        item.code === currentLanguage && styles.selectedLanguageItem,
      ]}
      onPress={() => handleLanguageSelect(item.code)}
    >
      <Text
        style={[
          styles.languageText,
          item.code === currentLanguage && styles.selectedLanguageText,
        ]}
      >
        {item.nativeName}
      </Text>
      {item.code === currentLanguage && (
        <Text style={styles.checkmark}>✓</Text>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity
        style={styles.selectorButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.selectorButtonText}>
          {getCurrentLanguageInfo().nativeName}
        </Text>
        <Text style={styles.dropdownIcon}>▼</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {t('language.selectLanguage')}
              </Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>
            
            <FlatList
              data={availableLanguages}
              renderItem={renderLanguageItem}
              keyExtractor={(item) => item.code}
              style={styles.languageList}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: 'flex-start',
  },
  selectorButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  selectorButtonText: {
    fontSize: 16,
    color: '#333',
    marginRight: 8,
  },
  dropdownIcon: {
    fontSize: 12,
    color: '#666',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: width * 0.8,
    maxHeight: '60%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 5,
  },
  closeButtonText: {
    fontSize: 20,
    color: '#666',
  },
  languageList: {
    maxHeight: 200,
  },
  languageItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  selectedLanguageItem: {
    backgroundColor: '#e3f2fd',
  },
  languageText: {
    fontSize: 16,
    color: '#333',
  },
  selectedLanguageText: {
    color: '#1976d2',
    fontWeight: 'bold',
  },
  checkmark: {
    fontSize: 16,
    color: '#1976d2',
    fontWeight: 'bold',
  },
}); 