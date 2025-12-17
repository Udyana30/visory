import React from 'react';
import { HelpCircle } from 'lucide-react';
import { AvatarParameters } from '../types/domain/project';
import { Tooltip } from '@/components/ui/Tooltip';

interface ParameterSettingsProps {
  settings: AvatarParameters;
  onChange: (key: keyof AvatarParameters, value: number) => void;
  disabled?: boolean;
}

const TOOLTIP_DESCRIPTIONS = {
  sampleSteps: "Higher values result in smoother output but take longer to process.",
  sampleShift: "Adjusts temporal coherence to maintain consistent facial features.",
  textGuideScale: "Determines how strictly the AI follows your text prompt description.",
  audioGuideScale: "Controls the intensity of lip-sync and facial reactions to audio.",
  loraScale: "Adjusts the influence intensity of the specific style model.",
  seed: "Use the same seed number to reproduce identical generation results."
};

export const ParameterSettings: React.FC<ParameterSettingsProps> = ({
  settings,
  onChange,
  disabled
}) => {
  const renderRangeInput = (
    label: string, 
    key: keyof AvatarParameters, 
    min: number, 
    max: number, 
    step: number,
    tooltip: string
  ) => (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-1.5">
          <label className="text-xs font-semibold text-gray-700">
            {label}
          </label>
          <Tooltip content={tooltip}>
            <HelpCircle className="w-3 h-3 text-gray-400 hover:text-blue-500 transition-colors" />
          </Tooltip>
        </div>
        <span className="text-[10px] font-mono bg-white px-2 py-0.5 rounded text-gray-600 min-w-[2.5rem] text-center border border-gray-200 shadow-sm">
          {(settings[key] as number).toFixed(step < 1 ? 1 : 0)}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={settings[key] as number}
        onChange={(e) => onChange(key, Number(e.target.value))}
        disabled={disabled}
        className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600 disabled:opacity-50 hover:bg-gray-300 transition-colors"
      />
    </div>
  );

  return (
    <div className="space-y-7">
      <div className="space-y-6">
        {renderRangeInput('Sample Steps', 'sampleSteps', 1, 50, 1, TOOLTIP_DESCRIPTIONS.sampleSteps)}
        {renderRangeInput('Sample Shift', 'sampleShift', 0, 10, 0.5, TOOLTIP_DESCRIPTIONS.sampleShift)}
        {renderRangeInput('Audio Reactivity', 'audioGuideScale', 0, 10, 0.5, TOOLTIP_DESCRIPTIONS.audioGuideScale)}
        {renderRangeInput('Prompt Adherence', 'textGuideScale', 0, 10, 0.5, TOOLTIP_DESCRIPTIONS.textGuideScale)}
        {renderRangeInput('LoRA Intensity', 'loraScale', 0, 2, 0.1, TOOLTIP_DESCRIPTIONS.loraScale)}

        <div className="space-y-1.5 pt-2 border-t border-gray-100">
          <div className="flex items-center gap-1.5 mb-2">
             <label className="text-xs font-semibold text-gray-700">Generation Seed</label>
             <Tooltip content={TOOLTIP_DESCRIPTIONS.seed}>
               <HelpCircle className="w-3 h-3 text-gray-400 hover:text-blue-500 transition-colors" />
             </Tooltip>
          </div>
          <input
            type="number"
            value={settings.seed}
            onChange={(e) => onChange('seed', Number(e.target.value))}
            disabled={disabled}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition disabled:bg-gray-50 disabled:text-gray-400 bg-white"
            placeholder="42"
          />
        </div>
      </div>
    </div>
  );
};