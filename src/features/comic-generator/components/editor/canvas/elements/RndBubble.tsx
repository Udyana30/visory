import React, { useState, useRef, useEffect } from 'react';
import { Rnd, RndResizeCallback } from 'react-rnd';
import { DraggableData, DraggableEvent } from 'react-draggable';
import { SpeechBubble } from '@/features/comic-generator/types/domain/editor';
import { useCanvasMath } from '../hooks/useCanvasMath';
import { BubbleTail } from './BubbleTail';
import { customResizeHandles } from './ResizeHandle';

interface RndBubbleProps {
  bubble: SpeechBubble;
  zoom: number;
  isSelected: boolean;
  canvasSize: { width: number; height: number };
  onSelect: (id: string) => void;
  onUpdate: (id: string, changes: Partial<SpeechBubble>) => void;
}

const HANDLE_STYLES = {
  topLeft: { left: -14, top: -4 },
  topRight: { right: -22, top: -4 },
  bottomLeft: { left: -14, bottom: -12 },
  bottomRight: { right: -22, bottom: -12 },
};

export const RndBubble: React.FC<RndBubbleProps> = ({
  bubble,
  zoom,
  isSelected,
  canvasSize,
  onSelect,
  onUpdate
}) => {
  const { toPx, toPercent } = useCanvasMath(canvasSize.width, canvasSize.height);
  const [isEditing, setIsEditing] = useState(false);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isEditing && textRef.current) {
      textRef.current.focus();
      const range = document.createRange();
      range.selectNodeContents(textRef.current);
      const sel = window.getSelection();
      sel?.removeAllRanges();
      sel?.addRange(range);
    }
  }, [isEditing]);

  const handleDragStop = (e: DraggableEvent, d: DraggableData) => {
    onUpdate(bubble.id, { 
      x: toPercent(d.x, canvasSize.width), 
      y: toPercent(d.y, canvasSize.height) 
    });
  };

  const handleResizeStop: RndResizeCallback = (e, dir, ref, delta, position) => {
    onUpdate(bubble.id, {
      width: toPercent(ref.offsetWidth, canvasSize.width),
      height: toPercent(ref.offsetHeight, canvasSize.height),
      x: toPercent(position.x, canvasSize.width),
      y: toPercent(position.y, canvasSize.height)
    });
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
    onSelect(bubble.id);
  };

  const handleBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    setIsEditing(false);
    if (textRef.current) {
      onUpdate(bubble.id, { text: textRef.current.innerText });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    e.stopPropagation();
  };

  const textStyle: React.CSSProperties = {
    fontFamily: bubble.style.fontFamily,
    fontSize: `${bubble.style.fontSize}px`,
    fontWeight: bubble.style.fontWeight as any,
    fontStyle: bubble.style.fontStyle as any,
    textDecoration: bubble.style.textDecoration,
    textAlign: bubble.style.textAlign,
    color: bubble.style.color,
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center', 
    justifyContent: bubble.style.textAlign === 'center' ? 'center' : 
                    bubble.style.textAlign === 'right' ? 'flex-end' : 'flex-start',
    lineHeight: 1.2,
    wordBreak: 'break-word',
    outline: 'none',
    cursor: isEditing ? 'text' : 'move',
    userSelect: isEditing ? 'text' : 'none',
    pointerEvents: isEditing ? 'auto' : 'none',
  };

  return (
    <Rnd
      size={{ width: toPx(bubble.width, canvasSize.width), height: toPx(bubble.height, canvasSize.height) }}
      position={{ x: toPx(bubble.x, canvasSize.width), y: toPx(bubble.y, canvasSize.height) }}
      scale={zoom}
      bounds="parent"
      dragAxis="both"
      disableDragging={!isSelected || isEditing}
      enableResizing={isSelected && !isEditing ? undefined : false}
      resizeHandleComponent={isSelected && !isEditing ? customResizeHandles : undefined}
      resizeHandleStyles={isSelected && !isEditing ? HANDLE_STYLES : undefined}
      onDragStart={(e) => { 
        e.stopPropagation(); 
        onSelect(bubble.id); 
      }}
      onDragStop={handleDragStop}
      onResizeStop={handleResizeStop}
      onClick={(e: React.MouseEvent) => { 
        e.stopPropagation(); 
        if (!isEditing) onSelect(bubble.id); 
      }}
      onDoubleClick={handleDoubleClick}
      style={{
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        zIndex: isSelected ? 100 : bubble.zIndex,
        backgroundColor: bubble.style.backgroundColor,
        border: `${bubble.style.borderWidth}px ${bubble.variant === 'whisper' ? 'dashed' : 'solid'} ${bubble.style.borderColor}`,
        borderRadius: bubble.variant === 'thought' ? '50%' : bubble.variant === 'shout' ? '4px' : '16px',
        transform: bubble.variant === 'shout' ? 'rotate(-2deg)' : 'none'
      }}
      className={isSelected ? 'ring-2 ring-blue-500' : ''}
    >
      <div
        ref={textRef}
        contentEditable={isEditing}
        suppressContentEditableWarning={true}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        style={textStyle}
      >
        {bubble.text}
      </div>
      
      <BubbleTail bubble={bubble} />
    </Rnd>
  );
};