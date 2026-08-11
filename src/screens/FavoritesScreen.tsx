import React, { useEffect, useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '@/context/ThemeContext';
import { useFavorites } from '@/context/FavoritesContext';
import { SearchBar } from '@/components/SearchBar';
import { ImageCard } from '@/components/ImageCard';
import { Loader } from '@/components/Loader';
import { EmptyState } from '@/components/EmptyState';
import { fetchFavoriteDetails } from '@/services/favoritesLookup';
import { PicsumImage } from '@/types';
import { FavoritesStackParamList } from '@/navigation/types';

export function FavoritesScreen() {
  const { colors } = useTheme();
  const { favoriteIds, isFavorite, removeFavorite } = useFavorites();
  const navigation = useNavigation<NativeStackNavigationProp<FavoritesStackParamList>>();

  const [favoriteImages, setFavoriteImages] = useState<PicsumImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setIsLoading(true);
      const details = await fetchFavoriteDetails(favoriteIds);
      if (!cancelled) {
        setFavoriteImages(details);
        setIsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [favoriteIds]);

  const visibleImages = useMemo(() => {
    const query = searchText.trim().toLowerCase();
    if (!query) return favoriteImages;
    return favoriteImages.filter((img) => img.author.toLowerCase().includes(query));
  }, [favoriteImages, searchText]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Favorites</Text>
        <Text style={[styles.subtitle, { color: colors.subtext }]}>
          {favoriteIds.length} image{favoriteIds.length === 1 ? '' : 's'} saved
        </Text>
      </View>

      {favoriteIds.length > 0 && (
        <View style={styles.searchWrapper}>
          <SearchBar value={searchText} onChangeText={setSearchText} placeholder="Search favorites by author..." />
        </View>
      )}

      {isLoading ? (
        <Loader />
      ) : (
        <FlatList
          data={visibleImages}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <ImageCard
              image={item}
              isFavorite={isFavorite(item.id)}
              onPress={() => navigation.navigate('ImageDetails', { image: item })}
              onToggleFavorite={() => removeFavorite(item.id)}
            />
          )}
          ListEmptyComponent={
            <EmptyState
              title={favoriteIds.length === 0 ? 'No favorites yet' : 'No matches found'}
              subtitle={
                favoriteIds.length === 0
                  ? 'Tap the heart icon on any image to save it here.'
                  : 'Try a different search term.'
              }
            />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 8 },
  title: { fontSize: 22, fontWeight: '800' },
  subtitle: { fontSize: 13, marginTop: 2 },
  searchWrapper: { paddingHorizontal: 20, paddingTop: 8 },
  listContent: { paddingHorizontal: 20, paddingBottom: 24 },
});
