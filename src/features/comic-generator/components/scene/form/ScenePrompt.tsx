import React, { useState, useRef, useEffect } from 'react';
import { Reference } from '../../../types/domain/reference';
import { getMentionLabel } from '../../../utils/sceneUtils';

interface ScenePromptProps {
  prompt: string;
  references: Reference[];
  onChange: (value: string) => void;
  onMention: (referenceId: string) => void;
  disabled?: boolean;
  className?: string;
}

export const ScenePrompt: React.FC<ScenePromptProps> = ({
  prompt,
  references,
  onChange,
  onMention,
  disabled,
  className
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [cursorPos, setCursorPos] = useState(0);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    const pos = e.target.selectionStart;
    onChange(val);
    setCursorPos(pos);
    setShowMenu(val[pos - 1] === '@');
  };

  const handleInsert = (ref: Reference) => {
    const label = getMentionLabel(ref);
    const before = prompt.slice(0, cursorPos);
    const after = prompt.slice(cursorPos);
    const lastAt = before.lastIndexOf('@');
    
    if (lastAt !== -1) {
      const newText = prompt.slice(0, lastAt) + `@${label} ` + after;
      onChange(newText);
      onMention(ref.id);
      setShowMenu(false);
    }
  };

  const renderHighlights = () => {
    if (!prompt) return <span className="text-gray-400 italic">Describe scene details... Type @ to mention</span>;
    
    return prompt.split(/(@[\w-]+)/g).map((part, i) => {
      if (part.startsWith('@')) {
        const label = part.slice(1);
        if (references.some(r => getMentionLabel(r) === label)) {
          return (
            <span key={i} className="text-teal-600 bg-teal-50 rounded-[2px]">
              {part}
            </span>
          );
        }
      }
      return <span key={i}>{part}</span>;
    });
  };

  useEffect(() => {
    const closeMenu = (e: MouseEvent) => {
      if (showMenu && !(e.target as HTMLElement).closest('.mention-menu')) setShowMenu(false);
    };
    document.addEventListener('mousedown', closeMenu);
    return () => document.removeEventListener('mousedown', closeMenu);
  }, [showMenu]);

  return (
    <div className={`relative flex flex-col ${className}`}>
      <div 
        className="relative flex-1 w-full rounded-lg bg-gray-50 ring-1 ring-inset ring-gray-200 transition-all duration-200 ease-in-out focus-within:bg-white focus-within:ring-2 focus-within:ring-inset focus-within:ring-teal-500 overflow-hidden"
      >
        {/* Backdrop Layer */}
        <div 
          ref={backdropRef} 
          className="absolute inset-0 p-3 whitespace-pre-wrap break-words font-sans text-sm leading-relaxed text-gray-800 pointer-events-none overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200"
        >
          {renderHighlights()}
        </div>
        
        {/* Input Layer */}
        <textarea
          ref={textareaRef}
          value={prompt}
          onChange={handleChange}
          onClick={(e) => setCursorPos(e.currentTarget.selectionStart)}
          onScroll={() => backdropRef.current && (backdropRef.current.scrollTop = textareaRef.current?.scrollTop || 0)}
          disabled={disabled}
          className="absolute inset-0 w-full h-full p-3 bg-transparent text-transparent caret-gray-900 border-none focus:ring-0 outline-none resize-none font-sans text-sm leading-relaxed scrollbar-thin scrollbar-thumb-gray-200 placeholder-transparent"
          spellCheck={false}
        />
      </div>

      {showMenu && (
        <div className="mention-menu absolute z-50 bottom-full left-0 mb-2 w-64 bg-white ring-1 ring-gray-200 rounded-lg shadow-xl max-h-48 overflow-y-auto animate-in fade-in zoom-in-95 duration-100 custom-scrollbar">
          {references.map(ref => (
            <button key={ref.id} onClick={() => handleInsert(ref)} className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-50 text-left border-b border-gray-50 last:border-0 transition-colors">
              <img src={ref.imageUrl} className="w-8 h-8 rounded-full object-cover ring-1 ring-gray-100" alt="" />
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{ref.name}</p>
                <p className="text-xs text-gray-500 truncate">@{getMentionLabel(ref)}</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};