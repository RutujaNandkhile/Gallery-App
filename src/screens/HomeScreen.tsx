import React, { useMemo, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { useFavorites } from '@/context/FavoritesContext';
import { usePaginatedImages } from '@/hooks/usePaginatedImages';
import { useDebounce } from '@/hooks/useDebounce';
import { SearchBar } from '@/components/SearchBar';
import { FilterChips } from '@/components/FilterChips';
import { ImageCard } from '@/components/ImageCard';
import { Loader } from '@/components/Loader';
import { EmptyState } from '@/components/EmptyState';
import { FilterOption, PicsumImage } from '@/types';
import { HomeStackParamList } from '@/navigation/types';

export function HomeScreen() {
  const { colors } = useTheme();
  const { user } = useAuth();
  const { isFavorite, toggleFavorite } = useFavorites();
  const navigation = useNavigation<NativeStackNavigationProp<HomeStackParamList>>();

  const { images, isLoading, isRefreshing, isLoadingMore, error, loadMore, refresh } = usePaginatedImages();

  const [searchText, setSearchText] = useState('');
  const [filter, setFilter] = useState<FilterOption>('all');
  const debouncedSearch = useDebounce(searchText, 350);

  // Search and filter are combined here so they always work together
  // regardless of which one the user changes.
  const visibleImages = useMemo(() => {
    let result = images;

    const query = debouncedSearch.trim().toLowerCase();
    if (query.length > 0) {
      result = result.filter((img) => img.author.toLowerCase().includes(query));
    }

    if (filter === 'a-m') {
      result = result.filter((img) => /^[a-m]/i.test(img.author.trim()));
    } else if (filter === 'n-z') {
      result = result.filter((img) => /^[n-z]/i.test(img.author.trim()));
    }

    return result;
  }, [images, debouncedSearch, filter]);

  const openDetails = (image: PicsumImage) => navigation.navigate('ImageDetails', { image });

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Hi {user?.fullName?.split(' ')[0] ?? 'there'} 👋</Text>
        <Text style={[styles.subtitle, { color: colors.subtext }]}>Explore the image gallery</Text>
      </View>

      <View style={styles.filters}>
        <SearchBar value={searchText} onChangeText={setSearchText} />
        <FilterChips value={filter} onChange={setFilter} />
      </View>

      {isLoading ? (
        <Loader />
      ) : error && images.length === 0 ? (
        <EmptyState title="Couldn't load images" subtitle={error} actionLabel="Retry" onAction={refresh} />
      ) : (
        <FlatList
          data={visibleImages}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <ImageCard
              image={item}
              isFavorite={isFavorite(item.id)}
              onPress={() => openDetails(item)}
              onToggleFavorite={() => toggleFavorite(item.id)}
            />
          )}
          refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={refresh} tintColor={colors.primary} />}
          onEndReachedThreshold={0.4}
          onEndReached={() => {
            // Only paginate the underlying source list, not the filtered
            // view, so search/filter never trigger extra network calls.
            if (debouncedSearch.trim().length === 0 && filter === 'all') loadMore();
          }}
          ListFooterComponent={isLoadingMore ? <Loader size="small" /> : null}
          ListEmptyComponent={
            <EmptyState
              title="No images found"
              subtitle="Try a different search term or filter."
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
  filters: { paddingHorizontal: 20, paddingTop: 8 },
  listContent: { paddingHorizontal: 20, paddingBottom: 24 },
});
