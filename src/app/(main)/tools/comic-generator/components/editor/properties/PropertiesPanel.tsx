import React from 'react';
import { SpeechBubble, ComicPanel } from '@/app/(main)/tools/comic-generator/types/editor';
import { BubbleProperties } from './BubbleProperties';
import { PanelProperties } from './PanelProperties';
import { CanvasProperties } from './CanvasProperties';

interface PropertiesPanelProps {
  selectedBubble: SpeechBubble | null;
  selectedPanel: ComicPanel | null;
  onBubbleUpdate: (bubble: SpeechBubble) => void;
  onPanelUpdate: (panel: ComicPanel) => void;
  onLayoutChange: (layout: string) => void;
  currentLayout: string;
  onBubbleAdd: (x: number, y: number, template?: Partial<SpeechBubble>) => void;
  currentPagePanels: ComicPanel[];
  onDeselectBubble: () => void;
  onDeselectPanel: () => void;
}

export const PropertiesPanel: React.FC<PropertiesPanelProps> = ({
  selectedBubble,
  selectedPanel,
  onBubbleUpdate,
  onPanelUpdate,
  onLayoutChange,
  currentLayout,
  onBubbleAdd,
  currentPagePanels,
  onDeselectBubble,
  onDeselectPanel
}) => {
  const renderContent = () => {
    if (selectedBubble) {
      return (
        <BubbleProperties
          bubble={selectedBubble}
          onUpdate={onBubbleUpdate}
          onDeselect={onDeselectBubble}
        />
      );
    }

    if (selectedPanel && currentLayout === 'custom') {
      return (
        <PanelProperties
          panel={selectedPanel}
          onUpdate={onPanelUpdate}
          onDeselect={onDeselectPanel}
        />
      );
    }

    return (
      <CanvasProperties
        currentLayout={currentLayout}
        onLayoutChange={onLayoutChange}
        onBubbleAdd={onBubbleAdd}
        currentPagePanels={currentPagePanels}
      />
    );
  };

  return (
    <div className="w-80 bg-white border-l border-gray-200 flex flex-col h-full">
      {renderContent()}
    </div>
  );
};