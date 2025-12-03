import { useState, useCallback } from 'react';
import { referenceService } from '../../services/referenceService';
import { Reference } from '../../types/domain/reference';
import { mapToDomain } from '../../utils/referenceMapper';

export const useUserLibrary = () => {
  const [libraryItems, setLibraryItems] = useState<Reference[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLibrary = useCallback(async (userId: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await referenceService.getUserLibrary(userId);
      setLibraryItems(response.map(mapToDomain));
    } catch (err: any) {
      setError(err.message || 'Failed to load library');
    } finally {
      setLoading(false);
    }
  }, []);

  return { libraryItems, loading, error, fetchLibrary };
};