import React from 'react';
import { Upload, ImageIcon } from 'lucide-react';
import { SceneVisualization } from '../../../types/domain/scene';
import { DraggableAsset } from './DraggableAsset';

interface ImageLibraryProps {
  visualizations: SceneVisualization[];
  onUpload: (files: FileList | null) => void;
}

export const ImageLibrary: React.FC<ImageLibraryProps> = ({ 
  visualizations, 
  onUpload 
}) => {
  const hasImages = visualizations.length > 0;

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="flex-shrink-0 p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-blue-600" />
            Library
          </h3>
          <span className="text-xs font-medium text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
            {visualizations.length}
          </span>
        </div>
        
        <label className="flex items-center justify-center gap-2 w-full py-2.5 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors cursor-pointer border border-blue-200 font-medium text-sm">
          <Upload className="w-4 h-4" />
          Upload Image
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => onUpload(e.target.files)}
            className="hidden"
          />
        </label>
      </div>

      <div className="flex-1 overflow-y-auto p-3 scrollbar-thin">
        {!hasImages ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-4">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
              <ImageIcon className="w-6 h-6 text-gray-300" />
            </div>
            <p className="text-sm font-medium text-gray-900">No images yet</p>
            <p className="text-xs text-gray-500 mt-1">Upload or generate scenes to start.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {visualizations.map((viz) => (
              <DraggableAsset key={viz.id} data={viz} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};