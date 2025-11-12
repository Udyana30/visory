import React, { useRef, useState } from 'react';
import { useDrop, useDrag } from 'react-dnd';
import { ComicPage, ComicPanel, SpeechBubble, DraggedImage, DraggedPanel, CustomPanelDrawing } from '@/types/editor';
import { DEFAULT_PAGE_WIDTH, DEFAULT_PAGE_HEIGHT } from '@/lib/editorConstants';

interface EditorCanvasProps {
  page: ComicPage;
  zoom: number;
  activeTool: string;
  selectedBubbleId: string | null;
  selectedPanelId: string | null;
  onBubbleSelect: (bubbleId: string | null) => void;
  onPanelSelect: (panelId: string | null) => void;
  onBubbleUpdate: (panelId: string, bubble: SpeechBubble) => void;
  onPanelUpdate: (panel: ComicPanel) => void;
  onBubbleAdd: (panelId: string, x: number, y: number) => void;
  onImageDrop: (panelId: string, imageUrl: string) => void;
  onCanvasClick: () => void;
  onPanelSwap?: (sourcePanelId: string, targetPanelId: string) => void;
  onCustomPanelAdd?: (x: number, y: number, width: number, height: number) => void;
}

interface DroppablePanelProps {
  panel: ComicPanel;
  panelIndex: number;
  activeTool: string;
  selectedBubbleId: string | null;
  selectedPanelId: string | null;
  isCustomLayout: boolean;
  onBubbleSelect: (bubbleId: string | null) => void;
  onPanelSelect: (panelId: string | null) => void;
  onBubbleDragStart: (e: React.MouseEvent, panelId: string, bubble: SpeechBubble) => void;
  onPanelDragStart: (e: React.MouseEvent, panel: ComicPanel) => void;
  onResizeStart: (e: React.MouseEvent, panelId: string, bubble: SpeechBubble, handle: string) => void;
  onPanelResizeStart: (e: React.MouseEvent, panel: ComicPanel, handle: string) => void;
  onCanvasClick: (e: React.MouseEvent, panelId: string) => void;
  onImageDrop: (panelId: string, imageUrl: string) => void;
  onPanelSwap?: (sourcePanelId: string, targetPanelId: string) => void;
}

const DroppablePanel: React.FC<DroppablePanelProps> = ({
  panel,
  panelIndex,
  activeTool,
  selectedBubbleId,
  selectedPanelId,
  isCustomLayout,
  onBubbleSelect,
  onPanelSelect,
  onBubbleDragStart,
  onPanelDragStart,
  onResizeStart,
  onPanelResizeStart,
  onCanvasClick,
  onImageDrop,
  onPanelSwap
}) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'panel',
    item: { panelId: panel.id, imageUrl: panel.imageUrl },
    canDrag: () => !!panel.imageUrl && activeTool === 'select' && !isCustomLayout,
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  }), [panel.imageUrl, panel.id, activeTool, isCustomLayout]);

  const [{ isOverPanel }, dropPanel] = useDrop(() => ({
    accept: 'panel',
    drop: (item: DraggedPanel) => {
      if (item.panelId !== panel.id && onPanelSwap) {
        onPanelSwap(item.panelId, panel.id);
      }
    },
    collect: (monitor) => ({
      isOverPanel: monitor.isOver() && monitor.canDrop()
    })
  }), [panel.id, onPanelSwap]);

  const [{ isOver }, dropImage] = useDrop(() => ({
    accept: 'image',
    drop: (item: DraggedImage) => {
      onImageDrop(panel.id, item.imageUrl);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver()
    })
  }), [panel.id, onImageDrop]);

  const attachRefs = (el: HTMLDivElement | null) => {
    if (!isCustomLayout) {
      drag(el);
      dropPanel(el);
    }
    dropImage(el);
  };

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

  const isPanelSelected = selectedPanelId === panel.id;
  const showPanelControls = isCustomLayout && activeTool === 'select' && isPanelSelected;

  return (
    <div
      ref={attachRefs}
      className={`absolute border-2 overflow-hidden transition-all ${
        isPanelSelected && isCustomLayout ? 'ring-2 ring-blue-500 border-blue-500' :
        isOverPanel ? 'border-green-500 bg-green-50/30 ring-2 ring-green-400' :
        isOver ? 'border-blue-500 bg-blue-50/30' : 
        'border-gray-300'
      } ${isDragging ? 'opacity-40' : 'opacity-100'}`}
      style={{
        left: `${panel.x}%`,
        top: `${panel.y}%`,
        width: `${panel.width}%`,
        height: `${panel.height}%`,
        cursor: isCustomLayout && activeTool === 'select' ? 'move' : 
                activeTool === 'bubble' ? 'crosshair' : 
                panel.imageUrl && activeTool === 'select' && !isCustomLayout ? 'move' : 'default'
      }}
      onClick={(e) => {
        if (isCustomLayout && activeTool === 'select') {
          e.stopPropagation();
          onPanelSelect(panel.id);
        } else {
          onCanvasClick(e, panel.id);
        }
      }}
      onMouseDown={(e) => {
        if (isCustomLayout && activeTool === 'select' && isPanelSelected) {
          e.stopPropagation();
          onPanelDragStart(e, panel);
        }
      }}
    >
      {panel.imageUrl ? (
        <>
          <img
            src={panel.imageUrl}
            alt="Panel"
            className="w-full h-full object-cover"
            draggable={false}
          />
          {activeTool === 'select' && (
            <div className="absolute top-1 right-1 bg-blue-600 text-white text-xs px-2 py-0.5 rounded shadow-md font-medium">
              Panel {panelIndex + 1}
            </div>
          )}
        </>
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

      {showPanelControls && (
        <>
          <div
            className="absolute -right-1.5 -top-1.5 w-4 h-4 bg-green-500 rounded-full cursor-nwse-resize border-2 border-white shadow-md z-10"
            onMouseDown={(e) => {
              e.stopPropagation();
              onPanelResizeStart(e, panel, 'tr');
            }}
          />
          <div
            className="absolute -right-1.5 -bottom-1.5 w-4 h-4 bg-green-500 rounded-full cursor-nesw-resize border-2 border-white shadow-md z-10"
            onMouseDown={(e) => {
              e.stopPropagation();
              onPanelResizeStart(e, panel, 'br');
            }}
          />
          <div
            className="absolute -left-1.5 -top-1.5 w-4 h-4 bg-green-500 rounded-full cursor-nesw-resize border-2 border-white shadow-md z-10"
            onMouseDown={(e) => {
              e.stopPropagation();
              onPanelResizeStart(e, panel, 'tl');
            }}
          />
          <div
            className="absolute -left-1.5 -bottom-1.5 w-4 h-4 bg-green-500 rounded-full cursor-nwse-resize border-2 border-white shadow-md z-10"
            onMouseDown={(e) => {
              e.stopPropagation();
              onPanelResizeStart(e, panel, 'bl');
            }}
          />
        </>
      )}
    </div>
  );
};

export const EditorCanvas: React.FC<EditorCanvasProps> = ({
  page,
  zoom,
  activeTool,
  selectedBubbleId,
  selectedPanelId,
  onBubbleSelect,
  onPanelSelect,
  onBubbleUpdate,
  onPanelUpdate,
  onBubbleAdd,
  onImageDrop,
  onCanvasClick,
  onPanelSwap,
  onCustomPanelAdd
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
  const [draggingPanel, setDraggingPanel] = useState<{
    panel: ComicPanel;
    initialPanel: ComicPanel;
  } | null>(null);
  const [resizingPanel, setResizingPanel] = useState<{
    panel: ComicPanel;
    handle: string;
    initialPanel: ComicPanel;
  } | null>(null);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);
  const [customPanelDrawing, setCustomPanelDrawing] = useState<CustomPanelDrawing | null>(null);

  const isCustomLayout = page.layout === 'custom';

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

  const handlePanelDragStart = (e: React.MouseEvent, panel: ComicPanel) => {
    setDraggingPanel({
      panel,
      initialPanel: { ...panel }
    });
    setDragStart({ x: e.clientX, y: e.clientY });
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

  const handlePanelResizeStart = (e: React.MouseEvent, panel: ComicPanel, handle: string) => {
    setResizingPanel({
      panel,
      handle,
      initialPanel: { ...panel }
    });
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (activeTool !== 'custom-panel') return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setCustomPanelDrawing({
      startX: x,
      startY: y,
      width: 0,
      height: 0
    });
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (activeTool === 'custom-panel' && customPanelDrawing) {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const currentX = ((e.clientX - rect.left) / rect.width) * 100;
      const currentY = ((e.clientY - rect.top) / rect.height) * 100;

      setCustomPanelDrawing({
        ...customPanelDrawing,
        width: currentX - customPanelDrawing.startX,
        height: currentY - customPanelDrawing.startY
      });
      return;
    }

    if (!dragStart) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const canvasRect = canvas.getBoundingClientRect();
    const deltaX = ((e.clientX - dragStart.x) / canvasRect.width) * 100;
    const deltaY = ((e.clientY - dragStart.y) / canvasRect.height) * 100;

    if (draggingPanel) {
      const { panel, initialPanel } = draggingPanel;
      const updatedPanel: ComicPanel = {
        ...panel,
        x: Math.max(0, Math.min(100 - initialPanel.width, initialPanel.x + deltaX)),
        y: Math.max(0, Math.min(100 - initialPanel.height, initialPanel.y + deltaY))
      };
      onPanelUpdate(updatedPanel);
      return;
    }

    if (resizingPanel) {
      const { handle, initialPanel, panel } = resizingPanel;
      const updatedPanel: ComicPanel = {
        ...panel,
        x: initialPanel.x,
        y: initialPanel.y,
        width: initialPanel.width,
        height: initialPanel.height
      };

      switch (handle) {
        case 'br':
          updatedPanel.width = Math.max(10, Math.min(100 - initialPanel.x, initialPanel.width + deltaX));
          updatedPanel.height = Math.max(10, Math.min(100 - initialPanel.y, initialPanel.height + deltaY));
          break;
        case 'bl':
          const newWidthBL = Math.max(10, initialPanel.width - deltaX);
          updatedPanel.x = Math.max(0, initialPanel.x + initialPanel.width - newWidthBL);
          updatedPanel.width = newWidthBL;
          updatedPanel.height = Math.max(10, Math.min(100 - initialPanel.y, initialPanel.height + deltaY));
          break;
        case 'tr':
          const newHeightTR = Math.max(10, initialPanel.height - deltaY);
          updatedPanel.y = Math.max(0, initialPanel.y + initialPanel.height - newHeightTR);
          updatedPanel.height = newHeightTR;
          updatedPanel.width = Math.max(10, Math.min(100 - initialPanel.x, initialPanel.width + deltaX));
          break;
        case 'tl':
          const newWidthTL = Math.max(10, initialPanel.width - deltaX);
          const newHeightTL = Math.max(10, initialPanel.height - deltaY);
          updatedPanel.x = Math.max(0, initialPanel.x + initialPanel.width - newWidthTL);
          updatedPanel.y = Math.max(0, initialPanel.y + initialPanel.height - newHeightTL);
          updatedPanel.width = newWidthTL;
          updatedPanel.height = newHeightTL;
          break;
      }

      onPanelUpdate(updatedPanel);
      return;
    }

    const panel = page.panels.find(
      (p) => p.id === (draggingBubble?.panelId || resizingBubble?.panelId)
    );
    if (!panel) return;

    const panelElement = document.querySelector(
      `[data-panel-id="${panel.id}"]`
    )?.firstChild as HTMLElement;
    if (!panelElement) return;

    const rect = panelElement.getBoundingClientRect();
    const bubbleDeltaX = ((e.clientX - dragStart.x) / rect.width) * 100;
    const bubbleDeltaY = ((e.clientY - dragStart.y) / rect.height) * 100;

    if (draggingBubble) {
      const { bubble, initialBubble, panelId } = draggingBubble;
      const updatedBubble: SpeechBubble = {
        ...bubble,
        x: Math.max(
          0,
          Math.min(100 - initialBubble.width, initialBubble.x + bubbleDeltaX)
        ),
        y: Math.max(
          0,
          Math.min(100 - initialBubble.height, initialBubble.y + bubbleDeltaY)
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
          updatedBubble.width = Math.max(10, Math.min(100 - initialBubble.x, initialBubble.width + bubbleDeltaX));
          updatedBubble.height = Math.max(10, Math.min(100 - initialBubble.y, initialBubble.height + bubbleDeltaY));
          break;
        case 'bl':
          const newWidthBL = Math.max(10, initialBubble.width - bubbleDeltaX);
          updatedBubble.x = initialBubble.x + initialBubble.width - newWidthBL;
          updatedBubble.width = newWidthBL;
          updatedBubble.height = Math.max(10, Math.min(100 - initialBubble.y, initialBubble.height + bubbleDeltaY));
          break;
        case 'tr':
          const newHeightTR = Math.max(10, initialBubble.height - bubbleDeltaY);
          updatedBubble.y = initialBubble.y + initialBubble.height - newHeightTR;
          updatedBubble.height = newHeightTR;
          updatedBubble.width = Math.max(10, Math.min(100 - initialBubble.x, initialBubble.width + bubbleDeltaX));
          break;
        case 'tl':
          const newWidthTL = Math.max(10, initialBubble.width - bubbleDeltaX);
          const newHeightTL = Math.max(10, initialBubble.height - bubbleDeltaY);
          updatedBubble.x = initialBubble.x + initialBubble.width - newWidthTL;
          updatedBubble.y = initialBubble.y + initialBubble.height - newHeightTL;
          updatedBubble.width = newWidthTL;
          updatedBubble.height = newHeightTL;
          break;
      }

      onBubbleUpdate(panelId, updatedBubble);
    }
  };

  const handleCanvasMouseUp = () => {
    if (activeTool === 'custom-panel' && customPanelDrawing) {
      const minSize = 10;
      const absWidth = Math.abs(customPanelDrawing.width);
      const absHeight = Math.abs(customPanelDrawing.height);

      if (absWidth >= minSize && absHeight >= minSize && onCustomPanelAdd) {
        const finalX = customPanelDrawing.width < 0 
          ? customPanelDrawing.startX + customPanelDrawing.width 
          : customPanelDrawing.startX;
        const finalY = customPanelDrawing.height < 0 
          ? customPanelDrawing.startY + customPanelDrawing.height 
          : customPanelDrawing.startY;

        onCustomPanelAdd(
          Math.max(0, Math.min(100 - absWidth, finalX)),
          Math.max(0, Math.min(100 - absHeight, finalY)),
          absWidth,
          absHeight
        );
      }
      setCustomPanelDrawing(null);
    }

    setDraggingBubble(null);
    setResizingBubble(null);
    setDraggingPanel(null);
    setResizingPanel(null);
    setDragStart(null);
  };

  const getCustomPanelStyle = () => {
    if (!customPanelDrawing) return {};

    const x = customPanelDrawing.width < 0 
      ? customPanelDrawing.startX + customPanelDrawing.width 
      : customPanelDrawing.startX;
    const y = customPanelDrawing.height < 0 
      ? customPanelDrawing.startY + customPanelDrawing.height 
      : customPanelDrawing.startY;

    return {
      left: `${x}%`,
      top: `${y}%`,
      width: `${Math.abs(customPanelDrawing.width)}%`,
      height: `${Math.abs(customPanelDrawing.height)}%`
    };
  };

  return (
    <div
      className="flex-1 bg-gray-100 overflow-auto flex items-center justify-center p-8"
      onMouseMove={handleCanvasMouseMove}
      onMouseUp={handleCanvasMouseUp}
      onMouseLeave={handleCanvasMouseUp}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onCanvasClick();
        }
      }}
    >
      <div
        ref={canvasRef}
        className="bg-white shadow-2xl relative"
        style={{
          width: DEFAULT_PAGE_WIDTH * zoom,
          height: DEFAULT_PAGE_HEIGHT * zoom,
          transform: `scale(${zoom})`,
          transformOrigin: 'center',
          cursor: activeTool === 'custom-panel' ? 'crosshair' : 'default'
        }}
        onMouseDown={handleCanvasMouseDown}
      >
        {page.panels.map((panel, index) => (
          <div key={panel.id} data-panel-id={panel.id}>
            <DroppablePanel
              panel={panel}
              panelIndex={index}
              activeTool={activeTool}
              selectedBubbleId={selectedBubbleId}
              selectedPanelId={selectedPanelId}
              isCustomLayout={isCustomLayout}
              onBubbleSelect={onBubbleSelect}
              onPanelSelect={onPanelSelect}
              onBubbleDragStart={handleBubbleDragStart}
              onPanelDragStart={handlePanelDragStart}
              onResizeStart={handleResizeStart}
              onPanelResizeStart={handlePanelResizeStart}
              onCanvasClick={handleCanvasClick}
              onImageDrop={onImageDrop}
              onPanelSwap={onPanelSwap}
            />
          </div>
        ))}

        {customPanelDrawing && (
          <div
            className="absolute border-2 border-dashed border-blue-500 bg-blue-100/30 pointer-events-none"
            style={getCustomPanelStyle()}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-blue-600 text-sm font-medium bg-white/90 px-2 py-1 rounded">
                {Math.round(Math.abs(customPanelDrawing.width))}% × {Math.round(Math.abs(customPanelDrawing.height))}%
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};