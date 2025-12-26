import { useState, useEffect, useCallback } from 'react';
import { avatarProjectService } from '../services/avatarProjectService';
import { AvatarProject } from '../types/domain/project';

export const useAvatarHistory = (userId?: string) => {
  const [projects, setProjects] = useState<AvatarProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = useCallback(async () => {
    if (!userId) {
        setIsLoading(false);
        return;
    }

    try {
      setIsLoading(true);
      const data = await avatarProjectService.getAll(userId);
      setProjects(data);
      setError(null);
    } catch (err) {
      setError('Failed to load history');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return {
    projects,
    isLoading,
    error,
    refresh: fetchProjects
  };
};