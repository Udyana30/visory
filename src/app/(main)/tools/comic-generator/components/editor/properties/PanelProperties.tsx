import React from 'react';
import { ComicPanel } from '@/app/(main)/tools/comic-generator/types/editor';
import { 
  AlignLeft, AlignCenterHorizontal, AlignRight, 
  ArrowUpToLine, AlignCenterVertical, ArrowDownToLine,
  RotateCw, Maximize, Minimize, Crop
} from 'lucide-react';

interface PanelPropertiesProps {
  panel: ComicPanel;
  onUpdate: (panel: ComicPanel) => void;
  onDeselect: () => void;
}

type AlignType = 'left' | 'center-x' | 'right' | 'top' | 'center-y' | 'bottom';
type FillMode = 'cover' | 'contain' | 'custom';

export const PanelProperties: React.FC<PanelPropertiesProps> = ({
  panel,
  onUpdate,
  onDeselect
}) => {
  
  const handleChange = (field: keyof ComicPanel, value: number) => {
    onUpdate({ ...panel, [field]: value });
  };

  const handleAlign = (type: AlignType) => {
    const newPanel = { ...panel };
    switch (type) {
      case 'left': newPanel.x = 0; break;
      case 'center-x': newPanel.x = (100 - panel.width) / 2; break;
      case 'right': newPanel.x = 100 - panel.width; break;
      case 'top': newPanel.y = 0; break;
      case 'center-y': newPanel.y = (100 - panel.height) / 2; break;
      case 'bottom': newPanel.y = 100 - panel.height; break;
    }
    onUpdate(newPanel);
  };

  const handleFillMode = (mode: FillMode) => {
    const newPanel = { ...panel };
    if (mode === 'cover') {
      newPanel.imageScale = 1;
      newPanel.imagePosition = { x: 50, y: 50 };
    } else if (mode === 'contain') {
      newPanel.imageScale = 0.8; 
      newPanel.imagePosition = { x: 50, y: 50 };
    }
    onUpdate(newPanel);
  };

  return (
    <div className="h-full flex flex-col bg-white text-gray-800">
      <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between shrink-0">
        <span className="text-xs font-bold uppercase tracking-wider text-gray-500">PROPERTIES</span>
        <button onClick={onDeselect} className="text-xs font-medium text-blue-600 hover:text-blue-700">
          Done
        </button>
      </div>

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
            <NumberInput 
              label="X" 
              value={panel.x} 
              onChange={(v) => handleChange('x', v)} 
            />
            <NumberInput 
              label="Y" 
              value={panel.y} 
              onChange={(v) => handleChange('y', v)} 
            />
            <NumberInput 
              label="W" 
              value={panel.width} 
              onChange={(v) => handleChange('width', v)} 
              min={10}
            />
            <NumberInput 
              label="H" 
              value={panel.height} 
              onChange={(v) => handleChange('height', v)} 
              min={10}
            />
            <NumberInput 
              label={<RotateCw className="w-3 h-3" />} 
              value={panel.rotation} 
              onChange={(v) => handleChange('rotation', v)} 
              suffix="°"
              step={90}
            />
          </div>
        </section>

        {panel.imageUrl && (
          <section className="space-y-3 pt-2 border-t border-gray-100">
            <SectionHeader title="Image Fill" />
            
            <div className="grid grid-cols-3 gap-2 mb-3">
              <FillModeButton 
                icon={<Maximize className="w-4 h-4" />} 
                label="Fill" 
                active={panel.imageScale === 1}
                onClick={() => handleFillMode('cover')} 
              />
              <FillModeButton 
                icon={<Minimize className="w-4 h-4" />} 
                label="Fit" 
                active={panel.imageScale === 0.8}
                onClick={() => handleFillMode('contain')} 
              />
              <FillModeButton 
                icon={<Crop className="w-4 h-4" />} 
                label="Crop" 
                active={panel.imageScale !== 1 && panel.imageScale !== 0.8}
                onClick={() => handleFillMode('custom')} 
              />
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
                      type="range" 
                      min="0.1" 
                      max="3" 
                      step="0.1"
                      value={panel.imageScale || 1}
                      onChange={(e) => handleChange('imageScale', parseFloat(e.target.value))}
                      className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                   />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                 <NumberInput 
                    label="Img X" 
                    value={panel.imagePosition?.x || 50} 
                    onChange={(v) => onUpdate({...panel, imagePosition: {...(panel.imagePosition || {y: 50}), x: v}})} 
                    suffix="%"
                 />
                 <NumberInput 
                    label="Img Y" 
                    value={panel.imagePosition?.y || 50} 
                    onChange={(v) => onUpdate({...panel, imagePosition: {...(panel.imagePosition || {x: 50}), y: v}})} 
                    suffix="%"
                 />
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

const SectionHeader: React.FC<{ title: string }> = ({ title }) => (
  <h4 className="text-xs font-semibold text-gray-900 mb-2">{title}</h4>
);

const AlignButton: React.FC<{ icon: React.ReactNode; onClick: () => void; tooltip: string }> = ({ icon, onClick, tooltip }) => (
  <button 
    onClick={onClick}
    title={tooltip}
    className="p-1.5 rounded-md text-gray-600 hover:text-gray-900 hover:bg-white hover:shadow-sm transition-all active:scale-95"
  >
    {icon}
  </button>
);

const FillModeButton: React.FC<{ icon: React.ReactNode; label: string; active?: boolean; onClick: () => void }> = ({ icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center justify-center gap-1.5 py-2 rounded-md border transition-all ${
      active 
        ? 'bg-blue-50 border-blue-200 text-blue-700' 
        : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300'
    }`}
  >
    {icon}
    <span className="text-[10px] font-medium">{label}</span>
  </button>
);

const NumberInput: React.FC<{ 
  label: React.ReactNode; 
  value: number; 
  onChange: (val: number) => void; 
  min?: number; 
  max?: number;
  step?: number;
  suffix?: string;
}> = ({ label, value, onChange, min, max, step = 1, suffix }) => (
  <div className="flex items-center group relative">
    <div className="absolute left-2.5 text-gray-400 select-none text-xs font-medium pointer-events-none flex items-center z-10">
      {label}
    </div>
    <input
      type="number"
      value={Math.round(value * 10) / 10}
      onChange={(e) => {
        const val = parseFloat(e.target.value);
        if (!isNaN(val)) onChange(val);
      }}
      min={min}
      max={max}
      step={step}
      className="w-full pl-11 pr-7 py-1.5 bg-white border border-gray-200 rounded-md text-xs font-medium text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow hover:border-gray-300 text-right"
    />
    {suffix && (
      <div className="absolute right-2.5 text-gray-400 text-xs pointer-events-none select-none z-10">
        {suffix}
      </div>
    )}
  </div>
);