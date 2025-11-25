import React, { useState, useRef, useEffect } from 'react';
import { MoreVertical, ChevronDown, Trash2, Wand2 } from 'lucide-react';
import { Character } from '@/app/(main)/tools/comic-generator/types/comic';
import { SceneVisualization } from '@/app/(main)/tools/comic-generator/types/scene';
import {
  ASPECT_RATIOS,
  SHOT_TYPES,
  SHOT_SIZES,
  SHOT_ANGLES,
  LIGHTING_OPTIONS,
  MOOD_OPTIONS,
  COMPOSITION_OPTIONS
} from '@/app/(main)/tools/comic-generator/lib/scene';
import { getMentionLabel } from '@/app/(main)/tools/comic-generator/lib/sceneUtils';

interface SceneCardProps {
  scene: SceneVisualization;
  index: number;
  characters: Character[];
  isGenerating?: boolean;
  projectId: number | null;
  onChange: (field: keyof SceneVisualization, value: string | string[]) => void;
  onDelete: () => void;
  onGenerate: () => void;
}

export const SceneCard: React.FC<SceneCardProps> = ({
  scene,
  index,
  characters,
  isGenerating = false,
  projectId,
  onChange,
  onDelete,
  onGenerate
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [showMenu, setShowMenu] = useState(false);
  const [showCharacterMenu, setShowCharacterMenu] = useState(false);
  const [cursorPosition, setCursorPosition] = useState(0);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);

  const isRegenerating = scene.imageUrl && !scene.id.startsWith('temp_');
  const canGenerate = scene.prompt.trim() && !isGenerating && projectId;

  const toggleCharacter = (charId: string) => {
    const isSelected = scene.characters.includes(charId);
    const canSelect = !isSelected && scene.characters.length < 2;
    
    const updated = isSelected
      ? scene.characters.filter(id => id !== charId)
      : canSelect
      ? [...scene.characters, charId]
      : scene.characters;
    
    onChange('characters', updated);
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    const position = e.target.selectionStart;
    
    onChange('prompt', value);
    setCursorPosition(position);

    setShowCharacterMenu(value[position - 1] === '@');
  };

  const handleCharacterMention = (charId: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const char = characters.find(c => c.id === charId);
    if (!char) return;

    const label = getMentionLabel(char);
    const beforeCursor = scene.prompt.slice(0, cursorPosition);
    const afterCursor = scene.prompt.slice(cursorPosition);
    const lastAtIndex = beforeCursor.lastIndexOf('@');
    
    if (lastAtIndex !== -1) {
      const newPrompt = 
        scene.prompt.slice(0, lastAtIndex) + 
        `@${label} ` + 
        afterCursor;
      
      onChange('prompt', newPrompt);
      setShowCharacterMenu(false);
      
      if (!scene.characters.includes(charId) && scene.characters.length < 2) {
          toggleCharacter(charId);
      }
      
      setTimeout(() => {
        const newPosition = lastAtIndex + label.length + 2;
        textarea.setSelectionRange(newPosition, newPosition);
        textarea.focus();
      }, 0);
    }
  };

  const handleScroll = () => {
    if (textareaRef.current && backdropRef.current) {
      backdropRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Escape' && showCharacterMenu) {
      setShowCharacterMenu(false);
      e.preventDefault();
    }
  };

  const handleTextareaClick = (e: React.MouseEvent<HTMLTextAreaElement>) => {
    setCursorPosition(e.currentTarget.selectionStart);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showCharacterMenu) {
        const target = event.target as HTMLElement;
        if (!target.closest('.character-mention-menu')) {
          setShowCharacterMenu(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showCharacterMenu]);

  const renderHighlightedPrompt = () => {
    if (!scene.prompt) return <span className="text-gray-400 italic">Describe your scene... Type @ to mention characters</span>;

    const parts = scene.prompt.split(/(@[\w-]+)/g);
    
    return parts.map((part, i) => {
      if (part.startsWith('@')) {
        const label = part.slice(1);
        const isValidMention = characters.some(c => getMentionLabel(c) === label);
        
        if (isValidMention) {
          return (
            <span key={i} className="text-blue-600 font-medium bg-blue-50/50 rounded-sm">
              {part}
            </span>
          );
        }
      }
      return <span key={i}>{part}</span>;
    });
  };

  const renderCharacterSelection = () => {
    if (characters.length === 0) return null;

    return (
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-800 mb-3">
          Characters (up to 2, optional)
        </label>
        <div className="flex flex-wrap gap-3">
          {characters.map(char => {
            const isSelected = scene.characters.includes(char.id);
            const isDisabled = !isSelected && scene.characters.length >= 2;
            const label = getMentionLabel(char);

            return (
              <button
                key={char.id}
                onClick={() => toggleCharacter(char.id)}
                disabled={isDisabled}
                className={`relative group ${
                  isSelected
                    ? 'ring-2 ring-teal-500'
                    : 'opacity-60 hover:opacity-100'
                } rounded-lg overflow-hidden transition disabled:opacity-30 disabled:cursor-not-allowed`}
              >
                <img
                  src={char.imageUrl}
                  alt={char.name}
                  className="w-20 h-20 object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-2 py-1">
                  <p className="text-white text-xs font-medium truncate">
                    {label}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  const renderCharacterMentionMenu = () => {
    if (!showCharacterMenu || characters.length === 0) return null;

    return (
      <div className="character-mention-menu absolute z-20 top-12 left-0 w-64 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
        <div className="p-2">
          <p className="text-xs text-gray-500 px-2 py-1 mb-1">Select a character</p>
          {characters.map(char => (
            <button
              key={char.id}
              onClick={() => handleCharacterMention(char.id)}
              className="w-full flex items-center gap-2 px-2 py-2 hover:bg-gray-100 rounded transition text-left"
            >
              <img
                src={char.imageUrl}
                alt={char.name}
                className="w-8 h-8 rounded-full object-cover"
              />
              <div className="overflow-hidden">
                <p className="text-sm font-medium text-gray-900 truncate">{char.name}</p>
                <p className="text-xs text-gray-500">@{getMentionLabel(char)}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  };

  const renderSceneOptions = () => {
    return (
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">Aspect Ratio</label>
          <select
            value={scene.aspectRatio}
            onChange={(e) => onChange('aspectRatio', e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition text-sm text-gray-800"
          >
            {ASPECT_RATIOS.map(ratio => (
              <option key={ratio} value={ratio}>{ratio}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">Shot Type</label>
          <select
            value={scene.shotType}
            onChange={(e) => onChange('shotType', e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition text-sm text-gray-800"
          >
            {SHOT_TYPES.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">Shot Size</label>
          <select
            value={scene.shotSize}
            onChange={(e) => onChange('shotSize', e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition text-sm text-gray-800"
          >
            {SHOT_SIZES.map(size => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">Shot Angle</label>
          <select
            value={scene.shotAngle}
            onChange={(e) => onChange('shotAngle', e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition text-sm text-gray-800"
          >
            {SHOT_ANGLES.map(angle => (
              <option key={angle} value={angle}>{angle}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">Lighting</label>
          <select
            value={scene.lighting}
            onChange={(e) => onChange('lighting', e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition text-sm text-gray-800"
          >
            {LIGHTING_OPTIONS.map(light => (
              <option key={light} value={light}>{light}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">Mood</label>
          <select
            value={scene.mood}
            onChange={(e) => onChange('mood', e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition text-sm text-gray-800"
          >
            {MOOD_OPTIONS.map(mood => (
              <option key={mood} value={mood}>{mood}</option>
            ))}
          </select>
        </div>

        <div className="col-span-2">
          <label className="block text-sm font-semibold text-gray-800 mb-2">Composition</label>
          <select
            value={scene.composition}
            onChange={(e) => onChange('composition', e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition text-sm text-gray-800"
          >
            {COMPOSITION_OPTIONS.map(comp => (
              <option key={comp} value={comp}>{comp}</option>
            ))}
          </select>
        </div>
      </div>
    );
  };

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-teal-400 to-teal-500">
        <h3 className="text-white font-semibold text-lg">Scene {index + 1}</h3>
        <div className="relative">
          <button 
            onClick={() => setShowMenu(!showMenu)}
            className="text-white hover:bg-white/20 p-1 rounded transition"
          >
            <MoreVertical className="w-5 h-5" />
          </button>
          {showMenu && (
            <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg z-10 border border-gray-200">
              <button
                onClick={() => {
                  onDelete();
                  setShowMenu(false);
                }}
                className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Delete Scene
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="p-6">
        {isGenerating && (
          <div className="mb-6 p-8 bg-gray-50 rounded-lg flex flex-col items-center justify-center">
            <div className="w-12 h-12 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin mb-3"></div>
            <p className="text-sm font-medium text-gray-700">
              {isRegenerating ? 'Regenerating scene...' : 'Generating scene...'}
            </p>
          </div>
        )}

        {!isGenerating && scene.imageUrl && (
          <div className="mb-6">
            <img
              src={scene.imageUrl}
              alt={`Scene ${index + 1}`}
              className="w-full rounded-lg shadow-md object-cover"
            />
          </div>
        )}

        {renderCharacterSelection()}

        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <label className="block text-sm font-semibold text-gray-800">
              Scene Description
            </label>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-gray-500 hover:text-gray-700 transition"
            >
              <ChevronDown className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
            </button>
          </div>
          {isExpanded && (
            <div className="relative">
              <div className="relative h-32 w-full rounded-lg bg-white border border-gray-300 focus-within:ring-2 focus-within:ring-teal-500 focus-within:border-transparent transition overflow-hidden">
                <div 
                  ref={backdropRef}
                  className="absolute inset-0 p-3 whitespace-pre-wrap break-words font-sans text-sm leading-relaxed text-gray-800 pointer-events-none overflow-hidden"
                  aria-hidden="true"
                >
                  {renderHighlightedPrompt()}
                </div>

                <textarea
                  ref={textareaRef}
                  value={scene.prompt}
                  onChange={handleTextareaChange}
                  onScroll={handleScroll}
                  onKeyDown={handleKeyDown}
                  onClick={handleTextareaClick}
                  className="absolute inset-0 w-full h-full p-3 bg-transparent text-transparent caret-gray-900 border-none focus:ring-0 resize-none font-sans text-sm leading-relaxed overflow-auto"
                  placeholder=""
                  spellCheck={false}
                />
              </div>
              
              {renderCharacterMentionMenu()}
              
              <p className="text-xs text-gray-500 mt-2">
                Tip: Type @ to mention characters by Name (Blue text)
              </p>
            </div>
          )}
        </div>

        {renderSceneOptions()}

        <button
          onClick={onGenerate}
          disabled={!canGenerate}
          className={`w-full py-2.5 rounded-lg font-medium transition flex items-center justify-center gap-2 ${
            canGenerate
              ? 'bg-teal-600 text-white hover:bg-teal-700'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          <Wand2 className="w-4 h-4" />
          {isGenerating 
            ? isRegenerating ? 'Regenerating...' : 'Generating...'
            : isRegenerating 
              ? 'Regenerate Scene' 
              : 'Generate This Scene'
          }
        </button>
      </div>
    </div>
  );
};