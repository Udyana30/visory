import React, { useState, useRef } from 'react';
import { ComicPage } from '@/app/(main)/tools/comic-generator/types/editor';
import { Plus, Trash2, GripVertical } from 'lucide-react';

interface PagesSidebarProps {
  pages: ComicPage[];
  currentPageIndex: number;
  onPageSelect: (index: number) => void;
  onPageAdd: () => void;
  onPageDelete: (index: number) => void;
  onPageReorder?: (fromIndex: number, toIndex: number) => void;
  isLoading?: boolean;
}

export const PagesSidebar: React.FC<PagesSidebarProps> = ({
  pages,
  currentPageIndex,
  onPageSelect,
  onPageAdd,
  onPageDelete,
  onPageReorder,
  isLoading = false
}) => {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    if (isLoading) return;
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', index.toString());
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;
    setDragOverIndex(index);
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = (e: React.DragEvent, toIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === toIndex || !onPageReorder) return;

    onPageReorder(draggedIndex, toIndex);
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="px-3 py-2.5 border-b border-gray-200 bg-gray-50 flex-shrink-0">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-gray-900">Pages</h3>
          <button
            onClick={onPageAdd}
            disabled={isLoading}
            className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            title="Add Page"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div 
        ref={scrollContainerRef}
        className="flex-1 overflow-x-auto overflow-y-hidden py-4 px-4 bg-gray-50 scrollbar-thin"
      >
        <div className="flex gap-2.5 h-full items-center">
          {pages.map((page, index) => (
            <div
              key={page.id}
              draggable={!isLoading && onPageReorder !== undefined}
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, index)}
              onDragEnd={handleDragEnd}
              className={`relative group cursor-pointer rounded-lg border-2 transition flex-shrink-0 ${
                draggedIndex === index
                  ? 'opacity-50 scale-95'
                  : ''
              } ${
                dragOverIndex === index
                  ? 'border-blue-400 scale-105'
                  : ''
              } ${
                currentPageIndex === index
                  ? 'border-blue-500 bg-blue-50 shadow-md'
                  : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
              }`}
              onClick={() => !isLoading && onPageSelect(index)}
              style={{ width: '100px', height: '130px' }}
            >
              <div className="w-full h-full bg-gray-100 rounded-md overflow-hidden relative flex items-center justify-center">
                <span className="text-4xl font-bold text-gray-300">
                  {page.page_number}
                </span>
                
                {onPageReorder && (
                  <div className="absolute top-1 left-1 opacity-0 group-hover:opacity-100 transition cursor-move">
                    <div className="p-1 bg-gray-700 text-white rounded shadow-md">
                      <GripVertical className="w-3.5 h-3.5" />
                    </div>
                  </div>
                )}
              </div>
              
              {pages.length > 1 && (
                <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!isLoading) onPageDelete(index);
                    }}
                    disabled={isLoading || pages.length === 1}
                    className="p-1 bg-red-600 text-white rounded hover:bg-red-700 transition shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {isLoading && currentPageIndex === index && (
                <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded-md">
                  <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-600 border-t-transparent" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};