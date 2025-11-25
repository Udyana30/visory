import React from 'react';
import { SpeechBubble } from '@/app/(main)/tools/comic-generator/types/editor';
import { BUBBLE_TEMPLATES, FONT_FAMILIES, FONT_SIZES } from '@/app/(main)/tools/comic-generator/lib/editorConstants';
import { 
  AlignLeft, AlignCenter, AlignRight, 
  Bold, Italic, Underline, 
  Type, Square, Circle
} from 'lucide-react';

interface BubblePropertiesProps {
  bubble: SpeechBubble;
  onUpdate: (bubble: SpeechBubble) => void;
  onDeselect: () => void;
}

export const BubbleProperties: React.FC<BubblePropertiesProps> = ({
  bubble,
  onUpdate,
  onDeselect
}) => {
  
  const handleChange = (field: keyof SpeechBubble, value: any) => {
    onUpdate({ ...bubble, [field]: value });
  };

  const toggleStyle = (style: 'bold' | 'italic' | 'underline') => {
    if (style === 'bold') {
      handleChange('fontWeight', bubble.fontWeight === 'bold' ? 'normal' : 'bold');
    } else if (style === 'italic') {
      handleChange('fontStyle', bubble.fontStyle === 'italic' ? 'normal' : 'italic');
    } else if (style === 'underline') {
      handleChange('textDecoration', bubble.textDecoration === 'underline' ? 'none' : 'underline');
    }
  };

  return (
    <div className="h-full flex flex-col bg-white text-gray-800">
      <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between shrink-0">
        <span className="text-sm font-bold uppercase tracking-wider text-gray-500">PROPERTIES</span>
        <button onClick={onDeselect} className="text-sm font-medium text-blue-600 hover:text-blue-700">
          Done
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-6 scrollbar-thin">
        
        <section className="space-y-4">
          <SectionHeader title="Appearance" />
          
          <div className="grid grid-cols-5 gap-3">
            {BUBBLE_TEMPLATES.map((template) => (
              <button
                key={template.id}
                onClick={() => handleChange('type', template.style.type)}
                title={template.name}
                className={`aspect-square flex items-center justify-center rounded-lg border transition-all ${
                  bubble.type === template.style.type
                    ? 'bg-blue-50 border-blue-500 text-blue-600 shadow-sm'
                    : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <span className="text-xl">{template.icon}</span>
              </button>
            ))}
          </div>

          {(bubble.type === 'speech' || bubble.type === 'shout' || bubble.type === 'thought') && (
            <div className="flex items-center justify-between px-1">
              <span className="text-sm font-medium text-gray-600">Show Tail</span>
              <button
                onClick={() => handleChange('showTail', !bubble.showTail)}
                className={`w-11 h-6 rounded-full transition-colors relative ${
                  bubble.showTail ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${
                  bubble.showTail ? 'translate-x-5' : 'translate-x-0'
                }`} />
              </button>
            </div>
          )}
        </section>

        <hr className="border-gray-100" />

        <section className="space-y-4">
          <SectionHeader title="Typography" />

          <div className="relative">
            <textarea
              value={bubble.text}
              onChange={(e) => handleChange('text', e.target.value)}
              rows={3}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all placeholder:text-gray-400"
              placeholder="Type something..."
            />
          </div>

          <div className="grid grid-cols-[1fr_100px] gap-3">
            <div className="relative h-10">
              <select
                value={bubble.fontFamily}
                onChange={(e) => handleChange('fontFamily', e.target.value)}
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
                value={bubble.fontSize}
                onChange={(e) => handleChange('fontSize', parseInt(e.target.value))}
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
                  value={bubble.color} 
                  onChange={(c) => handleChange('color', c)} 
                  icon={<Type className="w-4 h-4" />}
                  fullWidth
               />
             </div>
             
             <div className="w-px h-6 bg-gray-200" />
             
             <div className="flex-1 h-full flex bg-gray-50 rounded-lg border border-gray-200 p-1">
               <StyleButton 
                 icon={<Bold className="w-4 h-4" />} 
                 active={bubble.fontWeight === 'bold'} 
                 onClick={() => toggleStyle('bold')} 
               />
               <StyleButton 
                 icon={<Italic className="w-4 h-4" />} 
                 active={bubble.fontStyle === 'italic'} 
                 onClick={() => toggleStyle('italic')} 
               />
               <StyleButton 
                 icon={<Underline className="w-4 h-4" />} 
                 active={bubble.textDecoration === 'underline'} 
                 onClick={() => toggleStyle('underline')} 
               />
             </div>
          </div>

          <div className="h-10 flex bg-gray-50 rounded-lg border border-gray-200 p-1">
            <AlignButton 
              icon={<AlignLeft className="w-4 h-4" />} 
              active={bubble.textAlign === 'left'} 
              onClick={() => handleChange('textAlign', 'left')} 
            />
            <AlignButton 
              icon={<AlignCenter className="w-4 h-4" />} 
              active={bubble.textAlign === 'center'} 
              onClick={() => handleChange('textAlign', 'center')} 
            />
            <AlignButton 
              icon={<AlignRight className="w-4 h-4" />} 
              active={bubble.textAlign === 'right'} 
              onClick={() => handleChange('textAlign', 'right')} 
            />
          </div>

          <div className="pt-2 space-y-3">
             <div className="flex items-center justify-between">
               <span className="text-sm font-medium text-gray-600 flex items-center gap-2">
                 <Square className="w-4 h-4 text-gray-400" /> Background
               </span>
             </div>
             <div className="h-10">
                <ColorInput 
                  value={bubble.backgroundColor} 
                  onChange={(c) => handleChange('backgroundColor', c)} 
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
                    value={bubble.borderColor} 
                    onChange={(c) => handleChange('borderColor', c)} 
                    fullWidth
                  />
                </div>
                <div className="flex-1 relative group">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-medium pointer-events-none">W</span>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    value={bubble.borderWidth}
                    onChange={(e) => handleChange('borderWidth', parseInt(e.target.value))}
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

const SectionHeader: React.FC<{ title: string }> = ({ title }) => (
  <h4 className="text-xs font-bold text-gray-400 tracking-wide mb-2">{title}</h4>
);

const StyleButton: React.FC<{ icon: React.ReactNode; active: boolean; onClick: () => void }> = ({ icon, active, onClick }) => (
  <button
    onClick={onClick}
    className={`h-full flex-1 flex items-center justify-center rounded-md transition-all ${
      active 
        ? 'bg-white text-blue-600 shadow-sm ring-1 ring-gray-200' 
        : 'text-gray-500 hover:text-gray-900 hover:bg-white/50'
    }`}
  >
    {icon}
  </button>
);

const AlignButton: React.FC<{ icon: React.ReactNode; active: boolean; onClick: () => void }> = ({ icon, active, onClick }) => (
  <button
    onClick={onClick}
    className={`h-full flex-1 flex items-center justify-center rounded-md transition-all ${
      active 
        ? 'bg-white text-blue-600 shadow-sm ring-1 ring-gray-200 font-medium' 
        : 'text-gray-500 hover:text-gray-900 hover:bg-white/50'
    }`}
  >
    {icon}
  </button>
);

const ColorInput: React.FC<{ 
  value: string; 
  onChange: (val: string) => void; 
  icon?: React.ReactNode; 
  fullWidth?: boolean; 
}> = ({ value, onChange, icon, fullWidth }) => (
  <div className={`relative h-full group ${fullWidth ? 'w-full' : ''}`}>
    <input
      type="color"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="absolute inset-0 opacity-0 w-full h-full cursor-pointer z-10"
    />
    <div className={`h-full flex items-center gap-3 px-3 bg-white border border-gray-200 rounded-lg group-hover:border-gray-300 transition-colors ${fullWidth ? 'w-full justify-between' : ''}`}>
      <div className="flex items-center gap-3">
        {icon && <span className="text-gray-400">{icon}</span>}
        <div 
          className="w-5 h-5 rounded border border-gray-200 shadow-sm ring-1 ring-black/5"
          style={{ backgroundColor: value }}
        />
      </div>
      <span className="text-sm font-mono text-gray-600 uppercase">{value}</span>
    </div>
  </div>
);