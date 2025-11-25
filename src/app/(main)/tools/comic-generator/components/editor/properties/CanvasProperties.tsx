import React, { useState } from 'react';
import { 
  LayoutTemplate, 
  MessageSquare, 
  MessageCircle, 
  Cloud, 
  Zap, 
  MessageCircleDashed, 
  Square,
  LayoutDashboard,
  Grid2x2,
  Columns,
  Rows,
  RectangleHorizontal
} from 'lucide-react';
import { ComicPanel, SpeechBubble } from '@/app/(main)/tools/comic-generator/types/editor';
import { BUBBLE_TEMPLATES } from '@/app/(main)/tools/comic-generator/lib/editorConstants';
import { AccordionSection } from './AccordionSection';

interface CanvasPropertiesProps {
  currentLayout: string;
  onLayoutChange: (layout: string) => void;
  onBubbleAdd: (x: number, y: number, template?: Partial<SpeechBubble>) => void;
  currentPagePanels: ComicPanel[];
}

type Section = 'bubbles' | 'layouts';

const getBubbleIcon = (id: string) => {
  switch (id) {
    case 'classic-speech': return <MessageSquare className="w-4 h-4" />;
    case 'thought': return <Cloud className="w-4 h-4" />;
    case 'shout': return <Zap className="w-4 h-4" />;
    case 'whisper': return <MessageCircleDashed className="w-4 h-4" />;
    case 'narration': return <RectangleHorizontal className="w-4 h-4" />;
    default: return <MessageCircle className="w-4 h-4" />;
  }
};

export const CanvasProperties: React.FC<CanvasPropertiesProps> = ({
  currentLayout,
  onLayoutChange,
  onBubbleAdd,
  currentPagePanels
}) => {
  const [activeSection, setActiveSection] = useState<Section>('bubbles');

  const handleTemplateSelect = (template: typeof BUBBLE_TEMPLATES[0]) => {
    onBubbleAdd(30, 30, template.style);
  };

  return (
    <div className="h-full flex flex-col bg-white text-gray-800">
      <div className="px-4 py-3 border-b border-gray-100 shrink-0">
        <span className="text-xs font-bold uppercase tracking-wider text-gray-500">PROPERTIES</span>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200">
        <AccordionSection
          title="Bubble Type"
          isOpen={activeSection === 'bubbles'}
          onToggle={() => setActiveSection('bubbles')}
        >
          <div className="space-y-1">
            {BUBBLE_TEMPLATES.map((template) => (
              <MenuItem
                key={template.id}
                label={template.name}
                icon={getBubbleIcon(template.id)}
                onClick={() => handleTemplateSelect(template)}
              />
            ))}
          </div>
        </AccordionSection>

        <AccordionSection
          title="Page Layout"
          isOpen={activeSection === 'layouts'}
          onToggle={() => setActiveSection('layouts')}
        >
          <div className="space-y-1">
            <MenuItem
              label="Custom Layout"
              icon={<LayoutDashboard className="w-4 h-4" />}
              isActive={currentLayout === 'custom'}
              onClick={() => onLayoutChange('custom')}
            />
            <MenuItem
              label="Single Panel"
              icon={<Square className="w-4 h-4" />}
              isActive={currentLayout === 'single'}
              onClick={() => onLayoutChange('single')}
            />
            <MenuItem
              label="Double Panel"
              icon={<Columns className="w-4 h-4" />}
              isActive={currentLayout === 'double'}
              onClick={() => onLayoutChange('double')}
            />
            <MenuItem
              label="Triple Panel"
              icon={<Rows className="w-4 h-4" />}
              isActive={currentLayout === 'triple'}
              onClick={() => onLayoutChange('triple')}
            />
            <MenuItem
              label="Quad Panel"
              icon={<Grid2x2 className="w-4 h-4" />}
              isActive={currentLayout === 'quad'}
              onClick={() => onLayoutChange('quad')}
            />
          </div>
        </AccordionSection>
      </div>
    </div>
  );
};

interface MenuItemProps {
  label: string;
  icon: React.ReactNode;
  isActive?: boolean;
  onClick: () => void;
}

const MenuItem: React.FC<MenuItemProps> = ({ label, icon, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full px-3 py-2.5 rounded-md flex items-center gap-3 transition-all duration-200 group ${
      isActive
        ? 'bg-blue-50 text-blue-700 shadow-sm ring-1 ring-blue-100'
        : 'hover:bg-gray-50 text-gray-600 hover:text-gray-900'
    }`}
  >
    <span className={`flex items-center justify-center transition-colors ${
      isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'
    }`}>
      {icon}
    </span>
    <span className="text-xs font-medium tracking-wide">{label}</span>
  </button>
);