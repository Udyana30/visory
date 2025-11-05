import React, { useRef, useState } from 'react';
import { useDrop } from 'react-dnd';
import { ComicPage, ComicPanel, SpeechBubble, DraggedImage } from '@/types/editor';
import { DEFAULT_PAGE_WIDTH, DEFAULT_PAGE_HEIGHT } from '@/lib/editorConstants';

interface EditorCanvasProps {
  page: ComicPage;
  zoom: number;
  activeTool: string;
  selectedBubbleId: string | null;
  onBubbleSelect: (bubbleId: string | null) => void;
  onBubbleUpdate: (panelId: string, bubble: SpeechBubble) => void;
  onBubbleAdd: (panelId: string, x: number, y: number) => void;
  onImageDrop: (panelId: string, imageUrl: string) => void;
  onCanvasClick: () => void;
}

interface DroppablePanelProps {
  panel: ComicPanel;
  activeTool: string;
  selectedBubbleId: string | null;
  onBubbleSelect: (bubbleId: string | null) => void;
  onBubbleDragStart: (e: React.MouseEvent, panelId: string, bubble: SpeechBubble) => void;
  onResizeStart: (e: React.MouseEvent, panelId: string, bubble: SpeechBubble, handle: string) => void;
  onCanvasClick: (e: React.MouseEvent, panelId: string) => void;
  onImageDrop: (panelId: string, imageUrl: string) => void;
}

const DroppablePanel: React.FC<DroppablePanelProps> = ({
  panel,
  activeTool,
  selectedBubbleId,
  onBubbleSelect,
  onBubbleDragStart,
  onResizeStart,
  onCanvasClick,
  onImageDrop
}) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'image',
    drop: (item: DraggedImage) => {
      onImageDrop(panel.id, item.imageUrl);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver()
    })
  }));

  const getBubbleStyle = (bubble: SpeechBubble) => {
    const baseStyle = {
      left: `${bubble.x}%`,
      top: `${bubble.y}%`,
      width: `${bubble.width}%`,
      height: `${bubble.height}%`,
      backgroundColor: bubble.backgroundColor,
      border: `${bubble.borderWidth}px solid ${bubble.borderColor}`,
      cursor: 'move'
    };

    switch (bubble.type) {
      case 'thought':
        return { ...baseStyle, borderRadius: '50%' };
      case 'shout':
        return { ...baseStyle, borderRadius: '4px', transform: 'rotate(-2deg)' };
      case 'whisper':
        return { ...baseStyle, borderRadius: '20px', borderStyle: 'dashed' };
      case 'narration':
        return { ...baseStyle, borderRadius: '4px' };
      default:
        return { ...baseStyle, borderRadius: '20px' };
    }
  };

  return (
    <div
      ref={drop as any}
      className={`absolute border-2 overflow-hidden transition-all ${
        isOver ? 'border-blue-500 bg-blue-50/30' : 'border-gray-300'
      }`}
      style={{
        left: `${panel.x}%`,
        top: `${panel.y}%`,
        width: `${panel.width}%`,
        height: `${panel.height}%`,
        cursor: activeTool === 'bubble' ? 'crosshair' : 'default'
      }}
      onClick={(e) => onCanvasClick(e, panel.id)}
    >
      {panel.imageUrl ? (
        <img
          src={panel.imageUrl}
          alt="Panel"
          className="w-full h-full object-cover"
          draggable={false}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gray-50">
          <p className="text-gray-400 text-sm text-center px-4 font-medium">
            Drag image here
          </p>
        </div>
      )}

      {panel.bubbles.map((bubble) => (
        <div
          key={bubble.id}
          className={`absolute flex items-center justify-center p-2 select-none transition-all ${
            selectedBubbleId === bubble.id
              ? 'shadow-lg ring-2 ring-blue-500'
              : 'hover:shadow-md'
          }`}
          style={getBubbleStyle(bubble)}
          onMouseDown={(e) => {
            e.stopPropagation();
            onBubbleDragStart(e, panel.id, bubble);
          }}
          onClick={(e) => {
            e.stopPropagation();
            onBubbleSelect(bubble.id);
          }}
        >
          <div
            className="text-center w-full overflow-hidden pointer-events-none"
            style={{
              fontSize: `${bubble.fontSize}px`,
              fontFamily: bubble.fontFamily,
              textAlign: bubble.textAlign,
              color: bubble.color,
              fontWeight: bubble.type === 'shout' ? 'bold' : 'normal'
            }}
          >
            {bubble.text || 'Click to edit'}
          </div>

          {selectedBubbleId === bubble.id && (
            <>
              <div
                className="absolute -right-1.5 -top-1.5 w-4 h-4 bg-blue-500 rounded-full cursor-nwse-resize border-2 border-white shadow-md"
                onMouseDown={(e) => {
                  e.stopPropagation();
                  onResizeStart(e, panel.id, bubble, 'tr');
                }}
              />
              <div
                className="absolute -right-1.5 -bottom-1.5 w-4 h-4 bg-blue-500 rounded-full cursor-nesw-resize border-2 border-white shadow-md"
                onMouseDown={(e) => {
                  e.stopPropagation();
                  onResizeStart(e, panel.id, bubble, 'br');
                }}
              />
              <div
                className="absolute -left-1.5 -top-1.5 w-4 h-4 bg-blue-500 rounded-full cursor-nesw-resize border-2 border-white shadow-md"
                onMouseDown={(e) => {
                  e.stopPropagation();
                  onResizeStart(e, panel.id, bubble, 'tl');
                }}
              />
              <div
                className="absolute -left-1.5 -bottom-1.5 w-4 h-4 bg-blue-500 rounded-full cursor-nwse-resize border-2 border-white shadow-md"
                onMouseDown={(e) => {
                  e.stopPropagation();
                  onResizeStart(e, panel.id, bubble, 'bl');
                }}
              />
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export const EditorCanvas: React.FC<EditorCanvasProps> = ({
  page,
  zoom,
  activeTool,
  selectedBubbleId,
  onBubbleSelect,
  onBubbleUpdate,
  onBubbleAdd,
  onImageDrop,
  onCanvasClick
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [draggingBubble, setDraggingBubble] = useState<{
    panelId: string;
    bubble: SpeechBubble;
    initialBubble: SpeechBubble;
  } | null>(null);
  const [resizingBubble, setResizingBubble] = useState<{
    panelId: string;
    bubble: SpeechBubble;
    handle: string;
    initialBubble: SpeechBubble;
  } | null>(null);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);

  const handleCanvasClick = (e: React.MouseEvent, panelId: string) => {
    if (activeTool === 'bubble') {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      onBubbleAdd(panelId, x, y);
    } else if (activeTool === 'select') {
      onCanvasClick();
    }
  };

  const handleBubbleDragStart = (
    e: React.MouseEvent,
    panelId: string,
    bubble: SpeechBubble
  ) => {
    setDraggingBubble({ 
      panelId, 
      bubble,
      initialBubble: { ...bubble }
    });
    setDragStart({ x: e.clientX, y: e.clientY });
    onBubbleSelect(bubble.id);
  };

  const handleResizeStart = (
    e: React.MouseEvent,
    panelId: string,
    bubble: SpeechBubble,
    handle: string
  ) => {
    setResizingBubble({ 
      panelId, 
      bubble, 
      handle,
      initialBubble: { ...bubble }
    });
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragStart) return;

    const panel = page.panels.find(
      (p) => p.id === (draggingBubble?.panelId || resizingBubble?.panelId)
    );
    if (!panel) return;

    const panelElement = document.querySelector(
      `[data-panel-id="${panel.id}"]`
    )?.firstChild as HTMLElement;
    if (!panelElement) return;

    const rect = panelElement.getBoundingClientRect();
    const deltaX = ((e.clientX - dragStart.x) / rect.width) * 100;
    const deltaY = ((e.clientY - dragStart.y) / rect.height) * 100;

    if (draggingBubble) {
      const { bubble, initialBubble, panelId } = draggingBubble;
      const updatedBubble: SpeechBubble = {
        ...bubble,
        x: Math.max(
          0,
          Math.min(100 - initialBubble.width, initialBubble.x + deltaX)
        ),
        y: Math.max(
          0,
          Math.min(100 - initialBubble.height, initialBubble.y + deltaY)
        )
      };

      onBubbleUpdate(panelId, updatedBubble);
    } else if (resizingBubble) {
      const { handle, initialBubble, bubble, panelId } = resizingBubble;
      const updatedBubble: SpeechBubble = {
        ...bubble,
        x: initialBubble.x,
        y: initialBubble.y,
        width: initialBubble.width,
        height: initialBubble.height
      };

      switch (handle) {
        case 'br':
          updatedBubble.width = Math.max(10, Math.min(100 - initialBubble.x, initialBubble.width + deltaX));
          updatedBubble.height = Math.max(10, Math.min(100 - initialBubble.y, initialBubble.height + deltaY));
          break;
        case 'bl':
          const newWidthBL = Math.max(10, initialBubble.width - deltaX);
          updatedBubble.x = initialBubble.x + initialBubble.width - newWidthBL;
          updatedBubble.width = newWidthBL;
          updatedBubble.height = Math.max(10, Math.min(100 - initialBubble.y, initialBubble.height + deltaY));
          break;
        case 'tr':
          const newHeightTR = Math.max(10, initialBubble.height - deltaY);
          updatedBubble.y = initialBubble.y + initialBubble.height - newHeightTR;
          updatedBubble.height = newHeightTR;
          updatedBubble.width = Math.max(10, Math.min(100 - initialBubble.x, initialBubble.width + deltaX));
          break;
        case 'tl':
          const newWidthTL = Math.max(10, initialBubble.width - deltaX);
          const newHeightTL = Math.max(10, initialBubble.height - deltaY);
          updatedBubble.x = initialBubble.x + initialBubble.width - newWidthTL;
          updatedBubble.y = initialBubble.y + initialBubble.height - newHeightTL;
          updatedBubble.width = newWidthTL;
          updatedBubble.height = newHeightTL;
          break;
      }

      onBubbleUpdate(panelId, updatedBubble);
    }
  };

  const handleMouseUp = () => {
    setDraggingBubble(null);
    setResizingBubble(null);
    setDragStart(null);
  };

  return (
    <div
      className="flex-1 bg-gray-100 overflow-auto flex items-center justify-center p-8"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onCanvasClick();
        }
      }}
    >
      <div
        ref={canvasRef}
        className="bg-white shadow-2xl"
        style={{
          width: DEFAULT_PAGE_WIDTH * zoom,
          height: DEFAULT_PAGE_HEIGHT * zoom,
          transform: `scale(${zoom})`,
          transformOrigin: 'center',
          position: 'relative'
        }}
      >
        {page.panels.map((panel) => (
          <div key={panel.id} data-panel-id={panel.id}>
            <DroppablePanel
              panel={panel}
              activeTool={activeTool}
              selectedBubbleId={selectedBubbleId}
              onBubbleSelect={onBubbleSelect}
              onBubbleDragStart={handleBubbleDragStart}
              onResizeStart={handleResizeStart}
              onCanvasClick={handleCanvasClick}
              onImageDrop={onImageDrop}
            />
          </div>
        ))}
      </div>
    </div>
  );
};