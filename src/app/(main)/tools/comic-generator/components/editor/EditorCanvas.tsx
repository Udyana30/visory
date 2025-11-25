import React, { useRef, useState } from 'react';
import { useDrop, useDrag } from 'react-dnd';
import { ComicPage, ComicPanel, SpeechBubble, DraggedImage, DraggedPanel, CustomPanelDrawing } from '@/app/(main)/tools/comic-generator/types/editor';
import { DEFAULT_PAGE_WIDTH, DEFAULT_PAGE_HEIGHT } from '@/app/(main)/tools/comic-generator/lib/editorConstants';

interface EditorCanvasProps {
  page: ComicPage;
  zoom: number;
  activeTool: string;
  selectedBubbleId: string | null;
  selectedPanelId: string | null;
  onBubbleSelect: (bubbleId: string | null) => void;
  onPanelSelect: (panelId: string | null) => void;
  onBubbleUpdate: (bubble: SpeechBubble) => void;
  onPanelUpdate: (panel: ComicPanel) => void;
  onBubbleAdd: (x: number, y: number) => void;
  onImageDrop: (panelId: string, imageUrl: string) => void;
  onCanvasClick: () => void;
  onPanelSwap?: (sourcePanelId: string, targetPanelId: string) => void;
  onCustomPanelAdd?: (x: number, y: number, width: number, height: number) => void;
}

interface DroppablePanelProps {
  panel: ComicPanel;
  panelIndex: number;
  activeTool: string;
  selectedPanelId: string | null;
  isCustomLayout: boolean;
  onPanelSelect: (panelId: string | null) => void;
  onPanelDragStart: (e: React.MouseEvent, panel: ComicPanel) => void;
  onPanelResizeStart: (e: React.MouseEvent, panel: ComicPanel, handle: string) => void;
  onCanvasClick: (e: React.MouseEvent, panelId: string) => void;
  onImageDrop: (panelId: string, imageUrl: string) => void;
  onPanelSwap?: (sourcePanelId: string, targetPanelId: string) => void;
}

const DroppablePanel: React.FC<DroppablePanelProps> = ({
  panel,
  panelIndex,
  activeTool,
  selectedPanelId,
  isCustomLayout,
  onPanelSelect,
  onPanelDragStart,
  onPanelResizeStart,
  onCanvasClick,
  onImageDrop,
  onPanelSwap
}) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'panel',
    item: { panelId: panel.id, imageUrl: panel.imageUrl },
    canDrag: () => !!panel.imageUrl && activeTool === 'select' && !isCustomLayout,
    collect: (monitor) => ({ isDragging: monitor.isDragging() })
  }), [panel.imageUrl, panel.id, activeTool, isCustomLayout]);

  const [{ isOverPanel }, dropPanel] = useDrop(() => ({
    accept: 'panel',
    drop: (item: DraggedPanel) => {
      if (item.panelId !== panel.id && onPanelSwap) onPanelSwap(item.panelId, panel.id);
    },
    collect: (monitor) => ({ isOverPanel: monitor.isOver() && monitor.canDrop() })
  }), [panel.id, onPanelSwap]);

  const [{ isOver }, dropImage] = useDrop(() => ({
    accept: 'image',
    drop: (item: DraggedImage) => onImageDrop(panel.id, item.imageUrl),
    collect: (monitor) => ({ isOver: monitor.isOver() })
  }), [panel.id, onImageDrop]);

  const attachRefs = (el: HTMLDivElement | null) => {
    if (!isCustomLayout) { drag(el); dropPanel(el); }
    dropImage(el);
  };

  const isPanelSelected = selectedPanelId === panel.id;
  const showPanelControls = isCustomLayout && activeTool === 'select' && isPanelSelected;

  return (
    <div
      ref={attachRefs}
      className={`absolute border-2 overflow-hidden transition-all ${
        isPanelSelected && isCustomLayout ? 'ring-2 ring-blue-500 border-blue-500' :
        isOverPanel ? 'border-green-500 bg-green-50/30 ring-2 ring-green-400' :
        isOver ? 'border-blue-500 bg-blue-50/30' : 'border-gray-300'
      } ${isDragging ? 'opacity-40' : 'opacity-100'}`}
      style={{
        left: `${panel.x}%`, top: `${panel.y}%`, width: `${panel.width}%`, height: `${panel.height}%`,
        cursor: isCustomLayout && activeTool === 'select' ? 'move' : 
                panel.imageUrl && activeTool === 'select' && !isCustomLayout ? 'move' : 'default',
        zIndex: 10
      }}
      onClick={(e) => {
        if (isCustomLayout && activeTool === 'select') { e.stopPropagation(); onPanelSelect(panel.id); } 
        else { onCanvasClick(e, panel.id); }
      }}
      onMouseDown={(e) => {
        if (isCustomLayout && activeTool === 'select' && isPanelSelected) { e.stopPropagation(); onPanelDragStart(e, panel); }
      }}
    >
      {panel.imageUrl ? (
        <img 
          src={panel.imageUrl} 
          alt="Panel" 
          className="w-full h-full object-cover transition-transform duration-100"
          draggable={false} 
          style={{
            objectPosition: `${panel.imagePosition?.x || 50}% ${panel.imagePosition?.y || 50}%`,
            transform: `scale(${panel.imageScale || 1})`
          }}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gray-50">
          <p className="text-gray-400 text-sm font-medium">Drag image here</p>
        </div>
      )}
      {activeTool === 'select' && panel.imageUrl && (
        <div className="absolute top-1 right-1 bg-blue-600 text-white text-xs px-2 py-0.5 rounded shadow-md pointer-events-none">
          Panel {panelIndex + 1}
        </div>
      )}
      {showPanelControls && (
        <>
          <div className="absolute -right-1.5 -top-1.5 w-4 h-4 bg-green-500 rounded-full cursor-nwse-resize border-2 border-white shadow-md z-30" onMouseDown={(e) => {e.stopPropagation(); onPanelResizeStart(e, panel, 'tr');}} />
          <div className="absolute -right-1.5 -bottom-1.5 w-4 h-4 bg-green-500 rounded-full cursor-nesw-resize border-2 border-white shadow-md z-30" onMouseDown={(e) => {e.stopPropagation(); onPanelResizeStart(e, panel, 'br');}} />
          <div className="absolute -left-1.5 -top-1.5 w-4 h-4 bg-green-500 rounded-full cursor-nesw-resize border-2 border-white shadow-md z-30" onMouseDown={(e) => {e.stopPropagation(); onPanelResizeStart(e, panel, 'tl');}} />
          <div className="absolute -left-1.5 -bottom-1.5 w-4 h-4 bg-green-500 rounded-full cursor-nwse-resize border-2 border-white shadow-md z-30" onMouseDown={(e) => {e.stopPropagation(); onPanelResizeStart(e, panel, 'bl');}} />
        </>
      )}
    </div>
  );
};

const BubbleTail: React.FC<{ bubble: SpeechBubble }> = ({ bubble }) => {
  if (!bubble.showTail) return null;
  if (bubble.type === 'narration' || bubble.type === 'whisper') return null;

  const tailColor = bubble.backgroundColor;
  const borderColor = bubble.borderColor;
  const borderWidth = bubble.borderWidth;

  if (bubble.type === 'thought') {
    return (
      <div className="absolute -bottom-6 left-8 flex flex-col items-center gap-1 z-[-1]">
        <div 
          className="w-3 h-3 rounded-full" 
          style={{ backgroundColor: tailColor, borderWidth: `${borderWidth}px`, borderStyle: 'solid', borderColor: borderColor }} 
        />
        <div 
          className="w-2 h-2 rounded-full" 
          style={{ backgroundColor: tailColor, borderWidth: `${borderWidth}px`, borderStyle: 'solid', borderColor: borderColor }} 
        />
      </div>
    );
  }

  if (bubble.type === 'speech' || bubble.type === 'shout') {
    return (
      <div 
        className="absolute pointer-events-none"
        style={{ 
          bottom: `-${14 + borderWidth}px`, 
          left: '20%', 
          width: '20px', 
          height: '20px',
          zIndex: 51, 
          transform: 'translateY(-1px)'
        }}
      >
        <svg width="100%" height="100%" viewBox="0 0 20 20" style={{ overflow: 'visible' }}>
          <path 
            d="M0 0 L20 0 L5 15 Z" 
            fill={tailColor} 
            stroke={borderColor} 
            strokeWidth={borderWidth}
            strokeLinejoin="round"
          />
          <path 
            d="M0 0 L20 0" 
            stroke={tailColor} 
            strokeWidth={borderWidth + 2} 
            fill="none"
          />
        </svg>
      </div>
    );
  }

  return null;
};

interface DraggableBubbleProps {
  bubble: SpeechBubble;
  selectedBubbleId: string | null;
  onBubbleSelect: (id: string) => void;
  onBubbleDragStart: (e: React.MouseEvent, bubble: SpeechBubble) => void;
  onResizeStart: (e: React.MouseEvent, bubble: SpeechBubble, handle: string) => void;
}

const DraggableBubble: React.FC<DraggableBubbleProps> = ({
  bubble,
  selectedBubbleId,
  onBubbleSelect,
  onBubbleDragStart,
  onResizeStart
}) => {
  const getBubbleStyle = () => {
    return {
      left: `${bubble.x}%`,
      top: `${bubble.y}%`,
      width: `${bubble.width}%`,
      height: `${bubble.height}%`,
      backgroundColor: bubble.backgroundColor,
      borderWidth: `${bubble.borderWidth}px`,
      borderStyle: bubble.type === 'whisper' ? 'dashed' : 'solid',
      borderColor: bubble.borderColor,
      borderRadius: bubble.type === 'thought' ? '50%' :
                    bubble.type === 'shout' ? '4px' :
                    bubble.type === 'narration' ? '0px' : '16px',
      transform: bubble.type === 'shout' ? 'rotate(-2deg)' : 'none',
      cursor: 'move',
      zIndex: selectedBubbleId === bubble.id ? 50 : 20,
      boxSizing: 'border-box' as const
    };
  };

  return (
    <div
      className={`absolute flex items-center justify-center p-2 select-none transition-shadow ${
        selectedBubbleId === bubble.id ? 'shadow-lg ring-2 ring-blue-500' : 'hover:shadow-md'
      }`}
      style={getBubbleStyle()}
      onMouseDown={(e) => { e.stopPropagation(); onBubbleDragStart(e, bubble); }}
      onClick={(e) => { e.stopPropagation(); onBubbleSelect(bubble.id); }}
    >
      <div className="text-center w-full overflow-hidden pointer-events-none relative z-10" style={{
        fontSize: `${bubble.fontSize}px`, 
        fontFamily: bubble.fontFamily,
        fontWeight: bubble.fontWeight,
        fontStyle: bubble.fontStyle,
        textDecoration: bubble.textDecoration,
        textAlign: bubble.textAlign, 
        color: bubble.color
      }}>
        {bubble.text || 'Click to edit'}
      </div>
      
      <BubbleTail bubble={bubble} />
      
      {selectedBubbleId === bubble.id && (
        <>
          <div className="absolute -right-1.5 -top-1.5 w-4 h-4 bg-blue-500 rounded-full cursor-nwse-resize border-2 border-white shadow-md z-20" onMouseDown={(e) => {e.stopPropagation(); onResizeStart(e, bubble, 'tr');}} />
          <div className="absolute -right-1.5 -bottom-1.5 w-4 h-4 bg-blue-500 rounded-full cursor-nesw-resize border-2 border-white shadow-md z-20" onMouseDown={(e) => {e.stopPropagation(); onResizeStart(e, bubble, 'br');}} />
          <div className="absolute -left-1.5 -top-1.5 w-4 h-4 bg-blue-500 rounded-full cursor-nesw-resize border-2 border-white shadow-md z-20" onMouseDown={(e) => {e.stopPropagation(); onResizeStart(e, bubble, 'tl');}} />
          <div className="absolute -left-1.5 -bottom-1.5 w-4 h-4 bg-blue-500 rounded-full cursor-nwse-resize border-2 border-white shadow-md z-20" onMouseDown={(e) => {e.stopPropagation(); onResizeStart(e, bubble, 'bl');}} />
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
  const [draggingBubble, setDraggingBubble] = useState<{ bubble: SpeechBubble; initial: SpeechBubble } | null>(null);
  const [resizingBubble, setResizingBubble] = useState<{ bubble: SpeechBubble; handle: string; initial: SpeechBubble } | null>(null);
  const [draggingPanel, setDraggingPanel] = useState<{ panel: ComicPanel; initial: ComicPanel } | null>(null);
  const [resizingPanel, setResizingPanel] = useState<{ panel: ComicPanel; handle: string; initial: ComicPanel } | null>(null);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);
  const [customPanelDrawing, setCustomPanelDrawing] = useState<CustomPanelDrawing | null>(null);

  const handleBubbleDragStart = (e: React.MouseEvent, bubble: SpeechBubble) => {
    setDraggingBubble({ bubble, initial: { ...bubble } });
    setDragStart({ x: e.clientX, y: e.clientY });
    onBubbleSelect(bubble.id);
  };

  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (activeTool === 'custom-panel') {
      const rect = e.currentTarget.getBoundingClientRect();
      setCustomPanelDrawing({
        startX: ((e.clientX - rect.left) / rect.width) * 100,
        startY: ((e.clientY - rect.top) / rect.height) * 100,
        width: 0, height: 0
      });
    }
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!dragStart && !customPanelDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const deltaX = ((e.clientX - (dragStart?.x || 0)) / rect.width) * 100;
    const deltaY = ((e.clientY - (dragStart?.y || 0)) / rect.height) * 100;

    if (activeTool === 'custom-panel' && customPanelDrawing) {
      const currentX = ((e.clientX - rect.left) / rect.width) * 100;
      const currentY = ((e.clientY - rect.top) / rect.height) * 100;
      setCustomPanelDrawing({
        ...customPanelDrawing,
        width: currentX - customPanelDrawing.startX,
        height: currentY - customPanelDrawing.startY
      });
      return;
    }

    if (draggingPanel) {
       const { initial } = draggingPanel;
       onPanelUpdate({
         ...draggingPanel.panel,
         x: Math.max(0, initial.x + deltaX),
         y: Math.max(0, initial.y + deltaY)
       });
       return;
    }

    if (resizingPanel) {
      const { handle, initial, panel } = resizingPanel;
      const updated = { ...panel };
      if (handle.includes('r')) {
        updated.width = Math.max(10, initial.width + deltaX);
        if (handle.includes('b')) updated.height = Math.max(10, initial.height + deltaY);
        else {
          updated.y = Math.min(initial.y + initial.height - 10, initial.y + deltaY);
          updated.height = Math.max(10, initial.height - deltaY);
        }
      }
      if (handle.includes('l')) {
        const w = Math.max(10, initial.width - deltaX);
        updated.x = initial.x + initial.width - w;
        updated.width = w;
        if (handle.includes('b')) updated.height = Math.max(10, initial.height + deltaY);
        else {
          updated.y = Math.min(initial.y + initial.height - 10, initial.y + deltaY);
          updated.height = Math.max(10, initial.height - deltaY);
        }
      }
      onPanelUpdate(updated);
      return;
    }

    if (draggingBubble) {
      const { initial } = draggingBubble;
      onBubbleUpdate({
        ...draggingBubble.bubble,
        x: Math.max(0, Math.min(100 - initial.width, initial.x + deltaX)),
        y: Math.max(0, Math.min(100 - initial.height, initial.y + deltaY))
      });
    } else if (resizingBubble) {
      const { handle, initial } = resizingBubble;
      const updated = { ...resizingBubble.bubble };
      if (handle.includes('r')) updated.width = Math.max(5, initial.width + deltaX);
      if (handle.includes('b')) updated.height = Math.max(5, initial.height + deltaY);
      if (handle.includes('l')) {
        const w = Math.max(5, initial.width - deltaX);
        updated.x = initial.x + initial.width - w;
        updated.width = w;
      }
      if (handle.includes('t')) {
        const h = Math.max(5, initial.height - deltaY);
        updated.y = initial.y + initial.height - h;
        updated.height = h;
      }
      onBubbleUpdate(updated);
    }
  };

  const handleCanvasMouseUp = () => {
    if (activeTool === 'custom-panel' && customPanelDrawing && onCustomPanelAdd) {
       const w = Math.abs(customPanelDrawing.width);
       const h = Math.abs(customPanelDrawing.height);
       if (w > 5 && h > 5) onCustomPanelAdd(
         customPanelDrawing.width < 0 ? customPanelDrawing.startX + customPanelDrawing.width : customPanelDrawing.startX,
         customPanelDrawing.height < 0 ? customPanelDrawing.startY + customPanelDrawing.height : customPanelDrawing.startY,
         w, h
       );
    }
    setDraggingBubble(null); setResizingBubble(null); setDraggingPanel(null); setResizingPanel(null); setDragStart(null); setCustomPanelDrawing(null);
  };

  return (
    <div className="flex-1 bg-gray-100 overflow-auto flex items-center justify-center p-8"
      onMouseMove={handleCanvasMouseMove} onMouseUp={handleCanvasMouseUp} onMouseLeave={handleCanvasMouseUp}
      onClick={(e) => { if (e.target === e.currentTarget) onCanvasClick(); }}>
      
      <div ref={canvasRef} className="bg-white shadow-2xl relative"
        style={{
          width: DEFAULT_PAGE_WIDTH * zoom, height: DEFAULT_PAGE_HEIGHT * zoom,
          transform: `scale(${zoom})`, transformOrigin: 'center',
          cursor: activeTool === 'custom-panel' ? 'crosshair' : activeTool === 'bubble' ? 'text' : 'default'
        }}
        onMouseDown={handleCanvasMouseDown}
        onClick={(e) => {
          if (activeTool === 'bubble') {
            const rect = e.currentTarget.getBoundingClientRect();
            onBubbleAdd(((e.clientX - rect.left) / rect.width) * 100, ((e.clientY - rect.top) / rect.height) * 100);
          }
        }}
      >
        {page.panels.map((panel, idx) => (
          <DroppablePanel
            key={panel.id} panel={panel} panelIndex={idx} activeTool={activeTool}
            selectedPanelId={selectedPanelId} isCustomLayout={page.layout === 'custom'}
            onPanelSelect={onPanelSelect} onPanelDragStart={(e, p) => {setDraggingPanel({panel: p, initial: {...p}}); setDragStart({x:e.clientX, y:e.clientY});}}
            onPanelResizeStart={(e, p, h) => {setResizingPanel({panel: p, handle: h, initial: {...p}}); setDragStart({x:e.clientX, y:e.clientY});}}
            onCanvasClick={onCanvasClick} onImageDrop={onImageDrop} onPanelSwap={onPanelSwap}
          />
        ))}

        {page.bubbles?.map((bubble) => (
          <DraggableBubble
            key={bubble.id}
            bubble={bubble}
            selectedBubbleId={selectedBubbleId}
            onBubbleSelect={onBubbleSelect}
            onBubbleDragStart={handleBubbleDragStart}
            onResizeStart={(e, b, h) => {
              setResizingBubble({ bubble: b, handle: h, initial: { ...b } });
              setDragStart({ x: e.clientX, y: e.clientY });
            }}
          />
        ))}

        {customPanelDrawing && (
          <div className="absolute border-2 border-dashed border-blue-500 bg-blue-100/30 pointer-events-none"
            style={{
              left: `${customPanelDrawing.width < 0 ? customPanelDrawing.startX + customPanelDrawing.width : customPanelDrawing.startX}%`,
              top: `${customPanelDrawing.height < 0 ? customPanelDrawing.startY + customPanelDrawing.height : customPanelDrawing.startY}%`,
              width: `${Math.abs(customPanelDrawing.width)}%`, height: `${Math.abs(customPanelDrawing.height)}%`
            }}
          />
        )}
      </div>
    </div>
  );
};