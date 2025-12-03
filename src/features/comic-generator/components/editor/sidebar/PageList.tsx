import React, { useCallback } from 'react';
import { Plus } from 'lucide-react';
import { useEditorActions } from '../../../hooks/editor/useEditorActions';
import { PageThumbnail } from './PageThumbnail';

interface PageListProps {
  projectId: number | null;
}

export const PageList: React.FC<PageListProps> = ({ projectId }) => {
  const { 
    pages, 
    activePageIndex, 
    setActivePage, 
    createPage, 
    deletePage,
    reorderPages,
    savePageOrder
  } = useEditorActions();

  const handleAddPage = () => {
    if (projectId) createPage(projectId);
  };

  const handleDeletePage = (index: number) => {
    if (projectId) deletePage(projectId, index);
  };

  const handleMovePage = useCallback((dragIndex: number, hoverIndex: number) => {
    reorderPages(dragIndex, hoverIndex);
  }, [reorderPages]);

  const handleDropComplete = useCallback(() => {
    if (projectId) {
      savePageOrder(projectId);
    }
  }, [projectId, savePageOrder]);

  return (
    <div className="flex flex-col h-full bg-gray-50 border-t border-gray-200">
      <div className="px-4 py-3 border-b border-gray-200 bg-white flex-shrink-0 flex items-center justify-between">
        <h3 className="text-sm font-bold text-gray-800">Pages</h3>
        <button
          onClick={handleAddPage}
          className="p-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition shadow-sm border border-blue-100"
          title="Add New Page"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-x-auto overflow-y-hidden p-4 scrollbar-thin">
        <div className="flex gap-3 h-full">
          {pages.map((page, index) => (
            <PageThumbnail
              key={page.id}
              page={page}
              index={index}
              isActive={index === activePageIndex}
              onSelect={() => setActivePage(index)}
              onDelete={() => handleDeletePage(index)}
              onMove={handleMovePage}
              onDropComplete={handleDropComplete}
              canDelete={pages.length > 1}
            />
          ))}
        </div>
      </div>
    </div>
  );
};