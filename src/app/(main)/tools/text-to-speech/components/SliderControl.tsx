import React from 'react';
import { formatSliderValue } from '@/app/(main)/tools/text-to-speech/lib/tts.utils';

interface SliderControlProps {
  label: string;
  name: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  onChange: (name: string, value: number) => void;
}

const SliderControl: React.FC<SliderControlProps> = ({
  label,
  name,
  value,
  min,
  max,
  step,
  unit,
  onChange,
}) => {
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <label className="text-sm font-medium text-gray-700">{label}</label>
        <span className="text-xs font-mono px-2.5 py-1 bg-black text-white rounded">
          {formatSliderValue(value)}{unit}
        </span>
      </div>

      <div className="relative">
        <input
          type="range"
          name={name}
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(name, parseInt(e.target.value))}
          className="slider-modern w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, #000 0%, #000 ${((value - min) / (max - min)) * 100}%, #e5e7eb ${((value - min) / (max - min)) * 100}%, #e5e7eb 100%)`
          }}
        />
        <div 
          className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-black rounded-full shadow-md pointer-events-none transition-all"
          style={{ left: `calc(${((value - min) / (max - min)) * 100}% - 8px)` }}
        />
      </div>

      <div className="flex justify-between text-xs text-gray-400 font-mono">
        <span>{min}{unit}</span>
        <span>{max}{unit}</span>
      </div>

      <style jsx>{`
        .slider-modern::-webkit-slider-thumb {
          appearance: none;
          width: 16px;
          height: 16px;
          background: transparent;
          cursor: pointer;
        }
        .slider-modern::-moz-range-thumb {
          width: 16px;
          height: 16px;
          background: transparent;
          border: none;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};

export default SliderControl;