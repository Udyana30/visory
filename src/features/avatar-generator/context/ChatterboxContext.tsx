'use client';

import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import { chatterboxService } from '../services/tts/chatterboxService';
import { TTSProject, VoiceSample, SupportedLanguages, GeneratorSettings, DEFAULT_GENERATOR_SETTINGS, TTSGenerateRequest, MultilingualTTSRequest, VoiceConversionRequest } from '../types/domain/chatterbox';
import { useAuth } from '@/hooks/useAuth';

// Cache duration in milliseconds
const PROJECTS_CACHE_DURATION = 30 * 1000; // 30 seconds

// Module-level caches (persist across provider remounts)
const projectsCache = new Map<string, TTSProject[]>();
const lastProjectsFetchMap = new Map<string, number>();

const LIMIT = 50;

interface ChatterboxContextType {
    // Data
    projects: TTSProject[];
    isLoading: boolean;
    isFetchingMore: boolean;
    error: string | null;
    hasMore: boolean;
    loadMore: () => Promise<void>;
    refresh: () => Promise<void>;
    addProject: (project: TTSProject) => void;
    removeProject: (projectId: string) => void;

    // Form State
    mode: 'cloning' | 'multilingual' | 'voice-changer';
    setMode: (mode: 'cloning' | 'multilingual' | 'voice-changer') => void;
    text: string;
    setText: (text: string) => void;
    selectedVoice: VoiceSample | null;
    setSelectedVoice: (voice: VoiceSample | null) => void;
    sourceFile: File | null;
    setSourceFile: (file: File | null) => void;
    settings: GeneratorSettings;
    setSettings: (settings: GeneratorSettings) => void;
    updateSetting: <K extends keyof GeneratorSettings>(key: K, value: GeneratorSettings[K]) => void;

    // Generation State
    currentProject: TTSProject | null;
    isGenerating: boolean;
    generationError: string | null;
    generateCloning: (req: Omit<TTSGenerateRequest, 'user_id'>) => Promise<void>;
    generateMultilingual: (req: Omit<MultilingualTTSRequest, 'user_id'>) => Promise<void>;
    convertVoice: (req: Omit<VoiceConversionRequest, 'user_id'>) => Promise<void>;
    resetGeneration: () => void;

    // Languages
    languages: SupportedLanguages;
}

const ChatterboxContext = createContext<ChatterboxContextType | undefined>(undefined);

export const ChatterboxProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useAuth();
    const userId = user?.id ? String(user.id) : undefined;
    const cacheKey = userId || 'anonymous';

    // Data State
    const [projects, setProjects] = useState<TTSProject[]>(() => projectsCache.get(cacheKey) || []);
    const [isLoading, setIsLoading] = useState(false);
    const [isFetchingMore, setIsFetchingMore] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [hasMore, setHasMore] = useState(true);
    const [languages, setLanguages] = useState<SupportedLanguages>({});

    // Form State
    const [mode, setMode] = useState<'cloning' | 'multilingual' | 'voice-changer'>('cloning');
    const [text, setText] = useState('');
    const [selectedVoice, setSelectedVoice] = useState<VoiceSample | null>(null);
    const [sourceFile, setSourceFile] = useState<File | null>(null);
    const [settings, setSettings] = useState<GeneratorSettings>(DEFAULT_GENERATOR_SETTINGS);

    // Generation State
    const [currentProject, setCurrentProject] = useState<TTSProject | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [generationError, setGenerationError] = useState<string | null>(null);

    const offsetRef = useRef(0);
    const isFetchingRef = useRef(false);
    const pollingInterval = useRef<NodeJS.Timeout | null>(null);

    // Fetch languages once
    useEffect(() => {
        const fetchLangs = async () => {
            try {
                const langs = await chatterboxService.getLanguages();
                setLanguages(langs);
            } catch (err) {
                console.error("Failed to load languages", err);
            }
        };
        fetchLangs();
    }, []);

    const fetchProjects = useCallback(async (reset = false, force = false) => {
        if (!userId) {
            setIsLoading(false);
            return;
        }
        if (isFetchingRef.current) return;
        if (!reset && !hasMore) return;

        // Check cache validity if not forcing and resetting (initial load)
        if (reset && !force) {
            const lastFetch = lastProjectsFetchMap.get(cacheKey);
            const now = Date.now();
            if (lastFetch && (now - lastFetch) < PROJECTS_CACHE_DURATION && projectsCache.has(cacheKey)) {
                console.log('[ChatterboxContext] Using cached projects');
                setProjects(projectsCache.get(cacheKey)!);
                offsetRef.current = projectsCache.get(cacheKey)!.length;
                return;
            }
        }

        isFetchingRef.current = true;

        if (reset) {
            setIsLoading(true);
        } else {
            setIsFetchingMore(true);
        }

        setError(null);

        try {
            const currentOffset = reset ? 0 : offsetRef.current;
            const data = await chatterboxService.getProjects(userId, undefined, LIMIT, currentOffset);

            if (data.length < LIMIT) {
                setHasMore(false);
            } else {
                setHasMore(true);
            }

            setProjects(prev => {
                const currentProjects = reset ? [] : prev;

                // Use Map to ensure uniqueness by project_id
                const projectMap = new Map<string, TTSProject>();

                // Add existing projects to map
                currentProjects.forEach(p => projectMap.set(p.project_id, p));

                // Add/Update with new projects
                data.forEach(p => projectMap.set(p.project_id, p));

                // Convert back to array and sort
                const combined = Array.from(projectMap.values());
                const sorted = combined.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

                projectsCache.set(cacheKey, sorted);
                lastProjectsFetchMap.set(cacheKey, Date.now());

                return sorted;
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
    }, [userId, hasMore, cacheKey]);

    // Initial fetch
    useEffect(() => {
        if (userId) {
            fetchProjects(true, false);
        }
    }, [userId, fetchProjects]);

    const loadMore = async () => {
        await fetchProjects(false);
    };

    const refresh = async () => {
        offsetRef.current = 0;
        setHasMore(true);
        await fetchProjects(true, true);
    };

    const addProject = useCallback((project: TTSProject) => {
        setProjects(prev => {
            // Remove existing project with same ID if it exists (to update it)
            const filtered = prev.filter(p => p.project_id !== project.project_id);
            const newProjects = [project, ...filtered];
            projectsCache.set(cacheKey, newProjects);
            return newProjects;
        });
    }, [cacheKey]);

    const removeProject = useCallback(async (projectId: string) => {
        try {
            await chatterboxService.deleteProject(projectId);
            setProjects(prev => {
                const newProjects = prev.filter(p => p.project_id !== projectId);
                projectsCache.set(cacheKey, newProjects);
                return newProjects;
            });
        } catch (err: any) {
            console.error("Failed to delete project:", err);
            setError(err.message || 'Failed to delete project');
        }
    }, [cacheKey]);

    const updateSetting = <K extends keyof GeneratorSettings>(key: K, value: GeneratorSettings[K]) => {
        setSettings(prev => ({ ...prev, [key]: value }));
    };

    // Polling Logic
    const stopPolling = useCallback(() => {
        if (pollingInterval.current) {
            clearInterval(pollingInterval.current);
            pollingInterval.current = null;
        }
    }, []);

    const startPolling = useCallback((projectId: string) => {
        stopPolling();

        const poll = async () => {
            try {
                const data = await chatterboxService.getProjectStatus(projectId);
                setCurrentProject(data);

                if (data.status === 'completed') {
                    setIsGenerating(false);
                    addProject(data);
                    stopPolling();
                } else if (data.status === 'failed') {
                    setIsGenerating(false);
                    setGenerationError(data.error_message || "Generation failed");
                    stopPolling();
                }
            } catch (err: any) {
                console.error("Polling error:", err);
                setIsGenerating(false);
                setGenerationError(err.message || "Polling failed");
                stopPolling();
            }
        };

        pollingInterval.current = setInterval(poll, 2000);
    }, [addProject, stopPolling]);

    // Cleanup polling on unmount
    useEffect(() => {
        return () => stopPolling();
    }, [stopPolling]);

    const handleGenerationStart = (initialProject: TTSProject) => {
        setCurrentProject(initialProject);

        if (initialProject.status === 'completed' || initialProject.status === 'failed') {
            setIsGenerating(false);
            if (initialProject.status === 'failed') {
                setGenerationError(initialProject.error_message || "Generation failed");
            }
            addProject(initialProject);
        } else {
            startPolling(initialProject.project_id);
        }
    };

    const generateCloning = async (req: Omit<TTSGenerateRequest, 'user_id'>) => {
        if (!userId) {
            setGenerationError("User ID required");
            return;
        }
        setIsGenerating(true);
        setGenerationError(null);

        try {
            const result = await chatterboxService.generateTTS({ ...req, user_id: userId });
            handleGenerationStart(result);
        } catch (err: any) {
            setIsGenerating(false);
            setGenerationError(err.response?.data?.detail || err.message || "Failed to start generation");
        }
    };

    const generateMultilingual = async (req: Omit<MultilingualTTSRequest, 'user_id'>) => {
        if (!userId) {
            setGenerationError("User ID required");
            return;
        }
        setIsGenerating(true);
        setGenerationError(null);

        try {
            const result = await chatterboxService.generateMultilingualTTS({ ...req, user_id: userId });
            handleGenerationStart(result);
        } catch (err: any) {
            setIsGenerating(false);
            setGenerationError(err.response?.data?.detail || err.message || "Failed to start generation");
        }
    };

    const convertVoice = async (req: Omit<VoiceConversionRequest, 'user_id'>) => {
        if (!userId) {
            setGenerationError("User ID required");
            return;
        }
        setIsGenerating(true);
        setGenerationError(null);

        try {
            const result = await chatterboxService.convertVoice({ ...req, user_id: userId });
            handleGenerationStart(result);
        } catch (err: any) {
            setIsGenerating(false);
            setGenerationError(err.response?.data?.detail || err.message || "Failed to start conversion");
        }
    };

    const resetGeneration = () => {
        setCurrentProject(null);
        setGenerationError(null);
        setIsGenerating(false);
        stopPolling();
    };

    const contextValue: ChatterboxContextType = {
        projects,
        isLoading,
        isFetchingMore,
        error,
        hasMore,
        loadMore,
        refresh,
        addProject,
        removeProject,

        mode,
        setMode,
        text,
        setText,
        selectedVoice,
        setSelectedVoice,
        sourceFile,
        setSourceFile,
        settings,
        setSettings,
        updateSetting,

        currentProject,
        isGenerating,
        generationError,
        generateCloning,
        generateMultilingual,
        convertVoice,
        resetGeneration,

        languages
    };

    return (
        <ChatterboxContext.Provider value={contextValue}>
            {children}
        </ChatterboxContext.Provider>
    );
};

export const useChatterboxContext = () => {
    const context = useContext(ChatterboxContext);
    if (context === undefined) {
        throw new Error('useChatterboxContext must be used within a ChatterboxProvider');
    }
    return context;
};
