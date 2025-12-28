import { useState, useCallback } from 'react';
import { kokoroService } from '../services/kokoroService';
import { useKokoroContext } from '../context/KokoroContext';

export const useKokoro = (userId?: string) => {
    // Get data from context
    const {
        voices,
        isVoicesLoading,
        projects,
        isHistoryLoading,
        addProject,
        removeProject,
        refreshHistory
    } = useKokoroContext();

    const [isGenerating, setIsGenerating] = useState(false);
    const [status, setStatus] = useState<string>('');
    const [lastGeneratedAudioUrl, setLastGeneratedAudioUrl] = useState<string | null>(null);

    // Helper: Poll status (no auto-complete)
    const pollStatus = async (ttsId: string) => {
        const interval = setInterval(async () => {
            try {
                const statusRes = await kokoroService.checkStatus(ttsId);
                if (statusRes.status === 'completed' && statusRes.audio_url) {
                    clearInterval(interval);
                    setLastGeneratedAudioUrl(statusRes.audio_url);
                    setIsGenerating(false);
                    setStatus('');

                    // Add to context cache and refresh history
                    addProject(statusRes);
                    refreshHistory();
                } else if (statusRes.status === 'failed') {
                    clearInterval(interval);
                    throw new Error('Generation failed');
                }
            } catch (error) {
                clearInterval(interval);
                console.error('Polling error:', error);
                alert('Error checking status');
                setIsGenerating(false);
                setStatus('');
            }
        }, 1500);
    };

    // Generate Audio (no auto-complete)
    const generateAudio = async (text: string, voice: string, speed: number) => {
        setIsGenerating(true);
        setStatus('Initializing...');
        setLastGeneratedAudioUrl(null); // Reset previous

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
                setLastGeneratedAudioUrl(response.audio_url);
                setIsGenerating(false);
                setStatus('');

                // Add to context cache and refresh history
                addProject(response);
                refreshHistory();
            } else if (response.status === 'pending' || response.status === 'processing') {
                setStatus('Processing...');
                pollStatus(response.tts_id);
            } else {
                throw new Error('Generation failed');
            }
        } catch (error) {
            console.error('Kokoro generation error:', error);
            alert('Failed to generate audio');
            setIsGenerating(false);
            setStatus('');
        }
    };

    // Download audio and return File
    const downloadAudio = async (url: string): Promise<File> => {
        try {
            const response = await fetch(url);
            const blob = await response.blob();
            const filename = `kokoro_${Date.now()}.wav`;
            const file = new File([blob], filename, { type: 'audio/wav' });
            return file;
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
        refreshHistory
    };
};
