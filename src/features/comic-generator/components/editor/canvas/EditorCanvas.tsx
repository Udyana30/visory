import React, { useState } from 'react';
import { useDrop } from 'react-dnd';
import { useEditorActions } from '@/features/comic-generator/hooks/editor/useEditorActions';
import { ComicPanel, SpeechBubble } from '@/features/comic-generator/types/domain/editor';
import { DEFAULT_PAGE_WIDTH, DEFAULT_PAGE_HEIGHT } from '@/features/comic-generator/constants/editor';
import { RndPanel } from './elements/RndPanel';
import { RndBubble } from './elements/RndBubble';

export const EditorCanvas: React.FC = () => {
  const {
    pages,
    activePageIndex,
    activeTool,
    zoom,
    selectedElementId,
    updateElement,
    selectElement,
    addBubble,
    addCustomPanel
  } = useEditorActions();

  const [drawingStart, setDrawingStart] = useState<{ x: number, y: number } | null>(null);
  const [currentDraw, setCurrentDraw] = useState<{ w: number, h: number } | null>(null);

  const currentPage = pages[activePageIndex];
  const [, dropCanvas] = useDrop(() => ({ accept: 'image' }));

  if (!currentPage) return <div className="w-full h-full flex items-center justify-center text-gray-400">No Page Selected</div>;

  // Calculate the visual scale based on zoom and the 0.7 base factor
  const displayScale = zoom * 0.7;
  const scaledWidth = DEFAULT_PAGE_WIDTH * displayScale;
  const scaledHeight = DEFAULT_PAGE_HEIGHT * displayScale;

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      selectElement(null);

      if (activeTool === 'bubble') {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        addBubble(x, y);
      }
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (activeTool === 'custom-panel') {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setDrawingStart({ x, y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (drawingStart && activeTool === 'custom-panel') {
      const rect = e.currentTarget.getBoundingClientRect();
      const currentX = ((e.clientX - rect.left) / rect.width) * 100;
      const currentY = ((e.clientY - rect.top) / rect.height) * 100;
      setCurrentDraw({
        w: currentX - drawingStart.x,
        h: currentY - drawingStart.y
      });
    }
  };

  const handleMouseUp = () => {
    if (drawingStart && currentDraw) {
      const finalX = currentDraw.w < 0 ? drawingStart.x + currentDraw.w : drawingStart.x;
      const finalY = currentDraw.h < 0 ? drawingStart.y + currentDraw.h : drawingStart.y;

      if (Math.abs(currentDraw.w) > 5 && Math.abs(currentDraw.h) > 5) {
        addCustomPanel(finalX, finalY, Math.abs(currentDraw.w), Math.abs(currentDraw.h));
      }
    }
    setDrawingStart(null);
    setCurrentDraw(null);
  };

  return (
    <div className="absolute inset-0 overflow-auto bg-gray-100 flex">
      <div
        style={{
          width: scaledWidth,
          height: scaledHeight,
          flexShrink: 0,
          position: 'relative',
          boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
          backgroundColor: 'white',
          margin: 'auto'
        }}
      >
        <div
          ref={(node) => { dropCanvas(node); }}
          className="absolute inset-0 origin-top-left"
          style={{
            width: DEFAULT_PAGE_WIDTH,
            height: DEFAULT_PAGE_HEIGHT,
            transform: `scale(${displayScale})`,
            cursor: activeTool === 'custom-panel' ? 'crosshair' : activeTool === 'bubble' ? 'text' : 'default'
          }}
          onClick={handleCanvasClick}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        >
          {currentPage.elements
            .filter((el): el is ComicPanel => el.type === 'panel')
            .map((panel, idx) => (
              <RndPanel
                key={panel.id}
                panel={panel}
                index={idx}
                zoom={displayScale}
                isSelected={selectedElementId === panel.id}
                activeTool={activeTool}
                canInteract={currentPage.layout === 'custom' || !!panel.isCustom || activeTool === 'select'}
                canvasSize={{ width: DEFAULT_PAGE_WIDTH, height: DEFAULT_PAGE_HEIGHT }}
                onSelect={selectElement}
                onUpdate={updateElement}
              />
            ))}

          {currentPage.elements
            .filter((el): el is SpeechBubble => el.type === 'bubble')
            .map((bubble) => (
              <RndBubble
                key={bubble.id}
                bubble={bubble}
                zoom={displayScale}
                isSelected={selectedElementId === bubble.id}
                canvasSize={{ width: DEFAULT_PAGE_WIDTH, height: DEFAULT_PAGE_HEIGHT }}
                onSelect={selectElement}
                onUpdate={updateElement}
              />
            ))}

          {drawingStart && currentDraw && (
            <div
              className="absolute border-2 border-dashed border-blue-500 bg-blue-100/30 pointer-events-none z-[100]"
              style={{
                left: `${currentDraw.w < 0 ? drawingStart.x + currentDraw.w : drawingStart.x}%`,
                top: `${currentDraw.h < 0 ? drawingStart.y + currentDraw.h : drawingStart.y}%`,
                width: `${Math.abs(currentDraw.w)}%`,
                height: `${Math.abs(currentDraw.h)}%`
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};