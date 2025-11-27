import React from 'react';
import { SpeechBubble } from '../../../../types/domain/editor';

interface BubbleTailProps {
  bubble: SpeechBubble;
}

export const BubbleTail: React.FC<BubbleTailProps> = ({ bubble }) => {
  if (!bubble.style.showTail || ['narration', 'whisper'].includes(bubble.variant)) return null;

  const { backgroundColor, borderColor, borderWidth } = bubble.style;

  if (bubble.variant === 'thought') {
    return (
      <div className="absolute -bottom-6 left-8 flex flex-col items-center gap-1 z-[-1]">
        <div className="w-3 h-3 rounded-full" style={{ backgroundColor, borderWidth: `${borderWidth}px`, borderStyle: 'solid', borderColor }} />
        <div className="w-2 h-2 rounded-full" style={{ backgroundColor, borderWidth: `${borderWidth}px`, borderStyle: 'solid', borderColor }} />
      </div>
    );
  }

  return (
    <div 
      className="absolute pointer-events-none"
      style={{ 
        bottom: `-${12 + borderWidth}px`, 
        left: '20%', width: '20px', height: '20px', zIndex: 51 
      }}
    >
      <svg width="100%" height="100%" viewBox="0 0 20 20" style={{ overflow: 'visible' }}>
        <path d="M0 0 L20 0 L5 15 Z" fill={backgroundColor} stroke={borderColor} strokeWidth={borderWidth} strokeLinejoin="round" />
        <path d="M0 0 L20 0" stroke={backgroundColor} strokeWidth={borderWidth + 2} fill="none" />
      </svg>
    </div>
  );
};