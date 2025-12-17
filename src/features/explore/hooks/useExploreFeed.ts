import { useState, useEffect, useCallback } from 'react';
import { galleryService } from '../services/galleryService';
import { ComicGalleryItem } from '../types/domain';

export const useExploreFeed = () => {
  const [items, setItems] = useState<ComicGalleryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFeed = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const { data } = await galleryService.getAll({ page: 1, limit: 12 });
      setItems(data);
    } catch (err) {
      setError('Failed to load explore feed');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFeed();
  }, [fetchFeed]);

  return { items, isLoading, error, refresh: fetchFeed };
};