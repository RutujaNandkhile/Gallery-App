import { PicsumImage } from '@/types';

const BASE_URL = 'https://picsum.photos/v2/list';

export class ApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Fetches a single page of images from the Picsum public API.
 * Thin wrapper so the rest of the app never talks to `fetch` directly,
 * which keeps error handling and the base URL in one place.
 */
export async function fetchImages(page: number, limit = 20): Promise<PicsumImage[]> {
  const url = `${BASE_URL}?page=${page}&limit=${limit}`;
  let response: Response;

  try {
    response = await fetch(url);
  } catch (err) {
    throw new ApiError('Network request failed. Please check your internet connection.');
  }

  if (!response.ok) {
    throw new ApiError(`Server responded with status ${response.status}`);
  }

  try {
    const data = (await response.json()) as PicsumImage[];
    return data;
  } catch (err) {
    throw new ApiError('Failed to parse server response.');
  }
}
