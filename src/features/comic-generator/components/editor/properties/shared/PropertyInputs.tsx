import React from 'react';

export const SectionHeader: React.FC<{ title: string }> = ({ title }) => (
  <h4 className="text-xs font-bold text-gray-400 tracking-wide mb-2 uppercase">{title}</h4>
);

interface IconButtonProps {
  icon: React.ReactNode;
  active?: boolean;
  onClick: () => void;
  tooltip?: string;
  className?: string;
}

export const AlignButton: React.FC<IconButtonProps> = ({ icon, active, onClick, tooltip }) => (
  <button
    onClick={onClick}
    title={tooltip}
    className={`h-full flex-1 flex items-center justify-center rounded-md transition-all ${
      active 
        ? 'bg-white text-blue-600 shadow-sm ring-1 ring-gray-200 font-medium' 
        : 'text-gray-500 hover:text-gray-900 hover:bg-white/50'
    }`}
  >
    {icon}
  </button>
);

export const StyleButton: React.FC<IconButtonProps> = ({ icon, active, onClick }) => (
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

interface NumberInputProps { 
  label: React.ReactNode; 
  value: number; 
  onChange: (val: number) => void; 
  min?: number; 
  max?: number;
  step?: number;
  suffix?: string;
}

export const NumberInput: React.FC<NumberInputProps> = ({ label, value, onChange, min, max, step = 1, suffix }) => (
  <div className="flex items-center group relative">
    <div className="absolute left-2.5 text-gray-400 select-none text-xs font-medium pointer-events-none flex items-center z-10">
      {label}
    </div>
    <input
      type="number"
      value={Math.round((value || 0) * 10) / 10}
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

export const PropertiesHeader: React.FC<{ title: string; onDone?: () => void }> = ({ title, onDone }) => (
  <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between shrink-0 bg-white">
    <span className="text-xs font-bold uppercase tracking-wider text-gray-500">{title}</span>
    {onDone && (
      <button onClick={onDone} className="text-xs font-medium text-blue-600 hover:text-blue-700">
        Done
      </button>
    )}
  </div>
);