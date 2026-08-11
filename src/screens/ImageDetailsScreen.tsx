import React, { useState } from 'react';
import { Alert, Image, Platform, Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import * as Sharing from 'expo-sharing';
import { useTheme } from '@/context/ThemeContext';
import { useFavorites } from '@/context/FavoritesContext';
import { PrimaryButton } from '@/components/PrimaryButton';
import { HomeStackParamList } from '@/navigation/types';

type DetailsRoute = RouteProp<HomeStackParamList, 'ImageDetails'>;

export function ImageDetailsScreen() {
  const { colors } = useTheme();
  const { params } = useRoute<DetailsRoute>();
  const { image } = params;
  const { isFavorite, toggleFavorite } = useFavorites();
  const { width } = useWindowDimensions();

  const [downloading, setDownloading] = useState(false);

  const fullImageUrl = `https://picsum.photos/id/${image.id}/1080/1080`;
  const aspectRatio = image.width / image.height || 1;

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const permission = await MediaLibrary.requestPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Permission required', 'Please allow access to your gallery to save images.');
        return;
      }

      const fileUri = `${FileSystem.cacheDirectory}picsum-${image.id}.jpg`;
      const downloadResult = await FileSystem.downloadAsync(fullImageUrl, fileUri);

      if (Platform.OS === 'web') {
        // MediaLibrary isn't available on web; fall back to native share/download.
        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(downloadResult.uri);
        }
        return;
      }

      const asset = await MediaLibrary.createAssetAsync(downloadResult.uri);
      await MediaLibrary.createAlbumAsync('Gallery App', asset, false);
      Alert.alert('Saved', 'Image has been saved to your device gallery.');
    } catch (err) {
      Alert.alert('Download failed', 'Something went wrong while saving the image. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  const favorite = isFavorite(image.id);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Image
        source={{ uri: fullImageUrl }}
        style={{ width, height: width / aspectRatio, backgroundColor: colors.chipBackground }}
        resizeMode="cover"
      />

      <View style={styles.content}>
        <View style={styles.rowBetween}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.author, { color: colors.text }]}>{image.author}</Text>
            <Text style={[styles.meta, { color: colors.subtext }]}>Image ID: {image.id}</Text>
            <Text style={[styles.meta, { color: colors.subtext }]}>
              Dimensions: {image.width} x {image.height}
            </Text>
          </View>
          <Pressable onPress={() => toggleFavorite(image.id)} hitSlop={10}>
            <Text style={{ fontSize: 30, color: favorite ? colors.favorite : colors.subtext }}>
              {favorite ? '♥' : '♡'}
            </Text>
          </Pressable>
        </View>

        <PrimaryButton
          title={downloading ? 'Saving...' : 'Download Image'}
          onPress={handleDownload}
          loading={downloading}
          style={{ marginTop: 24 }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20 },
  rowBetween: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' },
  author: { fontSize: 20, fontWeight: '800', marginBottom: 6 },
  meta: { fontSize: 13, marginBottom: 2 },
});
