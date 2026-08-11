import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { PicsumImage } from '@/types';

interface ImageCardProps {
  image: PicsumImage;
  isFavorite: boolean;
  onPress: () => void;
  onToggleFavorite: () => void;
}

const THUMB_WIDTH = 100;

export function ImageCard({ image, isFavorite, onPress, onToggleFavorite }: ImageCardProps) {
  const { colors } = useTheme();
  const thumbUrl = `https://picsum.photos/id/${image.id}/200/200`;

  return (
    <Pressable
      onPress={onPress}
      style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}
    >
      <Image source={{ uri: thumbUrl }} style={styles.thumb} />
      <View style={styles.info}>
        <Text style={[styles.author, { color: colors.text }]} numberOfLines={1}>
          {image.author}
        </Text>
        <Text style={[styles.id, { color: colors.subtext }]}>Image ID: {image.id}</Text>
      </View>
      <Pressable hitSlop={10} onPress={onToggleFavorite} style={styles.favoriteBtn}>
        <Text style={{ fontSize: 22, color: isFavorite ? colors.favorite : colors.subtext }}>
          {isFavorite ? '♥' : '♡'}
        </Text>
      </Pressable>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 14,
    marginBottom: 10,
    overflow: 'hidden',
  },
  thumb: { width: THUMB_WIDTH, height: THUMB_WIDTH },
  info: { flex: 1, paddingHorizontal: 12 },
  author: { fontSize: 15, fontWeight: '700', marginBottom: 4 },
  id: { fontSize: 12 },
  favoriteBtn: { paddingHorizontal: 14 },
});
