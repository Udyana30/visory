import { useState, useCallback } from 'react';
import { avatarTemplateService } from '../../services/avatarTemplateService';
import { AvatarTemplate } from '../../types/domain/template';
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
            // Parallel fetch for better performance
            const currentUserId = userId || authService.getCurrentUser()?.id;

            const [allTemplates, myTemplates] = await Promise.all([
                avatarTemplateService.getAll(),
                currentUserId
                    ? avatarTemplateService.getByUserId(currentUserId)
                    : Promise.resolve([])
            ]);

            setTemplates(allTemplates);
            setUserTemplates(myTemplates);
        } catch (err: any) {
            const errorMessage = err.message || 'Failed to fetch templates';
            setError(errorMessage);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, [userId]);

    const createTemplate = async (
        name: string,
        file: File,
        isPublic: boolean = false
    ) => {
        const currentUserId = userId || authService.getCurrentUser()?.id;
        if (!currentUserId) {
            throw new Error("User ID required to create template");
        }

        await avatarTemplateService.create({
            name,
            file,
            userId: currentUserId,
            isPublic
        });

        // Refresh templates after creation
        await fetchTemplates();
    };

    const deleteTemplate = async (id: string) => {
        await avatarTemplateService.delete(id);

        // Optimistic update for better UX
        setTemplates(prev => prev.filter(t => t.avatar_id !== id));
        setUserTemplates(prev => prev.filter(t => t.avatar_id !== id));
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
