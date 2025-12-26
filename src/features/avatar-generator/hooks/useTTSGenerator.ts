import { useState, useRef, useEffect, useCallback } from 'react';
import { chatterboxService } from '../services/chatterboxService';
import { TTSProject, TTSGenerateRequest, MultilingualTTSRequest, SupportedLanguages, VoiceConversionRequest } from '../types/domain/chatterbox';
import { useTTSContext } from '../context/TTSContext';

const POLLING_INTERVAL = 5000;
const MAX_ATTEMPTS = 60;

export const useTTSGenerator = (userId?: string) => {
    const {
        projects,
        loadMore,
        hasMore,
        addProject,
        removeProject,
        isLoading: isHistoryInitialLoading,
        isFetchingMore: isHistoryFetchingMore
    } = useTTSContext();

    const [project, setProject] = useState<TTSProject | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [languages, setLanguages] = useState<SupportedLanguages>({});

    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const attemptsRef = useRef(0);

    const fetchLanguages = useCallback(async () => {
        try {
            const langs = await chatterboxService.getLanguages();
            setLanguages(langs);
        } catch (err) {
            console.error("Failed to load languages", err);
        }
    }, []);

    useEffect(() => {
        fetchLanguages();
    }, [fetchLanguages]);

    const pollStatus = useCallback(async (projectId: string) => {
        if (attemptsRef.current >= MAX_ATTEMPTS) {
            setIsGenerating(false);
            setError("Generation timed out");
            return;
        }

        try {
            const status = await chatterboxService.getProjectStatus(projectId);
            setProject(status);

            if (status.status === 'completed' || status.status === 'failed') {
                setIsGenerating(false);
                if (status.status === 'failed') {
                    setError(status.error_message || "Generation failed");
                }
                addProject(status);
            } else {
                attemptsRef.current++;
                timeoutRef.current = setTimeout(() => pollStatus(projectId), POLLING_INTERVAL);
            }
        } catch (err) {
            console.error("Polling failed", err);
            setIsGenerating(false);
            setError("Failed to check status");
        }
    }, [addProject]);

    const generateCloning = async (req: Omit<TTSGenerateRequest, 'user_id'>) => {
        if (!userId) {
            setError("User ID required");
            return;
        }
        setIsGenerating(true);
        setError(null);
        attemptsRef.current = 0;

        try {
            const result = await chatterboxService.generateTTS({ ...req, user_id: userId });
            setProject(result);
            pollStatus(result.project_id);
        } catch (err: any) {
            setIsGenerating(false);
            setError(err.response?.data?.detail || err.message || "Failed to start generation");
        }
    };

    const generateMultilingual = async (req: Omit<MultilingualTTSRequest, 'user_id'>) => {
        if (!userId) {
            setError("User ID required");
            return;
        }
        setIsGenerating(true);
        setError(null);
        attemptsRef.current = 0;

        try {
            const result = await chatterboxService.generateMultilingualTTS({ ...req, user_id: userId });
            setProject(result);
            pollStatus(result.project_id);
        } catch (err: any) {
            setIsGenerating(false);
            setError(err.response?.data?.detail || err.message || "Failed to start generation");
        }
    };

    const convertVoice = async (req: Omit<VoiceConversionRequest, 'user_id'>) => {
        if (!userId) {
            setError("User ID required");
            return;
        }
        setIsGenerating(true);
        setError(null);
        attemptsRef.current = 0;

        try {
            const result = await chatterboxService.convertVoice({ ...req, user_id: userId });
            setProject(result);
            pollStatus(result.project_id);
        } catch (err: any) {
            setIsGenerating(false);
            setError(err.response?.data?.detail || err.message || "Failed to start conversion");
        }
    };

    const deleteProject = async (projectId: string) => {
        try {
            await chatterboxService.deleteProject(projectId);
            removeProject(projectId);
        } catch (err: any) {
            console.error("Failed to delete project", err);
            // Optionally set error state here if you want to show it in the UI
        }
    };

    useEffect(() => {
        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, []);

    return {
        project,
        projects,
        isGenerating,
        isHistoryLoading: isHistoryInitialLoading,
        isHistoryFetchingMore,
        hasMoreHistory: hasMore,
        loadMoreHistory: loadMore,
        error,
        languages,
        generateCloning,
        generateMultilingual,
        convertVoice,
        deleteProject,
        reset: () => {
            setProject(null);
            setError(null);
            setIsGenerating(false);
        }
    };
};
