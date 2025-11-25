import React from 'react';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';

interface SaveModalProps {
  isOpen: boolean;
  mode: 'manual' | 'auto';
  isSuccess?: boolean;
  error?: string | null;
}

export const SaveModal: React.FC<SaveModalProps> = ({ 
  isOpen, 
  mode, 
  isSuccess = false,
  error = null 
}) => {
  if (!isOpen) return null;

  if (mode === 'auto') {
    return (
      <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 animate-slide-down">
        <div className="bg-white rounded-lg shadow-xl border border-gray-200 px-6 py-3 flex items-center gap-3 min-w-[280px]">
          <Loader2 className="w-5 h-5 text-blue-600 animate-spin flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">Auto saving...</p>
            <div className="mt-1.5 w-full bg-gray-200 rounded-full h-1 overflow-hidden">
              <div 
                className="bg-blue-600 h-full rounded-full transition-all duration-300"
                style={{ width: '100%', animation: 'progress 1s ease-in-out' }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-white rounded-xl shadow-2xl p-8 max-w-sm w-full mx-4 transform transition-all animate-scale-in">
        <div className="flex flex-col items-center">
          {error ? (
            <>
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Save Failed</h3>
              <p className="text-gray-600 text-center text-sm">{error}</p>
            </>
          ) : isSuccess ? (
            <>
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Saved Successfully</h3>
              <p className="text-gray-600 text-center text-sm">
                Your comic project has been saved
              </p>
            </>
          ) : (
            <>
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Saving Your Work</h3>
              <p className="text-gray-600 text-center text-sm">
                Please wait while we save your comic project...
              </p>
              <div className="mt-6 w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-blue-600 h-full rounded-full"
                  style={{ width: '70%', animation: 'pulse 1.5s ease-in-out infinite' }}
                />
              </div>
            </>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes scale-in {
          from {
            transform: scale(0.95);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        @keyframes slide-down {
          from {
            transform: translate(-50%, -20px);
            opacity: 0;
          }
          to {
            transform: translate(-50%, 0);
            opacity: 1;
          }
        }
        @keyframes progress {
          from {
            width: 0%;
          }
          to {
            width: 100%;
          }
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
        .animate-scale-in {
          animation: scale-in 0.2s ease-out;
        }
        .animate-slide-down {
          animation: slide-down 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};