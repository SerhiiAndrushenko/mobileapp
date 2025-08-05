// Утіліти для роботи з датами та їх форматування
import { useTranslation } from 'react-i18next';

// Функція для отримання назви дня тижня
export const getDayName = (date: Date, t: (key: string) => string): string => {
  const dayNames = [
    'days.sunday',
    'days.monday', 
    'days.tuesday',
    'days.wednesday',
    'days.thursday',
    'days.friday',
    'days.saturday'
  ];
  
  return t(dayNames[date.getDay()]);
};

// Функція для отримання назви місяця
export const getMonthName = (date: Date, t: (key: string) => string): string => {
  const monthNames = [
    'months.january',
    'months.february',
    'months.march',
    'months.april',
    'months.may',
    'months.june',
    'months.july',
    'months.august',
    'months.september',
    'months.october',
    'months.november',
    'months.december'
  ];
  
  return t(monthNames[date.getMonth()]);
};

// Функція для форматування дати у форматі "Четвер, 3 липня"
export const formatDateString = (date: Date, t: (key: string) => string): string => {
  const dayName = getDayName(date, t);
  const monthName = getMonthName(date, t);
  const day = date.getDate();

  // Capitalize first letter of day name
  const capitalizedDay = dayName.charAt(0).toUpperCase() + dayName.slice(1);

  return `${capitalizedDay}, ${day} ${monthName}`;
};

// Функція для отримання поточного часу у форматі HH:MM
export const getCurrentTimeString = (): string => {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  
  return `${hours}:${minutes}`;
};

// Функція для перевірки чи є дата сьогоднішньою
export const isToday = (date: Date): boolean => {
  const today = new Date();
  return date.toDateString() === today.toDateString();
};

// Функція для отримання відносного часу (наприклад, "2 години тому")
export const getRelativeTime = (date: Date, t: (key: string) => string): string => {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffMins < 1) return 'Щойно';
  if (diffMins < 60) return `${diffMins} хв тому`;
  if (diffHours < 24) return `${diffHours} год тому`;
  if (diffDays < 7) return `${diffDays} дн тому`;
  
  return formatDateString(date, t);
}; 