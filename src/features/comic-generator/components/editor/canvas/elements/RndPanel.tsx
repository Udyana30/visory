import React from 'react';
import { Rnd, RndResizeCallback } from 'react-rnd';
import { useDrop } from 'react-dnd';
import { DraggableData, DraggableEvent } from 'react-draggable';
import { ComicPanel } from '@/features/comic-generator/types/domain/editor';
import { useCanvasMath } from '../hooks/useCanvasMath';
import { customResizeHandles } from './ResizeHandle';

interface RndPanelProps {
  panel: ComicPanel;
  index: number;
  zoom: number;
  isSelected: boolean;
  canInteract: boolean;
  activeTool: string;
  canvasSize: { width: number; height: number };
  onSelect: (id: string) => void;
  onUpdate: (id: string, changes: Partial<ComicPanel>) => void;
}

const HANDLE_STYLES = {
  topLeft: { left: -4, top: -4 },
  topRight: { right: -12, top: -4 },
  bottomLeft: { left: -4, bottom: -10 },
  bottomRight: { right: -12, bottom: -10 },
};

export const RndPanel: React.FC<RndPanelProps> = ({
  panel,
  index,
  zoom,
  isSelected,
  canInteract,
  activeTool,
  canvasSize,
  onSelect,
  onUpdate
}) => {
  const { toPx, toPercent } = useCanvasMath(canvasSize.width, canvasSize.height);

  const [{ isOver }, dropRef] = useDrop(() => ({
    accept: 'image',
    drop: (item: { imageUrl: string }) => {
      onUpdate(panel.id, { imageUrl: item.imageUrl });
    },
    collect: (monitor) => ({ isOver: monitor.isOver() })
  }), [panel.id, onUpdate]);

  const handleDragStop = (e: DraggableEvent, d: DraggableData) => {
    onUpdate(panel.id, {
      x: toPercent(d.x, canvasSize.width),
      y: toPercent(d.y, canvasSize.height)
    });
  };

  const handleResizeStop: RndResizeCallback = (e, dir, ref, delta, position) => {
    onUpdate(panel.id, {
      width: toPercent(ref.offsetWidth, canvasSize.width),
      height: toPercent(ref.offsetHeight, canvasSize.height),
      x: toPercent(position.x, canvasSize.width),
      y: toPercent(position.y, canvasSize.height)
    });
  };

  return (
    <Rnd
      size={{ width: toPx(panel.width, canvasSize.width), height: toPx(panel.height, canvasSize.height) }}
      position={{ x: toPx(panel.x, canvasSize.width), y: toPx(panel.y, canvasSize.height) }}
      scale={zoom}
      bounds="parent"
      disableDragging={!canInteract}
      enableResizing={canInteract && isSelected ? undefined : false}
      resizeHandleComponent={(canInteract && isSelected) ? customResizeHandles : undefined}
      resizeHandleStyles={(canInteract && isSelected) ? HANDLE_STYLES : undefined}
      onDragStart={(e) => {
        e.stopPropagation();
        onSelect(panel.id);
      }}
      onDragStop={handleDragStop}
      onResizeStop={handleResizeStop}
      onClick={(e: React.MouseEvent) => {
        e.stopPropagation();
        onSelect(panel.id);
      }}
      className={`absolute transition-colors ${isOver ? 'ring-4 ring-green-400 z-50' : ''}`}
      style={{ zIndex: panel.zIndex }}
    >
      <div 
        ref={(node) => { dropRef(node); }}
        className={`w-full h-full overflow-hidden bg-white border-2 flex items-center justify-center relative ${
          isSelected ? 'border-blue-500' : 'border-gray-800'
        }`}
      >
        {panel.imageUrl ? (
          <img 
            src={panel.imageUrl} 
            alt={`Panel ${index + 1}`}
            className="w-full h-full object-cover pointer-events-none"
            style={{
              transform: `scale(${panel.imageScale || 1})`,
              objectPosition: `${panel.imagePosition?.x || 50}% ${panel.imagePosition?.y || 50}%`
            }}
          />
        ) : (
          <span className="text-gray-300 text-xs font-medium">Drop Image</span>
        )}

        {activeTool === 'select' && panel.imageUrl && (
          <div className="absolute top-1 right-1 bg-blue-600 text-white text-[10px] px-2 py-0.5 rounded shadow-md pointer-events-none z-10">
            Panel {index + 1}
          </div>
        )}
      </div>
    </Rnd>
  );
};