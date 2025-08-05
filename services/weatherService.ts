// Сервіс для роботи з API погоди Open-Meteo (покращена версія)
export interface WeatherData {
  current_weather: {
    temperature: number;
    weathercode: number;
    time: string;
    windspeed: number;
    winddirection: number;
    is_day: number;
  };
  hourly: {
    time: string[];
    temperature_2m: number[];
    weathercode: number[];
  };
}

export interface ProcessedWeatherData {
  currentTemp: number;
  dayTemp: number;
  nightTemp: number;
  weatherCode: number;
  weatherDescription: string;
}

// URL API для погоди в Запоріжжі з додатковими параметрами
const WEATHER_API_URL = 'https://api.open-meteo.com/v1/forecast?latitude=47.8378&longitude=35.1383&current_weather=true&hourly=temperature_2m,weathercode&timezone=Europe/Kiev&forecast_days=1';

// Коди погоди WMO та їх опис
const getWeatherDescription = (code: number): string => {
  const weatherCodes: { [key: number]: string } = {
    0: 'sunny', // Ясно
    1: 'sunny', // Переважно ясно
    2: 'cloudy', // Частково хмарно
    3: 'cloudy', // Хмарно
    45: 'cloudy', // Туман
    48: 'cloudy', // Туман з інеєм
    51: 'rainy', // Дрібний дощ
    53: 'rainy', // Помірний дощ
    55: 'rainy', // Сильний дощ
    56: 'rainy', // Дрібний крижаний дощ
    57: 'rainy', // Сильний крижаний дощ
    61: 'rainy', // Слабкий дощ
    63: 'rainy', // Помірний дощ
    65: 'rainy', // Сильний дощ
    66: 'rainy', // Легкий крижаний дощ
    67: 'rainy', // Сильний крижаний дощ
    71: 'snowy', // Слабкий сніг
    73: 'snowy', // Помірний сніг
    75: 'snowy', // Сильний сніг
    77: 'snowy', // Снігові зерна
    80: 'rainy', // Слабкі дощові злива
    81: 'rainy', // Помірні дощові злива
    82: 'rainy', // Сильні дощові злива
    85: 'snowy', // Слабкі снігові злива
    86: 'snowy', // Сильні снігові злива
    95: 'stormy', // Гроза
    96: 'stormy', // Гроза з градом
    99: 'stormy', // Гроза з сильним градом
  };

  return weatherCodes[code] || 'cloudy';
};

// Функція для отримання температури в певний час
const getTemperatureAtHour = (hourlyData: WeatherData['hourly'], targetHour: number): number => {
  const now = new Date();
  const today = now.toISOString().split('T')[0];
  const targetTime = `${today}T${targetHour.toString().padStart(2, '0')}:00`;
  
  const index = hourlyData.time.findIndex(time => time === targetTime);
  if (index >= 0) {
    return Math.round(hourlyData.temperature_2m[index]);
  }
  
  // Якщо точний час не знайдено, шукаємо найближчий
  for (let i = 0; i < hourlyData.time.length; i++) {
    const time = hourlyData.time[i];
    const hour = new Date(time).getHours();
    if (Math.abs(hour - targetHour) <= 1) {
      return Math.round(hourlyData.temperature_2m[i]);
    }
  }
  
  return 0; // Fallback
};

// Функція для отримання даних про погоду
export const fetchWeatherData = async (): Promise<ProcessedWeatherData | null> => {
  try {
    console.log('🌍 Відправляємо запит до:', WEATHER_API_URL);
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      console.log('⏰ Таймаут 10 секунд досягнуто, скасовуємо запит');
      controller.abort();
    }, 10000);
    
    const response = await fetch(WEATHER_API_URL, {
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'MobileApp/1.0'
      }
    });
    
    clearTimeout(timeoutId);
    console.log('📡 Відповідь отримана, статус:', response.status);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data: WeatherData = await response.json();
    console.log('📊 Повні дані з API:', JSON.stringify(data, null, 2));
    
    if (!data.current_weather) {
      console.error('❌ Відсутні поточні дані в API відповіді');
      throw new Error('Неповні дані від API - немає current_weather');
    }
    
    if (!data.hourly) {
      console.error('❌ Відсутні почасові дані в API відповіді');
      throw new Error('Неповні дані від API - немає hourly');
    }
    
    // Поточна температура
    const currentTemp = Math.round(data.current_weather.temperature);
    console.log('🌡️ Поточна температура:', currentTemp);
    
    // Температура вдень (14:00) та вночі (02:00)
    const dayTemp = getTemperatureAtHour(data.hourly, 14) || currentTemp;
    const nightTemp = getTemperatureAtHour(data.hourly, 2) || currentTemp - 8;
    
    console.log(`📈 Розраховані температури: зараз ${currentTemp}°, день ${dayTemp}°, ніч ${nightTemp}°`);
    
    const result = {
      currentTemp,
      dayTemp,
      nightTemp,
      weatherCode: data.current_weather.weathercode,
      weatherDescription: getWeatherDescription(data.current_weather.weathercode),
    };
    
    console.log('✅ Підготовлені дані для повернення:', result);
    return result;
    
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        console.error('⏰ Запит погоди був скасований через таймаут');
      } else {
        console.error('❌ Помилка отримання даних погоди:', error.message);
        console.error('📋 Деталі помилки:', error);
      }
    } else {
      console.error('❌ Невідома помилка отримання даних погоди:', error);
    }
    return null;
  }
};

// Функція для отримання іконки погоди
export const getWeatherIcon = (weatherDescription: string): string => {
  const icons: { [key: string]: string } = {
    sunny: '☀️',
    cloudy: '☁️',
    rainy: '🌧️',
    stormy: '⛈️',
    snowy: '❄️',
  };
  
  return icons[weatherDescription] || '☁️';
}; 