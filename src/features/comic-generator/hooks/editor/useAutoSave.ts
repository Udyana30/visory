import { useEffect, useRef } from 'react';
import { useEditor } from '../../context/EditorContext';

export const useAutoSave = (projectId: number | null, interval = 5000) => {
  const { state, actions } = useEditor();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!projectId) return;

    const checkAndSave = async () => {
      if (!projectId || state.isSaving || state.isAutoSaving) return;

      const dirtyPageIndex = state.pages.findIndex(p => p.isDirty);

      if (dirtyPageIndex !== -1) {
        const page = state.pages[dirtyPageIndex];

        // Validasi page sebelum save
        if (!page || !page.id || !page.elements || page.elements.length === 0) {
          console.warn('[AutoSave] Skipping invalid page:', {
            pageIndex: dirtyPageIndex,
            pageId: page?.id,
            hasElements: !!page?.elements
          });
          return;
        }

        try {
          await actions.autoSavePage(projectId, dirtyPageIndex);
        } catch (error) {
          console.error('[AutoSave] Failed to save page:', { pageIndex: dirtyPageIndex, error });
        }
      }
    };

    timerRef.current = setInterval(checkAndSave, interval);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [projectId, state.pages, state.isSaving, state.isAutoSaving, actions]);
};