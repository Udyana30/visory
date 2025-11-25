import React, { useState } from 'react';
import { HexColorPicker } from 'react-colorful';
import { ChevronDown } from 'lucide-react';

interface ColorPickerProps {
  label: string;
  color: string;
  onChange: (color: string) => void;
}

export const ColorPicker: React.FC<ColorPickerProps> = ({ label, color, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 hover:border-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent flex items-center justify-between transition"
      >
        <div className="flex items-center gap-2">
          <div
            className="w-6 h-6 rounded border border-gray-300"
            style={{ backgroundColor: color }}
          />
          <span className="text-sm">{color}</span>
        </div>
        <ChevronDown className={`w-4 h-4 transition ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="absolute z-20 mt-2 p-3 bg-white rounded-lg shadow-xl border border-gray-200 right-0">
            <HexColorPicker color={color} onChange={onChange} />
            <input
              type="text"
              value={color}
              onChange={(e) => onChange(e.target.value)}
              className="mt-2 w-full px-2 py-1 bg-gray-50 border border-gray-300 rounded text-gray-900 text-sm"
              placeholder="#000000"
            />
          </div>
        </>
      )}
    </div>
  );
};