import React from 'react';
import { ChevronDown } from 'lucide-react';
import { GENRES, LANGUAGES } from '../../../../constants/comic';
import { ProjectFormData } from '../../types/domain/project';

interface ProjectBasicInputsProps {
  data: ProjectFormData;
  onChange: (field: keyof ProjectFormData, value: string) => void;
  disabled?: boolean;
}

export const ProjectBasicInputs: React.FC<ProjectBasicInputsProps> = ({ data, onChange, disabled }) => {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
          Comic Name
        </label>
        <input
          type="text"
          value={data.name}
          onChange={(e) => onChange('name', e.target.value)}
          disabled={disabled}
          className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-gray-900 bg-white placeholder-gray-400 disabled:bg-gray-50 text-sm"
          placeholder="e.g., The Last Horizon"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
          Genre
        </label>
        <div className="relative">
          <select
            value={data.genre}
            onChange={(e) => onChange('genre', e.target.value)}
            disabled={disabled}
            className={`w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition appearance-none bg-white cursor-pointer disabled:bg-gray-50 text-sm ${
              !data.genre ? 'text-gray-400' : 'text-gray-900'
            }`}
          >
            <option value="" disabled hidden>Select genre</option>
            {GENRES.map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
          Language
        </label>
        <div className="relative">
          <select
            value={data.language}
            onChange={(e) => onChange('language', e.target.value)}
            disabled={disabled}
            className={`w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition appearance-none bg-white cursor-pointer disabled:bg-gray-50 text-sm ${
              !data.language ? 'text-gray-400' : 'text-gray-900'
            }`}
          >
            <option value="" disabled hidden>Select language</option>
            {LANGUAGES.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.flag} {lang.name}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>
      </div>
    </div>
  );
};