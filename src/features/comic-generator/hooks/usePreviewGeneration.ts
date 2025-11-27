import { useState, useCallback } from 'react';
import { ComicPage } from '../types/domain/editor';
import { renderPageToBlob } from '../utils/canvasRenderer';
import { previewService } from '../services/previewService';
import { ProcessStatus } from '../types/domain/review';

interface UsePreviewGenerationReturn {
  generateAllPreviews: (projectId: number, pages: ComicPage[]) => Promise<void>;
  status: ProcessStatus;
  progress: number;
  generatedPreviews: Record<number, string>;
}

export const usePreviewGeneration = (): UsePreviewGenerationReturn => {
  const [status, setStatus] = useState<ProcessStatus>('idle');
  const [progress, setProgress] = useState(0);
  const [generatedPreviews, setGeneratedPreviews] = useState<Record<number, string>>({});

  const generateAllPreviews = useCallback(async (projectId: number, pages: ComicPage[]) => {
    if (pages.length === 0) return;
    
    setStatus('loading');
    setProgress(0);

    try {
      const newPreviews: Record<number, string> = {};
      
      for (let i = 0; i < pages.length; i++) {
        const page = pages[i];
        const pageId = Number(page.id);
        
        if (isNaN(pageId)) continue;

        const blob = await renderPageToBlob(page);
        const url = await previewService.uploadPagePreview(projectId, pageId, blob);
        
        newPreviews[pageId] = url;
        setProgress(Math.round(((i + 1) / pages.length) * 100));
      }

      setGeneratedPreviews(prev => ({ ...prev, ...newPreviews }));
      setStatus('success');
    } catch (error) {
      console.error('Preview generation error:', error);
      setStatus('error');
    }
  }, []);

  return { generateAllPreviews, status, progress, generatedPreviews };
};