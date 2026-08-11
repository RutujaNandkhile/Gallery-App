import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useTheme } from '@/context/ThemeContext';

export function Loader({ size = 'large' as 'small' | 'large' }) {
  const { colors } = useTheme();
  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={colors.primary} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingVertical: 24, alignItems: 'center', justifyContent: 'center' },
});
