import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence } from 'framer-motion';
import { AutoSaveIndicator } from './AutoSaveIndicator';
import { ManualSaveDialog } from './ManualSaveDialog';

interface SaveFeedbackProps {
  isOpen: boolean;
  mode: 'manual' | 'auto';
  isSuccess?: boolean;
  error?: string | null;
  customMessage?: string;
}

export const SaveFeedback: React.FC<SaveFeedbackProps> = ({ 
  isOpen, 
  mode, 
  isSuccess,
  error,
  customMessage
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Render komponen langsung ke document.body menggunakan Portal
  return createPortal(
    <AnimatePresence>
      {isOpen && mode === 'auto' && (
        <AutoSaveIndicator key="autosave" message={customMessage} />
      )}
      
      {isOpen && mode === 'manual' && (
        <ManualSaveDialog 
          key="manualsave" 
          isSuccess={isSuccess} 
          error={error} 
          message={customMessage}
        />
      )}
    </AnimatePresence>,
    document.body
  );
};