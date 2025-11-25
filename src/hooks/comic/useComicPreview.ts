import { useState } from 'react';
import { comicPreviewService } from '@/services/comic/comicPreviewService';

export type PreviewStatus = 'idle' | 'generating' | 'success' | 'error';

interface UseComicPreviewReturn {
  generatePreview: (
    projectId: number,
    pageId: number,
    imageBlob: Blob
  ) => Promise<string | null>;
  isGenerating: boolean;
  previewStatus: PreviewStatus;
  previewError: string | null;
  previewUrl: string | null;
  resetPreview: () => void;
}

export const useComicPreview = (): UseComicPreviewReturn => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewStatus, setPreviewStatus] = useState<PreviewStatus>('idle');
  const [previewError, setPreviewError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const resetPreview = () => {
    setIsGenerating(false);
    setPreviewStatus('idle');
    setPreviewError(null);
    setPreviewUrl(null);
  };

  const generatePreview = async (
    projectId: number,
    pageId: number,
    imageBlob: Blob
  ): Promise<string | null> => {
    setIsGenerating(true);
    setPreviewStatus('generating');
    setPreviewError(null);
    setPreviewUrl(null);

    try {
      const response = await comicPreviewService.generatePreview(
        projectId,
        pageId,
        imageBlob
      );
      
      if (!response.preview_url) {
        throw new Error('Backend did not return preview URL');
      }

      setPreviewUrl(response.preview_url);
      setPreviewStatus('success');
      
      return response.preview_url;
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to generate preview';
      setPreviewError(errorMessage);
      setPreviewStatus('error');
      
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    generatePreview,
    isGenerating,
    previewStatus,
    previewError,
    previewUrl,
    resetPreview,
  };
};