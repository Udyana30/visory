import React from 'react';
import { 
  AlignLeft, AlignCenter, AlignRight, 
  Bold, Italic, Underline, 
  Type, Square, Circle
} from 'lucide-react';
import { SpeechBubble } from '../../../../types/domain/editor';
import { BUBBLE_TEMPLATES, FONT_FAMILIES, FONT_SIZES } from '@/features/comic-generator/constants/editor';
import { useEditorActions } from '@/features/comic-generator/hooks/useEditorActions';
import { SectionHeader, StyleButton, AlignButton, PropertiesHeader } from '../shared/PropertyInputs';
import { ColorInput } from '../shared/ColorPicker';

interface BubblePropertiesProps {
  bubble: SpeechBubble;
}

export const BubbleProperties: React.FC<BubblePropertiesProps> = ({ bubble }) => {
  const { updateElement, selectElement } = useEditorActions();
  
  const handleChange = (field: keyof SpeechBubble, value: any) => {
    updateElement(bubble.id, { [field]: value });
  };

  const handleStyleChange = (field: keyof typeof bubble.style, value: any) => {
    updateElement(bubble.id, { 
      style: { ...bubble.style, [field]: value } 
    });
  };

  const toggleStyle = (style: 'bold' | 'italic' | 'underline') => {
    if (style === 'bold') {
      handleStyleChange('fontWeight', bubble.style.fontWeight === 'bold' ? 'normal' : 'bold');
    } else if (style === 'italic') {
      handleStyleChange('fontStyle', bubble.style.fontStyle === 'italic' ? 'normal' : 'italic');
    } else if (style === 'underline') {
      handleStyleChange('textDecoration', bubble.style.textDecoration === 'underline' ? 'none' : 'underline');
    }
  };

  return (
    <div className="h-full flex flex-col bg-white text-gray-800">
      <PropertiesHeader title="Bubble Properties" onDone={() => selectElement(null)} />

      <div className="flex-1 overflow-y-auto p-5 space-y-6 scrollbar-thin">
        
        <section className="space-y-4">
          <SectionHeader title="Appearance" />
          <div className="grid grid-cols-5 gap-3">
            {BUBBLE_TEMPLATES.map((template) => (
              <button
                key={template.id}
                onClick={() => handleChange('variant', template.style.type)}
                title={template.name}
                className={`aspect-square flex items-center justify-center rounded-lg border transition-all ${
                  bubble.variant === template.style.type
                    ? 'bg-blue-50 border-blue-500 text-blue-600 shadow-sm'
                    : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <span className="text-xl">{template.icon}</span>
              </button>
            ))}
          </div>

          {['speech', 'shout', 'thought'].includes(bubble.variant) && (
            <div className="flex items-center justify-between px-1">
              <span className="text-sm font-medium text-gray-600">Show Tail</span>
              <button
                onClick={() => handleStyleChange('showTail', !bubble.style.showTail)}
                className={`w-11 h-6 rounded-full transition-colors relative ${
                  bubble.style.showTail ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${
                  bubble.style.showTail ? 'translate-x-5' : 'translate-x-0'
                }`} />
              </button>
            </div>
          )}
        </section>

        <hr className="border-gray-100" />

        <section className="space-y-4">
          <SectionHeader title="Typography" />

          <textarea
            value={bubble.text}
            onChange={(e) => handleChange('text', e.target.value)}
            rows={3}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all placeholder:text-gray-400"
            placeholder="Type something..."
          />

          <div className="grid grid-cols-[1fr_100px] gap-3">
            <div className="relative h-10">
              <select
                value={bubble.style.fontFamily}
                onChange={(e) => handleStyleChange('fontFamily', e.target.value)}
                className="w-full h-full pl-3 pr-8 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none truncate"
              >
                {FONT_FAMILIES.map((font) => (
                  <option key={font} value={font} style={{ fontFamily: font }}>
                    {font}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                <Type className="w-4 h-4" />
              </div>
            </div>
            
            <div className="h-10">
              <select
                value={bubble.style.fontSize}
                onChange={(e) => handleStyleChange('fontSize', parseInt(e.target.value))}
                className="w-full h-full px-3 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center"
              >
                {FONT_SIZES.map((size) => (
                  <option key={size} value={size}>{size}px</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center gap-3 h-10">
             <div className="flex-1 h-full">
               <ColorInput 
                  value={bubble.style.color} 
                  onChange={(c) => handleStyleChange('color', c)} 
                  icon={<Type className="w-4 h-4" />}
                  fullWidth
               />
             </div>
             
             <div className="w-px h-6 bg-gray-200" />
             
             <div className="flex-1 h-full flex bg-gray-50 rounded-lg border border-gray-200 p-1">
               <StyleButton icon={<Bold className="w-4 h-4" />} active={bubble.style.fontWeight === 'bold'} onClick={() => toggleStyle('bold')} />
               <StyleButton icon={<Italic className="w-4 h-4" />} active={bubble.style.fontStyle === 'italic'} onClick={() => toggleStyle('italic')} />
               <StyleButton icon={<Underline className="w-4 h-4" />} active={bubble.style.textDecoration === 'underline'} onClick={() => toggleStyle('underline')} />
             </div>
          </div>

          <div className="h-10 flex bg-gray-50 rounded-lg border border-gray-200 p-1">
            <AlignButton icon={<AlignLeft className="w-4 h-4" />} active={bubble.style.textAlign === 'left'} onClick={() => handleStyleChange('textAlign', 'left')} />
            <AlignButton icon={<AlignCenter className="w-4 h-4" />} active={bubble.style.textAlign === 'center'} onClick={() => handleStyleChange('textAlign', 'center')} />
            <AlignButton icon={<AlignRight className="w-4 h-4" />} active={bubble.style.textAlign === 'right'} onClick={() => handleStyleChange('textAlign', 'right')} />
          </div>

          <div className="pt-2 space-y-3">
             <div className="flex items-center justify-between">
               <span className="text-sm font-medium text-gray-600 flex items-center gap-2">
                 <Square className="w-4 h-4 text-gray-400" /> Background
               </span>
             </div>
             <div className="h-10">
                <ColorInput 
                  value={bubble.style.backgroundColor} 
                  onChange={(c) => handleStyleChange('backgroundColor', c)} 
                  fullWidth
                />
             </div>
          </div>

          <div className="pt-2 space-y-3">
             <div className="flex items-center justify-between">
               <span className="text-sm font-medium text-gray-600 flex items-center gap-2">
                 <Circle className="w-4 h-4 text-gray-400" /> Border
               </span>
             </div>
             <div className="flex gap-3 h-10">
                <div className="flex-[2]">
                  <ColorInput 
                    value={bubble.style.borderColor} 
                    onChange={(c) => handleStyleChange('borderColor', c)} 
                    fullWidth
                  />
                </div>
                <div className="flex-1 relative group">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-medium pointer-events-none">W</span>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    value={bubble.style.borderWidth}
                    onChange={(e) => handleStyleChange('borderWidth', parseInt(e.target.value))}
                    className="w-full h-full pl-8 pr-3 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-right"
                  />
                </div>
             </div>
          </div>
        </section>
      </div>
    </div>
  );
};