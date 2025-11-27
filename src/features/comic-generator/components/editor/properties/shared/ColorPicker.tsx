import React from 'react';

interface ColorInputProps {
  value?: string;
  onChange: (val: string) => void;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

export const ColorInput: React.FC<ColorInputProps> = ({ value, onChange, icon, fullWidth }) => (
  <div className={`relative h-full group ${fullWidth ? 'w-full' : ''}`}>
    <input
      type="color"
      value={value || '#000000'} 
      onChange={(e) => onChange(e.target.value)}
      className="absolute inset-0 opacity-0 w-full h-full cursor-pointer z-10"
    />
    <div className={`h-full flex items-center gap-3 px-3 bg-white border border-gray-200 rounded-lg group-hover:border-gray-300 transition-colors ${fullWidth ? 'w-full justify-between' : ''}`}>
      <div className="flex items-center gap-3">
        {icon && <span className="text-gray-400">{icon}</span>}
        <div 
          className="w-5 h-5 rounded border border-gray-200 shadow-sm ring-1 ring-black/5"
          style={{ backgroundColor: value || '#000000' }}
        />
      </div>
      <span className="text-sm font-mono text-gray-600 uppercase">
        {value || '#000000'}
      </span>
    </div>
  </div>
);