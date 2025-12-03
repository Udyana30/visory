import React, { useState } from 'react';
import { 
  MessageSquare, Cloud, Zap, MessageCircleDashed, MessageCircle, RectangleHorizontal,
  LayoutDashboard, Square, Grid2x2, Columns, Rows
} from 'lucide-react';
import { BUBBLE_TEMPLATES } from '@/features/comic-generator/constants/editor';
import { useEditorActions } from '@/features/comic-generator/hooks/editor/useEditorActions';
import { AccordionSection } from '../shared/AccordionSection';
import { PropertiesHeader } from '../shared/PropertyInputs';
import { PageLayout } from '@/features/comic-generator/types/domain/editor';

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

export const CanvasProperties: React.FC = () => {
  const { addBubble, updatePageLayout, pages, activePageIndex } = useEditorActions();

  const [activeSection, setActiveSection] = useState<Section>('layouts');

  const currentPage = pages[activePageIndex];
  const currentLayout = currentPage?.layout || 'single';

  const handleTemplateSelect = (template: typeof BUBBLE_TEMPLATES[0]) => {
    addBubble(30, 30, template.style.type, template.style); 
  };

  const handleLayoutChange = (layout: string) => {
    updatePageLayout(layout as PageLayout);
  };

  return (
    <div className="h-full flex flex-col bg-white text-gray-800">
      <PropertiesHeader title="Page Properties" />

      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200">
        <AccordionSection
          title="Page Layout"
          isOpen={activeSection === 'layouts'}
          onToggle={() => setActiveSection('layouts')}
        >
          <div className="space-y-1">
            <MenuItem label="Custom Layout" icon={<LayoutDashboard className="w-4 h-4" />} isActive={currentLayout === 'custom'} onClick={() => handleLayoutChange('custom')} />
            <MenuItem label="Single Panel" icon={<Square className="w-4 h-4" />} isActive={currentLayout === 'single'} onClick={() => handleLayoutChange('single')} />
            <MenuItem label="Double Panel" icon={<Columns className="w-4 h-4" />} isActive={currentLayout === 'double'} onClick={() => handleLayoutChange('double')} />
            <MenuItem label="Triple Panel" icon={<Rows className="w-4 h-4" />} isActive={currentLayout === 'triple'} onClick={() => handleLayoutChange('triple')} />
            <MenuItem label="Quad Panel" icon={<Grid2x2 className="w-4 h-4" />} isActive={currentLayout === 'quad'} onClick={() => handleLayoutChange('quad')} />
          </div>
        </AccordionSection>

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
      </div>
    </div>
  );
};