import React from 'react';
import { ChevronDown } from 'lucide-react';
import { GENRES, PAGE_SIZE_OPTIONS } from '../../constants/project';
import { ProjectFormData } from '../../types/domain/project';

interface ProjectFormProps {
  data: ProjectFormData;
  onChange: (field: keyof ProjectFormData, value: string) => void;
  disabled?: boolean;
}

export const ProjectForm: React.FC<ProjectFormProps> = ({ data, onChange, disabled }) => {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-base font-semibold text-gray-900 mb-2">
          Comic Name
        </label>
        <input
          type="text"
          value={data.name}
          onChange={(e) => onChange('name', e.target.value)}
          disabled={disabled}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-gray-900 disabled:bg-gray-100 disabled:text-gray-500"
          placeholder="Enter comic name"
        />
      </div>

      <div>
        <label className="block text-base font-semibold text-gray-900 mb-2">
          Genre
        </label>
        <div className="relative">
          <select
            value={data.genre}
            onChange={(e) => onChange('genre', e.target.value)}
            disabled={disabled}
            className={`w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition appearance-none bg-white cursor-pointer disabled:bg-gray-100 ${
              !data.genre ? 'text-gray-400' : 'text-gray-900'
            }`}
          >
            <option value="" disabled hidden>Select genre</option>
            {GENRES.map((g) => (
              <option key={g} value={g} className="text-gray-900">{g}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
        </div>
      </div>

      <div>
        <label className="block text-base font-semibold text-gray-900 mb-2">
          Page Size
        </label>
        <div className="relative">
          <select
            value={data.pageSizeLabel}
            onChange={(e) => onChange('pageSizeLabel', e.target.value)}
            disabled={disabled}
            className={`w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition appearance-none bg-white cursor-pointer disabled:bg-gray-100 ${
              !data.pageSizeLabel ? 'text-gray-400' : 'text-gray-900'
            }`}
          >
            <option value="" disabled hidden>Select page size</option>
            {PAGE_SIZE_OPTIONS.map((size) => (
              <option key={size} value={size} className="text-gray-900">{size}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
        </div>
      </div>
    </div>
  );
};