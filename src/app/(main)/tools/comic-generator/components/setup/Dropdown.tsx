import React from 'react';
import { ChevronDown } from 'lucide-react';

interface DropdownProps {
  label: string;
  value: string;
  options: string[];
  placeholder?: string;
  onChange: (value: string) => void;
}

export const Dropdown: React.FC<DropdownProps> = ({
  label,
  value,
  options,
  placeholder = 'Select an option',
  onChange
}) => {
  return (
    <div>
      <label className="block text-base font-semibold text-gray-900 mb-2">
        {label}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition appearance-none bg-white cursor-pointer hover:border-gray-400 ${
            value === '' ? 'text-gray-400' : 'text-gray-900'
          }`}
        >
          <option value="" disabled hidden className="text-gray-400">
            {placeholder}
          </option>
          {options.map((option) => (
            <option key={option} value={option} className="text-gray-900">
              {option}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <ChevronDown className="w-5 h-5 text-gray-400" />
        </div>
      </div>
    </div>
  );
};