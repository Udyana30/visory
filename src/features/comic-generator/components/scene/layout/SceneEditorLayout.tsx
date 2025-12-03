import React, { useState } from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';

interface SceneEditorLayoutProps {
  controls: React.ReactNode;
  canvas: React.ReactNode;
  configuration: React.ReactNode;
  context: React.ReactNode;
  filmstrip: React.ReactNode;
  gridView: React.ReactNode;
}

export const SceneEditorLayout: React.FC<SceneEditorLayoutProps> = ({
  controls,
  canvas,
  configuration,
  context,
  filmstrip,
  gridView
}) => {
  const [isFilmstripOpen, setIsFilmstripOpen] = useState(true);

  return (
    <div className="flex flex-col h-full bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm relative">
      <div className="shrink-0 z-30 bg-white border-b border-gray-200">
        {controls}
      </div>

      <div className="relative flex-1 flex flex-col min-h-0 overflow-hidden">
        <div className="flex flex-col flex-1 min-h-0">
          
          <div className="flex flex-1 min-h-0 relative overflow-hidden">
            <div 
              className={`
                shrink-0 bg-white border-r border-gray-200 relative z-20 h-full
                transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]
                ${isFilmstripOpen ? 'w-[160px] opacity-100' : 'w-0 opacity-0 border-r-0'}
              `}
            >
              <div className="absolute inset-0 w-full h-full overflow-hidden">
                {filmstrip}
              </div>
            </div>

            <div className="flex-1 relative min-w-0 bg-gray-50 overflow-visible h-full">
              <button
                onClick={() => setIsFilmstripOpen(!isFilmstripOpen)}
                className="absolute left-0 top-1/2 z-40 -translate-y-1/2 -translate-x-1/2 flex items-center justify-center w-6 h-6 bg-white border border-gray-200 rounded-full shadow-md text-gray-500 hover:text-teal-600 hover:border-teal-400 transition-transform active:scale-95"
              >
                {isFilmstripOpen ? <ChevronLeft className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
              </button>

              <div className="w-full h-full overflow-hidden relative z-10">
                {canvas}
              </div>
            </div>
          </div>

          <div className="h-[360px] shrink-0 flex divide-x divide-gray-200 min-h-0 border-t border-gray-200 z-50 bg-white">
            <div className="w-1/2 min-w-0 h-full">
              {configuration}
            </div>
            <div className="w-1/2 min-w-0 h-full">
              {context}
            </div>
          </div>
        </div>

        {gridView}
      </div>
    </div>
  );
};