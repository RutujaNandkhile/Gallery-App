import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { storage } from '@/services/storage';
import { useAuth } from '@/context/AuthContext';

interface FavoritesContextValue {
  favoriteIds: string[];
  isFavorite: (imageId: string) => boolean;
  toggleFavorite: (imageId: string) => Promise<void>;
  removeFavorite: (imageId: string) => Promise<void>;
}

const FavoritesContext = createContext<FavoritesContextValue | undefined>(undefined);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);

  // Favorites are scoped per logged-in user and reloaded whenever the
  // session user changes (login/logout/switch account).
  useEffect(() => {
    (async () => {
      if (!user) {
        setFavoriteIds([]);
        return;
      }
      const stored = await storage.getFavorites(user.email);
      setFavoriteIds(stored);
    })();
  }, [user]);

  const persist = useCallback(
    async (next: string[]) => {
      setFavoriteIds(next);
      if (user) await storage.saveFavorites(user.email, next);
    },
    [user]
  );

  const isFavorite = useCallback((imageId: string) => favoriteIds.includes(imageId), [favoriteIds]);

  const toggleFavorite = useCallback(
    async (imageId: string) => {
      const next = favoriteIds.includes(imageId)
        ? favoriteIds.filter((id) => id !== imageId)
        : [...favoriteIds, imageId];
      await persist(next);
    },
    [favoriteIds, persist]
  );

  const removeFavorite = useCallback(
    async (imageId: string) => {
      await persist(favoriteIds.filter((id) => id !== imageId));
    },
    [favoriteIds, persist]
  );

  const value = useMemo(
    () => ({ favoriteIds, isFavorite, toggleFavorite, removeFavorite }),
    [favoriteIds, isFavorite, toggleFavorite, removeFavorite]
  );

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites(): FavoritesContextValue {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error('useFavorites must be used within a FavoritesProvider');
  return ctx;
}
