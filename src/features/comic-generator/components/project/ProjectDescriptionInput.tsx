import React from 'react';
import { ProjectFormData } from '../../types/domain/project';

interface ProjectDescriptionInputProps {
  data: ProjectFormData;
  onChange: (field: keyof ProjectFormData, value: string) => void;
  disabled?: boolean;
}

export const ProjectDescriptionInput: React.FC<ProjectDescriptionInputProps> = ({ data, onChange, disabled }) => {
  return (
    <div className="flex flex-col h-full">
      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
        Description
      </label>
      <textarea
        value={data.description}
        onChange={(e) => onChange('description', e.target.value)}
        disabled={disabled}
        className="w-full flex-1 min-h-[120px] px-3 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-gray-900 bg-white placeholder-gray-400 disabled:bg-gray-50 resize-none text-sm"
        placeholder="Briefly describe your comic's plot or setting..."
      />
    </div>
  );
};