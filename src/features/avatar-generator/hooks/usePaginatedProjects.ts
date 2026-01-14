import { useState, useCallback, useEffect } from 'react';
import { AvatarProject } from '../types/domain/project';
import { avatarProjectService } from '../services/avatarProjectService';

interface UsePaginatedProjectsReturn {
    /** Array of all loaded projects */
    projects: AvatarProject[];

    /** Indicator apakah masih ada data selanjutnya */
    hasMore: boolean;

    /** Loading state untuk initial load */
    isLoading: boolean;

    /** Loading state untuk load more */
    isLoadingMore: boolean;

    /** Error state */
    error: Error | null;

    /** Load more projects (append to existing) */
    loadMore: () => Promise<void>;

    /** Refresh (reset to page 1) */
    refresh: () => Promise<void>;
}

/**
 * Custom hook untuk manage paginated avatar projects
 * Mendukung infinite scroll dan load more functionality
 * 
 * @param userId - User ID untuk filter projects
 * @param pageSize - Jumlah items per page (default: 20)
 * @returns Pagination state dan functions
 */
export const usePaginatedProjects = (
    userId?: string,
    pageSize: number = 20
): UsePaginatedProjectsReturn => {
    const [projects, setProjects] = useState<AvatarProject[]>([]);
    const [nextCursor, setNextCursor] = useState<string | null>(null);
    const [hasMore, setHasMore] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    /**
     * Load initial page atau page berikutnya
     */
    const loadPage = useCallback(async (cursor: string | null = null, isRefresh: boolean = false) => {
        if (!userId) return;

        try {
            if (isRefresh) {
                setIsLoading(true);
            } else {
                setIsLoadingMore(true);
            }
            setError(null);

            const response = await avatarProjectService.getPage(userId, {
                limit: pageSize,
                cursor
            });

            if (isRefresh) {
                // Refresh: replace existing projects
                setProjects(response.items);
            } else {
                // Load more: append to existing projects
                setProjects(prev => [...prev, ...response.items]);
            }

            setNextCursor(response.next_cursor);
            setHasMore(response.has_more);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to load projects'));
            console.error('Error loading projects:', err);
        } finally {
            setIsLoading(false);
            setIsLoadingMore(false);
        }
    }, [userId, pageSize]);

    /**
     * Load more projects (append to existing)
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
        if (userId) {
            refresh();
        }
    }, [userId]); // Hanya trigger saat userId berubah

    return {
        projects,
        hasMore,
        isLoading,
        isLoadingMore,
        error,
        loadMore,
        refresh
    };
};
