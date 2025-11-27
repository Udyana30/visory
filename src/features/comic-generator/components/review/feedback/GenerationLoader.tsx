import React from 'react';
import { Loader2 } from 'lucide-react';

interface GenerationLoaderProps {
  progress: number;
  currentPage: number;
  totalPages: number;
}

export const GenerationLoader: React.FC<GenerationLoaderProps> = ({ 
  progress, 
  currentPage, 
  totalPages 
}) => (
  <div className="h-full flex flex-col items-center justify-center bg-white rounded-xl border border-gray-200 shadow-sm p-12">
    <div className="w-full max-w-md space-y-6 text-center">
      <div className="relative w-20 h-20 mx-auto">
        <div className="absolute inset-0 border-4 border-gray-100 rounded-full" />
        <div className="absolute inset-0 flex items-center justify-center">
          <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
        </div>
      </div>
      
      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Generating Previews...</h3>
        <p className="text-gray-500 mb-6">Rendering page {currentPage} of {totalPages}</p>
      </div>

      <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
        <div 
          className="bg-blue-600 h-full rounded-full transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="text-sm font-medium text-blue-600">{progress}% Complete</p>
    </div>
  </div>
);