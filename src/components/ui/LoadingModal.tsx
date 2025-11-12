import React, { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingModalProps {
  isOpen: boolean;
  message?: string;
}

export const LoadingModal: React.FC<LoadingModalProps> = ({
  isOpen,
  message = 'Loading...'
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      
      <div className="relative bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full">
        <div className="flex flex-col items-center text-center">
          <Loader2 className="w-16 h-16 text-blue-600 animate-spin mb-4" />
          <p className="text-lg font-medium text-gray-900">{message}</p>
          <p className="text-sm text-gray-500 mt-2">Please wait a moment</p>
        </div>
      </div>
    </div>
  );
};