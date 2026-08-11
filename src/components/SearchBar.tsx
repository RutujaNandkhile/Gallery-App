import React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { useTheme } from '@/context/ThemeContext';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

export function SearchBar({ value, onChangeText, placeholder = 'Search by author name...' }: SearchBarProps) {
  const { colors } = useTheme();

  return (
    <View style={[styles.wrapper, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.subtext}
        style={[styles.input, { color: colors.text }]}
        autoCapitalize="none"
        autoCorrect={false}
        clearButtonMode="while-editing"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    marginBottom: 10,
  },
  input: { paddingVertical: 12, fontSize: 15 },
});
