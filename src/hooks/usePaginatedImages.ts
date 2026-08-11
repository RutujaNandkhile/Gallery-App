import { useCallback, useEffect, useRef, useState } from 'react';
import { fetchImages, ApiError } from '@/services/api';
import { PicsumImage } from '@/types';

const PAGE_SIZE = 20;

interface UsePaginatedImagesResult {
  images: PicsumImage[];
  isLoading: boolean;
  isRefreshing: boolean;
  isLoadingMore: boolean;
  error: string | null;
  loadMore: () => void;
  refresh: () => void;
}

/**
 * Encapsulates fetching + infinite scroll pagination + pull-to-refresh for
 * the Picsum image list, including a guard against firing duplicate
 * requests while one is already in flight.
 */
export function usePaginatedImages(): UsePaginatedImagesResult {
  const [images, setImages] = useState<PicsumImage[]>([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const requestInFlight = useRef(false);

  const load = useCallback(async (targetPage: number, mode: 'initial' | 'refresh' | 'more') => {
    if (requestInFlight.current) return;
    requestInFlight.current = true;

    if (mode === 'initial') setIsLoading(true);
    if (mode === 'refresh') setIsRefreshing(true);
    if (mode === 'more') setIsLoadingMore(true);
    setError(null);

    try {
      const data = await fetchImages(targetPage, PAGE_SIZE);
      setHasMore(data.length === PAGE_SIZE);
      setImages((prev) => (mode === 'more' ? [...prev, ...data] : data));
      setPage(targetPage);
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Something went wrong while loading images.';
      setError(message);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
      setIsLoadingMore(false);
      requestInFlight.current = false;
    }
  }, []);

  useEffect(() => {
    load(1, 'initial');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadMore = useCallback(() => {
    if (isLoadingMore || isLoading || isRefreshing || !hasMore || requestInFlight.current) return;
    load(page + 1, 'more');
  }, [isLoadingMore, isLoading, isRefreshing, hasMore, page, load]);

  const refresh = useCallback(() => {
    if (requestInFlight.current) return;
    load(1, 'refresh');
  }, [load]);

  return { images, isLoading, isRefreshing, isLoadingMore, error, loadMore, refresh };
}
