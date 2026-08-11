import React from 'react';
import { NavigationContainer, DarkTheme, DefaultTheme } from '@react-navigation/native';
import { ActivityIndicator, View } from 'react-native';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { FavoritesProvider } from '@/context/FavoritesContext';
import { AuthStack } from '@/navigation/AuthStack';
import { AppTabs } from '@/navigation/AppTabs';

export function RootNavigator() {
  const { user, isLoading } = useAuth();
  const { colors, mode } = useTheme();

  if (isLoading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const navigationTheme = mode === 'dark' ? DarkTheme : DefaultTheme;

  return (
    <NavigationContainer
      theme={{
        ...navigationTheme,
        colors: { ...navigationTheme.colors, background: colors.background, card: colors.surface, primary: colors.primary, text: colors.text, border: colors.border },
      }}
    >
      {user ? (
        <FavoritesProvider>
          <AppTabs />
        </FavoritesProvider>
      ) : (
        <AuthStack />
      )}
    </NavigationContainer>
  );
}
