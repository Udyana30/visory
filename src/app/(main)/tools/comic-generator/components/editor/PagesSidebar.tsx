import React from 'react';
import { ComicPage } from '@/types/editor';
import { Plus, Trash2 } from 'lucide-react';

interface PagesSidebarProps {
  pages: ComicPage[];
  currentPageIndex: number;
  onPageSelect: (index: number) => void;
  onPageAdd: () => void;
  onPageDelete: (index: number) => void;
}

export const PagesSidebar: React.FC<PagesSidebarProps> = ({
  pages,
  currentPageIndex,
  onPageSelect,
  onPageAdd,
  onPageDelete
}) => {
  return (
    <div className="flex-1 flex flex-col border-t border-gray-200 min-h-0">
      <div className="p-4 border-b border-gray-200 bg-gray-50 flex-shrink-0">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Pages</h3>
        <button
          onClick={onPageAdd}
          className="w-full py-2.5 px-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2 text-sm font-medium shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Add Page
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {pages.map((page, index) => (
          <div
            key={page.id}
            className={`relative group cursor-pointer rounded-lg border-2 transition ${
              currentPageIndex === index
                ? 'border-blue-500 bg-blue-50 shadow-md'
                : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
            }`}
            onClick={() => onPageSelect(index)}
          >
            <div className="aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden m-1.5 relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-4xl font-bold text-gray-300">{index + 1}</span>
              </div>
            </div>
            
            {pages.length > 1 && (
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onPageDelete(index);
                  }}
                  className="p-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition shadow-md"
                  disabled={pages.length === 1}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            <div className="px-2 pb-2 text-center">
              <span className="text-xs text-gray-600 font-medium">
                Page {index + 1}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};