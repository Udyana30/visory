import { useState, useCallback } from 'react';
import { kokoroService } from '../../services/tts/kokoroService';
import { useKokoroContext } from '../../context/KokoroContext';
import { usePolling } from './usePolling';
import { KokoroGenerateResponse } from '../../types/domain/kokoro';

export const useKokoro = (userId?: string) => {
    // Get data from context
    const {
        voices,
        isVoicesLoading,
        projects,
        isHistoryLoading,
        addProject,
        removeProject,
        refreshHistory,
        text,
        setText,
        speed,
        setSpeed,
        selectedVoice,
        setSelectedVoice
    } = useKokoroContext();

    const [isGenerating, setIsGenerating] = useState(false);
    const [status, setStatus] = useState<string>('');
    const [lastGeneratedAudioUrl, setLastGeneratedAudioUrl] = useState<string | null>(null);

    // Setup polling
    const { startPolling, stopPolling } = usePolling<KokoroGenerateResponse>(
        kokoroService.checkStatus,
        (data) => data.status === 'completed',
        (data) => data.status === 'failed'
    );

    // Generate Audio
    const generateAudio = async (text: string, voice: string, speed: number) => {
        setIsGenerating(true);
        setStatus('Initializing...');
        setLastGeneratedAudioUrl(null);

        try {
            const selectedVoiceObj = voices.find(v => v.id === voice);
            const response = await kokoroService.generateAudio({
                text,
                voice,
                speed,
                lang_code: selectedVoiceObj?.langCode,
                user_id: userId || 'anonymous'
            });

            if (response.status === 'completed' && response.audio_url) {
                handleGenerationSuccess(response);
            } else if (response.status === 'pending' || response.status === 'processing') {
                setStatus('Processing...');
                startPolling(
                    response.tts_id,
                    (data) => {
                        if (data.status === 'completed' && data.audio_url) {
                            handleGenerationSuccess(data);
                        } else if (data.status === 'failed') {
                            handleGenerationError(new Error('Generation failed'));
                        }
                    },
                    (error) => handleGenerationError(error)
                );
            } else {
                throw new Error('Generation failed');
            }
        } catch (error) {
            handleGenerationError(error);
        }
    };

    const handleGenerationSuccess = (data: KokoroGenerateResponse) => {
        setLastGeneratedAudioUrl(data.audio_url);
        setIsGenerating(false);
        setStatus('');
        addProject(data);
        refreshHistory();
    };

    const handleGenerationError = (error: any) => {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error('Kokoro generation error:', errorMessage, error);
        alert(`Failed to generate audio: ${errorMessage}`);
        setIsGenerating(false);
        setStatus('');
        stopPolling();
    };

    // Download audio and return File
    const downloadAudio = async (url: string): Promise<File> => {
        try {
            const response = await fetch(url);
            const blob = await response.blob();
            const filename = `kokoro_${Date.now()}.wav`;
            return new File([blob], filename, { type: 'audio/wav' });
        } catch (error) {
            console.error('Download error:', error);
            throw new Error('Failed to download audio');
        }
    };

    // Reset generation state
    const resetGeneration = () => {
        setLastGeneratedAudioUrl(null);
        setIsGenerating(false);
        setStatus('');
        stopPolling();
    };

    const deleteProject = async (ttsId: string) => {
        try {
            // Optimistic update
            removeProject(ttsId);

            // API call
            await kokoroService.deleteProject(ttsId);
        } catch (error) {
            console.error('Failed to delete project:', error);
            alert('Failed to delete project');

            // Refresh to revert optimistic update
            refreshHistory();
        }
    };

    return {
        voices,
        isVoicesLoading,
        projects,
        isHistoryLoading,
        isGenerating,
        status,
        lastGeneratedAudioUrl,
        generateAudio,
        downloadAudio,
        resetGeneration,
        deleteProject,
        refreshHistory,
        text,
        setText,
        speed,
        setSpeed,
        selectedVoice,
        setSelectedVoice
    };
};
