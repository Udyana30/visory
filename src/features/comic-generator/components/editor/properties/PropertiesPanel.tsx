import React from 'react';
import { SpeechBubble, ComicPanel } from '../../../types/domain/editor';
import { useEditorActions } from '@/features/comic-generator/hooks/useEditorActions';
import { BubbleProperties } from './forms/BubbleProperties';
import { PanelProperties } from './forms/PanelProperties';
import { CanvasProperties } from './forms/CanvasProperties';

export const PropertiesPanel: React.FC = () => {
  const { pages, activePageIndex, selectedElementId } = useEditorActions();
  
  const currentPage = pages[activePageIndex];
  const currentLayout = currentPage?.layout || 'single';

  const getSelectedElement = () => {
    if (!selectedElementId || !currentPage) return null;
    return currentPage.elements.find(el => el.id === selectedElementId);
  };

  const selectedElement = getSelectedElement();

  const renderContent = () => {
    if (selectedElement?.type === 'bubble') {
      return <BubbleProperties bubble={selectedElement as SpeechBubble} />;
    }

    if (selectedElement?.type === 'panel') {
      if (currentLayout === 'custom' || (selectedElement as ComicPanel).isCustom) {
         return <PanelProperties panel={selectedElement as ComicPanel} />;
      }
      return <PanelProperties panel={selectedElement as ComicPanel} />;
    }

    return <CanvasProperties />;
  };

  return (
    <div className="w-80 bg-white border-l border-gray-200 flex flex-col h-full shadow-sm z-20">
      {renderContent()}
    </div>
  );
};