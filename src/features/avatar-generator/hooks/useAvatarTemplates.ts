import { useState, useCallback } from 'react';
import { avatarTemplateService } from '../services/avatarTemplateService';
import { AvatarTemplate } from '../types/domain/template';
import authService from '@/services/authService';

export const useAvatarTemplates = (userId?: string) => {
    const [templates, setTemplates] = useState<AvatarTemplate[]>([]);
    const [userTemplates, setUserTemplates] = useState<AvatarTemplate[]>([]);

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchTemplates = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            // 1. Fetch All Public Templates
            const all = await avatarTemplateService.getAll();
            setTemplates(all);

            // 2. Fetch User Templates
            // Use passed userId or fallback to localStorage (authService)
            const currentUserId = userId || authService.getCurrentUser()?.id;

            if (currentUserId) {
                const mine = await avatarTemplateService.getByUserId(currentUserId);
                setUserTemplates(mine);
            }

        } catch (err: any) {
            setError(err.message || 'Failed to fetch templates');
        } finally {
            setIsLoading(false);
        }
    }, [userId]);

    const createTemplate = async (name: string, file: File) => {
        const currentUserId = userId || authService.getCurrentUser()?.id;
        if (!currentUserId) throw new Error("User ID required");

        setIsLoading(true);
        try {
            await avatarTemplateService.create({ name, file, userId: currentUserId });
            await fetchTemplates(); // Refresh list
        } catch (err: any) {
            setError(err.message || 'Failed to create template');
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const deleteTemplate = async (id: string) => {
        try {
            await avatarTemplateService.delete(id);
            // Optimistic update
            setTemplates(prev => prev.filter(t => t.avatar_id !== id));
            setUserTemplates(prev => prev.filter(t => t.avatar_id !== id));
        } catch (err: any) {
            console.error("Delete failed", err);
            throw err;
        }
    };

    return {
        templates,
        userTemplates,
        isLoading,
        error,
        fetchTemplates,
        createTemplate,
        deleteTemplate
    };
};
