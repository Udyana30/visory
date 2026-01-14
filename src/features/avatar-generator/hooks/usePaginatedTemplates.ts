import { useState, useCallback, useEffect } from 'react';
import { AvatarTemplate } from '../types/domain/template';
import { avatarTemplateService } from '../services/avatarTemplateService';

interface UsePaginatedTemplatesReturn {
    /** Array of all loaded templates */
    templates: AvatarTemplate[];

    /** Indicator apakah masih ada data selanjutnya */
    hasMore: boolean;

    /** Loading state untuk initial load */
    isLoading: boolean;

    /** Loading state untuk load more */
    isLoadingMore: boolean;

    /** Error state */
    error: Error | null;

    /** Load more templates (append to existing) */
    loadMore: () => Promise<void>;

    /** Refresh (reset to page 1) */
    refresh: () => Promise<void>;
}

/**
 * Custom hook untuk manage paginated avatar templates
 * Mendukung infinite scroll dan load more functionality
 * 
 * @param userId - Optional user ID untuk filter user templates
 * @param pageSize - Jumlah items per page (default: 20)
 * @returns Pagination state dan functions
 */
export const usePaginatedTemplates = (
    userId?: string,
    pageSize: number = 20
): UsePaginatedTemplatesReturn => {
    const [templates, setTemplates] = useState<AvatarTemplate[]>([]);
    const [nextCursor, setNextCursor] = useState<string | null>(null);
    const [hasMore, setHasMore] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    /**
     * Load initial page atau page berikutnya
     */
    const loadPage = useCallback(async (cursor: string | null = null, isRefresh: boolean = false) => {
        try {
            if (isRefresh) {
                setIsLoading(true);
            } else {
                setIsLoadingMore(true);
            }
            setError(null);

            const response = userId
                ? await avatarTemplateService.getPageByUserId(userId, { limit: pageSize, cursor })
                : await avatarTemplateService.getPage({ limit: pageSize, cursor });

            if (isRefresh) {
                // Refresh: replace existing templates
                setTemplates(response.items);
            } else {
                // Load more: append to existing templates
                setTemplates(prev => [...prev, ...response.items]);
            }

            setNextCursor(response.next_cursor);
            setHasMore(response.has_more);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to load templates'));
            console.error('Error loading templates:', err);
        } finally {
            setIsLoading(false);
            setIsLoadingMore(false);
        }
    }, [userId, pageSize]);

    /**
     * Load more templates (append to existing)
     */
    const loadMore = useCallback(async () => {
        if (!hasMore || isLoadingMore) return;
        await loadPage(nextCursor, false);
    }, [hasMore, isLoadingMore, nextCursor, loadPage]);

    /**
     * Refresh (reset to page 1)
     */
    const refresh = useCallback(async () => {
        await loadPage(null, true);
    }, [loadPage]);

    // Initial load
    useEffect(() => {
        refresh();
    }, [userId]); // Trigger saat userId berubah

    return {
        templates,
        hasMore,
        isLoading,
        isLoadingMore,
        error,
        loadMore,
        refresh
    };
};
