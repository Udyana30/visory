import React from 'react';
import { 
  AlignLeft, AlignCenterHorizontal, AlignRight, 
  ArrowUpToLine, AlignCenterVertical, ArrowDownToLine,
  RotateCw, Maximize, Minimize, Crop
} from 'lucide-react';
import { ComicPanel } from '../../../../types/domain/editor';
import { useEditorActions } from '@/features/comic-generator/hooks/useEditorActions';
import { SectionHeader, AlignButton, NumberInput, PropertiesHeader } from '../shared/PropertyInputs';

interface PanelPropertiesProps {
  panel: ComicPanel;
}

type FillMode = 'cover' | 'contain' | 'custom';

export const PanelProperties: React.FC<PanelPropertiesProps> = ({ panel }) => {
  const { updateElement, selectElement } = useEditorActions();

  const handleChange = (field: keyof ComicPanel, value: number) => {
    updateElement(panel.id, { [field]: value });
  };

  const handleAlign = (type: string) => {
    const updates: Partial<ComicPanel> = {};
    switch (type) {
      case 'left': updates.x = 0; break;
      case 'center-x': updates.x = (100 - panel.width) / 2; break;
      case 'right': updates.x = 100 - panel.width; break;
      case 'top': updates.y = 0; break;
      case 'center-y': updates.y = (100 - panel.height) / 2; break;
      case 'bottom': updates.y = 100 - panel.height; break;
    }
    updateElement(panel.id, updates);
  };

  const handleFillMode = (mode: FillMode) => {
    let updates: Partial<ComicPanel> = {};
    if (mode === 'cover') {
      updates = { imageScale: 1, imagePosition: { x: 50, y: 50 } };
    } else if (mode === 'contain') {
      updates = { imageScale: 0.8, imagePosition: { x: 50, y: 50 } };
    }
    updateElement(panel.id, updates);
  };

  const FillModeButton: React.FC<{ icon: React.ReactNode; label: string; active?: boolean; onClick: () => void }> = ({ icon, label, active, onClick }) => (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center gap-1.5 py-2 rounded-md border transition-all ${
        active ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300'
      }`}
    >
      {icon}
      <span className="text-[10px] font-medium">{label}</span>
    </button>
  );

  return (
    <div className="h-full flex flex-col bg-white text-gray-800">
      <PropertiesHeader title="Panel Properties" onDone={() => selectElement(null)} />

      <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin">
        <section className="space-y-3">
          <SectionHeader title="Position" />
          <div className="flex items-center justify-between p-1 bg-gray-50 rounded-lg border border-gray-100">
            <AlignButton icon={<AlignLeft className="w-4 h-4"/>} onClick={() => handleAlign('left')} tooltip="Left" />
            <AlignButton icon={<AlignCenterHorizontal className="w-4 h-4"/>} onClick={() => handleAlign('center-x')} tooltip="Center X" />
            <AlignButton icon={<AlignRight className="w-4 h-4"/>} onClick={() => handleAlign('right')} tooltip="Right" />
            <div className="w-px h-4 bg-gray-300 mx-1" />
            <AlignButton icon={<ArrowUpToLine className="w-4 h-4"/>} onClick={() => handleAlign('top')} tooltip="Top" />
            <AlignButton icon={<AlignCenterVertical className="w-4 h-4"/>} onClick={() => handleAlign('center-y')} tooltip="Center Y" />
            <AlignButton icon={<ArrowDownToLine className="w-4 h-4"/>} onClick={() => handleAlign('bottom')} tooltip="Bottom" />
          </div>
        </section>

        <section className="space-y-3">
          <SectionHeader title="Transform" />
          <div className="grid grid-cols-2 gap-x-2 gap-y-3">
            <NumberInput label="X" value={panel.x} onChange={(v) => handleChange('x', v)} />
            <NumberInput label="Y" value={panel.y} onChange={(v) => handleChange('y', v)} />
            <NumberInput label="W" value={panel.width} onChange={(v) => handleChange('width', v)} min={10} />
            <NumberInput label="H" value={panel.height} onChange={(v) => handleChange('height', v)} min={10} />
            <NumberInput label={<RotateCw className="w-3 h-3" />} value={panel.rotation} onChange={(v) => handleChange('rotation', v)} suffix="°" step={90} />
          </div>
        </section>

        {panel.imageUrl && (
          <section className="space-y-3 pt-2 border-t border-gray-100">
            <SectionHeader title="Image Fill" />
            
            <div className="grid grid-cols-3 gap-2 mb-3">
              <FillModeButton icon={<Maximize className="w-4 h-4" />} label="Fill" active={panel.imageScale === 1} onClick={() => handleFillMode('cover')} />
              <FillModeButton icon={<Minimize className="w-4 h-4" />} label="Fit" active={panel.imageScale === 0.8} onClick={() => handleFillMode('contain')} />
              <FillModeButton icon={<Crop className="w-4 h-4" />} label="Crop" active={panel.imageScale !== 1 && panel.imageScale !== 0.8} onClick={() => handleFillMode('custom')} />
            </div>

            <div className="space-y-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
              <div className="flex gap-3">
                <div className="w-16 h-16 rounded border border-gray-200 bg-white overflow-hidden shrink-0">
                  <img src={panel.imageUrl} className="w-full h-full object-cover" alt="Preview" />
                </div>
                <div className="flex-1 space-y-2">
                   <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Scale</span>
                      <span>{Math.round((panel.imageScale || 1) * 100)}%</span>
                   </div>
                   <input 
                      type="range" min="0.1" max="3" step="0.1"
                      value={panel.imageScale || 1}
                      onChange={(e) => handleChange('imageScale', parseFloat(e.target.value))}
                      className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                   />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                 <NumberInput 
                    label="Img X" value={panel.imagePosition?.x || 50} suffix="%"
                    onChange={(v) => updateElement(panel.id, { imagePosition: { ...(panel.imagePosition || { y: 50 }), x: v } })} 
                 />
                 <NumberInput 
                    label="Img Y" value={panel.imagePosition?.y || 50} suffix="%"
                    onChange={(v) => updateElement(panel.id, { imagePosition: { ...(panel.imagePosition || { x: 50 }), y: v } })} 
                 />
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};