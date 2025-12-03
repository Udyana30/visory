import React from 'react';
import { Wand2, Grid } from 'lucide-react';

export type ViewMode = 'generate' | 'grid';

interface ViewModeToggleProps {
  mode: ViewMode;
  onChange: (mode: ViewMode) => void;
}

export const ViewModeToggle: React.FC<ViewModeToggleProps> = ({ mode, onChange }) => {
  return (
    <div className="flex bg-gray-100 p-1 rounded-lg border border-gray-200">
      <button
        onClick={() => onChange('generate')}
        className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
          mode === 'generate'
            ? 'bg-white text-teal-700 shadow-sm'
            : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        <Wand2 className="w-3.5 h-3.5" />
        Generate
      </button>
      <button
        onClick={() => onChange('grid')}
        className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
          mode === 'grid'
            ? 'bg-white text-teal-700 shadow-sm'
            : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        <Grid className="w-3.5 h-3.5" />
        Grid View
      </button>
    </div>
  );
};