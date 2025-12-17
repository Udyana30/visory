import { useState, useEffect, useCallback } from 'react';
import { AvatarProject } from '../types/domain/project';
import { avatarService } from '../services/avatarService';

export const useAvatarHistory = () => {
  const [projects, setProjects] = useState<AvatarProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await avatarService.getAll();
      
      const successfulProjects = data.filter((project) => !project.hasError);
      
      setProjects(successfulProjects);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch projects';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return {
    projects,
    isLoading,
    error,
    refresh: fetchProjects,
  };
};