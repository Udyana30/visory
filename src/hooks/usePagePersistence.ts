import { useState, useCallback, useEffect, useRef } from 'react';
import { ComicPage } from '@/types/editor';
import { comicPageService } from '@/services/comicPageService';
import { serializePageToAPI, deserializePageFromAPI } from '@/lib/pageSerializer';

interface UsePagePersistenceProps {
  projectId: number | null;
  currentPageIndex: number;
  pages: ComicPage[];
}

interface UsePagePersistenceReturn {
  savePage: (pageIndex?: number) => Promise<void>;
  loadPage: (pageIndex: number) => Promise<ComicPage | undefined>;
  isSaving: boolean;
  isLoading: boolean;
  lastSaved: Date | null;
  saveError: string | null;
}

export const usePagePersistence = ({
  projectId,
  currentPageIndex,
  pages,
}: UsePagePersistenceProps): UsePagePersistenceReturn => {
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const lastSavedStateRef = useRef<string>('');

  const savePage = useCallback(
    async (pageIndex?: number) => {
      if (!projectId) return;

      const targetPageIndex = pageIndex ?? currentPageIndex;
      const targetPage = pages[targetPageIndex];

      if (!targetPage) return;

      const currentState = JSON.stringify(targetPage);
      if (currentState === lastSavedStateRef.current) {
        return;
      }

      setIsSaving(true);
      setSaveError(null);

      try {
        const elements = serializePageToAPI(targetPage);
        const pageId = parseInt(targetPage.id.split('-')[1]) || targetPageIndex + 1;

        await comicPageService.savePage(projectId, pageId, { elements });

        lastSavedStateRef.current = currentState;
        setLastSaved(new Date());
      } catch (error: any) {
        setSaveError(error.message || 'Failed to save page');
        console.error('Save page error:', error);
      } finally {
        setIsSaving(false);
      }
    },
    [projectId, currentPageIndex, pages]
  );

  const loadPage = useCallback(
    async (pageIndex: number): Promise<ComicPage | undefined> => {
      if (!projectId) return undefined;

      const targetPage = pages[pageIndex];
      if (!targetPage) return undefined;

      setIsLoading(true);
      setSaveError(null);

      try {
        const pageId = parseInt(targetPage.id.split('-')[1]) || pageIndex + 1;
        const data = await comicPageService.loadPage(projectId, pageId);

        if (data.elements && data.elements.length > 0) {
          return deserializePageFromAPI(data.elements, targetPage.id, targetPage.layout);
        }
      } catch (error: any) {
        if (error.status !== 404) {
          setSaveError(error.message || 'Failed to load page');
          console.error('Load page error:', error);
        }
      } finally {
        setIsLoading(false);
      }

      return undefined;
    },
    [projectId, pages]
  );

  useEffect(() => {
    return () => {
      lastSavedStateRef.current = '';
    };
  }, []);

  return {
    savePage,
    loadPage,
    isSaving,
    isLoading,
    lastSaved,
    saveError,
  };
};