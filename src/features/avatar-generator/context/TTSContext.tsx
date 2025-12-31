'use client';

import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import { chatterboxService } from '../services/tts/chatterboxService';
import { TTSProject } from '../types/domain/chatterbox';
import { useAuth } from '@/hooks/useAuth';

const LIMIT = 50;

interface TTSContextType {
    projects: TTSProject[];
    isLoading: boolean;
    isFetchingMore: boolean;
    error: string | null;
    hasMore: boolean;
    loadMore: () => Promise<void>;
    refresh: () => Promise<void>;
    addProject: (project: TTSProject) => void;
    removeProject: (projectId: string) => void;
}

const TTSContext = createContext<TTSContextType | undefined>(undefined);

export const TTSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useAuth();
    const userId = user?.id ? String(user.id) : undefined;

    const [projects, setProjects] = useState<TTSProject[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isFetchingMore, setIsFetchingMore] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [hasMore, setHasMore] = useState(true);

    const offsetRef = useRef(0);
    const isFetchingRef = useRef(false);
    const initializedRef = useRef(false);

    const fetchProjects = useCallback(async (reset = false) => {
        if (!userId) {
            setIsLoading(false);
            return;
        }
        if (isFetchingRef.current) return;
        if (!reset && !hasMore) return;

        isFetchingRef.current = true;

        if (reset) {
            setIsLoading(true);
        } else {
            setIsFetchingMore(true);
        }

        setError(null);

        try {
            const currentOffset = reset ? 0 : offsetRef.current;
            console.log(`[TTSContext] Fetching projects. Offset: ${currentOffset}, Limit: ${LIMIT}`);

            const data = await chatterboxService.getProjects(userId, undefined, LIMIT, currentOffset);
            console.log(`[TTSContext] Received ${data.length} items`);

            if (data.length < LIMIT) {
                setHasMore(false);
            } else {
                setHasMore(true);
            }

            setProjects(prev => {
                const currentProjects = reset ? [] : prev;
                const existingIds = new Set(currentProjects.map(p => p.project_id));
                const uniqueNewProjects = data.filter(p => !existingIds.has(p.project_id));

                console.log(`[TTSContext] Unique new items: ${uniqueNewProjects.length}`);

                // If we got data but all were duplicates, and we're not resetting, stop pagination
                if (!reset && data.length > 0 && uniqueNewProjects.length === 0) {
                    console.warn("[TTSContext] Server returned only duplicates. This usually means the server ignores 'offset'. Stopping pagination.");
                    setHasMore(false);
                    return currentProjects;
                }

                const combined = [...currentProjects, ...uniqueNewProjects];
                return combined.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
            });

            offsetRef.current = currentOffset + data.length;

        } catch (err: any) {
            console.error("Fetch projects error:", err);
            setError(err.message || 'Failed to fetch history');
        } finally {
            setIsLoading(false);
            setIsFetchingMore(false);
            isFetchingRef.current = false;
        }
    }, [userId, hasMore]);

    const addProject = useCallback((project: TTSProject) => {
        setProjects(prev => [project, ...prev]);
        offsetRef.current += 1;
    }, []);

    const removeProject = useCallback((projectId: string) => {
        setProjects(prev => prev.filter(p => p.project_id !== projectId));
        offsetRef.current = Math.max(0, offsetRef.current - 1);
    }, []);

    useEffect(() => {
        if (userId && !initializedRef.current) {
            fetchProjects(true);
            initializedRef.current = true;
        } else if (!userId) {
            setIsLoading(false);
        }
    }, [userId, fetchProjects]);

    useEffect(() => {
        if (!userId) {
            initializedRef.current = false;
            setProjects([]);
            offsetRef.current = 0;
            setHasMore(true);
        }
    }, [userId]);

    const contextValue = React.useMemo(() => ({
        projects,
        isLoading,
        isFetchingMore,
        error,
        hasMore,
        loadMore: () => fetchProjects(false),
        refresh: () => fetchProjects(true),
        addProject,
        removeProject
    }), [projects, isLoading, isFetchingMore, error, hasMore, fetchProjects, addProject, removeProject]);

    return (
        <TTSContext.Provider value={contextValue}>
            {children}
        </TTSContext.Provider>
    );
};

export const useTTSContext = () => {
    const context = useContext(TTSContext);
    if (context === undefined) {
        throw new Error('useTTSContext must be used within a TTSProvider');
    }
    return context;
};
