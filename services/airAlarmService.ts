// Сервіс для роботи з API повітряної тривоги
export interface AirAlarmData {
  regionId: string;
  regionName: string;
  isAlarmActive: boolean;
  lastUpdate: string;
}

// API ключ та ID регіону Запоріжжя
const API_KEY = '6fb363e4:8cb4413bf8a007f46adf108a686d32cd';
const ZAPORIZHZHIA_REGION_ID = 'zaporozhzhia';
const ALARM_API_URL = 'https://alerts.com.ua/api/states/7';

// Функція для отримання статусу повітряної тривоги
export const fetchAirAlarmStatus = async (): Promise<AirAlarmData | null> => {
  try {
    console.log('🚨 Відправляємо запит тривоги до:', ALARM_API_URL);
    
    const response = await fetch(ALARM_API_URL, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('🚨 Статус відповіді тривоги:', response.status);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('🚨 Повні дані API тривоги:', JSON.stringify(data, null, 2));
    console.log('🚨 Тип даних:', typeof data, 'Array?', Array.isArray(data));
    
    // Перевіряємо чи це масив
    if (!Array.isArray(data)) {
      console.warn('⚠️ Дані тривоги не є масивом, спробуємо обробити як об\'єкт');
      
             // Перевіряємо чи є дані по області в полі state
       if (data.state && (data.state.id === 7 || data.state.name?.toLowerCase().includes('луган'))) {
         console.log('✅ Знайдено дані Запорізької області:', data.state);
                 return {
           regionId: data.state.id.toString(),
           regionName: 'м. Запоріжжя та Запорізька територіальна громада',
           isAlarmActive: data.state.alert || false,
           lastUpdate: data.last_update || new Date().toISOString(),
         };
      }
      
      // Якщо це об'єкт, може він має масив регіонів всередині
      if (data.states && Array.isArray(data.states)) {
        console.log('✅ Знайдено масив states');
        const zaporizhzhiaData = data.states.find((region: any) => 
          region.id === '7' || 
          region.name?.toLowerCase().includes('луган')
        );
        
        if (zaporizhzhiaData) {
          console.log('✅ Знайдено дані Запоріжжя:', zaporizhzhiaData);
          return {
            regionId: zaporizhzhiaData.id,
            regionName: zaporizhzhiaData.name || 'м. Запоріжжя та Запорізька територіальна громада',
            isAlarmActive: zaporizhzhiaData.alert || false,
            lastUpdate: new Date().toISOString(),
          };
        }
      }
      
      // Повертаємо дефолтні дані якщо структура незрозуміла
      console.log('⚠️ Не вдалось знайти дані Запорізької області, використовуємо дефолт');
      return {
        regionId: '7',
        regionName: 'м. Запоріжжя та Запорізька територіальна громада',
        isAlarmActive: false,
        lastUpdate: new Date().toISOString(),
      };
    }
    
    // Якщо це масив (оригінальна логіка)
    console.log('✅ Дані тривоги є масивом, шукаємо Запоріжжя');
    const zaporizhzhiaData = data.find((region: any) => 
      region.id === ZAPORIZHZHIA_REGION_ID || 
      region.name?.toLowerCase().includes('запоріж')
    );

    if (zaporizhzhiaData) {
      console.log('✅ Знайдено дані Запоріжжя:', zaporizhzhiaData);
      return {
        regionId: zaporizhzhiaData.id,
        regionName: zaporizhzhiaData.name || 'м. Запоріжжя та Запорізька територіальна громада',
        isAlarmActive: zaporizhzhiaData.alert || false,
        lastUpdate: new Date().toISOString(),
      };
    }

    // Якщо не знайдено, повертаємо дефолтні дані
    console.log('⚠️ Запорізьку область не знайдено в масиві, використовуємо дефолт');
    return {
      regionId: '7',
      regionName: 'м. Запоріжжя та Запорізька територіальна громада',
      isAlarmActive: false,
      lastUpdate: new Date().toISOString(),
    };

  } catch (error) {
    console.error('❌ Помилка отримання даних повітряної тривоги:', error);
    
    // Повертаємо дефолтні дані у випадку помилки
    return {
      regionId: '7',
      regionName: 'м. Запоріжжя та Запорізька територіальна громада',
      isAlarmActive: false,
      lastUpdate: new Date().toISOString(),
    };
  }
};

// Функція для отримання іконки тривоги
export const getAlarmIcon = (isActive: boolean): string => {
  return isActive ? '🚨' : '✅';
};

// Функція для отримання кольору індикатора тривоги
export const getAlarmColor = (isActive: boolean): string => {
  return isActive ? '#ff4444' : '#4CAF50';
}; 