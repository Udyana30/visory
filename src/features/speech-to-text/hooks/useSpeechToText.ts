import { useState, useEffect, useCallback } from 'react';
import { sttService } from '@/services/sttService';
import { STTResult, STTHistoryItem } from '@/types/stt';

export const useSpeechToText = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<STTResult | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [history, setHistory] = useState<STTHistoryItem[]>([]);
    const [isLoadingHistory, setIsLoadingHistory] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const fetchHistory = useCallback(async () => {
        setIsLoadingHistory(true);
        try {
            const response = await sttService.getSTT({
                order_by: 'created_at',
                order_dir: 'desc',
                limit: 50,
            });
            setHistory(response.data || []);
        } catch (err) {
            console.error('Failed to fetch history:', err);
        } finally {
            setIsLoadingHistory(false);
        }
    }, []);

    useEffect(() => {
        fetchHistory();
    }, [fetchHistory]);

    const handleGenerate = useCallback(async (payload: FormData) => {
        setIsLoading(true);
        setResult(null);
        setError(null);

        try {
            const response = await sttService.createSTT(payload);

            setTimeout(() => {
                setResult(response.data);
                setShowSuccessModal(true);
            }, 100);

            await fetchHistory();
        } catch (err: any) {
            setError(err.message || 'Failed to transcribe audio. Please try again.');
        } finally {
            setIsLoading(false);
        }
    }, [fetchHistory]);

    const handlePlayFromHistory = useCallback((item: STTHistoryItem) => {
        setResult(item);
        setError(null);
    }, []);

    const handleDeleteFromHistory = useCallback(async (id: number) => {
        if (!confirm('Are you sure you want to delete this transcription?')) return;

        try {
            await sttService.deleteSTT(id);
            setHistory((prev) => prev.filter((item) => item.id !== id));

            if (result?.id === id) {
                setResult(null);
            }
        } catch (err) {
            console.error('Failed to delete:', err);
            setError('Failed to delete item. Please try again.');
        }
    }, [result?.id]);

    const handleCloseSuccessModal = useCallback(() => {
        setShowSuccessModal(false);
    }, []);

    return {
        isLoading,
        result,
        error,
        history,
        isLoadingHistory,
        showSuccessModal,
        handleGenerate,
        handlePlayFromHistory,
        handleDeleteFromHistory,
        handleCloseSuccessModal,
    };
};
