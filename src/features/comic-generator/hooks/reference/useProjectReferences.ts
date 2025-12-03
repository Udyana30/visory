import { useState, useCallback, useEffect } from 'react';
import { referenceService } from '../../services/referenceService';
import { Reference } from '../../types/domain/reference';
import { mapToDomain } from '../../utils/referenceMapper';

export const useProjectReferences = (projectId: number | null) => {
  const [references, setReferences] = useState<Reference[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReferences = useCallback(async () => {
    if (!projectId) return;
    
    setLoading(true);
    setError(null);
    try {
        const response = await referenceService.getAllByProject(projectId);
      
        const mappedRefs = response
          .map(mapToDomain)
          .filter(ref => ref.projectId === projectId);
  
        setReferences(mappedRefs);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch project references');
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchReferences();
  }, [fetchReferences]);

  return { references, loading, error, refresh: fetchReferences };
};