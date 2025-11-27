import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { AutoSaveIndicator } from './AutoSaveIndicator';
import { ManualSaveDialog } from './ManualSaveDialog';

interface SaveFeedbackProps {
  isOpen: boolean;
  mode: 'manual' | 'auto';
  isSuccess?: boolean;
  error?: string | null;
}

export const SaveFeedback: React.FC<SaveFeedbackProps> = ({ 
  isOpen, 
  mode, 
  isSuccess,
  error 
}) => {
  return (
    <AnimatePresence>
      {isOpen && mode === 'auto' && (
        <AutoSaveIndicator key="autosave" />
      )}
      
      {isOpen && mode === 'manual' && (
        <ManualSaveDialog key="manualsave" isSuccess={isSuccess} error={error} />
      )}
    </AnimatePresence>
  );
};