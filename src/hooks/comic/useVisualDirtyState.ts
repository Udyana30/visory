import { useState, useCallback } from 'react';

export const useVisualDirtyState = () => {
  const [dirtyPageIds, setDirtyPageIds] = useState<Set<number>>(new Set());

  const markPageAsDirty = useCallback((pageId: number) => {
    setDirtyPageIds(prev => {
      if (prev.has(pageId)) return prev;
      return new Set(prev).add(pageId);
    });
  }, []);

  const markPageAsClean = useCallback((pageId: number) => {
    setDirtyPageIds(prev => {
      const next = new Set(prev);
      if (next.delete(pageId)) {
        return next;
      }
      return prev;
    });
  }, []);

  const clearDirtyState = useCallback(() => {
    setDirtyPageIds(new Set());
  }, []);

  return {
    dirtyPageIds,
    markPageAsDirty,
    markPageAsClean,
    clearDirtyState
  };
};