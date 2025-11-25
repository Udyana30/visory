import React, { useState } from 'react';
import { ZoomIn, ZoomOut, AlertCircle, ImageOff } from 'lucide-react';
import { ComicPage } from '@/app/(main)/tools/comic-generator/types/editor';

interface PreviewPanelProps {
  pages: ComicPage[];
  onContinue: () => void;
  onBack: () => void;
}

export const PreviewPanel: React.FC<PreviewPanelProps> = ({
  pages,
  onBack
}) => {
  const [zoom, setZoom] = useState(1);
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.1, 2));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.1, 0.5));

  const handleImageError = (pageId: number) => {
    setImageErrors(prev => new Set(prev).add(pageId));
  };

  return (
    <div className="flex flex-col h-full">
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Review Comic</h2>
          <p className="text-sm text-gray-500">Check your pages before exporting</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
            <button onClick={handleZoomOut} className="p-1.5 hover:bg-white rounded-md transition" title="Zoom Out">
              <ZoomOut className="w-4 h-4 text-gray-600" />
            </button>
            <span className="text-xs font-medium text-gray-600 w-12 text-center">
              {Math.round(zoom * 100)}%
            </span>
            <button onClick={handleZoomIn} className="p-1.5 hover:bg-white rounded-md transition" title="Zoom In">
              <ZoomIn className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto bg-gray-100 p-8 scrollbar-thin">
        <div className="max-w-4xl mx-auto space-y-8 pb-10">
          {pages.map((page, index) => (
            <div 
              key={page.id || index} 
              className="bg-white rounded-sm shadow-lg transition-transform origin-top"
              style={{ transform: `scale(${zoom})`, transformOrigin: 'top center' }}
            >
              {page.preview_url && !imageErrors.has(page.id) ? (
                <img 
                  src={page.preview_url} 
                  alt={`Page ${index + 1}`} 
                  className="w-full h-auto block"
                  loading="lazy"
                  onError={() => handleImageError(page.id)}
                />
              ) : (
                <div className="aspect-[2/3] flex flex-col items-center justify-center bg-gray-50 text-gray-400 p-8 text-center border-2 border-dashed border-gray-200">
                  {imageErrors.has(page.id) ? (
                    <>
                      <ImageOff className="w-12 h-12 mb-2 text-red-300" />
                      <p className="text-sm font-medium text-red-500">Failed to load image</p>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-12 h-12 mb-2 opacity-20" />
                      <p className="text-sm">No preview generated</p>
                    </>
                  )}
                </div>
              )}
              <div className="border-t border-gray-100 p-2 text-center text-xs text-gray-400 font-mono flex justify-between px-4">
                <span>Page {index + 1}</span>
                <span className="text-gray-300">ID: {page.id}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};