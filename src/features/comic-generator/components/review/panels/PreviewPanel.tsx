import React, { useState } from 'react';
import { ZoomIn, ZoomOut, AlertCircle, ImageOff } from 'lucide-react';
import { ComicPage } from '@/features/comic-generator/types/domain/editor';

interface PreviewPanelProps {
  pages: ComicPage[];
  previews: Record<number, string>;
}

export const PreviewPanel: React.FC<PreviewPanelProps> = ({ pages, previews }) => {
  const [zoom, setZoom] = useState(1);
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());

  const getPreviewUrl = (page: ComicPage) => {
    return previews[Number(page.id)] || page.previewUrl;
  };

  const handleZoomIn = () => setZoom(z => Math.min(2, z + 0.1));
  const handleZoomOut = () => setZoom(z => Math.max(0.5, z - 0.1));

  return (
    <div className="flex flex-col h-full">
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between sticky top-0 z-10">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Review Comic</h2>
          <p className="text-sm text-gray-500">Check your pages before exporting</p>
        </div>
        <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1 h-fit">
          <button onClick={handleZoomOut} className="p-1.5 hover:bg-white rounded-md transition-colors">
            <ZoomOut className="w-4 h-4 text-gray-600" />
          </button>
          <span className="text-xs font-medium text-gray-600 w-12 text-center">
            {Math.round(zoom * 100)}%
          </span>
          <button onClick={handleZoomIn} className="p-1.5 hover:bg-white rounded-md transition-colors">
            <ZoomIn className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto bg-gray-50 p-8 scrollbar-thin">
        <div className="max-w-4xl mx-auto space-y-8 pb-10">
          {pages.map((page, index) => {
            const url = getPreviewUrl(page);
            const hasError = imageErrors.has(page.id);

            return (
              <div 
                key={page.id} 
                className="bg-white shadow-lg transition-transform origin-top duration-200"
                style={{ transform: `scale(${zoom})` }}
              >
                {url && !hasError ? (
                  <img 
                    src={url} 
                    alt={`Page ${index + 1}`} 
                    className="w-full h-auto block select-none"
                    onError={() => setImageErrors(prev => new Set(prev).add(page.id))}
                  />
                ) : (
                  <div className="aspect-[2/3] flex flex-col items-center justify-center bg-gray-50 border-2 border-dashed border-gray-200">
                    {hasError ? (
                      <ImageOff className="w-12 h-12 text-red-300 mb-2" />
                    ) : (
                      <AlertCircle className="w-12 h-12 text-gray-300 mb-2" />
                    )}
                    <p className="text-sm text-gray-400 font-medium">
                      {hasError ? 'Failed to load preview' : 'No preview available'}
                    </p>
                  </div>
                )}
                
                <div className="border-t border-gray-100 p-3 flex justify-between items-center text-xs font-mono text-gray-400 bg-white">
                  <span className="font-semibold text-gray-600">Page {page.pageNumber}</span>
                  <span className="uppercase bg-gray-100 px-2 py-0.5 rounded">
                    {page.layout}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};