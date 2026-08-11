import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { PrimaryButton } from '@/components/PrimaryButton';

interface EmptyStateProps {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ title, subtitle, actionLabel, onAction }: EmptyStateProps) {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      {!!subtitle && <Text style={[styles.subtitle, { color: colors.subtext }]}>{subtitle}</Text>}
      {!!actionLabel && !!onAction && (
        <PrimaryButton title={actionLabel} onPress={onAction} style={{ marginTop: 16, paddingHorizontal: 24 }} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', justifyContent: 'center', paddingVertical: 60, paddingHorizontal: 24 },
  title: { fontSize: 16, fontWeight: '700', textAlign: 'center', marginBottom: 6 },
  subtitle: { fontSize: 13, textAlign: 'center' },
});
