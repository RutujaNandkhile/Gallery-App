import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, ViewStyle } from 'react-native';
import { useTheme } from '@/context/ThemeContext';

interface PrimaryButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'filled' | 'outline';
  style?: ViewStyle;
}

export function PrimaryButton({
  title,
  onPress,
  loading,
  disabled,
  variant = 'filled',
  style,
}: PrimaryButtonProps) {
  const { colors } = useTheme();
  const isOutline = variant === 'outline';

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.base,
        {
          backgroundColor: isOutline ? 'transparent' : colors.primary,
          borderColor: colors.primary,
          borderWidth: isOutline ? 1.5 : 0,
          opacity: disabled || loading ? 0.6 : pressed ? 0.85 : 1,
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={isOutline ? colors.primary : colors.primaryText} />
      ) : (
        <Text style={[styles.text, { color: isOutline ? colors.primary : colors.primaryText }]}>{title}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: { fontSize: 15, fontWeight: '700' },
});
