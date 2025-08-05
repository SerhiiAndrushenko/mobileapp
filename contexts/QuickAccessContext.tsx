import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { allServices, ServiceItem } from '../services/allServices';

interface QuickAccessCtx {
  selectedIds: string[];
  selectedServices: ServiceItem[];
  toggle: (id: string) => void;
  isSelected: (id: string) => boolean;
  reorder: (newOrder: string[]) => void;
}

const QuickAccessContext = createContext<QuickAccessCtx | undefined>(undefined);
const STORAGE_KEY = 'quick_access_ids';
const ALWAYS_ID = 'shelters'; // Мапа укриттів завжди присутня
const LIMIT = 5; // максимум додаткових сервісів, крім shelters

export const QuickAccessProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Загрузка сохранённых данных
  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((str) => {
      let initial: string[] = [ALWAYS_ID];
      if (str) {
        try {
          const arr = JSON.parse(str);
          if (Array.isArray(arr)) {
            initial = Array.from(new Set([ALWAYS_ID, ...arr]));
          }
        } catch {}
      }
      setSelectedIds(initial);
    });
  }, []);

  // Сохраняем при изменении
  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(selectedIds));
  }, [selectedIds]);

  const toggle = (id: string) => {
    if (id === ALWAYS_ID) return; // нельзя трогать базовый сервіс
    setSelectedIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((sid) => sid !== id);
      }
      const extraCount = prev.filter((sid) => sid !== ALWAYS_ID).length;
      if (extraCount >= LIMIT) return prev; // достигнут лимит 5 додаткових
      return [...prev, id];
    });
  };

  const isSelected = (id: string) => selectedIds.includes(id);

  const reorder = (newOrder: string[]) => {
    // Ensure ALWAYS_ID остаётся первым
    const filtered = newOrder.filter((id) => id !== ALWAYS_ID);
    setSelectedIds([ALWAYS_ID, ...filtered]);
  };
  const selectedServices = selectedIds
    .map((id) => allServices.find((s) => s.id === id))
    .filter(Boolean) as ServiceItem[];

  return (
    <QuickAccessContext.Provider value={{ selectedIds, selectedServices, toggle, isSelected, reorder }}>
      {children}
    </QuickAccessContext.Provider>
  );
};

export const useQuickAccess = () => {
  const ctx = useContext(QuickAccessContext);
  if (!ctx) throw new Error('useQuickAccess must be used within QuickAccessProvider');
  return ctx;
}; 