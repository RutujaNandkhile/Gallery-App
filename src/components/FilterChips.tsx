import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { FilterOption } from '@/types';

const OPTIONS: { key: FilterOption; label: string }[] = [
  { key: 'all', label: 'All Images' },
  { key: 'a-m', label: 'Author A-M' },
  { key: 'n-z', label: 'Author N-Z' },
];

interface FilterChipsProps {
  value: FilterOption;
  onChange: (value: FilterOption) => void;
}

export function FilterChips({ value, onChange }: FilterChipsProps) {
  const { colors } = useTheme();

  return (
    <View style={styles.row}>
      {OPTIONS.map((opt) => {
        const active = opt.key === value;
        return (
          <Pressable
            key={opt.key}
            onPress={() => onChange(opt.key)}
            style={[
              styles.chip,
              {
                backgroundColor: active ? colors.primary : colors.chipBackground,
              },
            ]}
          >
            <Text style={[styles.chipText, { color: active ? colors.primaryText : colors.text }]}>{opt.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20 },
  chipText: { fontSize: 13, fontWeight: '600' },
});
