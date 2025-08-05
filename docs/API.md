# API Документація

## Погода (Open-Meteo API)

### Опис
Використовується безкоштовний API Open-Meteo для отримання даних про погоду в Запоріжжі.

### Endpoint
```
https://api.open-meteo.com/v1/forecast?latitude=47.8378&longitude=35.1383&current_weather=true&hourly=temperature_2m,weathercode&timezone=Europe/Kyiv
```

### Параметри
- `latitude=47.8378` - Широта Запоріжжя
- `longitude=35.1383` - Довгота Запоріжжя  
- `current_weather=true` - Поточна погода
- `hourly=temperature_2m,weathercode` - Почасові дані
- `timezone=Europe/Kyiv` - Часовий пояс

### Сервіс
Файл: `services/weatherService.ts`

### Функції
- `fetchWeatherData()` - Отримання даних погоди
- `getWeatherIcon()` - Отримання іконки за типом погоди

## Повітряна тривога (Alerts API)

### Опис
API для отримання статусу повітряної тривоги в Запорізькій області.

### Endpoint
```
https://alerts.com.ua/api/states/7
```
д
### Авторизація
```
Authorization: Bearer 6fb363e4:8cb4413bf8a007f46adf108a686d32cd
```

### Сервіс
Файл: `services/airAlarmService.ts`

### Функції
- `fetchAirAlarmStatus()` - Отримання статусу тривоги
- `getAlarmIcon()` - Іконка за статусом
- `getAlarmColor()` - Колір за статусом

## Особливості

### Частота оновлення
- **Погода**: При завантаженні екрану та за запитом
- **Тривога**: Кожні 30 секунд автоматично

### Обробка помилок
Всі API мають fallback-значення і обробку помилок з можливістю повторного запиту.

### Кешування
Дані не кешуються - завжди актуальна інформація. 