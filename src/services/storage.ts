import AsyncStorage from '@react-native-async-storage/async-storage';
import { RegisteredUser } from '@/types';

/**
 * All AsyncStorage keys are centralized here so the rest of the app never
 * touches raw string literals. This keeps storage usage organized and
 * makes it trivial to namespace/migrate keys later.
 */
const KEYS = {
  USERS: 'gallery_app/users',
  SESSION_EMAIL: 'gallery_app/session_email',
  FAVORITES: (email: string) => `gallery_app/favorites/${email}`,
  THEME: 'gallery_app/theme',
} as const;

async function readJSON<T>(key: string, fallback: T): Promise<T> {
  try {
    const raw = await AsyncStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch (err) {
    console.warn(`storage.readJSON failed for key "${key}"`, err);
    return fallback;
  }
}

async function writeJSON<T>(key: string, value: T): Promise<void> {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.warn(`storage.writeJSON failed for key "${key}"`, err);
    throw err;
  }
}

export const storage = {
  async getUsers(): Promise<RegisteredUser[]> {
    return readJSON<RegisteredUser[]>(KEYS.USERS, []);
  },

  async saveUsers(users: RegisteredUser[]): Promise<void> {
    return writeJSON(KEYS.USERS, users);
  },

  async addUser(user: RegisteredUser): Promise<void> {
    const users = await storage.getUsers();
    users.push(user);
    await storage.saveUsers(users);
  },

  async updateUser(email: string, updater: (user: RegisteredUser) => RegisteredUser): Promise<RegisteredUser | null> {
    const users = await storage.getUsers();
    const idx = users.findIndex((u) => u.email.toLowerCase() === email.toLowerCase());
    if (idx === -1) return null;
    users[idx] = updater(users[idx]);
    await storage.saveUsers(users);
    return users[idx];
  },

  async findUserByEmail(email: string): Promise<RegisteredUser | undefined> {
    const users = await storage.getUsers();
    return users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  },

  async setSession(email: string | null): Promise<void> {
    if (email) {
      await AsyncStorage.setItem(KEYS.SESSION_EMAIL, email);
    } else {
      await AsyncStorage.removeItem(KEYS.SESSION_EMAIL);
    }
  },

  async getSession(): Promise<string | null> {
    return AsyncStorage.getItem(KEYS.SESSION_EMAIL);
  },

  async getFavorites(email: string): Promise<string[]> {
    return readJSON<string[]>(KEYS.FAVORITES(email), []);
  },

  async saveFavorites(email: string, favoriteIds: string[]): Promise<void> {
    return writeJSON(KEYS.FAVORITES(email), favoriteIds);
  },

  async getTheme(): Promise<'light' | 'dark' | null> {
    const val = await AsyncStorage.getItem(KEYS.THEME);
    return val === 'light' || val === 'dark' ? val : null;
  },

  async setTheme(theme: 'light' | 'dark'): Promise<void> {
    await AsyncStorage.setItem(KEYS.THEME, theme);
  },
};
