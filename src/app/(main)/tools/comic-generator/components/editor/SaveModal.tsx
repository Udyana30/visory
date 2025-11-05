import React from 'react';
import { Loader2, CheckCircle } from 'lucide-react';

interface SaveModalProps {
  isOpen: boolean;
}

export const SaveModal: React.FC<SaveModalProps> = ({ isOpen }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl p-8 max-w-sm w-full mx-4 transform transition-all">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Saving Your Work</h3>
          <p className="text-gray-600 text-center text-sm">
            Please wait while we save your comic project...
          </p>
          <div className="mt-6 w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div className="bg-blue-600 h-full rounded-full animate-pulse" style={{ width: '70%' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};