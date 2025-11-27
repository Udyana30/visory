import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { Reference } from '../../types/domain/reference';
import { getMentionLabel } from '../../utils/sceneUtils';

interface ScenePromptProps {
  prompt: string;
  references: Reference[];
  onChange: (value: string) => void;
  onMention: (referenceId: string) => void;
  disabled?: boolean;
}

export const ScenePrompt: React.FC<ScenePromptProps> = ({
  prompt,
  references,
  onChange,
  onMention,
  disabled
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
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
    if (!prompt) return <span className="text-gray-400 italic">Describe scene... Type @ to mention</span>;
    return prompt.split(/(@[\w-]+)/g).map((part, i) => {
      if (part.startsWith('@')) {
        const label = part.slice(1);
        if (references.some(r => getMentionLabel(r) === label)) {
          return <span key={i} className="text-blue-600 font-medium bg-blue-50/50 rounded-sm">{part}</span>;
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
    <div className="mb-6">
      <div className="flex items-center justify-between mb-2">
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">Description</label>
        <button onClick={() => setIsExpanded(!isExpanded)} className="text-gray-400 hover:text-gray-600">
          <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {isExpanded && (
        <div className="relative">
          <div className="relative h-32 w-full rounded-lg bg-white border border-gray-300 focus-within:ring-2 focus-within:ring-teal-500 overflow-hidden">
            <div ref={backdropRef} className="absolute inset-0 p-3 whitespace-pre-wrap break-words font-sans text-sm leading-relaxed text-gray-800 pointer-events-none">
              {renderHighlights()}
            </div>
            <textarea
              ref={textareaRef}
              value={prompt}
              onChange={handleChange}
              onClick={(e) => setCursorPos(e.currentTarget.selectionStart)}
              onScroll={() => backdropRef.current && (backdropRef.current.scrollTop = textareaRef.current?.scrollTop || 0)}
              disabled={disabled}
              className="absolute inset-0 w-full h-full p-3 bg-transparent text-transparent caret-gray-900 border-none focus:ring-0 resize-none font-sans text-sm leading-relaxed"
              spellCheck={false}
            />
          </div>

          {showMenu && (
            <div className="mention-menu absolute z-20 top-12 left-0 w-64 bg-white border border-gray-200 rounded-lg shadow-xl max-h-48 overflow-y-auto">
              {references.map(ref => (
                <button key={ref.id} onClick={() => handleInsert(ref)} className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-50 text-left border-b border-gray-50 last:border-0">
                  <img src={ref.imageUrl} className="w-8 h-8 rounded-full object-cover" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 truncate">{ref.name}</p>
                    <p className="text-xs text-gray-500">@{getMentionLabel(ref)}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};