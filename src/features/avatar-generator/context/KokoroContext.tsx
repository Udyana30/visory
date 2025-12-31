'use client';

import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import { kokoroService } from '../services/tts/kokoroService';
import { KokoroVoice, KokoroGenerateResponse } from '../types/domain/kokoro';
import { useAuth } from '@/hooks/useAuth';

// Cache duration in milliseconds
const VOICES_CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const HISTORY_CACHE_DURATION = 30 * 1000; // 30 seconds

// Module-level caches (persist across provider remounts)
const initializationMap = new Map<string, boolean>();
const voicesCache = new Map<string, KokoroVoice[]>();
const projectsCache = new Map<string, KokoroGenerateResponse[]>();
const lastVoicesFetchMap = new Map<string, number>();
const lastHistoryFetchMap = new Map<string, number>();

interface KokoroContextType {
    // Voices
    voices: KokoroVoice[];
    isVoicesLoading: boolean;
    voicesError: string | null;
    fetchVoices: (force?: boolean) => Promise<void>;

    // History/Projects
    projects: KokoroGenerateResponse[];
    isHistoryLoading: boolean;
    historyError: string | null;
    fetchHistory: (force?: boolean) => Promise<void>;
    refreshHistory: () => Promise<void>;

    // Mutations
    addProject: (project: KokoroGenerateResponse) => void;
    removeProject: (ttsId: string) => void;
}

const KokoroContext = createContext<KokoroContextType | undefined>(undefined);

export const KokoroProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useAuth();
    const userId = user?.id ? String(user.id) : undefined;
    const cacheKey = userId || 'anonymous';

    // Initialize state from module-level cache
    const [voices, setVoices] = useState<KokoroVoice[]>(() => voicesCache.get(cacheKey) || []);
    const [isVoicesLoading, setIsVoicesLoading] = useState(false);
    const [voicesError, setVoicesError] = useState<string | null>(null);

    // Initialize history state from module-level cache
    const [projects, setProjects] = useState<KokoroGenerateResponse[]>(() => projectsCache.get(cacheKey) || []);
    const [isHistoryLoading, setIsHistoryLoading] = useState(false);
    const [historyError, setHistoryError] = useState<string | null>(null);

    // Fetching flags (component-level is fine)
    const isFetchingVoicesRef = useRef(false);
    const isFetchingHistoryRef = useRef(false);

    // Utility: Clean voice name (remove gender suffix)
    const cleanVoiceName = (name: string): string => {
        // Remove patterns like (Female), (Male), etc.
        return name.replace(/\s*\([^)]*\)\s*$/g, '').trim();
    };

    // Fetch Voices with caching
    const fetchVoices = useCallback(async (force = false) => {
        // Check if we need to fetch
        const now = Date.now();
        const lastFetch = lastVoicesFetchMap.get(cacheKey);
        const shouldFetch = force ||
            !lastFetch ||
            (now - lastFetch) > VOICES_CACHE_DURATION;

        if (!shouldFetch) {
            console.log('[KokoroContext] Using cached voices');
            return;
        }

        if (isFetchingVoicesRef.current) {
            console.log('[KokoroContext] Already fetching voices');
            return;
        }

        isFetchingVoicesRef.current = true;
        setIsVoicesLoading(true);
        setVoicesError(null);

        try {
            console.log('[KokoroContext] Fetching voices from API');
            const data = await kokoroService.getVoices();

            // Clean voice names
            const cleanedVoices = data.map(voice => ({
                ...voice,
                name: cleanVoiceName(voice.name)
            }));

            setVoices(cleanedVoices);
            voicesCache.set(cacheKey, cleanedVoices); // Sync to cache
            lastVoicesFetchMap.set(cacheKey, Date.now());
        } catch (error) {
            console.error('[KokoroContext] Failed to fetch voices:', error);
            setVoicesError('Failed to load voices');
        } finally {
            setIsVoicesLoading(false);
            isFetchingVoicesRef.current = false;
        }
    }, [cacheKey]);

    // Fetch History with caching
    const fetchHistory = useCallback(async (force = false) => {
        if (!userId) {
            console.log('[KokoroContext] No userId, skipping history fetch');
            return;
        }

        // Check if we need to fetch
        const now = Date.now();
        const lastFetch = lastHistoryFetchMap.get(cacheKey);
        const shouldFetch = force ||
            !lastFetch ||
            (now - lastFetch) > HISTORY_CACHE_DURATION;

        if (!shouldFetch) {
            console.log('[KokoroContext] Using cached history');
            return;
        }

        if (isFetchingHistoryRef.current) {
            console.log('[KokoroContext] Already fetching history');
            return;
        }

        isFetchingHistoryRef.current = true;
        setIsHistoryLoading(true);
        setHistoryError(null);

        try {
            console.log('[KokoroContext] Fetching history from API');
            const data = await kokoroService.getProjects(userId);
            const sorted = data.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
            setProjects(sorted);
            projectsCache.set(cacheKey, sorted); // Sync to cache
            lastHistoryFetchMap.set(cacheKey, Date.now());
        } catch (error) {
            console.error('[KokoroContext] Failed to fetch history:', error);
            setHistoryError('Failed to load history');
        } finally {
            setIsHistoryLoading(false);
            isFetchingHistoryRef.current = false;
        }
    }, [userId, cacheKey]);

    // Force refresh history (ignores cache)
    const refreshHistory = useCallback(async () => {
        console.log('[KokoroContext] Force refreshing history');
        await fetchHistory(true);
    }, [fetchHistory]);

    // Add project to cache (optimistic update)
    const addProject = useCallback((project: KokoroGenerateResponse) => {
        console.log('[KokoroContext] Adding project to cache:', project.tts_id);
        setProjects(prev => {
            const updated = [project, ...prev].sort((a, b) =>
                new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
            );
            projectsCache.set(cacheKey, updated); // Sync to cache
            return updated;
        });
    }, [cacheKey]);

    // Remove project from cache (optimistic update)
    const removeProject = useCallback((ttsId: string) => {
        console.log('[KokoroContext] Removing project from cache:', ttsId);
        setProjects(prev => {
            const updated = prev.filter(p => p.tts_id !== ttsId);
            projectsCache.set(cacheKey, updated); // Sync to cache
            return updated;
        });
    }, [cacheKey]);

    // Initial fetch on mount (only once per userId)
    useEffect(() => {
        const initKey = userId || 'anonymous';
        const isInitialized = initializationMap.get(initKey);

        if (!isInitialized) {
            console.log('[KokoroContext] Initial fetch on mount for user:', initKey);
            fetchVoices();
            if (userId) {
                fetchHistory();
            }
            initializationMap.set(initKey, true);
        } else {
            console.log('[KokoroContext] Already initialized, skipping fetch');
        }
    }, [fetchVoices, fetchHistory, userId]);

    // Reset cache and initialization when userId changes to null (logout)
    useEffect(() => {
        if (!userId) {
            console.log('[KokoroContext] User logged out, clearing all caches');
            setProjects([]);
            setVoices([]);
            // Clear all module-level caches
            voicesCache.clear();
            projectsCache.clear();
            lastVoicesFetchMap.clear();
            lastHistoryFetchMap.clear();
            initializationMap.clear();
        }
    }, [userId]);

    const contextValue = React.useMemo(() => ({
        voices,
        isVoicesLoading,
        voicesError,
        fetchVoices,
        projects,
        isHistoryLoading,
        historyError,
        fetchHistory,
        refreshHistory,
        addProject,
        removeProject
    }), [
        voices,
        isVoicesLoading,
        voicesError,
        fetchVoices,
        projects,
        isHistoryLoading,
        historyError,
        fetchHistory,
        refreshHistory,
        addProject,
        removeProject
    ]);

    return (
        <KokoroContext.Provider value={contextValue}>
            {children}
        </KokoroContext.Provider>
    );
};

export const useKokoroContext = () => {
    const context = useContext(KokoroContext);
    if (context === undefined) {
        throw new Error('useKokoroContext must be used within a KokoroProvider');
    }
    return context;
};
