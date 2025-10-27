import { useState, useCallback } from 'react';
import { sttService } from '../services/sttService';
import type { STTResponse } from '../types/stt';

interface UseSTTReturn {
  isLoading: boolean;
  error: string | null;
  result: STTResponse | null;
  generateSTT: (formData: FormData) => Promise<STTResponse>;
  resetSTT: () => void;
}

export const useSTT = (): UseSTTReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<STTResponse | null>(null);

  const generateSTT = useCallback(async (formData: FormData): Promise<STTResponse> => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await sttService.createSTT(formData);
      setResult(response);
      return response;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to generate STT';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const resetSTT = useCallback(() => {
    setResult(null);
    setError(null);
    setIsLoading(false);
  }, []);

  return {
    isLoading,
    error,
    result,
    generateSTT,
    resetSTT,
  };
};
