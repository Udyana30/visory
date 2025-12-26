import { useState } from 'react';
import { avatarProjectService } from '../services/avatarProjectService';
import { CreateAvatarPayload } from '../types/domain/project';

export const useAvatarActions = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createAvatar = async (payload: CreateAvatarPayload) => {
    setIsCreating(true);
    setError(null);
    try {
      if (!payload.userId) throw new Error("User ID is missing");

      const result = await avatarProjectService.create(payload as CreateAvatarPayload & { userId: string });
      return result;
    } catch (err: any) {
      const msg = err.response?.data?.error || err.message || 'Failed to create avatar';
      setError(msg);
      throw err;
    } finally {
      setIsCreating(false);
    }
  };

  const deleteAvatar = async (id: string) => {
    setError(null);
    try {
      await avatarProjectService.deleteProject(id);
    } catch (err: any) {
      const msg = err.response?.data?.error || err.message || 'Failed to delete avatar';
      setError(msg);
      throw err;
    }
  };

  return {
    createAvatar,
    deleteAvatar,
    isCreating,
    error
  };
};