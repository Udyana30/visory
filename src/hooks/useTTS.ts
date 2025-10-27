import { useState, useCallback } from 'react';
import { ttsService } from '../services/ttsService';
import type { TTSRequestData, TTSResponse, TTSQueryParams } from '../types/tts';

interface UseTTSReturn {
  isLoading: boolean;
  error: string | null;
  results: TTSResponse[] | null;
  generatedTTS: TTSResponse | null;
  fetchTTS: (params?: TTSQueryParams) => Promise<TTSResponse[]>;
  generateTTS: (data: TTSRequestData) => Promise<TTSResponse>;
  resetTTS: () => void;
}

export const useTTS = (): UseTTSReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<TTSResponse[] | null>(null);
  const [generatedTTS, setGeneratedTTS] = useState<TTSResponse | null>(null);

  const fetchTTS = useCallback(async (params?: TTSQueryParams): Promise<TTSResponse[]> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await ttsService.getTTS(params);
      setResults(response);
      return response;
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || 'Failed to fetch TTS data';
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const generateTTS = useCallback(async (data: TTSRequestData): Promise<TTSResponse> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await ttsService.createTTS(data);
      setGeneratedTTS(response);
      return response;
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || 'Failed to generate TTS';
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
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
    resetTTS,
  };
};
