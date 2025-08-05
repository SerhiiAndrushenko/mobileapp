import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE = 'https://1580.zp.ua/api'; // placeholder

export interface Address {
  id: string;
  street: string;
  house: string;
  letter?: string;
}

export const fetchStreets = async (query: string) => {
  const res = await fetch(`${API_BASE}/streets?search=${encodeURIComponent(query)}`);
  return res.json();
};

export const fetchLetters = async (streetId: string) => {
  const res = await fetch(`${API_BASE}/streets/${streetId}/letters`);
  return res.json();
};

export const getAddresses = async (): Promise<Address[]> => {
  const json = await AsyncStorage.getItem('addresses');
  return json ? JSON.parse(json) : [];
};

export const addAddress = async (addr: Address): Promise<void> => {
  const list = await getAddresses();
  await AsyncStorage.setItem('addresses', JSON.stringify([...list, addr]));
};

export const deleteAddress = async (id: string): Promise<void> => {
  const list = await getAddresses();
  await AsyncStorage.setItem('addresses', JSON.stringify(list.filter(a => a.id !== id)));
}; 