import { PicsumImage } from '@/types';

/**
 * The /v2/list endpoint has no "fetch by id" mode, so favorites (which only
 * store an image id) are resolved individually through picsum's per-image
 * info endpoint. Failed lookups (e.g. deleted images) are silently skipped
 * rather than breaking the whole favorites screen.
 */
export async function fetchFavoriteDetails(ids: string[]): Promise<PicsumImage[]> {
  const results = await Promise.all(
    ids.map(async (id) => {
      try {
        const res = await fetch(`https://picsum.photos/id/${id}/info`);
        if (!res.ok) return null;
        return (await res.json()) as PicsumImage;
      } catch {
        return null;
      }
    })
  );

  return results.filter((r): r is PicsumImage => r !== null);
}
