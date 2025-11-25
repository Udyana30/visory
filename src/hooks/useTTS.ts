import { useState, useCallback } from 'react';
import { ttsService } from '../services/ttsService';
import type { TTSRequestData, TTSResult, TTSQueryParams } from '../types/tts';

interface UseTTSReturn {
  isLoading: boolean;
  error: string | null;
  results: TTSResult[] | null;
  generatedTTS: TTSResult | null;
  fetchTTS: (params?: TTSQueryParams) => Promise<TTSResult[]>;
  generateTTS: (data: TTSRequestData) => Promise<TTSResult>;
  deleteTTS: (id: number) => Promise<void>;
  resetTTS: () => void;
}

export const useTTS = (): UseTTSReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<TTSResult[] | null>(null);
  const [generatedTTS, setGeneratedTTS] = useState<TTSResult | null>(null);

  const fetchTTS = useCallback(async (params?: TTSQueryParams): Promise<TTSResult[]> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await ttsService.getTTS(params);
      const data = response.data || [];
      setResults(data);
      return data;
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || 'Failed to fetch TTS data';
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const generateTTS = useCallback(async (data: TTSRequestData): Promise<TTSResult> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await ttsService.createTTS(data);
      const result = response.data;
      setGeneratedTTS(result);
      return result;
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || 'Failed to generate TTS';
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteTTS = useCallback(async (id: number): Promise<void> => {
    try {
      await ttsService.deleteTTS(id);
      setResults((prev) => (prev ? prev.filter((item) => item.id !== id) : null));
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || 'Failed to delete TTS';
      setError(message);
      throw new Error(message);
    }
  }, []);

  const resetTTS = useCallback(() => {
    setResults(null);
    setGeneratedTTS(null);
    setError(null);
    setIsLoading(false);
  }, []);

  return {
    isLoading,
    error,
    results,
    generatedTTS,
    fetchTTS,
    generateTTS,
    deleteTTS,
    resetTTS,
  };
};