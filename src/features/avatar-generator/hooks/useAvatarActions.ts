import { useState } from 'react';
import { CreateAvatarPayload, AvatarProject } from '../types/domain/project';
import { avatarService } from '../services/avatarService';

export const useAvatarActions = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createAvatar = async (payload: CreateAvatarPayload): Promise<AvatarProject | null> => {
    setIsCreating(true);
    setError(null);
    
    try {
      const newProject = await avatarService.create(payload);
      return newProject;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create avatar';
      setError(message);
      return null;
    } finally {
      setIsCreating(false);
    }
  };

  return {
    createAvatar,
    isCreating,
    error,
  };
};