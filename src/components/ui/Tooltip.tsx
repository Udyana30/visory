import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

interface TooltipProps {
  content: string;
  children: React.ReactElement;
}

export const Tooltip: React.FC<TooltipProps> = ({ content, children }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setCoords({
        top: rect.top + window.scrollY,
        left: rect.left + window.scrollX + (rect.width / 2)
      });
      setIsVisible(true);
    }
  };

  const handleMouseLeave = () => {
    setIsVisible(false);
  };

  return (
    <>
      <div 
        ref={triggerRef}
        onMouseEnter={handleMouseEnter} 
        onMouseLeave={handleMouseLeave}
        className="inline-flex cursor-help"
      >
        {children}
      </div>
      
      {isVisible && createPortal(
        <div 
          ref={tooltipRef}
          style={{ 
            top: coords.top - 8, 
            left: coords.left,
            transform: 'translate(-50%, -100%)' 
          }}
          className="fixed z-[9999] w-56 p-3 bg-white text-gray-600 text-[11px] font-normal leading-relaxed rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100 animate-in fade-in zoom-in-95 duration-200 pointer-events-none"
        >
          {content}
          <div className="absolute left-1/2 -bottom-1.5 w-3 h-3 bg-white border-r border-b border-gray-100 rotate-45 -translate-x-1/2" />
        </div>,
        document.body
      )}
    </>
  );
};