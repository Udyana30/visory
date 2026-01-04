import React, { useState } from 'react';
import { HelpCircle, ChevronUp, ChevronDown } from 'lucide-react';
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
  const [focusedInput, setFocusedInput] = useState<keyof AvatarParameters | null>(null);

  const handleInputChange = (
    key: keyof AvatarParameters,
    value: string,
    min: number,
    max: number
  ) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      const clampedValue = Math.min(Math.max(numValue, min), max);
      onChange(key, clampedValue);
    }
  };

  const handleInputBlur = (
    key: keyof AvatarParameters,
    min: number,
    max: number,
    step: number
  ) => {
    setFocusedInput(null);
    const currentValue = settings[key] as number;
    const rounded = Math.round(currentValue / step) * step;
    const clamped = Math.min(Math.max(rounded, min), max);
    if (clamped !== currentValue) {
      onChange(key, clamped);
    }
  };

  const handleSeedIncrement = () => {
    onChange('seed', settings.seed + 1);
  };

  const handleSeedDecrement = () => {
    onChange('seed', Math.max(0, settings.seed - 1));
  };

  const renderRangeInput = (
    label: string,
    key: keyof AvatarParameters,
    min: number,
    max: number,
    step: number,
    tooltip: string
  ) => {
    const value = settings[key] as number;
    const displayValue = step < 1 ? value.toFixed(1) : value.toFixed(0);
    const isFocused = focusedInput === key;

    return (
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
          <input
            type="text"
            inputMode="decimal"
            value={isFocused ? value : displayValue}
            onChange={(e) => handleInputChange(key, e.target.value, min, max)}
            onFocus={() => setFocusedInput(key)}
            onBlur={() => handleInputBlur(key, min, max, step)}
            disabled={disabled}
            className="text-[10px] font-mono bg-white px-2 py-0.5 rounded text-gray-600 w-[3.5rem] text-center border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition disabled:opacity-50 disabled:bg-gray-50"
          />
        </div>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(key, Number(e.target.value))}
          disabled={disabled}
          className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600 disabled:opacity-50 hover:bg-gray-300 transition-colors"
        />
      </div>
    );
  };

  return (
    <div className="space-y-7">
      <div className="space-y-6">
        {renderRangeInput('Sample Steps', 'sampleSteps', 1, 50, 1, TOOLTIP_DESCRIPTIONS.sampleSteps)}
        {renderRangeInput('Sample Shift', 'sampleShift', 0, 10, 0.5, TOOLTIP_DESCRIPTIONS.sampleShift)}
        {renderRangeInput('Audio Reactivity', 'audioGuideScale', 0, 10, 0.5, TOOLTIP_DESCRIPTIONS.audioGuideScale)}
        {renderRangeInput('Prompt Adherence', 'textGuideScale', 0, 10, 0.5, TOOLTIP_DESCRIPTIONS.textGuideScale)}
        {renderRangeInput('LoRA Intensity', 'loraScale', 0, 2, 0.1, TOOLTIP_DESCRIPTIONS.loraScale)}

        <div className="space-y-2 pt-2 border-t border-gray-100">
          <div className="flex items-center gap-1.5">
            <label className="text-xs font-semibold text-gray-700">Generation Seed</label>
            <Tooltip content={TOOLTIP_DESCRIPTIONS.seed}>
              <HelpCircle className="w-3 h-3 text-gray-400 hover:text-blue-500 transition-colors" />
            </Tooltip>
          </div>

          {/* Custom Number Input with Separate Controls */}
          <div className="flex gap-2">
            {/* Input Field */}
            <input
              type="text"
              inputMode="numeric"
              value={settings.seed}
              onChange={(e) => {
                const val = e.target.value.replace(/[^0-9]/g, '');
                if (val === '' || !isNaN(Number(val))) {
                  onChange('seed', val === '' ? 0 : Math.max(0, Number(val)));
                }
              }}
              disabled={disabled}
              className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition disabled:bg-gray-50 disabled:text-gray-400 bg-white"
              placeholder="42"
            />

            {/* Single Increment/Decrement Button Group */}
            <div className="flex flex-col">
              <button
                type="button"
                onClick={handleSeedIncrement}
                disabled={disabled}
                className="px-2 py-0.5 bg-white hover:bg-blue-50 border border-gray-200 hover:border-blue-400 text-gray-600 hover:text-blue-600 rounded-t transition-all disabled:opacity-50 disabled:cursor-not-allowed border-b-0"
              >
                <ChevronUp className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={handleSeedDecrement}
                disabled={disabled}
                className="px-2 py-0.5 bg-white hover:bg-blue-50 border border-gray-200 hover:border-blue-400 text-gray-600 hover:text-blue-600 rounded-b transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};