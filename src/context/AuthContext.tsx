import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { storage } from '@/services/storage';
import { simpleHash } from '@/utils/validation';
import { PublicUser, RegisterFormValues, ProfileUpdateValues, RegisteredUser } from '@/types';

interface AuthContextValue {
  user: PublicUser | null;
  isLoading: boolean;
  register: (values: RegisterFormValues) => Promise<{ success: boolean; error?: string }>;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateProfile: (values: ProfileUpdateValues) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function toPublicUser(user: RegisteredUser): PublicUser {
  const { passwordHash, ...rest } = user;
  return rest;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<PublicUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore session on app launch so login state survives an app restart.
  useEffect(() => {
    (async () => {
      try {
        const sessionEmail = await storage.getSession();
        if (sessionEmail) {
          const found = await storage.findUserByEmail(sessionEmail);
          if (found) setUser(toPublicUser(found));
        }
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const register = useCallback(async (values: RegisterFormValues) => {
    const existing = await storage.findUserByEmail(values.email);
    if (existing) {
      return { success: false, error: 'An account with this email already exists.' };
    }

    const newUser: RegisteredUser = {
      id: `${Date.now()}`,
      fullName: values.fullName.trim(),
      email: values.email.trim().toLowerCase(),
      gender: values.gender,
      mobileNumber: values.mobileNumber.trim(),
      address: values.address.trim(),
      city: values.city,
      passwordHash: simpleHash(values.password),
    };

    await storage.addUser(newUser);
    await storage.setSession(newUser.email);
    setUser(toPublicUser(newUser));
    return { success: true };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const found = await storage.findUserByEmail(email);
    if (!found || found.passwordHash !== simpleHash(password)) {
      return { success: false, error: 'Invalid email or password.' };
    }
    await storage.setSession(found.email);
    setUser(toPublicUser(found));
    return { success: true };
  }, []);

  const logout = useCallback(async () => {
    await storage.setSession(null);
    setUser(null);
  }, []);

  const updateProfile = useCallback(
    async (values: ProfileUpdateValues) => {
      if (!user) return { success: false, error: 'No user is currently logged in.' };
      const updated = await storage.updateUser(user.email, (existing) => ({
        ...existing,
        fullName: values.fullName.trim(),
        mobileNumber: values.mobileNumber.trim(),
        address: values.address.trim(),
        city: values.city,
        gender: values.gender,
        avatarId: values.avatarId ?? existing.avatarId,
      }));
      if (!updated) return { success: false, error: 'Could not find user record to update.' };
      setUser(toPublicUser(updated));
      return { success: true };
    },
    [user]
  );

  const value = useMemo(
    () => ({ user, isLoading, register, login, logout, updateProfile }),
    [user, isLoading, register, login, logout, updateProfile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
