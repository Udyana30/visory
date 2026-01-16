'use client';

import { Plus } from 'lucide-react';

const filters = ['All','Avatar', 'Comic', 'TTS', 'STT'];

interface Props {
  activeFilter: string;
  onFilterChange: (value: string) => void;
  onCreateNew?: () => void;
}

export default function ProjectHeader({ activeFilter, onFilterChange, onCreateNew }: Props) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
        <button
          onClick={onCreateNew}
          className="flex items-center gap-2 px-6 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
        >
          <Plus size={20} />
          New Project
        </button>
      </div>

      <div className="flex items-center gap-2">
        {filters.map(filter => (
          <button
            key={filter}
            onClick={() => onFilterChange(filter)}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
              activeFilter === filter
                ? 'bg-gray-900 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>
    </div>
  );
}
