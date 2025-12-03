import React from 'react';
import { Search, Filter } from 'lucide-react';
import { FilterMode } from '../../../hooks/scene/useSceneFiltering';
import { ViewModeToggle, ViewMode } from './ViewModeToggle';

interface SceneControlsProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  filterMode: FilterMode;
  onFilterChange: (val: FilterMode) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  totalScenes: number;
}

export const SceneControls: React.FC<SceneControlsProps> = ({
  searchQuery,
  onSearchChange,
  filterMode,
  onFilterChange,
  viewMode,
  onViewModeChange,
  totalScenes
}) => {
  return (
    <div className="flex items-center justify-between px-6 py-3 border-b border-gray-200 bg-white h-16 shrink-0">
      <div className="flex items-center gap-4">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-teal-500 transition-colors" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search scenes..."
            className="pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:bg-white outline-none w-64 transition-all"
          />
        </div>

        <div className="h-6 w-px bg-gray-200 mx-2" />

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <select
            value={filterMode}
            onChange={(e) => onFilterChange(e.target.value as FilterMode)}
            className="text-sm bg-transparent border-none focus:ring-0 text-gray-700 font-medium cursor-pointer hover:text-teal-600 transition-colors"
          >
            <option value="all">All Scenes</option>
            <option value="generated">Generated</option>
            <option value="draft">Drafts</option>
          </select>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
          {totalScenes} Panels
        </span>
        <ViewModeToggle mode={viewMode} onChange={onViewModeChange} />
      </div>
    </div>
  );
};