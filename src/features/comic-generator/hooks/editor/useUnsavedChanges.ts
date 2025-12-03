import { useState, useCallback } from 'react';

export const useUnsavedChanges = (isDirty: boolean, saveFn: () => Promise<void>) => {
  const [isSavingAndExiting, setIsSavingAndExiting] = useState(false);

  const handleInterceptNavigation = useCallback(async (onNavigate: () => void) => {
    if (isDirty) {
      setIsSavingAndExiting(true);
      try {
        await saveFn();
        onNavigate();
      } catch (error) {
        console.error('Failed to save before exit', error);
        // Optional: Show error toast/alert here
      } finally {
        setIsSavingAndExiting(false);
      }
    } else {
      onNavigate();
    }
  }, [isDirty, saveFn]);

  return {
    handleInterceptNavigation,
    isSavingAndExiting
  };
};