import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE = 'https://portal.zp.digital/api'; // TODO: заменить на реальный URL

let authToken: string | null = null;

// ---------- helpers ----------
async function request(endpoint: string, options: RequestInit = {}) {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as object),
  };
  if (authToken) headers['Authorization'] = `Bearer ${authToken}`;

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || res.statusText);
  }
  if (res.status === 204) return null;
  return res.json();
}

// ---------- auth token persistence ----------
export async function loadToken() {
  authToken = await AsyncStorage.getItem('token');
}

async function saveToken(token: string) {
  authToken = token;
  await AsyncStorage.setItem('token', token);
}

export async function clearToken() {
  authToken = null;
  await AsyncStorage.removeItem('token');
}

// ---------- API methods ----------
export async function login(email: string, password: string) {
  const data = await request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  await saveToken(data.token);
  return data.user;
}

export async function register(body: {
  surname: string;
  name: string;
  email: string;
  password: string;
}) {
  const data = await request('/auth/register', {
    method: 'POST',
    body: JSON.stringify(body),
  });
  await saveToken(data.token);
  return data.user;
}

export async function getProfile() {
  return request('/user/profile');
}

export async function updateProfile(body: { surname: string; name: string; email: string }) {
  return request('/user/profile', {
    method: 'PUT',
    body: JSON.stringify(body),
  });
}

export async function deleteAccount() {
  await request('/user', { method: 'DELETE' });
  await clearToken();
} 