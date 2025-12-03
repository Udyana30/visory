import React, { useState } from 'react';
import { Image as ImageIcon, ZoomIn, ZoomOut, Maximize } from 'lucide-react';
import { SceneVisualization } from '../../../types/domain/scene';

interface SceneCanvasProps {
  scene: SceneVisualization | undefined;
  isGenerating: boolean;
}

export const SceneCanvas: React.FC<SceneCanvasProps> = ({ scene, isGenerating }) => {
  const [scale, setScale] = useState(1);

  const handleZoomIn = () => setScale(prev => Math.min(prev + 0.1, 2));
  const handleZoomOut = () => setScale(prev => Math.max(prev - 0.1, 0.5));
  const handleReset = () => setScale(1);

  if (!scene) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100/50 text-gray-400">
        <div className="text-center">
          <ImageIcon className="w-12 h-12 mx-auto mb-2 opacity-20" />
          <p>No scene selected</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full flex items-center justify-center bg-gray-100/50 overflow-hidden group">
      <div className="absolute inset-0 pattern-grid opacity-5 pointer-events-none" />
      
      <div className="absolute bottom-4 right-4 flex gap-1 bg-white p-1 rounded-lg shadow-sm border border-gray-200 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={handleZoomOut} className="p-1.5 hover:bg-gray-100 rounded text-gray-600">
          <ZoomOut className="w-4 h-4" />
        </button>
        <button onClick={handleReset} className="p-1.5 hover:bg-gray-100 rounded text-gray-600">
          <Maximize className="w-4 h-4" />
        </button>
        <button onClick={handleZoomIn} className="p-1.5 hover:bg-gray-100 rounded text-gray-600">
          <ZoomIn className="w-4 h-4" />
        </button>
      </div>

      <div 
        className={`relative transition-all duration-300 ${isGenerating ? 'opacity-80 scale-95' : 'opacity-100'}`}
        style={{ transform: `scale(${scale})` }}
      >
        {isGenerating ? (
          <div className="aspect-video w-[480px] flex flex-col items-center justify-center bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="w-10 h-10 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin mb-3" />
            <p className="text-teal-800 font-medium animate-pulse text-sm">Generating Scene...</p>
          </div>
        ) : scene.imageUrl ? (
          <img 
            src={scene.imageUrl} 
            alt="Preview" 
            className="max-w-full max-h-[400px] object-contain drop-shadow-xl rounded-md" 
          />
        ) : (
          <div className="aspect-video w-[480px] flex flex-col items-center justify-center bg-white border-2 border-dashed border-gray-300 rounded-xl">
            <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-3 text-gray-300">
              <ImageIcon className="w-6 h-6" />
            </div>
            <p className="text-gray-400 font-medium text-sm">Visual Preview</p>
          </div>
        )}
      </div>
    </div>
  );
};