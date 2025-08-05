import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ExpoNotifications from 'expo-notifications';
// @ts-ignore – Expo managed modules may lack typings in tsconfig paths
import * as TaskManager from 'expo-task-manager';
// @ts-ignore
import * as BackgroundFetch from 'expo-background-fetch';
// import * as Localization from 'expo-localization';

interface NotificationItem {
  id: string;
  category: string;
  time: string; // HH:MM
  title: string;
  text: string;
}

interface Ctx {
  enabled: Record<string, boolean>;
  toggle: (id: string) => void;
  items: NotificationItem[];
  visibleItems: NotificationItem[];
  clear: () => void;
}

const STORAGE_KEY = 'enabled_categories';
const ITEMS_KEY = 'saved_notifications_items_v1';
const LAST_ALARM_KEY = 'last_alarm_timestamp';
const TASK_NAME = 'alarm-background-fetch';
const defaultEnabled: Record<string, boolean> = {
  alarm: true,
  silence: true,
  transport: false,
  poll: true,
  appeals: false,
  achievements: true,
  repairs: false,
  system: true,
};

const initialItems: NotificationItem[] = [
  { id: 'n1', category: 'alarm', time: '17:00', title: 'Повітряна тривога', text: 'Оголошено повітряну тривогу в місті. Негайно пройдіть в укриття.' },
  { id: 'n2', category: 'poll', time: '15:00', title: 'Опитування', text: 'Долучайтесь до опитування: «Якість транспорту». Поділіться думкою!' },
  { id: 'n3', category: 'appeals', time: '12:00', title: 'Звернення', text: 'Змінено статус звернення. Перейдіть у розділ Мої звернення.' },
  { id: 'n4', category: 'transport', time: '10:00', title: 'Транспорт', text: 'У вас закінчуються поїздки. Поповніть баланс картки «Січ».' },
  { id: 'n5', category: 'silence', time: '08:58', title: 'Хвилина мовчання', text: 'О 9:00 приєднайтесь до хвилини мовчання.' },
  { id: 'n6', category: 'repairs', time: '22:00', title: 'Ремонтні роботи', text: 'Оновлення щодо ремонтних робіт у вашому будинку.' },
  { id: 'n7', category: 'system', time: '17:00', title: 'Системні', text: 'Сповіщення від системи.' },
  { id: 'n8', category: 'achievements', time: '12:00', title: 'Досягнення', text: 'Ви здобули досягнення: «Перший крок»!' },
];

const NotificationsContext = createContext<Ctx | undefined>(undefined);

export const NotificationsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [enabled, setEnabled] = useState<Record<string, boolean>>(defaultEnabled);
  const [items,setItems] = useState<NotificationItem[]>(initialItems);

  useEffect(() => {
    (async () => {
      await ExpoNotifications.requestPermissionsAsync();

      // load enabled categories
      const enStr = await AsyncStorage.getItem(STORAGE_KEY);
      if (enStr) {
        try {
          const obj = JSON.parse(enStr);
          setEnabled({ ...defaultEnabled, ...obj });
        } catch {}
      }

      // load saved notification items
      const itStr = await AsyncStorage.getItem(ITEMS_KEY);
      if (itStr) {
        try {
          const arr = JSON.parse(itStr);
          if (Array.isArray(arr) && arr.length) {
            setItems(arr);
          }
        } catch {}
      }

      // fetch latest 25 alarms history once to populate list (if nothing stored)
      if (items.length === 0) {
        try {
          const hist = await fetch('https://api.ukrainealarm.com/api/v3/alerts/regionHistory?regionId=7', {
            headers: { 'Authorization': '6fb363e4:8cb4413bf8a007f46adf108a686d32cd' },
          }).then(r=>r.json());
          const alarmsArr = hist?.[0]?.alarms ?? [];
          const mapped = alarmsArr.slice(0,25).map((a:any)=>({
            id: `alarm_${a.startDate}`,
            category: 'alarm',
            time: new Date(a.startDate).toLocaleTimeString('uk-UA',{hour:'2-digit',minute:'2-digit'}),
            title: 'Повітряна тривога',
            text: 'Оголошено повітряну тривогу в місті. Негайно пройдіть в укриття.'
          }));
          if (mapped.length) {
            setItems(prev=>[...mapped,...prev].slice(0,50));
          }
        } catch {}
      }

      // register background task
      if (!TaskManager.isTaskDefined(TASK_NAME)) {
        TaskManager.defineTask(TASK_NAME, async () => {
          try {
            const resp = await fetch('https://alerts.com.ua/api/states/7');
            const data = await resp.json();
            const alertNow = data?.state?.alert;
            const tsNow = Date.now();
            const savedTsStr = await AsyncStorage.getItem(LAST_ALARM_KEY);
            const savedTs = savedTsStr ? Number(savedTsStr) : 0;

            if (alertNow && tsNow - savedTs > 1000*60*5) {
              // save timestamp to avoid duplicates
              await AsyncStorage.setItem(LAST_ALARM_KEY, String(tsNow));

              let startIso = new Date().toISOString();
              try {
                const hist = await fetch('https://api.ukrainealarm.com/api/v3/alerts/regionHistory?regionId=7', { headers: { 'Authorization': '6fb363e4:8cb4413bf8a007f46adf108a686d32cd' } }).then(r=>r.json());
                startIso = hist?.[0]?.alarms?.[0]?.startDate ?? startIso;
              } catch {}

              const notif = {
                id: tsNow.toString(),
                category: 'alarm',
                time: new Date(startIso).toLocaleTimeString('uk-UA',{hour:'2-digit',minute:'2-digit'}),
                title: 'Повітряна тривога',
                text: 'Оголошено повітряна тривога! Негайно пройдіть в укриття.'
              } as NotificationItem;

              await ExpoNotifications.scheduleNotificationAsync({ content:{ title:notif.title, body:notif.text }, trigger:null });

              const existingStr = await AsyncStorage.getItem(ITEMS_KEY);
              const arr: NotificationItem[] = existingStr ? JSON.parse(existingStr) : [];
              const newArr = [notif, ...arr].slice(0,50);
              await AsyncStorage.setItem(ITEMS_KEY, JSON.stringify(newArr));
            }
          } catch{}

          return BackgroundFetch.BackgroundFetchResult.NewData;
        });
      }

      const status = await BackgroundFetch.getStatusAsync();
      if (status === BackgroundFetch.BackgroundFetchStatus.Available) {
        await BackgroundFetch.registerTaskAsync(TASK_NAME, {
          minimumInterval: 60 * 15, // 15 minutes
          stopOnTerminate: false,
          startOnBoot: true,
        });
      }
    })();
  }, []);

  // Schedule daily silence notification at 09:00 Kyiv
  useEffect(() => {
    const schedule = async () => {
      await ExpoNotifications.cancelScheduledNotificationAsync('silenceDaily');
      if (!enabled.silence) return;
      const trigger = { hour: 1, minute: 27, repeats: true } as any;
      await ExpoNotifications.scheduleNotificationAsync({
        identifier: 'silenceDaily',
        content: {
          title: 'Хвилина мовчання',
          body: 'О 9:00 приєднайтесь до хвилини мовчання.'
        },
        trigger,
      });
    };
    schedule();
  }, [enabled.silence]);

  // Poll air alarm status every 60s (simple demo)
  useEffect(() => {
    if (!enabled.alarm) return;
    let prev: boolean | undefined = undefined;

    const getAlarmStartTime = async (): Promise<string> => {
      try {
        const hist = await fetch('https://api.ukrainealarm.com/api/v3/alerts/regionHistory?regionId=7', { headers: { 'Authorization': '6fb363e4:8cb4413bf8a007f46adf108a686d32cd' } }).then(r=>r.json());
        const latest = hist?.[0]?.alarms?.[0];
        if (latest?.startDate) return latest.startDate;
      } catch {}
      return new Date().toISOString();
    };

    const check = async () => {
      try {
        const data = await fetch('https://alerts.com.ua/api/states/7').then(r=>r.json());
        const alertNow: boolean = data?.state?.alert;
        if (alertNow !== prev) {
          prev = alertNow;
          const body = alertNow ? 'Оголошено повітряна тривога! Негайно пройдіть в укриття.' : 'Відбій тривоги.';
          let displayTime = new Date().toLocaleTimeString('uk-UA',{hour:'2-digit',minute:'2-digit'});
          if (alertNow) {
            const startIso = await getAlarmStartTime();
            displayTime = new Date(startIso).toLocaleTimeString('uk-UA',{hour:'2-digit',minute:'2-digit'});
          }
          ExpoNotifications.scheduleNotificationAsync({ content:{ title:'Повітряна тривога', body }, trigger:null });
          addItem({ id: Date.now().toString(), category:'alarm', time: displayTime, title:'Повітряна тривога', text: body });
        }
      } catch{}
    };

    // first immediate check
    check();
    const id = setInterval(check, 30000);
    return ()=>clearInterval(id);
  }, [enabled.alarm]);

  const toggle = (id: string) => {
    setEnabled((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

  const visibleItems = items.filter((i) => enabled[i.category]);

  const addItem = (item:NotificationItem)=> {
    setItems(prev=>{
      const next = [item,...prev].slice(0,50);
      AsyncStorage.setItem(ITEMS_KEY, JSON.stringify(next));
      return next;
    });
  };

  const clear = () => {
    setItems([]);
    AsyncStorage.removeItem(ITEMS_KEY);
  };

  return (
    <NotificationsContext.Provider value={{ enabled, toggle, items, visibleItems, clear }}>
      {children}
    </NotificationsContext.Provider>
  );
};

export const useNotifications = () => {
  const ctx = useContext(NotificationsContext);
  if (!ctx) throw new Error('useNotifications must be inside provider');
  return ctx;
}; 