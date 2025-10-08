import { useState } from 'react';
import { sttService } from '@/services/sttService';

export const useSTT = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const generateSTT = async (formData) => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await sttService.createSTT(formData);
      setResult(response.data);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to generate STT';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const resetSTT = () => {
    setResult(null);
    setError(null);
    setIsLoading(false);
  };

  return {
    isLoading,
    error,
    result,
    generateSTT,
    resetSTT,
  };
};