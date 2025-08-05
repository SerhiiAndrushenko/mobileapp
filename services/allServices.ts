export interface ServiceItem {
  id: string;
  title: string;
  // Используемые имена иконок Ionicons
  icon: string;
}

export const allServices: ServiceItem[] = [
  { id: 'shelters', title: 'Мапа укриттів', icon: 'map' },
  { id: 'transport', title: 'Рух транспорту', icon: 'bus' },
  { id: 'qr', title: 'QR-сканер', icon: 'qr-code' },
  { id: 'sich', title: 'Транспортна картка Січ', icon: 'card' },
  { id: 'repairs', title: 'Ремонтні роботи', icon: 'construct' },
  { id: 'poll', title: 'Опитування', icon: 'list' },
  { id: 'handbook', title: 'Довідник', icon: 'book' },
  { id: 'video', title: 'Отримання відеозапису', icon: 'videocam' },
]; 