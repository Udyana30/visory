import { useState, useCallback, useEffect, useRef } from 'react';
import { ComicPage } from '../types/domain/editor';
import { renderPageToBlob } from '../utils/canvasRenderer';
import { previewService } from '../services/previewService';
import { ProcessStatus } from '../types/domain/review';

interface UsePreviewGenerationReturn {
  generatePreviews: (
    projectId: number, 
    pages: ComicPage[], 
    dimensions: { width: number, height: number },
    dirtyIds: Set<string>
  ) => Promise<Record<string, string>>;
  status: ProcessStatus;
  progress: number;
  renderedPreviews: Record<string, string>;
  isProcessing: boolean;
}

const CONCURRENCY_LIMIT = 2;

export const usePreviewGeneration = (): UsePreviewGenerationReturn => {
  const [status, setStatus] = useState<ProcessStatus>('idle');
  const [progress, setProgress] = useState(0);
  
  // Stores Blob URLs for immediate display
  const [renderedPreviews, setRenderedPreviews] = useState<Record<string, string>>({});
  
  const processingRef = useRef(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Cleanup blobs on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      Object.values(renderedPreviews).forEach(url => {
        if (url.startsWith('blob:')) URL.revokeObjectURL(url);
      });
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []); // Empty dependency ensures cleanup only happens on unmount

  const generatePreviews = useCallback(async (
    projectId: number, 
    pages: ComicPage[], 
    dimensions: { width: number, height: number },
    dirtyIds: Set<string>
  ): Promise<Record<string, string>> => {
    
    if (processingRef.current) return {};

    const pagesToProcess = pages.filter(p => dirtyIds.has(p.id));

    if (pagesToProcess.length === 0) {
      setStatus('idle');
      setProgress(0);
      return {};
    }
    
    processingRef.current = true;
    abortControllerRef.current = new AbortController();
    setStatus('loading');
    setProgress(0);

    const serverUrls: Record<string, string> = {};
    let completedCount = 0;
    let hasErrors = false;

    try {
      for (let i = 0; i < pagesToProcess.length; i += CONCURRENCY_LIMIT) {
        if (abortControllerRef.current.signal.aborted) {
          throw new Error('Process aborted');
        }

        const chunk = pagesToProcess.slice(i, i + CONCURRENCY_LIMIT);
        
        await Promise.all(chunk.map(async (page) => {
          try {
            // 1. Render to Blob (Client Side)
            const blob = await renderPageToBlob(page, dimensions.width, dimensions.height);
            const localUrl = URL.createObjectURL(blob);
            
            // 2. Update local state for immediate feedback
            setRenderedPreviews(prev => ({ ...prev, [page.id]: localUrl }));

            // 3. Upload to Server
            const uploadedUrl = await previewService.uploadPagePreview(
              projectId, 
              Number(page.id), 
              blob
            );
            
            // 4. Collect Server URL
            serverUrls[page.id] = uploadedUrl;

          } catch (err) {
            console.error(`Failed to process page ${page.id}:`, err);
            hasErrors = true;
          } finally {
            completedCount++;
            setProgress(Math.round((completedCount / pagesToProcess.length) * 100));
          }
        }));
      }

      setStatus(hasErrors ? 'error' : 'success');
      return serverUrls;

    } catch (error) {
      console.error('Preview generation failed:', error);
      setStatus('error');
      return {};
    } finally {
      processingRef.current = false;
      abortControllerRef.current = null;
    }
  }, []);

  return { 
    generatePreviews, 
    status, 
    progress, 
    renderedPreviews,
    isProcessing: processingRef.current
  };
};