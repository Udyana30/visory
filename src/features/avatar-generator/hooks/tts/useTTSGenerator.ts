import { useState, useEffect, useCallback } from 'react';
import { chatterboxService } from '../../services/tts/chatterboxService';
import { TTSProject, TTSGenerateRequest, MultilingualTTSRequest, SupportedLanguages, VoiceConversionRequest } from '../../types/domain/chatterbox';
import { useTTSContext } from '../../context/TTSContext';
import { usePolling } from './usePolling';

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

    // Setup polling
    const { startPolling, stopPolling } = usePolling<TTSProject>(
        chatterboxService.getProjectStatus,
        (data) => data.status === 'completed',
        (data) => data.status === 'failed'
    );

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

    const handleGenerationStart = (initialProject: TTSProject) => {
        setProject(initialProject);

        if (initialProject.status === 'completed' || initialProject.status === 'failed') {
            setIsGenerating(false);
            if (initialProject.status === 'failed') {
                setError(initialProject.error_message || "Generation failed");
            }
            addProject(initialProject);
        } else {
            startPolling(
                initialProject.project_id,
                (data) => {
                    setProject(data);
                    if (data.status === 'completed') {
                        setIsGenerating(false);
                        addProject(data);
                    } else if (data.status === 'failed') {
                        setIsGenerating(false);
                        setError(data.error_message || "Generation failed");
                    }
                },
                (err) => {
                    setIsGenerating(false);
                    setError(err.message || "Polling failed");
                }
            );
        }
    };

    const generateCloning = async (req: Omit<TTSGenerateRequest, 'user_id'>) => {
        if (!userId) {
            setError("User ID required");
            return;
        }
        setIsGenerating(true);
        setError(null);

        try {
            const result = await chatterboxService.generateTTS({ ...req, user_id: userId });
            handleGenerationStart(result);
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

        try {
            const result = await chatterboxService.generateMultilingualTTS({ ...req, user_id: userId });
            handleGenerationStart(result);
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

        try {
            const result = await chatterboxService.convertVoice({ ...req, user_id: userId });
            handleGenerationStart(result);
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

    const reset = () => {
        setProject(null);
        setError(null);
        setIsGenerating(false);
        stopPolling();
    };

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
        reset
    };
};
