import { useState, useCallback, useRef } from 'react';
import { ComicPage } from '@/app/(main)/tools/comic-generator/types/editor';
import { comicPageService } from '@/services/comic/comicPageService';
import { serializePageToAPI } from '@/app/(main)/tools/comic-generator/lib/pageSerializer';

interface UsePagePersistenceProps {
  projectId: number | null;
  pages: ComicPage[];
}

interface UsePagePersistenceReturn {
  saveCurrentPage: (pageIndex: number, isAutoSave?: boolean) => Promise<void>;
  saveDirtyPages: (isAutoSave?: boolean) => Promise<void>;
  saveAllPages: () => Promise<void>;
  markPageAsDirty: (pageIndex: number) => void;
  clearDirtyPages: () => void;
  isSaving: boolean;
  isAutoSaving: boolean;
  lastSaved: Date | null;
  saveError: string | null;
  hasDirtyPages: boolean;
}

export const usePagePersistence = ({
  projectId,
  pages,
}: UsePagePersistenceProps): UsePagePersistenceReturn => {
  const [isSaving, setIsSaving] = useState(false);
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  
  const dirtyPagesRef = useRef<Set<number>>(new Set());
  const lastSavedStateRef = useRef<Map<number, string>>(new Map());

  const markPageAsDirty = useCallback((pageIndex: number) => {
    dirtyPagesRef.current.add(pageIndex);
  }, []);

  const clearDirtyPages = useCallback(() => {
    dirtyPagesRef.current.clear();
  }, []);

  const saveCurrentPage = useCallback(
    async (pageIndex: number, isAutoSave: boolean = false) => {
      if (!projectId) return;

      const targetPage = pages[pageIndex];
      if (!targetPage || !targetPage.id || targetPage.id === 0) {
        return;
      }

      const currentState = JSON.stringify(targetPage);
      const lastState = lastSavedStateRef.current.get(targetPage.id);
      
      if (currentState === lastState) {
        dirtyPagesRef.current.delete(pageIndex);
        return;
      }

      if (isAutoSave) {
        setIsAutoSaving(true);
      } else {
        setIsSaving(true);
      }
      setSaveError(null);

      try {
        const elements = serializePageToAPI(targetPage);
        await comicPageService.savePage(projectId, targetPage.id, { elements });

        lastSavedStateRef.current.set(targetPage.id, currentState);
        dirtyPagesRef.current.delete(pageIndex);
        setLastSaved(new Date());
      } catch (error: any) {
        setSaveError(error.message || 'Failed to save page');
        console.error('Save page error:', error);
      } finally {
        if (isAutoSave) {
          setIsAutoSaving(false);
        } else {
          setIsSaving(false);
        }
      }
    },
    [projectId, pages]
  );

  const saveDirtyPages = useCallback(
    async (isAutoSave: boolean = false) => {
      if (!projectId || dirtyPagesRef.current.size === 0) return;

      const dirtyIndices = Array.from(dirtyPagesRef.current);
      
      if (isAutoSave) {
        setIsAutoSaving(true);
      } else {
        setIsSaving(true);
      }
      setSaveError(null);

      try {
        for (const pageIndex of dirtyIndices) {
          const targetPage = pages[pageIndex];
          if (!targetPage || !targetPage.id || targetPage.id === 0) continue;

          const currentState = JSON.stringify(targetPage);
          const lastState = lastSavedStateRef.current.get(targetPage.id);
          
          if (currentState === lastState) {
            dirtyPagesRef.current.delete(pageIndex);
            continue;
          }

          const elements = serializePageToAPI(targetPage);
          await comicPageService.savePage(projectId, targetPage.id, { elements });

          lastSavedStateRef.current.set(targetPage.id, currentState);
          dirtyPagesRef.current.delete(pageIndex);
        }
        
        setLastSaved(new Date());
      } catch (error: any) {
        setSaveError(error.message || 'Failed to save pages');
        console.error('Save pages error:', error);
      } finally {
        if (isAutoSave) {
          setIsAutoSaving(false);
        } else {
          setIsSaving(false);
        }
      }
    },
    [projectId, pages]
  );

  const saveAllPages = useCallback(async () => {
    if (!projectId) return;

    setIsSaving(true);
    setSaveError(null);

    try {
      for (const page of pages) {
        if (!page.id || page.id === 0) continue;

        const elements = serializePageToAPI(page);
        await comicPageService.savePage(projectId, page.id, { elements });

        const currentState = JSON.stringify(page);
        lastSavedStateRef.current.set(page.id, currentState);
      }

      dirtyPagesRef.current.clear();
      setLastSaved(new Date());
    } catch (error: any) {
      setSaveError(error.message || 'Failed to save all pages');
      console.error('Save all pages error:', error);
    } finally {
      setIsSaving(false);
    }
  }, [projectId, pages]);

  return {
    saveCurrentPage,
    saveDirtyPages,
    saveAllPages,
    markPageAsDirty,
    clearDirtyPages,
    isSaving,
    isAutoSaving,
    lastSaved,
    saveError,
    hasDirtyPages: dirtyPagesRef.current.size > 0,
  };
};